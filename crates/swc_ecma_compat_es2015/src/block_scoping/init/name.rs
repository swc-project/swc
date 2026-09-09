use rustc_hash::FxHashMap;
use swc_common::{util::take::Take, Spanned, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{quote_ident, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub(super) struct Preserver<'a> {
    pub renamed: &'a FxHashMap<Id, Id>,
    pub unresolved_ctxt: SyntaxContext,
}

impl Preserver<'_> {
    fn preserve(&self, name: &Ident, value: &mut Box<Expr>) {
        if !self.renamed.contains_key(&name.to_id()) {
            return;
        }
        match value.unwrap_parens() {
            Expr::Fn(FnExpr { ident: None, .. })
            | Expr::Class(ClassExpr { ident: None, .. })
            | Expr::Arrow(_) => {}
            _ => return,
        }

        // An object property preserves NamedEvaluation without introducing a
        // function/class name binding that could shadow references in the value.
        let span = value.span();
        if name.sym == "__proto__" && !matches!(value.unwrap_parens(), Expr::Class(_)) {
            // A plain __proto__ property changes the object's prototype. Avoid
            // introducing computed-property syntax after its ES2015 pass has
            // already run. Classes use the computed key below so their name is
            // available during static initialization; they still need lowering.
            *value = CallExpr {
                span,
                callee: Ident::new("Object".into(), span, self.unresolved_ctxt)
                    .make_member(quote_ident!("defineProperty"))
                    .as_callee(),
                args: vec![
                    value.take().as_arg(),
                    "name".as_arg(),
                    ObjectLit {
                        span,
                        props: vec![
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: quote_ident!("value").into(),
                                value: name.sym.clone().into(),
                            }))),
                            PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                                key: quote_ident!("configurable").into(),
                                value: true.into(),
                            }))),
                        ],
                    }
                    .as_arg(),
                ],
                ..Default::default()
            }
            .into();
            return;
        }
        let key = if name.sym == "__proto__" {
            PropName::Computed(ComputedPropName {
                span,
                expr: name.sym.clone().into(),
            })
        } else {
            PropName::Ident(name.clone().into())
        };
        *value = Expr::Object(ObjectLit {
            span,
            props: vec![PropOrSpread::Prop(Box::new(Prop::KeyValue(KeyValueProp {
                key,
                value: value.take(),
            })))],
        })
        .make_member(name.clone().into())
        .into();
    }
}

impl VisitMut for Preserver<'_> {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, expr: &mut AssignExpr) {
        expr.visit_mut_children_with(self);
        if matches!(expr.op, op!("=") | op!("&&=") | op!("||=") | op!("??=")) {
            if let Some(name) = expr.left.as_ident() {
                self.preserve(&name.id, &mut expr.right);
            }
        }
    }

    fn visit_mut_assign_pat(&mut self, pat: &mut AssignPat) {
        pat.visit_mut_children_with(self);
        if let Pat::Ident(name) = &*pat.left {
            self.preserve(&name.id, &mut pat.right);
        }
    }

    fn visit_mut_assign_pat_prop(&mut self, prop: &mut AssignPatProp) {
        prop.visit_mut_children_with(self);
        if let Some(value) = &mut prop.value {
            self.preserve(&prop.key.id, value);
        }
    }
}
