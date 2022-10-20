use std::iter;

use swc_atoms::js_word;
use swc_common::{util::take::Take, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{is_rest_arguments, quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::get_prototype_of;

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
pub struct SuperFieldAccessFolder<'a> {
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

    /// assumes super is never changed, payload is the name of super class
    pub constant_super: bool,

    pub super_class: &'a Option<Ident>,

    pub in_pat: bool,
}

macro_rules! mark_nested {
    ($name:ident, $T:tt) => {
        fn $name(&mut self, n: &mut $T) {
            // injected `_defineProperty` should be handled like method
            if self.folding_constructor && !self.in_injected_define_property_call {
                let old = self.in_nested_scope;
                self.in_nested_scope = true;
                n.visit_mut_children_with(self);
                self.in_nested_scope = old;
            } else {
                n.visit_mut_children_with(self)
            }
        }
    };
}

impl<'a> VisitMut for SuperFieldAccessFolder<'a> {
    noop_visit_mut_type!();

    // mark_nested!(fold_function, Function);
    mark_nested!(visit_mut_class, Class);

    visit_mut_only_key!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::This(ThisExpr { span }) if self.in_nested_scope => {
                *n = Expr::Ident(quote_ident!(
                    span.apply_mark(
                        *self
                            .this_alias_mark
                            .get_or_insert_with(|| Mark::fresh(Mark::root()))
                    ),
                    "_this"
                ));
            }
            // We pretend method folding mode for while folding injected `_defineProperty`
            // calls.
            Expr::Call(CallExpr {
                callee: Callee::Expr(expr),
                ..
            }) if matches!(
                &**expr,
                Expr::Ident(Ident {
                    sym: js_word!("_defineProperty"),
                    ..
                })
            ) =>
            {
                let old = self.in_injected_define_property_call;
                self.in_injected_define_property_call = true;
                n.visit_mut_children_with(self);
                self.in_injected_define_property_call = old;
            }
            Expr::SuperProp(..) => {
                self.visit_mut_super_member_get(n);
            }
            Expr::Update(UpdateExpr { arg, .. }) if arg.is_super_prop() => {
                if let Expr::SuperProp(SuperPropExpr {
                    obj: Super {
                        span: super_token, ..
                    },
                    prop,
                    ..
                }) = &**arg
                {
                    *arg = Box::new(self.super_to_update_call(*super_token, prop.clone()));
                }
            }
            Expr::Assign(AssignExpr {
                ref left,
                op: op!("="),
                right,
                ..
            }) if is_assign_to_super_prop(left) => {
                right.visit_mut_children_with(self);
                self.visit_mut_super_member_set(n)
            }
            Expr::Assign(AssignExpr { left, right, .. }) if is_assign_to_super_prop(left) => {
                right.visit_mut_children_with(self);
                self.visit_mut_super_member_update(n);
            }
            Expr::Call(CallExpr {
                callee: Callee::Expr(callee_expr),
                args,
                ..
            }) if callee_expr.is_super_prop() => {
                args.visit_mut_children_with(self);

                self.visit_mut_super_member_call(n);
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_pat(&mut self, n: &mut Pat) {
        let in_pat = self.in_pat;
        self.in_pat = true;
        n.visit_mut_children_with(self);
        self.in_pat = in_pat;
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        if self.folding_constructor {
            return;
        }

        if self.folding_constructor && !self.in_injected_define_property_call {
            let old = self.in_nested_scope;
            self.in_nested_scope = true;
            n.visit_mut_children_with(self);
            self.in_nested_scope = old;
        } else {
            n.visit_mut_children_with(self);
        }
    }
}

impl<'a> SuperFieldAccessFolder<'a> {
    /// # In
    /// ```js
    /// super.foo(a)
    /// ```
    /// # out
    /// ```js
    /// _get(_getPrototypeOf(Clazz.prototype), 'foo', this).call(this, a)
    /// ```
    fn visit_mut_super_member_call(&mut self, n: &mut Expr) {
        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee_expr),
            args,
            ..
        }) = n
        {
            if let Expr::SuperProp(SuperPropExpr {
                obj: Super {
                    span: super_token, ..
                },
                prop,
                ..
            }) = &**callee_expr
            {
                let this = match self.this_alias_mark.or(self.constructor_this_mark) {
                    Some(mark) => {
                        let ident = quote_ident!(DUMMY_SP.apply_mark(mark), "_this").as_arg();
                        // in constant super, call will be the only place where a assert is needed
                        if self.constant_super {
                            CallExpr {
                                span: DUMMY_SP,
                                callee: helper!(assert_this_initialized, "assertThisInitialized"),
                                args: vec![ident],
                                type_args: Default::default(),
                            }
                            .as_arg()
                        } else {
                            ident
                        }
                    }
                    _ => ThisExpr { span: DUMMY_SP }.as_arg(),
                };

                let callee = self.super_to_get_call(*super_token, prop.clone());
                let mut args = args.clone();

                if args.len() == 1 && is_rest_arguments(&args[0]) {
                    *n = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: callee.make_member(quote_ident!("apply")).as_callee(),
                        args: iter::once(this)
                            .chain(iter::once({
                                let mut arg = args.pop().unwrap();
                                arg.spread = None;
                                arg
                            }))
                            .collect(),
                        type_args: Default::default(),
                    });
                    return;
                }

                *n = Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: callee.make_member(quote_ident!("call")).as_callee(),
                    args: iter::once(this).chain(args).collect(),
                    type_args: Default::default(),
                });
            }
        }
    }

    /// # In
    /// ```js
    /// super.foo = bar
    /// # out
    /// ```js
    /// _set(_getPrototypeOf(Clazz.prototype), "foo", bar, this, true)
    /// ```
    fn visit_mut_super_member_set(&mut self, n: &mut Expr) {
        if let Expr::Assign(AssignExpr {
            left,
            op: op @ op!("="),
            right,
            ..
        }) = n
        {
            match left {
                PatOrExpr::Expr(expr) => {
                    if let Expr::SuperProp(SuperPropExpr {
                        obj: Super { span: super_token },
                        prop,
                        ..
                    }) = &mut **expr
                    {
                        *n = self.super_to_set_call(*super_token, prop.take(), *op, right.take());
                    }
                }
                PatOrExpr::Pat(pat) => {
                    if let Pat::Expr(expr) = &mut **pat {
                        if let Expr::SuperProp(SuperPropExpr {
                            obj:
                                Super {
                                    span: super_token, ..
                                },
                            prop,
                            ..
                        }) = &mut **expr
                        {
                            *n = self.super_to_set_call(
                                *super_token,
                                prop.take(),
                                *op,
                                right.take(),
                            );
                        }
                    }
                }
            }
        }
    }

    /// # In
    /// ```js
    /// super.foo
    /// ```
    /// # out
    /// ```js
    /// _get(_getPrototypeOf(Clazz.prototype), 'foo', this)
    /// ```
    fn visit_mut_super_member_get(&mut self, n: &mut Expr) {
        if let Expr::SuperProp(SuperPropExpr {
            obj: Super { span: super_token },
            prop,
            ..
        }) = n
        {
            let super_token = *super_token;
            prop.visit_mut_children_with(self);

            let prop = prop.take();
            *n = if self.in_pat {
                self.super_to_update_call(super_token, prop)
            } else {
                self.super_to_get_call(super_token, prop)
            };
        }
    }

    fn visit_mut_super_member_update(&mut self, n: &mut Expr) {
        if let Expr::Assign(AssignExpr { left, op, .. }) = n {
            debug_assert_ne!(*op, op!("="));

            match left {
                PatOrExpr::Expr(expr) => {
                    if let Expr::SuperProp(SuperPropExpr {
                        obj: Super { span: super_token },
                        prop,
                        ..
                    }) = *expr.take()
                    {
                        *expr = Box::new(self.super_to_update_call(super_token, prop));
                    }
                }
                PatOrExpr::Pat(pat) => {
                    if let Pat::Expr(expr) = &mut **pat {
                        if let Expr::SuperProp(SuperPropExpr {
                            obj:
                                Super {
                                    span: super_token, ..
                                },
                            prop,
                            ..
                        }) = *expr.take()
                        {
                            *expr = Box::new(self.super_to_update_call(super_token, prop));
                        }
                    }
                }
            }
        }
    }

    fn super_to_get_call(&mut self, super_token: Span, prop: SuperProp) -> Expr {
        if self.constant_super {
            Expr::Member(MemberExpr {
                span: super_token,
                obj: Box::new({
                    let name = self.super_class.clone().unwrap_or_else(|| {
                        quote_ident!(if self.is_static { "Function" } else { "Object" })
                    });
                    // in static default super class is Function.prototype
                    if self.is_static && self.super_class.is_some() {
                        Expr::Ident(name)
                    } else {
                        name.make_member(quote_ident!("prototype"))
                    }
                }),
                prop: match prop {
                    SuperProp::Ident(i) => MemberProp::Ident(i),
                    SuperProp::Computed(c) => MemberProp::Computed(c),
                },
            })
        } else {
            let proto_arg = self.proto_arg();

            let prop_arg = prop_arg(prop).as_arg();

            let this_arg = self.this_arg(super_token).as_arg();

            Expr::Call(CallExpr {
                span: super_token,
                callee: helper!(get, "get"),
                args: vec![proto_arg.as_arg(), prop_arg, this_arg],
                type_args: Default::default(),
            })
        }
    }

    fn super_to_set_call(
        &mut self,
        super_token: Span,
        prop: SuperProp,
        op: AssignOp,
        rhs: Box<Expr>,
    ) -> Expr {
        debug_assert_eq!(op, op!("="));

        let this_expr = Box::new(match self.constructor_this_mark {
            Some(mark) => quote_ident!(super_token.apply_mark(mark), "_this").into(),
            None => ThisExpr { span: super_token }.into(),
        });

        if self.constant_super {
            let left = Expr::Member(MemberExpr {
                span: super_token,
                obj: this_expr,
                prop: match prop {
                    SuperProp::Ident(i) => MemberProp::Ident(i),
                    SuperProp::Computed(c) => MemberProp::Computed(c),
                },
            });

            Expr::Assign(AssignExpr {
                span: super_token,
                left: PatOrExpr::Expr(left.into()),
                op,
                right: rhs,
            })
        } else {
            let proto_arg = self.proto_arg();

            let prop_arg = prop_arg(prop).as_arg();

            Expr::Call(CallExpr {
                span: super_token,
                callee: helper!(set, "set"),
                args: vec![
                    proto_arg.as_arg(),
                    prop_arg,
                    rhs.as_arg(),
                    this_expr.as_arg(),
                    // strict
                    true.as_arg(),
                ],
                type_args: Default::default(),
            })
        }
    }

    fn super_to_update_call(&mut self, super_token: Span, prop: SuperProp) -> Expr {
        let proto_arg = self.proto_arg();

        let prop_arg = prop_arg(prop).as_arg();

        let this_arg = self.this_arg(super_token).as_arg();

        let expr = Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(update, "update"),
            args: vec![
                proto_arg.as_arg(),
                prop_arg,
                this_arg,
                // strict
                true.as_arg(),
            ],
            type_args: Default::default(),
        });

        expr.make_member(quote_ident!("_"))
    }

    fn proto_arg(&mut self) -> Expr {
        let expr = if self.is_static {
            // Foo
            Expr::Ident(self.class_name.clone())
        } else {
            // Foo.prototype
            self.class_name
                .clone()
                .make_member(quote_ident!("prototype"))
        };

        if self.constant_super {
            return expr;
        }

        let mut proto_arg = get_prototype_of(expr);

        if let Some(mark) = self.constructor_this_mark {
            let this = quote_ident!(DUMMY_SP.apply_mark(mark), "_this");

            proto_arg = Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs: vec![
                    Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: helper!(assert_this_initialized, "assertThisInitialized"),
                        args: vec![this.as_arg()],
                        type_args: Default::default(),
                    })
                    .into(),
                    proto_arg.into(),
                ],
            })
        }

        proto_arg
    }

    fn this_arg(&self, super_token: Span) -> Expr {
        match self.constructor_this_mark {
            Some(mark) => quote_ident!(super_token.apply_mark(mark), "_this").into(),
            None => ThisExpr { span: super_token }.into(),
        }
    }
}

fn is_assign_to_super_prop(left: &PatOrExpr) -> bool {
    match left {
        PatOrExpr::Expr(expr) => expr.is_super_prop(),
        PatOrExpr::Pat(pat) => match &**pat {
            Pat::Expr(expr) => expr.is_super_prop(),
            _ => false,
        },
    }
}

fn prop_arg(prop: SuperProp) -> Expr {
    match prop {
        SuperProp::Ident(Ident {
            sym: value, span, ..
        }) => Expr::Lit(Lit::Str(Str {
            span,
            raw: None,
            value,
        })),
        SuperProp::Computed(c) => *c.expr,
    }
}
