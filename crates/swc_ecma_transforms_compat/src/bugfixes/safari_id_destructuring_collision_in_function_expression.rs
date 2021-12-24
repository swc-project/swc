use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    Span,
};
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
    binding_ident_syms: AHashSet<JsWord>,
}

impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();

    fn visit_mut_binding_ident(&mut self, i: &mut BindingIdent) {
        if self.fn_expr_name.eq(&i.id.sym) {
            self.destructured_id_span = Some(i.id.span);
        } else {
            self.binding_ident_syms.insert(i.id.sym.clone());
        }
    }

    fn visit_mut_param(&mut self, param: &mut Param) {
        param.visit_mut_children_with(self);
    }

    fn visit_mut_block_stmt(&mut self, block: &mut BlockStmt) {
        block.visit_mut_children_with(self);
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if let Some(ident) = &n.ident {
            self.fn_expr_name = ident.sym.clone();
            n.function.params.visit_mut_children_with(self);
            n.function.body.visit_mut_children_with(self);
            if let Some(id_span) = &self.destructured_id_span {
                let mut rename_map = AHashMap::default();
                let new_id: JsWord = {
                    let mut id_value: JsWord = format!("_{}", self.fn_expr_name).into();
                    let mut count = 0;
                    while self.binding_ident_syms.contains(&id_value) {
                        count = count + 1;
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
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_ecma_transforms_testing::test;

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
        avoid_collision,
        "(function a([a, _a]) { a + _a })",
        "(function a([_a1, _a]) {
          _a1 + _a;
        });"
    );
}
