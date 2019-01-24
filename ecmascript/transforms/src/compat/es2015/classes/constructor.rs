use super::get_prototype_of;
use crate::{helpers::Helpers, util::ExprFactory};
use ast::*;
use std::iter;
use swc_common::{Fold, FoldWith, Mark, Visit, VisitWith, DUMMY_SP};

pub(super) struct SuperCallFinder {
    mode: Option<SuperFoldingMode>,
    /// True in conditional statement or arrow expresion.
    in_complex: bool,
}

impl SuperCallFinder {
    ///
    /// - `None`: if no `super()` is found or super() is last call
    /// - `Some(Var)`: `var _this = ...`
    /// - `Some(Assign)`: `_this = ...`
    pub fn find(node: &Vec<Stmt>) -> Option<SuperFoldingMode> {
        match node.last() {
            Some(Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            }))) => return None,
            _ => {}
        }

        let mut v = SuperCallFinder {
            mode: None,
            in_complex: false,
        };
        node.visit_with(&mut v);
        v.mode
    }
}

macro_rules! mark_as_complex {
    ($T:ty) => {
        impl Visit<$T> for SuperCallFinder {
            fn visit(&mut self, node: &$T) {
                let old = self.in_complex;
                self.in_complex = true;
                node.visit_children(self);
                self.in_complex = old;
            }
        }
    };
}
mark_as_complex!(ArrowExpr);
mark_as_complex!(IfStmt);
mark_as_complex!(PropName);

impl Visit<AssignExpr> for SuperCallFinder {
    fn visit(&mut self, node: &AssignExpr) {
        node.left.visit_with(self);

        let old = self.in_complex;
        self.in_complex = true;
        node.right.visit_children(self);
        self.in_complex = old;
    }
}

impl Visit<MemberExpr> for SuperCallFinder {
    fn visit(&mut self, e: &MemberExpr) {
        e.visit_children(self);

        match e.obj {
            ExprOrSuper::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                ..
            })) => {
                // super().foo
                self.mode = Some(SuperFoldingMode::Assign)
            }
            _ => {}
        }
    }
}

impl Visit<CallExpr> for SuperCallFinder {
    fn visit(&mut self, e: &CallExpr) {
        match e.callee {
            ExprOrSuper::Super(..) => match self.mode {
                None if !self.in_complex => self.mode = Some(SuperFoldingMode::Var),

                // Complex `super()`
                None if self.in_complex => self.mode = Some(SuperFoldingMode::Assign),

                // Multiple `super()`
                Some(SuperFoldingMode::Var) => self.mode = Some(SuperFoldingMode::Assign),
                _ => {}
            },

            _ => e.visit_children(self),
        }
    }
}

pub(super) fn constructor_fn(c: Constructor) -> Function {
    Function {
        span: DUMMY_SP,
        decorators: Default::default(),
        params: c
            .params
            .into_iter()
            .map(|pat| match pat {
                PatOrTsParamProp::Pat(p) => p,
                _ => unimplemented!("TsParamProp in constructor"),
            })
            .collect(),
        body: c.body,
        is_async: false,
        is_generator: false,

        type_params: Default::default(),
        return_type: Default::default(),
    }
}

/// # In
///
/// ```js
/// super();
/// ```
///
/// # Out
/// ```js
/// _this = ...;
/// ```
pub(super) struct ConstructorFolder<'a> {
    pub helpers: &'a Helpers,
    pub class_name: &'a Ident,
    pub mode: Option<SuperFoldingMode>,
    /// Mark for `_this`
    pub mark: Mark,
    pub is_constructor_default: bool,
    /// True when recursing into other function or class.
    pub ignore_return: bool,
}

/// `None`: `return _possibleConstructorReturn`
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum SuperFoldingMode {
    /// `var _this;` followed by `_this = ...`
    Assign,
    /// `var _this = ...`
    Var,
}

impl<'a> Fold<Stmt> for ConstructorFolder<'a> {
    fn fold(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children(self);

        match stmt {
            Stmt::Expr(box Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                args,
                ..
            })) => {
                let expr = make_possible_return_value(
                    self.helpers,
                    ReturningMode::Prototype {
                        is_constructor_default: self.is_constructor_default,
                        class_name: self.class_name.clone(),
                        args: Some(args),
                    },
                );

                match self.mode {
                    Some(SuperFoldingMode::Assign) => Stmt::Expr(box Expr::Assign(AssignExpr {
                        span: DUMMY_SP,
                        left: PatOrExpr::Pat(box Pat::Ident(quote_ident!(
                            DUMMY_SP.apply_mark(self.mark),
                            "_this"
                        ))),
                        op: op!("="),
                        right: box expr,
                    })),
                    Some(SuperFoldingMode::Var) => Stmt::Decl(Decl::Var(VarDecl {
                        span: DUMMY_SP,
                        declare: false,
                        kind: VarDeclKind::Var,
                        decls: vec![VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this")),
                            init: Some(box expr),
                            definite: false,
                        }],
                    })),
                    None => Stmt::Return(ReturnStmt {
                        span: DUMMY_SP,
                        arg: Some(box expr),
                    }),
                }
            }
            _ => stmt,
        }
    }
}

impl<'a> Fold<ReturnStmt> for ConstructorFolder<'a> {
    fn fold(&mut self, stmt: ReturnStmt) -> ReturnStmt {
        if self.ignore_return {
            return stmt;
        }

        let arg = stmt.arg.fold_with(self);

        let arg = Some(box make_possible_return_value(
            self.helpers,
            ReturningMode::Returning {
                mark: self.mark,
                arg,
            },
        ));

        ReturnStmt { arg, ..stmt }
    }
}

macro_rules! ignore_return {
    ($T:ty) => {
        impl<'a> Fold<$T> for ConstructorFolder<'a> {
            fn fold(&mut self, n: $T) -> $T {
                let old = self.ignore_return;
                self.ignore_return = true;
                let n = n.fold_children(self);
                self.ignore_return = old;

                n
            }
        }
    };
}

ignore_return!(Function);
ignore_return!(Class);
ignore_return!(ArrowExpr);

impl<'a> Fold<Expr> for ConstructorFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        match self.mode {
            Some(SuperFoldingMode::Assign) => {}
            _ => return expr,
        }

        let expr = expr.fold_children(self);

        match expr {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                args,
                ..
            }) => {
                let right = box make_possible_return_value(
                    self.helpers,
                    ReturningMode::Prototype {
                        class_name: self.class_name.clone(),
                        args: Some(args),
                        is_constructor_default: self.is_constructor_default,
                    },
                );

                Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(box Pat::Ident(quote_ident!(
                        DUMMY_SP.apply_mark(self.mark),
                        "_this"
                    ))),
                    op: op!("="),
                    right,
                })
            }
            _ => return expr,
        }
    }
}

#[derive(Debug)]
pub(super) enum ReturningMode {
    /// `return arg`
    Returning {
        /// Mark for `_this`
        mark: Mark,
        arg: Option<Box<Expr>>,
    },

    /// `super()` call
    Prototype {
        /// Hack to handle injected (default) constructor
        is_constructor_default: bool,
        class_name: Ident,
        /// None when `super(arguments)` is injected because no constructor is
        /// defined.
        args: Option<Vec<ExprOrSpread>>,
    },
}

pub(super) fn make_possible_return_value(helpers: &Helpers, mode: ReturningMode) -> Expr {
    helpers.possible_constructor_return();
    let callee = quote_ident!("_possibleConstructorReturn").as_callee();

    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee,
        args: match mode {
            ReturningMode::Returning { mark, arg } => {
                iter::once(quote_ident!(DUMMY_SP.apply_mark(mark), "_this").as_arg())
                    .chain(arg.map(|arg| arg.as_arg()))
                    .collect()
            }
            ReturningMode::Prototype {
                class_name,
                args,
                is_constructor_default,
            } => {
                let (fn_name, args) = if is_constructor_default {
                    (
                        quote_ident!("apply"),
                        vec![
                            ThisExpr { span: DUMMY_SP }.as_arg(),
                            quote_ident!("arguments").as_arg(),
                        ],
                    )
                } else {
                    match args {
                        Some(mut args) => {
                            //
                            if args.len() == 1
                                && match args[0] {
                                    ExprOrSpread {
                                        spread: Some(..), ..
                                    } => true,
                                    _ => false,
                                }
                            {
                                args[0].spread = None;
                                (
                                    quote_ident!("apply"),
                                    vec![ThisExpr { span: DUMMY_SP }.as_arg(), args.pop().unwrap()],
                                )
                            } else {
                                (
                                    quote_ident!("call"),
                                    iter::once(ThisExpr { span: DUMMY_SP }.as_arg())
                                        .chain(args)
                                        .collect(),
                                )
                            }
                        }
                        None => (
                            quote_ident!("apply"),
                            vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                quote_ident!("arguments").as_arg(),
                            ],
                        ),
                    }
                };

                vec![ThisExpr { span: DUMMY_SP }.as_arg(), {
                    let apply = box Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: ExprOrSuper::Expr(box get_prototype_of(
                                helpers,
                                &Expr::Ident(class_name),
                            )),
                            computed: false,
                            prop: box Expr::Ident(fn_name),
                        }
                        .as_callee(),

                        // super(foo, bar) => possibleReturnCheck(this, foo, bar)
                        args,

                        type_args: Default::default(),
                    });

                    apply.as_arg()
                }]
            }
        },
        type_args: Default::default(),
    })
}

/// `mark`: Mark for `_this`
pub(super) fn replace_this_in_constructor(mark: Mark, c: Constructor) -> (Constructor, bool) {
    struct Replacer {
        mark: Mark,
        found: bool,
        wrap_with_assertiion: bool,
    }

    impl Fold<Expr> for Replacer {
        fn fold(&mut self, expr: Expr) -> Expr {
            match expr {
                Expr::This(..) => {
                    self.found = true;
                    let this = quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this");

                    // TODO:
                    // self.helpers.assert_this_initialized();

                    if self.wrap_with_assertiion {
                        Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: quote_ident!("_assertThisInitialized").as_callee(),
                            args: vec![this.as_arg()],
                            type_args: Default::default(),
                        })
                    } else {
                        Expr::Ident(this)
                    }
                }
                _ => expr.fold_children(self),
            }
        }
    }

    impl Fold<MemberExpr> for Replacer {
        fn fold(
            &mut self,
            MemberExpr {
                span,
                mut obj,
                prop,
                computed,
            }: MemberExpr,
        ) -> MemberExpr {
            if self.mark != Mark::root() {
                let old = self.wrap_with_assertiion;
                self.wrap_with_assertiion = false;
                obj = obj.fold_children(self);
                self.wrap_with_assertiion = old;
            }

            MemberExpr {
                span,
                obj,
                prop: prop.fold_children(self),
                computed,
            }
        }
    }

    let mut v = Replacer {
        found: false,
        mark,
        wrap_with_assertiion: true,
    };
    let c = c.fold_with(&mut v);

    (c, v.found)
}
