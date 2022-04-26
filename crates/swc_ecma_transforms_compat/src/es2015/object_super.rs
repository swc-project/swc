use std::iter;

use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    alias_ident_for, is_rest_arguments, prepend, private_ident, quote_ident, ExprFactory, IdentExt,
};
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct ObjectSuper {
    extra_vars: Vec<Ident>,
}

#[tracing::instrument(level = "info", skip_all)]
pub fn object_super() -> impl Fold + VisitMut {
    as_folder(ObjectSuper {
        extra_vars: Vec::new(),
    })
}

#[swc_trace]
impl VisitMut for ObjectSuper {
    noop_visit_mut_type!();

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);
        if !self.extra_vars.is_empty() {
            prepend(
                n,
                ModuleItem::Stmt(Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .extra_vars
                        .take()
                        .into_iter()
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: v.into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                }))),
            );
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);
        if !self.extra_vars.is_empty() {
            prepend(
                stmts,
                Stmt::Decl(Decl::Var(VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    declare: false,
                    decls: self
                        .extra_vars
                        .drain(..)
                        .into_iter()
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: v.into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                })),
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
                    if let Prop::Method(MethodProp { key: _, function }) = &mut **prop {
                        function.visit_mut_with(&mut replacer);
                        if !replacer.vars.is_empty() {
                            if let Some(BlockStmt { span: _, stmts }) = &mut function.body {
                                prepend(
                                    stmts,
                                    Stmt::Decl(Decl::Var(VarDecl {
                                        span: DUMMY_SP,
                                        kind: VarDeclKind::Var,
                                        declare: false,
                                        decls: replacer
                                            .vars
                                            .drain(..)
                                            .map(|v| VarDeclarator {
                                                span: DUMMY_SP,
                                                name: v.into(),
                                                init: None,
                                                definite: false,
                                            })
                                            .collect(),
                                    })),
                                );
                            }
                        }
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
                self.extra_vars.push(obj);
            }
        }
    }
}

struct SuperReplacer {
    obj: Option<Ident>,
    vars: Vec<Ident>,
}

#[swc_trace]
impl VisitMut for SuperReplacer {
    noop_visit_mut_type!();

    fn visit_mut_object_lit(&mut self, obj: &mut ObjectLit) {
        for prop_or_spread in obj.props.iter_mut() {
            if let PropOrSpread::Prop(prop) = prop_or_spread {
                match &mut **prop {
                    Prop::Method(MethodProp { key, .. })
                    | Prop::Getter(GetterProp { key, .. })
                    | Prop::Setter(SetterProp { key, .. }) => key.visit_mut_with(self),
                    Prop::KeyValue(KeyValueProp { key, value }) => {
                        key.visit_mut_with(self);
                        if !(value.is_fn_expr() || value.is_class()) {
                            value.visit_mut_with(self)
                        }
                    }
                    Prop::Shorthand(_) | Prop::Assign(_) => (),
                }
            }
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        self.visit_mut_super_member_call(expr);
        self.visit_mut_super_member_set(expr);
        self.visit_mut_super_member_get(expr);

        expr.visit_mut_children_with(self)
    }
}

#[swc_trace]
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
    fn normalize_computed_expr(&mut self, prop: &mut SuperProp) -> Box<Expr> {
        match prop.take() {
            SuperProp::Ident(Ident {
                sym: value, span, ..
            }) => Box::new(Expr::Lit(Lit::Str(Str {
                raw: None,
                value,
                span,
            }))),

            SuperProp::Computed(ComputedPropName { expr, .. }) => expr,
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
        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee_expr),
            args,
            type_args,
            ..
        }) = n
        {
            if let Expr::SuperProp(SuperPropExpr {
                obj: Super { span: super_token },
                prop,
                ..
            }) = &mut **callee_expr
            {
                let prop = self.normalize_computed_expr(prop);
                let callee =
                    SuperReplacer::super_to_get_call(self.get_proto(), *super_token, prop.as_arg());
                let this = ThisExpr { span: DUMMY_SP }.as_arg();
                if args.len() == 1 && is_rest_arguments(&args[0]) {
                    *n = Expr::Call(CallExpr {
                        span: DUMMY_SP,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(callee),
                            prop: MemberProp::Ident(quote_ident!("apply")),
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
                        obj: Box::new(callee),
                        prop: MemberProp::Ident(quote_ident!("call")),
                    }
                    .as_callee(),
                    args: iter::once(this).chain(args.take()).collect(),
                    type_args: type_args.take(),
                });
            }
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
            }) => {
                if let Expr::SuperProp(SuperPropExpr {
                    obj: Super { span: super_token },
                    prop,
                    ..
                }) = &mut **arg
                {
                    let op = match op {
                        op!("++") => op!("+="),
                        op!("--") => op!("-="),
                    };
                    *n = self.super_to_set_call(*super_token, true, prop, op, 1.0.into(), *prefix);
                }
            }

            Expr::Assign(AssignExpr {
                span,
                left,
                op,
                right,
            }) => {
                let mut left = left.take().normalize_expr();

                if let PatOrExpr::Expr(expr) = &mut left {
                    if let Expr::SuperProp(SuperPropExpr {
                        obj: Super { span: super_token },
                        prop,
                        ..
                    }) = &mut **expr
                    {
                        *n = self.super_to_set_call(
                            *super_token,
                            false,
                            prop,
                            *op,
                            right.take(),
                            false,
                        );
                        return;
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
        if let Expr::SuperProp(SuperPropExpr {
            obj: Super {
                span: super_token, ..
            },
            prop,
            ..
        }) = n
        {
            let prop = self.normalize_computed_expr(prop);
            *n = SuperReplacer::super_to_get_call(self.get_proto(), *super_token, prop.as_arg());
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
            op: op.to_update().unwrap(),
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
                true.as_arg(),
            ],
            type_args: Default::default(),
        })
    }

    fn super_to_set_call(
        &mut self,
        super_token: Span,
        is_update: bool,
        prop: &mut SuperProp,
        op: AssignOp,
        rhs: Box<Expr>,
        prefix: bool,
    ) -> Expr {
        let computed = match prop {
            SuperProp::Ident(_) => false,
            SuperProp::Computed(_) => true,
        };
        let mut prop = self.normalize_computed_expr(prop);
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
                            left: PatOrExpr::Pat(ref_ident.clone().into()),
                            op: op!("="),
                            right: prop.take(),
                        });
                        ref_ident.as_arg()
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
                                                    left: PatOrExpr::Pat(
                                                        update_ident.clone().into(),
                                                    ),
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
    use swc_common::{chain, Mark};
    use swc_ecma_parser::{EsConfig, Syntax};
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;

    use super::*;
    use crate::es2015::{function_name, shorthand_property::shorthand};
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            chain!(
                resolver(unresolved_mark, top_level_mark, false),
                object_super(),
                shorthand(),
                function_name(),
            )
        },
        get,
        "let obj = {
            a(){
                let c = super.x;
            }
        }",
        r#"var _obj;
        let obj = _obj = {
            a: function a() {
                let c = _get(_getPrototypeOf(_obj), "x", this);
            }
        };"#
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            chain!(
                resolver(Mark::new(), Mark::new(), false),
                object_super(),
                shorthand(),
                function_name(),
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
            chain!(
                resolver(Mark::new(), Mark::new(), false),
                object_super(),
                shorthand(),
                function_name(),
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
            chain!(
                resolver(Mark::new(), Mark::new(), false),
                object_super(),
                shorthand(),
                function_name(),
            )
        },
        nest,
        "let obj = {
            b(){
                super.bar()
                let o = {
                    d(){
                        super.d()
                    }
                }
            },
        }",
        r#"var _obj;
        let obj = _obj = {
        b: function b() {
            var _obj1;
            _get(_getPrototypeOf(_obj), "bar", this).call(this);
            let o = _obj1 = {
                d: function d() {
                    _get(_getPrototypeOf(_obj1), "d", this).call(this);
                }
            };
        }
    };"#
    );
    test!(
        Syntax::Es(EsConfig {
            allow_super_outside_method: true,
            ..Default::default()
        }),
        |_| {
            chain!(
                resolver(Mark::new(), Mark::new(), false),
                object_super(),
                shorthand(),
                function_name(),
            )
        },
        do_not_transform,
        "let outer = {
            b(){
                let inner = {
                    d:function d(){
                        super.d() // should not transform
                    }
                }
            },
        }",
        r#"let outer = {
            b: function b() {
                let inner = {
                    d: function d() {
                        super.d();
                    }
                };
            }
        };"#
    );
}
