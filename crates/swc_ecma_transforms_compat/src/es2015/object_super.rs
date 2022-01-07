use std::iter;

use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    alias_ident_for, is_rest_arguments, private_ident, quote_ident, ExprFactory, IdentExt,
};
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
            let mut replacer = SuperReplacer {
                obj: None,
                vars: Vec::new(),
            };
            for prop_or_spread in props.iter_mut() {
                if let PropOrSpread::Prop(ref mut prop) = prop_or_spread {
                    match &mut **prop {
                        Prop::KeyValue(KeyValueProp { value, .. }) => {
                            value.visit_mut_with(&mut replacer);
                        }
                        _ => {}
                    }
                }
            }
            if let Some(obj) = replacer.obj {
                *expr = Expr::Assign(AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: PatOrExpr::Expr(Box::new(Expr::Ident(obj.clone()))),
                    right: Box::new(expr.take()),
                });
                self.extra_var.append(&mut replacer.vars);
                self.extra_var.push(obj);
            }
        }
    }
}

struct SuperReplacer {
    obj: Option<Ident>,
    vars: Vec<Ident>,
}
impl VisitMut for SuperReplacer {
    noop_visit_mut_type!();
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.visit_mut_super_member_call(expr);
        self.visit_mut_super_member_set(expr);
        self.visit_mut_super_member_get(expr);

        expr.visit_mut_children_with(self)
    }
}

impl SuperReplacer {
    fn get_obj_ref(&mut self) -> Ident {
        if let Some(obj) = &self.obj {
            obj.clone()
        } else {
            let ident = private_ident!("_obj");
            self.obj = Some(ident.clone());
            ident
        }
    }
    fn get_proto(&mut self) -> ExprOrSpread {
        Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: helper!(get_prototype_of, "getPrototypeOf"),
            args: vec![self.get_obj_ref().as_arg()],
            type_args: Default::default(),
        })
        .as_arg()
    }

    // .a -> "a"
    fn normalize_computed_expr(&mut self, expr: Box<Expr>, computed: bool) -> Box<Expr> {
        match *expr {
            Expr::Ident(Ident {
                sym: value, span, ..
            }) if !computed => Box::new(Expr::Lit(Lit::Str(Str {
                span,
                value,
                has_escape: false,
                kind: Default::default(),
            }))),
            _ => expr,
        }
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
                callee: ExprOrSuper::Expr(callee_expr),
                args,
                type_args,
                ..
            }) => match &mut **callee_expr {
                Expr::Member(MemberExpr {
                    obj:
                        ExprOrSuper::Super(Super {
                            span: super_token, ..
                        }),
                    prop,
                    computed,
                    ..
                }) => {
                    let prop = self.normalize_computed_expr(prop.take(), *computed);
                    let callee = SuperReplacer::super_to_get_call(
                        self.get_proto(),
                        *super_token,
                        prop.as_arg(),
                    );
                    // let mut args = args.clone();
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
                            type_args: type_args.take(),
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
                        args: iter::once(this).chain(args.take()).collect(),
                        type_args: type_args.take(),
                    });
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
                    let prop = self.normalize_computed_expr(prop.take(), *computed);
                    *n = self.super_to_set_call(
                        *super_token,
                        true,
                        prop,
                        op,
                        Box::new(Expr::Lit(Lit::Num(Number {
                            span: DUMMY_SP,
                            value: 1.0,
                        }))),
                        *computed,
                        *prefix,
                    );
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
                            let prop = self.normalize_computed_expr(prop.take(), *computed);
                            *n = self.super_to_set_call(
                                *super_token,
                                false,
                                prop,
                                *op,
                                right.take(),
                                *computed,
                                false,
                            );
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
                let prop = self.normalize_computed_expr(prop.take(), *computed);
                *n =
                    SuperReplacer::super_to_get_call(self.get_proto(), *super_token, prop.as_arg());
            }

            _ => {}
        }
    }

    fn super_to_get_call(proto: ExprOrSpread, super_token: Span, prop: ExprOrSpread) -> Expr {
        Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(get, "get"),
            args: vec![proto, prop, ThisExpr { span: super_token }.as_arg()],
            type_args: Default::default(),
        })
    }
    fn to_bin_expr(left: Box<Expr>, op: AssignOp, rhs: Box<Expr>) -> BinExpr {
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
    }
    fn call_set_helper(
        &mut self,
        super_token: Span,
        prop: ExprOrSpread,
        rhs: ExprOrSpread,
    ) -> Expr {
        Expr::Call(CallExpr {
            span: super_token,
            callee: helper!(set, "set"),
            args: vec![
                self.get_proto(),
                prop,
                rhs,
                ThisExpr { span: super_token }.as_arg(),
                // strict
                Lit::Bool(Bool {
                    span: DUMMY_SP,
                    value: true,
                })
                .as_arg(),
            ],
            type_args: Default::default(),
        })
    }
    fn super_to_set_call(
        &mut self,
        super_token: Span,
        is_update: bool,
        mut prop: Box<Expr>,
        op: AssignOp,
        rhs: Box<Expr>,
        computed: bool,
        prefix: bool,
    ) -> Expr {
        match op {
            op!("=") => self.call_set_helper(super_token, prop.as_arg(), rhs.as_arg()),
            _ => {
                let left = Box::new(SuperReplacer::super_to_get_call(
                    self.get_proto(),
                    super_token,
                    if computed {
                        let ref_ident = alias_ident_for(&rhs, "_ref").private();
                        self.vars.push(ref_ident.clone());
                        *prop = Expr::Assign(AssignExpr {
                            span: DUMMY_SP,
                            left: PatOrExpr::Pat(Box::new(Pat::Ident(ref_ident.clone().into()))),
                            op: op!("="),
                            right: prop.take(),
                        });
                        Box::new(Expr::Ident(ref_ident)).as_arg()
                    } else {
                        prop.clone().as_arg()
                    },
                ));
                if is_update {
                    if prefix {
                        self.call_set_helper(
                            super_token,
                            prop.as_arg(),
                            SuperReplacer::to_bin_expr(
                                Box::new(Expr::Unary(UnaryExpr {
                                    span: DUMMY_SP,
                                    op: op!(unary, "+"),
                                    arg: left,
                                })),
                                op,
                                rhs,
                            )
                            .as_arg(),
                        )
                    } else {
                        let update_ident = alias_ident_for(&rhs, "_super").private();
                        self.vars.push(update_ident.clone());
                        Expr::Seq(SeqExpr {
                            span: DUMMY_SP,
                            exprs: vec![
                                Box::new(
                                    self.call_set_helper(
                                        super_token,
                                        prop.as_arg(),
                                        SuperReplacer::to_bin_expr(
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
                                            ),
                                            op,
                                            rhs,
                                        )
                                        .as_arg(),
                                    ),
                                ),
                                Box::new(Expr::Ident(update_ident)),
                            ],
                        })
                    }
                } else {
                    self.call_set_helper(
                        super_token,
                        prop.as_arg(),
                        SuperReplacer::to_bin_expr(left, op, rhs).as_arg(),
                    )
                }
            }
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
        nest,
        "let obj = {
            b(){
                let o = {
                    d(){
                        super.d
                    }
                }
            },
        }",
        r#"var _obj;
        let obj = {
        b: function b() {
            let o = _obj = {
                d: function d() {
                    _get(_getPrototypeOf(_obj), "d", this);
                }
            };
        }
    };"#
    );
}
