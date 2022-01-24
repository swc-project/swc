use std::iter;
use swc_atoms::{js_word, JsWord};
use swc_common::{util::take::Take, Mark, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_transforms_classes::{get_prototype_of, visit_mut_only_key};
use swc_ecma_utils::{private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

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
    pub fn find(node: &[Stmt]) -> Option<SuperFoldingMode> {
        if let Some(Stmt::Expr(ExprStmt { ref expr, .. })) = node.last() {
            if let Expr::Call(CallExpr {
                callee: Callee::Super(..),
                ..
            }) = &**expr
            {
                return None;
            }
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
        fn $name(&mut self, n: &mut $T) {
            if self.in_injected_define_property_call {
                return;
            }

            let old = self.ignore_return;
            self.ignore_return = true;
            n.visit_mut_children_with(self);
            self.ignore_return = old;
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
            Callee::Super(..) => match self.mode {
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

        if let Expr::Call(CallExpr {
            callee: Callee::Super(..),
            ..
        }) = &*e.obj
        {
            // super().foo
            self.mode = Some(SuperFoldingMode::Assign)
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
    /// `true` means it's processed and children are folded.
    fn handle_super_assignment(&mut self, e: &mut Expr) -> bool {
        if let Expr::Assign(AssignExpr {
            left,
            op: op!("="),
            right,
            span,
        }) = e
        {
            let left = left.take().normalize_expr();
            match left {
                PatOrExpr::Expr(mut left_expr) => match *left_expr {
                    Expr::SuperProp(_) => {
                        right.visit_mut_children_with(self);
                        self.handle_super_access(&mut left_expr, Some(right.take()));
                        *e = *left_expr;
                        true
                    }
                    _ => {
                        *e = Expr::Assign(AssignExpr {
                            span: *span,
                            left: PatOrExpr::Expr(left_expr),
                            op: op!("="),
                            right: right.take(),
                        });
                        false
                    }
                },
                _ => {
                    *e = Expr::Assign(AssignExpr {
                        span: *span,
                        left,
                        op: op!("="),
                        right: right.take(),
                    });
                    false
                }
            }
        } else {
            false
        }
    }

    fn handle_super_access(&mut self, e: &mut Expr, set_to: Option<Box<Expr>>) {
        if let Expr::SuperProp(SuperPropExpr { span, prop, .. }) = e {
            let this_var = quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this");
            let this_super = private_ident!("_thisSuper");
            self.cur_this_super = Some(this_super.clone());

            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: this_super.clone().into(),
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
                span: *span,
                callee: helper!(get_prototype_of, "getPrototypeOf"),
                args: vec![self
                    .class_name
                    .clone()
                    .make_member(quote_ident!("prototype"))
                    .as_arg()],
                type_args: Default::default(),
            }));

            *e = Expr::Call(CallExpr {
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
                        match prop {
                            SuperProp::Computed(ComputedPropName { expr, .. }) => {
                                expr.take().as_arg()
                            }
                            SuperProp::Ident(ident) => Str {
                                span: ident.span,
                                value: ident.take().sym,
                                has_escape: false,
                                kind: Default::default(),
                            }
                            .as_arg(),
                        },
                    ];

                    let is_set = set_to.is_some();
                    args.extend(set_to.map(|v| v.as_arg()));

                    args.push(this_super.as_arg());

                    if is_set {
                        args.push(true.as_arg());
                    }
                    args
                },
                type_args: Default::default(),
            })
        };
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

impl VisitMut for ConstructorFolder<'_> {
    noop_visit_mut_type!();
    visit_mut_only_key!();

    ignore_return!(visit_mut_function, Function);
    ignore_return!(visit_mut_class, Class);
    ignore_return!(visit_mut_arrow_expr, ArrowExpr);
    ignore_return!(visit_mut_constructor, Constructor);

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        match &e.callee {
            Callee::Expr(callee) => match &**callee {
                Expr::SuperProp(_) => {
                    let old = self.cur_this_super.take();

                    e.visit_mut_children_with(self);

                    let this_super = self.cur_this_super.take().unwrap();
                    self.cur_this_super = old;

                    e.args.insert(0, this_super.as_arg());
                    e.callee = e
                        .callee
                        .take()
                        .expect_expr()
                        .make_member(quote_ident!("call"))
                        .as_callee();
                }

                _ => e.visit_mut_children_with(self),
            },

            _ => e.visit_mut_children_with(self),
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        match self.mode {
            Some(SuperFoldingMode::Assign) => {}
            _ => {
                if !self.handle_super_assignment(expr) {
                    expr.visit_mut_children_with(self);
                };
                self.handle_super_access(expr, None);
                return;
            }
        }

        // We pretend method folding mode for while folding injected `_defineProperty`
        // calls.
        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee),
            ..
        }) = expr
        {
            if let Expr::Ident(Ident {
                sym: js_word!("_defineProperty"),
                ..
            }) = &**callee
            {
                let old = self.in_injected_define_property_call;
                self.in_injected_define_property_call = true;
                expr.visit_mut_children_with(self);
                self.in_injected_define_property_call = old;
                return;
            }
        }

        if !self.handle_super_assignment(expr) {
            expr.visit_mut_children_with(self);
        };
        match expr {
            Expr::This(e) => {
                *expr = Expr::Ident(Ident::new("_this".into(), e.span.apply_mark(self.mark)))
            }
            Expr::Call(CallExpr {
                callee: Callee::Super(..),
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
                            call_args.extend(args.take());

                            call_args
                        },
                        type_args: Default::default(),
                    })),

                    None => Box::new(make_possible_return_value(ReturningMode::Prototype {
                        class_name: self.class_name.clone(),
                        args: Some(args.take()),
                        is_constructor_default: self.is_constructor_default,
                    })),
                };

                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    left: PatOrExpr::Pat(
                        quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                    ),
                    op: op!("="),
                    right,
                });
            }

            _ => self.handle_super_access(expr, None),
        };
    }

    fn visit_mut_return_stmt(&mut self, stmt: &mut ReturnStmt) {
        if self.ignore_return {
            return;
        }

        stmt.arg.visit_mut_with(self);

        stmt.arg = Some(Box::new(make_possible_return_value(
            ReturningMode::Returning {
                mark: self.mark,
                arg: stmt.arg.take(),
            },
        )));
    }

    fn visit_mut_stmt(&mut self, stmt: &mut Stmt) {
        stmt.visit_mut_children_with(self);

        if let Stmt::Expr(ExprStmt { span: _, expr }) = stmt {
            if let Expr::Call(CallExpr {
                callee: Callee::Super(..),
                args,
                ..
            }) = &mut **expr
            {
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
                            call_args.extend(args.take());

                            call_args
                        },
                        type_args: Default::default(),
                    })),
                    None => Box::new(make_possible_return_value(ReturningMode::Prototype {
                        is_constructor_default: self.is_constructor_default,
                        class_name: self.class_name.clone(),
                        args: Some(args.take()),
                    })),
                };

                match self.mode {
                    Some(SuperFoldingMode::Assign) => {
                        *stmt = AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(
                                quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                            ),
                            op: op!("="),
                            right: expr,
                        }
                        .into_stmt()
                    }
                    Some(SuperFoldingMode::Var) => {
                        *stmt = Stmt::Decl(Decl::Var(VarDecl {
                            span: DUMMY_SP,
                            declare: false,
                            kind: VarDeclKind::Var,
                            decls: vec![VarDeclarator {
                                span: DUMMY_SP,
                                name: quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this").into(),
                                init: Some(expr),
                                definite: false,
                            }],
                        }))
                    }
                    None => {
                        *stmt = Stmt::Return(ReturnStmt {
                            span: DUMMY_SP,
                            arg: Some(expr),
                        })
                    }
                }
            }
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
                                && matches!(
                                    args[0],
                                    ExprOrSpread {
                                        spread: Some(..),
                                        ..
                                    }
                                )
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
pub(super) fn replace_this_in_constructor(mark: Mark, c: &mut Constructor) -> bool {
    struct Replacer {
        mark: Mark,
        found: bool,
        wrap_with_assertion: bool,
        in_injected_define_property_call: bool,
    }

    impl VisitMut for Replacer {
        noop_visit_mut_type!();

        fn visit_mut_class(&mut self, _: &mut Class) {}

        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            // We pretend method folding mode for while folding injected `_defineProperty`
            // calls.
            if let Expr::Call(CallExpr {
                callee: Callee::Expr(callee),
                ..
            }) = expr
            {
                if let Expr::Ident(Ident {
                    sym: js_word!("_defineProperty"),
                    ..
                }) = &**callee
                {
                    let old = self.in_injected_define_property_call;
                    self.in_injected_define_property_call = true;
                    expr.visit_mut_children_with(self);
                    self.in_injected_define_property_call = old;
                    return;
                }
            }

            match expr {
                Expr::This(..) => {
                    self.found = true;
                    let this = quote_ident!(DUMMY_SP.apply_mark(self.mark), "_this");

                    if self.wrap_with_assertion {
                        *expr = Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: helper!(assert_this_initialized, "assertThisInitialized"),
                            args: vec![this.as_arg()],
                            type_args: Default::default(),
                        })
                    } else {
                        *expr = Expr::Ident(this);
                    }
                }

                _ => expr.visit_mut_children_with(self),
            }
        }

        fn visit_mut_function(&mut self, n: &mut Function) {
            if self.in_injected_define_property_call {
                return;
            }
            n.visit_mut_children_with(self)
        }

        fn visit_mut_member_expr(&mut self, expr: &mut MemberExpr) {
            if self.mark != Mark::root() {
                let old = self.wrap_with_assertion;
                self.wrap_with_assertion = false;
                // it's not ExprOrSuper no more, so visit children will ignore this.aaa
                expr.obj.visit_mut_with(self);
                self.wrap_with_assertion = old;
            }
            expr.prop.visit_mut_with(self);
        }
    }

    let mut v = Replacer {
        found: false,
        mark,
        wrap_with_assertion: true,
        in_injected_define_property_call: false,
    };
    c.visit_mut_with(&mut v);

    v.found
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

impl<'a> VisitMut for VarRenamer<'a> {
    noop_visit_mut_type!();

    fn visit_mut_pat(&mut self, pat: &mut Pat) {
        match pat {
            Pat::Ident(ident) => {
                if *self.class_name == ident.id.sym {
                    ident.id.span = ident.id.span.apply_mark(self.mark);
                }
            }
            _ => pat.visit_mut_children_with(self),
        }
    }
}
