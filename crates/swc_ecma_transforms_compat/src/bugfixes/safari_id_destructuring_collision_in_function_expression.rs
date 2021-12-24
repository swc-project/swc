use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, Span};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};

pub fn safari_id_destructuring_collision_in_function_expression() -> impl Fold + VisitMut {
    as_folder(SafariIdDestructuringCollisionInFunctionExpression::default())
}

#[derive(Default, Clone)]
struct SafariIdDestructuringCollisionInFunctionExpression {
    fn_expr_name: JsWord,
    destructured_id_span: Option<Span>,
}

impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        let sym = i.id.sym.clone();
        if self.fn_expr_name.eq(&sym) {
            self.destructured_id_span = Some(i.id.span);
        }
    }

    fn visit_mut_param(&mut self, param: &mut Param) {
        param.visit_mut_children_with(self);
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if let Some(ident) = &n.ident {
            self.fn_expr_name = ident.sym.clone();
            n.function.params.visit_mut_children_with(self);
            if let Some(id_span) = &self.destructured_id_span {
                let mut rename_map = AHashMap::default();
                let new_id: JsWord = { "hi".into() };
                let id = (self.fn_expr_name.clone(), id_span.ctxt());
                rename_map.insert(id, new_id);
                n.function.visit_mut_children_with(&mut rename(&rename_map));
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

    test!(
        ::swc_ecma_parser::Syntax::default(),
        |_| safari_id_destructuring_collision_in_function_expression(),
        basic,
        "(function a ([a]) { console.log(a) })",
        "(function a ([a]) {})"
    );
}
