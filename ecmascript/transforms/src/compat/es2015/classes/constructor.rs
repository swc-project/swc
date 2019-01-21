use super::get_prototype_of;
use crate::{helpers::Helpers, util::ExprFactory};
use ast::*;
use std::iter;
use swc_common::{Fold, FoldWith, Mark, Visit, VisitWith, DUMMY_SP};

pub(super) struct SuperCallFinder {
    mode: Option<SuperFoldingMode>,
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

        let mut v = SuperCallFinder { mode: None };
        node.visit_with(&mut v);
        v.mode
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
                None => self.mode = Some(SuperFoldingMode::Var),
                // Multiple `super()` detected
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
/// _this = possi;
/// ```
pub(super) struct ConstructorFolder<'a> {
    pub helpers: &'a Helpers,
    pub class_name: &'a Ident,
    pub mode: Option<SuperFoldingMode>,
    /// Mark for `_this`
    pub mark: Mark,
    pub is_constructor_default: bool,
}

/// `None`: `return _possibleConstructorReturn`
#[derive(Debug, Clone, Copy)]
pub(super) enum SuperFoldingMode {
    /// `_this = ...`
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
                            "_thid"
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
        let arg = Some(box make_possible_return_value(
            self.helpers,
            ReturningMode::Returning {
                mark: self.mark,
                arg: stmt.arg,
            },
        ));

        ReturnStmt { arg, ..stmt }
    }
}

macro_rules! noop {
    ($T:ty) => {
        impl<'a> Fold<$T> for ConstructorFolder<'a> {
            fn fold(&mut self, n: $T) -> $T {
                n
            }
        }
    };
}

noop!(Function);
noop!(Class);

impl<'a> Fold<Expr> for ConstructorFolder<'a> {
    fn fold(&mut self, expr: Expr) -> Expr {
        let expr = expr.fold_children(self);

        match self.mode {
            Some(SuperFoldingMode::Assign) => {}
            _ => return expr,
        }

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
                            prop: box Expr::Ident(if args.is_some() && !is_constructor_default {
                                quote_ident!("call")
                            } else {
                                quote_ident!("apply")
                            }),
                        }
                        .as_callee(),
                        // super(foo, bar) => possibleReturnCheck(this, foo, bar)
                        args: match args {
                            Some(args) => {
                                if is_constructor_default {
                                    vec![
                                        ThisExpr { span: DUMMY_SP }.as_arg(),
                                        quote_ident!("arguments").as_arg(),
                                    ]
                                } else {
                                    iter::once(ThisExpr { span: DUMMY_SP }.as_arg())
                                        .chain(args)
                                        .collect()
                                }
                            }
                            None => vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                quote_ident!("arguments").as_arg(),
                            ],
                        },

                        type_args: Default::default(),
                    });

                    apply.as_arg()
                }]
            }
        },
        type_args: Default::default(),
    })
}
