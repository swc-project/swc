use swc_ecma_ast::*;
use swc_atoms::JsWord;
use swc_ecma_visit::{Fold, VisitMut, as_folder, noop_visit_mut_type, VisitMutWith};
use swc_common::{collections::AHashSet};

pub fn safari_id_destructuring_collision_in_function_expression() -> impl Fold + VisitMut {
    as_folder(SafariIdDestructuringCollisionInFunctionExpression::default())
}

#[derive(Default, Clone)]
struct SafariIdDestructuringCollisionInFunctionExpression {
    fn_expr_name: JsWord,
    destructured_ids: AHashSet<JsWord>
}


impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        self.destructured_ids.insert(i.id.sym.clone());
    }

    fn visit_mut_param(&mut self, param: &mut Param) {
        param.visit_mut_children_with(self);
    }

    fn visit_mut_block_stmt(&mut self, _n: &mut BlockStmt) {
        if self.destructured_ids.contains(&self.fn_expr_name) {
            dbg!("collision");
        }
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if let Some(ident) = &n.ident {
            self.fn_expr_name = ident.sym.clone();
            n.function.params.visit_mut_children_with(self);
            n.function.body.visit_mut_children_with(self);
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
        "(function a ([a]) {})",
        "(function a ([a]) {})"
    );
}
