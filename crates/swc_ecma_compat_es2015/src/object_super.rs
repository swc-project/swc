use std::iter;

use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_utils::{
    alias_ident_for, is_rest_arguments, prepend_stmt, private_ident, quote_ident, ExprFactory,
};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

struct ObjectSuper {
    extra_vars: Vec<Ident>,
}

pub fn object_super() -> impl Pass {
    visit_mut_pass(ObjectSuper {
        extra_vars: Vec::new(),
    })
}

#[swc_trace]
impl VisitMut for ObjectSuper {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        n.visit_mut_children_with(self);
        if !self.extra_vars.is_empty() {
            prepend_stmt(
                n,
                VarDecl {
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
                    ..Default::default()
                }
                .into(),
            );
        }
    }

    fn visit_mut_stmts(&mut self, stmts: &mut Vec<Stmt>) {
        stmts.visit_mut_children_with(self);
        if !self.extra_vars.is_empty() {
            prepend_stmt(
                stmts,
                VarDecl {
                    span: DUMMY_SP,
                    kind: VarDeclKind::Var,
                    decls: self
                        .extra_vars
                        .drain(..)
                        .map(|v| VarDeclarator {
                            span: DUMMY_SP,
                            name: v.into(),
                            init: None,
                            definite: false,
                        })
                        .collect(),
                    ..Default::default()
                }
                .into(),
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
                            if let Some(BlockStmt { span: _, stmts, .. }) = &mut function.body {
                                prepend_stmt(
                                    stmts,
                                    VarDecl {
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
                                        ..Default::default()
                                    }
                                    .into(),
                                );
                            }
                        }
                    }
                }
            }
            if let Some(obj) = replacer.obj {
                *expr = AssignExpr {
                    span: DUMMY_SP,
                    op: op!("="),
                    left: obj.clone().into(),
                    right: Box::new(expr.take()),
                }
                .into();
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
    noop_visit_mut_type!(fail);

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
        CallExpr {
            span: DUMMY_SP,
            callee: helper!(get_prototype_of),
            args: vec![self.get_obj_ref().as_arg()],

            ..Default::default()
        }
        .as_arg()
    }

    // .a -> "a"
    fn normalize_computed_expr(&mut self, prop: &mut SuperProp) -> Box<Expr> {
        match prop.take() {
            SuperProp::Ident(IdentName {
                sym: value, span, ..
            }) => Lit::Str(Str {
                raw: None,
                value,
                span,
            })
            .into(),

            SuperProp::Computed(ComputedPropName { expr, .. }) => expr,
        }
    }

    /// # In
    /// ```js
    /// super.foo(a)
    /// ```
    /// # out
    /// ```js
    /// _get(_get_prototype_of(Clazz.prototype), 'foo', this).call(this, a)
    /// ```
    fn visit_mut_super_member_call(&mut self, n: &mut Expr) {
        if let Expr::Call(CallExpr {
            callee: Callee::Expr(callee_expr),
            args,
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
                    *n = CallExpr {
                        span: DUMMY_SP,
                        callee: MemberExpr {
                            span: DUMMY_SP,
                            obj: Box::new(callee),
                            prop: quote_ident!("apply").into(),
                        }
                        .as_callee(),
                        args: iter::once(this)
                            .chain(iter::once({
                                let mut arg = args.pop().unwrap();
                                arg.spread = None;
                                arg
                            }))
                            .collect(),
                        ..Default::default()
                    }
                    .into();
                    return;
                }

                *n = CallExpr {
                    span: DUMMY_SP,
                    callee: MemberExpr {
                        span: DUMMY_SP,
                        obj: Box::new(callee),
                        prop: MemberProp::Ident(quote_ident!("call")),
                    }
                    .as_callee(),
                    args: iter::once(this).chain(args.take()).collect(),
                    ..Default::default()
                }
                .into();
            }
        }
    }

    /// # In
    /// ```js
    /// super.foo = bar
    /// # out
    /// ```js
    /// _set(_get_prototype_of(_obj), "foo", bar, this, true)
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
                if let AssignTarget::Simple(SimpleAssignTarget::SuperProp(SuperPropExpr {
                    obj: Super { span: super_token },
                    prop,
                    ..
                })) = left
                {
                    *n =
                        self.super_to_set_call(*super_token, false, prop, *op, right.take(), false);
                    return;
                }
                left.visit_mut_children_with(self);
                *n = AssignExpr {
                    span: *span,
                    left: left.take(),
                    op: *op,
                    right: right.take(),
                }
                .into();
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
    /// _get(_get_prototype_of(Clazz.prototype), 'foo', this)
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
        CallExpr {
            span: super_token,
            callee: helper!(get),
            args: vec![proto, prop, ThisExpr { span: super_token }.as_arg()],
            ..Default::default()
        }
        .into()
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
        CallExpr {
            span: super_token,
            callee: helper!(set),
            args: vec![
                self.get_proto(),
                prop,
                rhs,
                ThisExpr { span: super_token }.as_arg(),
                // strict
                true.as_arg(),
            ],
            ..Default::default()
        }
        .into()
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
                        let ref_ident = alias_ident_for(&rhs, "_ref").into_private();
                        self.vars.push(ref_ident.clone());
                        *prop = AssignExpr {
                            span: DUMMY_SP,
                            left: ref_ident.clone().into(),
                            op: op!("="),
                            right: prop.take(),
                        }
                        .into();
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
                                UnaryExpr {
                                    span: DUMMY_SP,
                                    op: op!(unary, "+"),
                                    arg: left,
                                }
                                .into(),
                                op,
                                rhs,
                            )
                            .as_arg(),
                        )
                    } else {
                        let update_ident = alias_ident_for(&rhs, "_super").into_private();
                        self.vars.push(update_ident.clone());
                        SeqExpr {
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
                                                    left: update_ident.clone().into(),
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
                        }
                        .into()
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
    use swc_common::Mark;
    use swc_ecma_parser::{EsSyntax, Syntax};
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::test;

    use super::*;
    use crate::{function_name, shorthand};
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();
            (
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
        }"
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            (
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
        }"
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            (
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
        }"
    );
    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| {
            (
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
        }"
    );
    test!(
        Syntax::Es(EsSyntax {
            allow_super_outside_method: true,
            ..Default::default()
        }),
        |_| {
            (
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
        }"
    );
}
