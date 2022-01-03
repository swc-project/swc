use std::iter;

use swc_common::{util::take::Take, Mark, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{alias_ident_for, is_rest_arguments, private_ident, quote_ident, ExprFactory};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

struct ObjectSuper {
    extra_var: Vec<Ident>,
}
pub fn object_super() -> impl Fold + VisitMut {
    as_folder(ObjectSuper {
        extra_var: Vec::new(),
    })
}

impl VisitMut for ObjectSuper {
    noop_visit_mut_type!();
    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);
        if self.extra_var.len() != 0 {
            n.insert(
                0,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .extra_var
                        .take()
                        .into_iter()
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: Pat::Ident(v.into()),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                }))),
            );
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);
        if let Expr::Object(ObjectLit { span: _, props }) = expr {
            let obj_ref = private_ident!("_obj");
            let mut replacer = SuperReplacer {
                obj: &obj_ref,
                vars: Vec::new(),
                processed: false,
            };
            for prop_or_spread in props.iter_mut() {
                if let PropOrSpread::Prop(ref mut prop) = prop_or_spread {
                    match &mut **prop {
                        Prop::Method(_) => {}
                        _ => {
                            prop.visit_mut_with(&mut replacer);
                        }
                    }
                }
            }
            if replacer.processed {
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: AssignOp::Assign,
                    left: PatOrExpr::Expr(Box::new(Expr::Ident(obj_ref.clone()))),
                    right: Box::new(expr.take()),
                });
                self.extra_var.append(&mut replacer.vars);
                self.extra_var.push(obj_ref);
            }
        }
    }
}

struct SuperReplacer<'a> {
    obj: &'a Ident,
    vars: Vec<Ident>,
    processed: bool,
}
impl<'a> VisitMut for SuperReplacer<'a> {
    noop_visit_mut_type!();
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.visit_mut_super_member_call(expr);
        self.visit_mut_super_member_set(expr);
        self.visit_mut_super_member_get(expr);

        expr.visit_mut_children_with(self)
    }
}

impl<'a> SuperReplacer<'a> {
    fn get_proto(&self) -> ExprOrSpread {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(get_prototype_of, "getPrototypeOf"),
            args: vec![self.obj.clone().as_arg()],
            type_args: Default::default(),
        })
        .as_arg()
    }
    /// # In
    /// ```js
    /// super.foo(a)
    /// ```
    /// # out
    /// ```js
    /// _get(_getPrototypeOf(Clazz.prototype), 'foo', this).call(this, a)
    /// ```
    fn visit_mut_super_member_call(&mut self, n: &mut Expr) {
        match n {
            Expr::Call(CallExpr {
                callee: ExprOrSuper::Expr(ref callee_expr),
                ref args,
                ref type_args,
                ..
            }) => match &**callee_expr {
                Expr::Member(MemberExpr {
                    obj:
                        ExprOrSuper::Super(Super {
                            span: super_token, ..
                        }),
                    prop,
                    computed,
                    ..
                }) => {
                    let callee = self.super_to_get_call(*super_token, prop.clone(), *computed);
                    let mut args = args.clone();
                    let this = ThisExpr { span: DUMMY_SP }.as_arg();
                    if args.len() == 1 && is_rest_arguments(&args[0]) {
                        *n = Expr::Call(CallExpr {
                            span: DUMMY_SP,
                            callee: MemberExpr {
                                span: DUMMY_SP,
                                obj: ExprOrSuper::Expr(Box::new(callee)),
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
                            type_args: type_args.clone(),
                        });
                        return;
                    }

                    *n = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: ExprOrSuper::Expr(Box::new(callee)),
                            prop: Box::new(Expr::Ident(quote_ident!("call"))),
                            computed: false,
                        }
                        .as_callee(),
                        args: iter::once(this).chain(args).collect(),
                        type_args: type_args.clone(),
                    });
                    self.processed = true;
                }

                _ => {}
            },
            _ => {}
        }
    }

    /// # In
    /// ```js
    /// super.foo = bar
    /// # out
    /// ```js
    /// _set(_getPrototypeOf(_obj), "foo", bar, this, true)
    /// ```
    fn visit_mut_super_member_set(&mut self, n: &mut Expr) {
        match n {
            Expr::Update(UpdateExpr {
                arg, op, prefix, ..
            }) => match &mut **arg {
                Expr::Member(MemberExpr {
                    obj:
                        ExprOrSuper::Super(Super {
                            span: super_token, ..
                        }),
                    prop,
                    computed,
                    ..
                }) => {
                    let op = match op {
                        op!("++") => op!("+="),
                        op!("--") => op!("-="),
                    };

                    *n = self.super_to_set_call(
                        *super_token,
                        true,
                        prop.take(),
                        op,
                        Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                        }))),
                        *computed,
                        *prefix,
                    );
                    self.processed = true;
                }
                _ => {}
            },

            Expr::Assign(AssignExpr {
                span,
                left,
                op,
                right,
            }) => {
                let mut left = left.take().normalize_expr();
                if let PatOrExpr::Expr(expr) = &mut left {
                    match &mut **expr {
                        Expr::Member(MemberExpr {
                            obj:
                                ExprOrSuper::Super(Super {
                                    span: super_token, ..
                                }),
                            prop,
                            computed,
                            ..
                        }) => {
                            *n = self.super_to_set_call(
                                *super_token,
                                false,
                                prop.take(),
                                *op,
                                right.take(),
                                *computed,
                                false,
                            );
                            self.processed = true;
                            return;
                        }
                        _ => {}
                    }
                }
                left.visit_mut_children_with(self);
                *n = Expr::Assign(AssignExpr {
                    span: *span,
                    left: left.take(),
                    op: *op,
                    right: right.take(),
                });
                self.processed = true;
            }
            _ => {}
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
        match n {
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Super(Super { span: super_token }),
                prop,
                computed,
                ..
            }) => {
                *n = self.super_to_get_call(*super_token, (*prop).take(), *computed);
                self.processed = true;
            }

            _ => {}
        }
    }

    fn super_to_get_call(&mut self, super_token: Span, prop: Box<Expr>, computed: bool) -> Expr {
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

        Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(get, "get"),
            args: vec![
                self.get_proto(),
                prop_arg,
                ThisExpr { span: super_token }.as_arg(),
            ],
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
        computed: bool,
        prefix: bool,
    ) -> Expr {
        let mut ref_ident = alias_ident_for(&rhs, "_ref");
        ref_ident.span = ref_ident.span.apply_mark(Mark::fresh(Mark::root()));
        let mut update_ident = alias_ident_for(&rhs, "_super");
        update_ident.span = update_ident.span.apply_mark(Mark::fresh(Mark::root()));
        if computed {
            self.vars.push(ref_ident.clone());
        }
        if is_update && !prefix {
            self.vars.push(update_ident.clone());
        }
        let mut is_computed = true;
        let mut prop_arg = match *prop {
            Expr::Ident(Ident {
                sym: ref value,
                span,
                ..
            }) if !computed => {
                is_computed = false;
                Expr::Lit(Lit::Str(Str {
                    span,
                    value: value.clone(),
                    has_escape: false,
                    kind: Default::default(),
                }))
            }
            ref e => e.clone(),
        };
        if computed {
            prop_arg = Expr::Assign(AssignExpr {
                span: DUMMY_SP,
                left: PatOrExpr::Pat(Box::new(Pat::Ident(ref_ident.clone().into()))),
                op: op!("="),
                right: prop.clone(),
            })
        }

        let rhs_arg = match op {
            op!("=") => rhs.as_arg(),
            _ => {
                let left = Box::new(self.super_to_get_call(
                    super_token,
                    if is_computed {
                        Box::new(Expr::Ident(ref_ident))
                    } else {
                        Box::new(prop_arg.clone())
                    },
                    computed,
                ));
                let left = if is_update {
                    if prefix {
                        Box::new(Expr::Unary(UnaryExpr {
                            span: DUMMY_SP,
                            op: op!(unary, "+"),
                            arg: left,
                        }))
                    } else {
                        Box::new(
                            AssignExpr {
                                span: DUMMY_SP,
                                left: PatOrExpr::Pat(Box::new(Pat::Ident(
                                    update_ident.clone().into(),
                                ))),
                                op: op!("="),
                                right: Box::new(Expr::Unary(UnaryExpr {
                                    span: DUMMY_SP,
                                    op: op!(unary, "+"),
                                    arg: left,
                                })),
                            }
                            .into(),
                        )
                    }
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
                self.get_proto(),
                prop_arg.as_arg(),
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

        if is_update && !prefix {
            Expr::Seq(SeqExpr {
                span: DUMMY_SP,
                exprs: vec![Box::new(expr), Box::new(Expr::Ident(update_ident))],
            })
        } else {
            expr
        }
    }
}
#[cfg(test)]
mod tests {
    use super::*;
    use crate::es2015::{function_name, shorthand_property::shorthand};
    use swc_common::{chain, Mark};
    use swc_ecma_transforms_base::resolver::resolver_with_mark;
    use swc_ecma_transforms_testing::test;
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        get,
        "let obj = {
            a(){
                let c = super.x;
            }
        }",
        r#"
        var _obj;
        let obj = _obj = {
            a: function a() {
                let c = _get(_getPrototypeOf(_obj), "x", this);
            }
        };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        call,
        "let obj = {
            a(){
                super.y(1,2,3);
            }
        }",
        r#"var _obj;
        let obj = _obj = {
            a: function a() {
                _get(_getPrototypeOf(_obj), "y", this).call(this,1,2,3);
            }
        };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let top_level_mark = Mark::fresh(Mark::root());
            chain!(
                resolver_with_mark(top_level_mark),
                shorthand(),
                function_name(),
                object_super()
            )
        },
        set,
        "let obj = {
            a(){
                super.x = 1;
            }
        }",
        r#"
        var _obj;
        let obj = _obj = {
            a: function a() {
                _set(_getPrototypeOf(_obj), "x", 1, this, true);
            }
        };"#
    );
}
