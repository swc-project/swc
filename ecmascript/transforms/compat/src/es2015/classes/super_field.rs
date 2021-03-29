use super::get_prototype_of;
use std::iter;
use swc_atoms::js_word;
use swc_common::{Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::alias_ident_for;
use swc_ecma_utils::is_rest_arguments;
use swc_ecma_utils::quote_ident;
use swc_ecma_utils::ExprFactory;
use swc_ecma_visit::{noop_fold_type, Fold, FoldWith};

/// Process function body.
///
/// # In
///
/// ```js
/// super.foo(a)
/// ```
///
/// # Out
///
///
/// _get(Child.prototype.__proto__ || Object.getPrototypeOf(Child.prototype),
/// 'foo', this).call(this, a);
pub(crate) struct SuperFieldAccessFolder<'a> {
    pub class_name: &'a Ident,

    pub vars: &'a mut Vec<VarDeclarator>,
    /// Mark for the `_this`. Used only when folding constructor.
    pub constructor_this_mark: Option<Mark>,
    pub is_static: bool,

    pub folding_constructor: bool,

    /// True while folding **injected** `_defineProperty` call
    pub in_injected_define_property_call: bool,

    /// True while folding a function / class.
    pub in_nested_scope: bool,

    /// `Some(mark)` if `var this2 = this`is required.
    pub this_alias_mark: Option<Mark>,
}

struct SuperCalleeFolder<'a> {
    vars: &'a mut Vec<VarDeclarator>,
    class_name: &'a Ident,
    /// True if we should inject get and
    inject_get: bool,
    _inject_set: bool,
    /// Mark for the `_this`. Used only when folding constructor.
    constructor_this_mark: Option<Mark>,
    is_static: bool,

    /// True while folding a function / class.
    in_nested_scope: bool,

    /// `Some(mark)` if `var this2 = this`is required.
    this_alias_mark: Option<Mark>,
}

macro_rules! mark_nested {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, n: $T) -> $T {
            // injected `_defineProperty` should be handled like method
            if self.folding_constructor && !self.in_injected_define_property_call {
                let old = self.in_nested_scope;
                self.in_nested_scope = true;
                let n = n.fold_children_with(self);
                self.in_nested_scope = old;
                n
            } else {
                n.fold_children_with(self)
            }
        }
    };
}

impl<'a> Fold for SuperCalleeFolder<'a> {
    noop_fold_type!();

    fold_only_key!();

    fn fold_expr(&mut self, n: Expr) -> Expr {
        match n {
            Expr::This(ThisExpr { span }) if self.in_nested_scope => {
                if self.this_alias_mark.is_none() {
                    self.this_alias_mark = Some(Mark::fresh(Mark::root()));
                }

                return Expr::Ident(quote_ident!(
                    span.apply_mark(self.this_alias_mark.unwrap()),
                    "_this"
                ));
            }
            _ => {}
        }

        let n = match n {
            Expr::Update(UpdateExpr {
                span,
                arg,
                op,
                prefix,
            }) => match *arg {
                Expr::Member(MemberExpr {
                    obj:
                        ExprOrSuper::Super(Super {
                            span: super_token, ..
                        }),
                    prop,
                    ..
                }) => {
                    let op = match op {
                        op!("++") => op!("+="),
                        op!("--") => op!("-="),
                    };

                    self.super_to_set_call(
                        super_token,
                        true,
                        prop,
                        op,
                        Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                        }))),
                    )
                }
                _ => {
                    return Expr::Update(UpdateExpr {
                        span,
                        arg,
                        op,
                        prefix,
                    });
                }
            },
            Expr::Assign(AssignExpr {
                span,
                mut left,
                op,
                right,
            }) => {
                //
                if let PatOrExpr::Expr(expr) = left {
                    match *expr {
                        Expr::Member(MemberExpr {
                            obj:
                                ExprOrSuper::Super(Super {
                                    span: super_token, ..
                                }),
                            prop,
                            ..
                        }) => {
                            return self.super_to_set_call(super_token, false, prop, op, right);
                        }
                        _ => {
                            left = PatOrExpr::Expr(expr);
                        }
                    }
                }
                if let PatOrExpr::Pat(pat) = left {
                    match *pat {
                        Pat::Expr(expr) => match *expr {
                            Expr::Member(MemberExpr {
                                obj:
                                    ExprOrSuper::Super(Super {
                                        span: super_token, ..
                                    }),
                                prop,
                                ..
                            }) => {
                                return self.super_to_set_call(super_token, false, prop, op, right);
                            }
                            _ => {
                                left = PatOrExpr::Pat(Box::new(Pat::Expr(expr)));
                            }
                        },
                        _ => left = PatOrExpr::Pat(pat),
                    }
                }

                Expr::Assign(AssignExpr {
                    span,
                    left: left.fold_children_with(self),
                    op,
                    right,
                })
            }
            _ => n.fold_children_with(self),
        };

        match n {
            Expr::Member(MemberExpr {
                obj:
                    ExprOrSuper::Super(Super {
                        span: super_token, ..
                    }),
                prop,
                computed,
                ..
            }) => self.super_to_get_call(super_token, prop, computed),

            _ => n,
        }
    }
}

impl<'a> SuperCalleeFolder<'a> {
    fn super_to_get_call(&mut self, super_token: Span, prop: Box<Expr>, computed: bool) -> Expr {
        self.inject_get = true;

        let proto_arg = get_prototype_of(if self.is_static {
            // Foo
            Expr::Ident(self.class_name.clone())
        } else {
            // Foo.prototype
            self.class_name
                .clone()
                .make_member(quote_ident!("prototype"))
        })
        .as_arg();

        let prop_arg = match *prop {
            Expr::Ident(Ident {
                sym: ref value,
                span,
                ..
            }) if !computed => Expr::Lit(Lit::Str(Str {
                span,
                value: value.clone(),
                has_escape: false,
                kind: Default::default(),
            })),
            ref expr => expr.clone(),
        }
        .as_arg();

        let this_arg = match self.constructor_this_mark {
            Some(mark) => {
                let this = quote_ident!(super_token.apply_mark(mark), "_this");

                CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(assert_this_initialized, "assertThisInitialized"),
                    args: vec![this.as_arg()],
                    type_args: Default::default(),
                }
                .as_arg()
            }
            _ => ThisExpr { span: super_token }.as_arg(),
        };

        Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(get, "get"),
            args: vec![proto_arg, prop_arg, this_arg],
            type_args: Default::default(),
        })
    }

    fn super_to_set_call(
        &mut self,
        super_token: Span,
        is_update: bool,
        prop: Box<Expr>,
        op: AssignOp,
        rhs: Box<Expr>,
    ) -> Expr {
        self._inject_set = true;

        let mut ref_ident = alias_ident_for(&rhs, "_ref");
        ref_ident.span = ref_ident.span.apply_mark(Mark::fresh(Mark::root()));

        let mut update_ident = alias_ident_for(&rhs, "_superRef");
        update_ident.span = update_ident.span.apply_mark(Mark::fresh(Mark::root()));

        if op != op!("=") {
            // Memoize
            self.vars.push(VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(ref_ident.clone().into()),
                init: None,
                definite: false,
            });

            if is_update {
                self.vars.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(update_ident.clone().into()),
                    init: None,
                    definite: false,
                });
            }
        }

        let proto_arg = get_prototype_of(
            self.class_name
                .clone()
                .make_member(quote_ident!("prototype")),
        )
        .as_arg();

        let prop_arg = match *prop {
            Expr::Ident(Ident {
                sym: ref value,
                span,
                ..
            }) => Expr::Lit(Lit::Str(Str {
                span,
                value: value.clone(),
                has_escape: false,
                kind: Default::default(),
            })),
            ref e => e.clone(),
        };
        let prop_arg = match op {
            op!("=") => prop_arg.as_arg(),
            _ => AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Box::new(Pat::Ident(ref_ident.clone().into()))),
                op: op!("="),
                right: prop,
            }
            .as_arg(),
        };

        let rhs_arg = match op {
            op!("=") => rhs.as_arg(),
            _ => {
                let left = Box::new(self.super_to_get_call(
                    super_token,
                    Box::new(Expr::Ident(ref_ident)),
                    true,
                ));
                let left = if is_update {
                    Box::new(
                        AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(update_ident.clone().into()))),
                            op: op!("="),
                            right: Box::new(Expr::Unary(UnaryExpr {
                                span: DUMMY_SP,
                                op: op!(unary, "+"),
                                arg: left,
                            })),
                        }
                        .into(),
                    )
                } else {
                    left
                };

                BinExpr {
                    span: DUMMY_SP,
                    left,
                    op: match op {
                        op!("=") => unreachable!(),

                        op!("+=") => op!(bin, "+"),
                        op!("-=") => op!(bin, "-"),
                        op!("*=") => op!("*"),
                        op!("/=") => op!("/"),
                        op!("%=") => op!("%"),
                        op!("<<=") => op!("<<"),
                        op!(">>=") => op!(">>"),
                        op!(">>>=") => op!(">>>"),
                        op!("|=") => op!("|"),
                        op!("&=") => op!("&"),
                        op!("^=") => op!("^"),
                        op!("**=") => op!("**"),
                        op!("&&=") => op!("&&"),
                        op!("||=") => op!("||"),
                        op!("??=") => op!("??"),
                    },
                    right: rhs,
                }
                .as_arg()
            }
        };

        let this_arg = ThisExpr { span: super_token }.as_arg();

        let expr = Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(set, "set"),
            args: vec![
                proto_arg,
                prop_arg,
                rhs_arg,
                this_arg,
                // strict
                Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .as_arg(),
            ],
            type_args: Default::default(),
        });

        if is_update {
            Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs: vec![Box::new(expr), Box::new(Expr::Ident(update_ident))],
            })
        } else {
            expr
        }
    }
}

impl<'a> Fold for SuperFieldAccessFolder<'a> {
    noop_fold_type!();

    mark_nested!(fold_function, Function);
    mark_nested!(fold_class, Class);

    fold_only_key!();

    fn fold_expr(&mut self, n: Expr) -> Expr {
        // We pretend method folding mode for while folding injected `_defineProperty`
        // calls.
        match n {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref expr),
                ..
            }) => match &**expr {
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

        let mut callee_folder = SuperCalleeFolder {
            class_name: self.class_name,
            inject_get: false,
            _inject_set: false,
            vars: self.vars,
            constructor_this_mark: self.constructor_this_mark,
            is_static: self.is_static,
            in_nested_scope: self.in_nested_scope,
            this_alias_mark: self.this_alias_mark,
        };

        let should_invoke_call = match n {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref expr),
                ..
            }) => match &**expr {
                Expr::Member(MemberExpr {
                    obj: ExprOrSuper::Super(..),
                    ..
                }) => true,
                _ => false,
            },
            _ => false,
        };

        let n = n.fold_with(&mut callee_folder);
        if callee_folder.this_alias_mark.is_some() {
            self.this_alias_mark = callee_folder.this_alias_mark;
        }

        if callee_folder.inject_get && should_invoke_call {
            match n {
                Expr::Call(CallExpr {
                    callee,
                    mut args,
                    type_args,
                    ..
                }) => {
                    let this = match self.constructor_this_mark {
                        Some(mark) => quote_ident!(DUMMY_SP.apply_mark(mark), "_this").as_arg(),
                        _ => ThisExpr { span: DUMMY_SP }.as_arg(),
                    };

                    if args.len() == 1 && is_rest_arguments(&args[0]) {
                        return Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: MemberExpr {
                                span: DUMMY_SP,
                                obj: callee,
                                prop: Box::new(Expr::Ident(quote_ident!("apply"))),
                                computed: false,
                            }
                            .as_callee(),
                            args: iter::once(this)
                                .chain(iter::once({
                                    let mut arg = args.pop().unwrap();
                                    arg.spread = None;
                                    arg
                                }))
                                .collect(),
                            type_args,
                        });
                    }

                    return Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: callee,
                            prop: Box::new(Expr::Ident(quote_ident!("call"))),
                            computed: false,
                        }
                        .as_callee(),
                        args: iter::once(this).chain(args).collect(),
                        type_args,
                    });
                }
                _ => unreachable!(),
            }
        }

        n.fold_children_with(self)
    }
}
