use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    Span,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "trace", skip_all)]
pub fn safari_id_destructuring_collision_in_function_expression() -> impl Fold + VisitMut {
    as_folder(SafariIdDestructuringCollisionInFunctionExpression::default())
}

#[derive(Default, Clone)]
struct SafariIdDestructuringCollisionInFunctionExpression {
    fn_expr_name: JsWord,
    destructured_id_span: Option<Span>,
    other_ident_syms: AHashSet<JsWord>,
    in_body: bool,
}

#[swc_trace]
impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();

    fn visit_mut_binding_ident(&mut self, binding_ident: &mut BindingIdent) {
        if !self.in_body && self.fn_expr_name.eq(&binding_ident.id.sym) {
            self.destructured_id_span = Some(binding_ident.id.span);
        } else {
            self.other_ident_syms.insert(binding_ident.id.sym.clone());
        }
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if let Some(ident) = &n.ident {
            self.fn_expr_name = ident.sym.clone();
            n.function.params.visit_mut_children_with(self);
            self.in_body = true;
            n.function.body.visit_mut_children_with(self);
            self.in_body = false;
            if let Some(id_span) = &self.destructured_id_span {
                let mut rename_map = AHashMap::default();
                let new_id: JsWord = {
                    let mut id_value: JsWord = format!("_{}", self.fn_expr_name).into();
                    let mut count = 0;
                    while self.other_ident_syms.contains(&id_value) {
                        count += 1;
                        id_value = format!("_{}{}", self.fn_expr_name, count).into();
                    }
                    id_value
                };
                let id = (self.fn_expr_name.clone(), id_span.ctxt());
                rename_map.insert(id, new_id);
                n.function.visit_mut_children_with(&mut rename(&rename_map));
            }
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        if self.in_body && !self.fn_expr_name.eq(&ident.sym) {
            self.other_ident_syms.insert(ident.sym.clone());
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_ecma_transforms_testing::test;

    use super::*;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        basic,
        "(function a ([a]) { a });
         (function a({ ...a }) { a });
         (function a({ a }) { a });",
        "(function a([_a]) { _a; });
         (function a({ ..._a }) { _a; });
         (function a({ a: _a }) { _a; });"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        avoid_collision_1,
        "(function a([a, _a]) { a + _a })",
        "(function a([_a1, _a]) {
          _a1 + _a;
        });"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        use_duplicated_id,
        "(function a([a]) { console.log(_a); })",
        "(function a([_a1]) { console.log(_a); });"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        avoid_collision_2,
        "(function _a([_a]) { console.log(_a); })",
        "(function _a([__a]) { console.log(__a); });"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        assign_outside_var,
        "let _a;
        (function a([a]) {
            _a = 3;
        })",
        "let _a;
        (function a([_a1]) {
            _a = 3;
        })"
    );

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        assignment_expr_in_default_value,
        "(function a([a = a = 3]) {})",
        "(function a([_a = _a = 3]) {})"
    );
}
