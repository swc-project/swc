use std::iter;
use swc_atoms::{js_word, JsWord};
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_classes::{fold_only_key, get_prototype_of};
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_fold_type, noop_visit_type, Fold, FoldWith, Visit, VisitWith};

pub(super) struct SuperCallFinder {
    mode: Option<SuperFoldingMode>,
    /// True in conditional statement or arrow expression.
    in_complex: bool,
}

impl SuperCallFinder {
    ///
    /// - `None`: if no `super()` is found or super() is last call
    /// - `Some(Var)`: `var _this = ...`
    /// - `Some(Assign)`: `_this = ...`
    pub fn find(node: &Vec<Stmt>) -> Option<SuperFoldingMode> {
        match node.last() {
            Some(Stmt::Expr(ExprStmt { ref expr, .. })) => match &**expr {
                Expr::Call(CallExpr {
                    callee: ExprOrSuper::Super(..),
                    ..
                }) => {
                    return None;
                }
                _ => {}
            },
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

macro_rules! ignore_return {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, n: $T) -> $T {
            if self.in_injected_define_property_call {
                return n;
            }

            let old = self.ignore_return;
            self.ignore_return = true;
            let n = n.fold_children_with(self);
            self.ignore_return = old;

            n
        }
    };
}

macro_rules! mark_as_complex {
    ($name:ident, $T:ty) => {
        fn $name(&mut self, node: &$T) {
            let old = self.in_complex;
            self.in_complex = true;
            node.visit_children_with(self);
            self.in_complex = old;
        }
    };
}

impl Visit for SuperCallFinder {
    noop_visit_type!();

    mark_as_complex!(visit_arrow_expr, ArrowExpr);
    mark_as_complex!(visit_if_stmt, IfStmt);
    mark_as_complex!(visit_prop_name, PropName);

    fn visit_assign_expr(&mut self, node: &AssignExpr) {
        node.left.visit_with(self);

        let old = self.in_complex;
        self.in_complex = true;
        node.right.visit_children_with(self);
        self.in_complex = old;
    }

    fn visit_call_expr(&mut self, e: &CallExpr) {
        match e.callee {
            ExprOrSuper::Super(..) => match self.mode {
                None if !self.in_complex => self.mode = Some(SuperFoldingMode::Var),

                // Complex `super()`
                None if self.in_complex => self.mode = Some(SuperFoldingMode::Assign),

                // Multiple `super()`
                Some(SuperFoldingMode::Var) => self.mode = Some(SuperFoldingMode::Assign),
                _ => {}
            },

            _ => e.visit_children_with(self),
        }
    }

    /// Don't recurse into class declaration.
    fn visit_class(&mut self, _: &Class) {}

    /// Don't recurse into function.
    fn visit_function(&mut self, _: &Function) {}

    fn visit_member_expr(&mut self, e: &MemberExpr) {
        e.visit_children_with(self);

        match e.obj {
            ExprOrSuper::Expr(ref expr) => {
                match &**expr {
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Super(..),
                        ..
                    }) => {
                        // super().foo
                        self.mode = Some(SuperFoldingMode::Assign)
                    }
                    _ => {}
                }
            }
            _ => {}
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
                ParamOrTsParamProp::Param(p) => p,
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
    pub class_name: &'a Ident,
    pub mode: Option<SuperFoldingMode>,
    /// Variables named `thisSuper` will be added if `super.foo` or
    /// `super.foo()` is used in constructor.
    pub vars: &'a mut Vec<VarDeclarator>,

    pub cur_this_super: Option<Ident>,

    /// Mark for `_this`
    pub mark: Mark,
    pub is_constructor_default: bool,
    pub super_var: Option<Ident>,
    /// True when recursing into other function or class.
    pub ignore_return: bool,
    pub in_injected_define_property_call: bool,
}

impl ConstructorFolder<'_> {
    /// `Ok()` means it's processed and children are folded.
    fn handle_super_assignment(&mut self, e: Expr) -> Result<Expr, Expr> {
        match e {
            Expr::Assign(AssignExpr {
                span,
                left,
                op: op!("="),
                right,
            }) => {
                let left = left.normalize_expr();
                match left {
                    PatOrExpr::Expr(left_expr) => match &*left_expr {
                        Expr::Member(MemberExpr {
                            obj: ExprOrSuper::Super(..),
                            ..
                        }) => {
                            let right = right.fold_children_with(self);

                            return Ok(self.handle_super_access(*left_expr, Some(right)));
                        }
                        _ => Err(Expr::Assign(AssignExpr {
                            span,
                            left: PatOrExpr::Expr(left_expr),
                            op: op!("="),
                            right,
                        })),
                    },
                    _ => Err(Expr::Assign(AssignExpr {
                        span,
                        left,
                        op: op!("="),
                        right,
                    })),
                }
            }
            _ => Err(e),
        }
    }

    fn handle_super_access(&mut self, e: Expr, set_to: Option<Box<Expr>>) -> Expr {
        match e {
            Expr::Member(MemberExpr {
                span,
                obj: ExprOrSuper::Super(..),
                prop,
                computed,
            }) => {
                let this_var = quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this");
                let this_super = private_ident!("_thisSuper");
                self.cur_this_super = Some(this_super.clone());

                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(this_super.clone().into()),
                    init: None,
                    definite: Default::default(),
                });

                // _thisSuper = _assertThisInitialized(_this)
                let init_this_super = Box::new(Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Pat(Box::new(this_super.clone().into())),
                    right: Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(assert_this_initialized, "assertThisInitialized"),
                        args: vec![this_var.as_arg()],
                        type_args: Default::default(),
                    })),
                }));
                // _getPrototypeOf(Foo.prototype)
                let get_proto = Box::new(Expr::Call(CallExpr {
                    span,
                    callee: helper!(get_prototype_of, "getPrototypeOf"),
                    args: vec![self
                        .class_name
                        .clone()
                        .make_member(quote_ident!("prototype"))
                        .as_arg()],
                    type_args: Default::default(),
                }));

                Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: if set_to.is_some() {
                        helper!(set, "set")
                    } else {
                        helper!(get, "get")
                    },
                    args: {
                        let mut args = vec![
                            Expr::Seq(SeqExpr {
                                span: DUMMY_SP,
                                exprs: vec![init_this_super, get_proto],
                            })
                            .as_arg(),
                            if computed {
                                prop.as_arg()
                            } else {
                                let prop = prop.expect_ident();

                                Str {
                                    span: prop.span,
                                    value: prop.sym,
                                    has_escape: false,
                                    kind: Default::default(),
                                }
                                .as_arg()
                            },
                        ];

                        let is_set = set_to.is_some();
                        args.extend(set_to.map(|v| v.as_arg()));

                        args.push(this_super.clone().as_arg());

                        if is_set {
                            args.push(true.as_arg());
                        }
                        args
                    },
                    type_args: Default::default(),
                })
            }

            _ => e,
        }
    }
}

/// `None`: `return _possibleConstructorReturn`
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(super) enum SuperFoldingMode {
    /// `var _this;` followed by `_this = ...`
    Assign,
    /// `var _this = ...`
    Var,
}

/// TODO: VisitMut
impl Fold for ConstructorFolder<'_> {
    noop_fold_type!();
    fold_only_key!();

    ignore_return!(fold_function, Function);
    ignore_return!(fold_class, Class);
    ignore_return!(fold_arrow_expr, ArrowExpr);
    ignore_return!(fold_constructor, Constructor);

    fn fold_call_expr(&mut self, e: CallExpr) -> CallExpr {
        match &e.callee {
            ExprOrSuper::Expr(callee) => match &**callee {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(..),
                    ..
                }) => {
                    let old = self.cur_this_super.take();

                    let mut e = e.fold_children_with(self);

                    let this_super = self.cur_this_super.take().unwrap();
                    self.cur_this_super = old;

                    e.args.insert(0, this_super.as_arg());

                    CallExpr {
                        span: e.span,
                        callee: e
                            .callee
                            .expect_expr()
                            .make_member(quote_ident!("call"))
                            .as_callee(),
                        args: e.args,
                        type_args: Default::default(),
                    }
                }

                _ => return e.fold_children_with(self),
            },

            _ => return e.fold_children_with(self),
        }
    }

    fn fold_expr(&mut self, expr: Expr) -> Expr {
        match self.mode {
            Some(SuperFoldingMode::Assign) => {}
            _ => {
                let expr = match self.handle_super_assignment(expr) {
                    Ok(v) => v,
                    Err(v) => v.fold_children_with(self),
                };
                return self.handle_super_access(expr, None);
            }
        }

        // We pretend method folding mode for while folding injected `_defineProperty`
        // calls.
        match expr {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref callee),
                ..
            }) => match &**callee {
                Expr::Ident(Ident {
                    sym: js_word!("_defineProperty"),
                    ..
                }) => {
                    let old = self.in_injected_define_property_call;
                    self.in_injected_define_property_call = true;
                    let n = expr.fold_children_with(self);
                    self.in_injected_define_property_call = old;
                    return n;
                }
                _ => {}
            },
            _ => {}
        }

        let expr = match self.handle_super_assignment(expr) {
            Ok(v) => v,
            Err(v) => v.fold_children_with(self),
        };

        match expr {
            Expr::This(e) => Expr::Ident(Ident::new("_this".into(), e.span.apply_mark(self.mark))),
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Super(..),
                args,
                ..
            }) => {
                let right = match self.super_var.clone() {
                    Some(super_var) => Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: if self.is_constructor_default {
                            super_var.make_member(quote_ident!("apply")).as_callee()
                        } else {
                            super_var.make_member(quote_ident!("call")).as_callee()
                        },
                        args: if self.is_constructor_default {
                            vec![
                                ThisExpr { span: DUMMY_SP }.as_arg(),
                                quote_ident!("arguments").as_arg(),
                            ]
                        } else {
                            let mut call_args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
                            call_args.extend(args);

                            call_args
                        },
                        type_args: Default::default(),
                    })),

                    None => Box::new(make_possible_return_value(ReturningMode::Prototype {
                        class_name: self.class_name.clone(),
                        args: Some(args),
                        is_constructor_default: self.is_constructor_default,
                    })),
                };

                Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(Box::new(Pat::Ident(
                        quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                    ))),
                    op: op!("="),
                    right,
                })
            }

            _ => self.handle_super_access(expr, None),
        }
    }

    fn fold_return_stmt(&mut self, stmt: ReturnStmt) -> ReturnStmt {
        if self.ignore_return {
            return stmt;
        }

        let arg = stmt.arg.fold_with(self);

        let arg = Some(Box::new(make_possible_return_value(
            ReturningMode::Returning {
                mark: self.mark,
                arg,
            },
        )));

        ReturnStmt { arg, ..stmt }
    }

    fn fold_stmt(&mut self, stmt: Stmt) -> Stmt {
        let stmt = stmt.fold_children_with(self);

        match stmt {
            Stmt::Expr(ExprStmt { span, expr }) => match *expr {
                Expr::Call(CallExpr {
                    callee: ExprOrSuper::Super(..),
                    args,
                    ..
                }) => {
                    let expr = match self.super_var.clone() {
                        Some(super_var) => Box::new(Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: if self.is_constructor_default {
                                super_var.make_member(quote_ident!("apply")).as_callee()
                            } else {
                                super_var.make_member(quote_ident!("call")).as_callee()
                            },
                            args: if self.is_constructor_default {
                                vec![
                                    ThisExpr { span: DUMMY_SP }.as_arg(),
                                    quote_ident!("arguments").as_arg(),
                                ]
                            } else {
                                let mut call_args = vec![ThisExpr { span: DUMMY_SP }.as_arg()];
                                call_args.extend(args);

                                call_args
                            },
                            type_args: Default::default(),
                        })),
                        None => Box::new(make_possible_return_value(ReturningMode::Prototype {
                            is_constructor_default: self.is_constructor_default,
                            class_name: self.class_name.clone(),
                            args: Some(args),
                        })),
                    };

                    match self.mode {
                        Some(SuperFoldingMode::Assign) => AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                            ))),
                            op: op!("="),
                            right: expr,
                        }
                        .into_stmt(),
                        Some(SuperFoldingMode::Var) => Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            declare: false,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: Pat::Ident(
                                    quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                                ),
                                init: Some(expr),
                                definite: false,
                            }],
                        })),
                        None => Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr.into()),
                        }),
                    }
                }
                _ => Stmt::Expr(ExprStmt { span, expr }),
            },
            _ => stmt,
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

pub(super) fn make_possible_return_value(mode: ReturningMode) -> Expr {
    let callee = helper!(possible_constructor_return, "possibleConstructorReturn");

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
                    let apply = Box::new(Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: get_prototype_of(Expr::Ident(class_name))
                            .make_member(fn_name)
                            .as_callee(),

                        // super(foo, bar) => possibleReturnCheck(this, foo, bar)
                        args,

                        type_args: Default::default(),
                    }));

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
        wrap_with_assertion: bool,
        in_injected_define_property_call: bool,
    }

    /// TODO: VisitMut
    impl Fold for Replacer {
        noop_fold_type!();

        fn fold_class(&mut self, n: Class) -> Class {
            n
        }

        fn fold_expr(&mut self, n: Expr) -> Expr {
            // We pretend method folding mode for while folding injected `_defineProperty`
            // calls.
            match n {
                Expr::Call(CallExpr {
                    callee: ExprOrSuper::Expr(ref callee),
                    ..
                }) => match &**callee {
                    Expr::Ident(Ident {
                        sym: js_word!("_defineProperty"),
                        ..
                    }) => {
                        let old = self.in_injected_define_property_call;
                        self.in_injected_define_property_call = true;
                        let n = n.fold_children_with(self);
                        self.in_injected_define_property_call = old;
                        return n;
                    }
                    _ => {}
                },
                _ => {}
            }

            match n {
                Expr::This(..) => {
                    self.found = true;
                    let this = quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this");

                    if self.wrap_with_assertion {
                        Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(assert_this_initialized, "assertThisInitialized"),
                            args: vec![this.as_arg()],
                            type_args: Default::default(),
                        })
                    } else {
                        Expr::Ident(this)
                    }
                }

                _ => n.fold_children_with(self),
            }
        }

        fn fold_function(&mut self, n: Function) -> Function {
            if self.in_injected_define_property_call {
                return n;
            }
            n.fold_children_with(self)
        }

        fn fold_member_expr(
            &mut self,
            MemberExpr {
                span,
                mut obj,
                prop,
                computed,
            }: MemberExpr,
        ) -> MemberExpr {
            if self.mark != Mark::root() {
                let old = self.wrap_with_assertion;
                self.wrap_with_assertion = false;
                obj = obj.fold_children_with(self);
                self.wrap_with_assertion = old;
            }

            MemberExpr {
                span,
                obj,
                prop: prop.fold_with(self),
                computed,
            }
        }
    }

    let mut v = Replacer {
        found: false,
        mark,
        wrap_with_assertion: true,
        in_injected_define_property_call: false,
    };
    let c = c.fold_with(&mut v);

    (c, v.found)
}

/// # In
///
/// ```js
/// 
/// class Example {
///   constructor() {
///     var Example;
///   }
/// }
/// ```
///
/// # Out
///
/// ```js
/// var Example = function Example() {
///     _classCallCheck(this, Example);
///     var Example1;
/// };
/// ```
pub(super) struct VarRenamer<'a> {
    pub mark: Mark,
    pub class_name: &'a JsWord,
}

/// TODO: VisitMut
impl<'a> Fold for VarRenamer<'a> {
    noop_fold_type!();

    fn fold_pat(&mut self, pat: Pat) -> Pat {
        match pat {
            Pat::Ident(ident) => {
                if *self.class_name == ident.id.sym {
                    Pat::Ident(
                        BindingIdent {
                            id: Ident {
                                span: ident.id.span.apply_mark(self.mark),
                                ..ident.id
                            },
                            ..ident
                        }
                        .into(),
                    )
                } else {
                    Pat::Ident(ident)
                }
            }
            _ => pat.fold_children_with(self),
        }
    }
}
