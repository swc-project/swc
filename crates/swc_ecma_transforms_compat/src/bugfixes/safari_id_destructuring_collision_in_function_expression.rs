use std::collections::HashMap;

use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, Span};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{as_folder, noop_visit_mut_type, Fold, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

#[tracing::instrument(level = "info", skip_all)]
pub fn safari_id_destructuring_collision_in_function_expression() -> impl Fold + VisitMut {
    as_folder(SafariIdDestructuringCollisionInFunctionExpression::default())
}

#[derive(Default, Clone)]
struct SafariIdDestructuringCollisionInFunctionExpression {
    fn_expr_name: JsWord,
    destructured_id_span: Option<Span>,
    other_ident_symbols: AHashSet<JsWord>,
    in_body: bool,
}

#[swc_trace]
impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!();

    fn visit_mut_binding_ident(&mut self, binding_ident: &mut BindingIdent) {
        if !self.in_body && self.fn_expr_name == binding_ident.id.sym {
            self.destructured_id_span = Some(binding_ident.id.span);
        } else {
            self.other_ident_symbols
                .insert(binding_ident.id.sym.clone());
        }
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        if let Some(ident) = &n.ident {
            let old_span = self.destructured_id_span.take();
            let old_fn_expr_name = self.fn_expr_name.clone();
            let old_in_body = self.in_body;

            self.fn_expr_name = ident.sym.clone();
            n.function.params.visit_mut_children_with(self);
            self.in_body = true;
            n.function.body.visit_mut_children_with(self);

            if let Some(id_span) = self.destructured_id_span.take() {
                let mut rename_map = HashMap::default();
                let new_id: JsWord = {
                    let mut id_value: JsWord = format!("_{}", self.fn_expr_name).into();
                    let mut count = 0;
                    while self.other_ident_symbols.contains(&id_value) {
                        count += 1;
                        id_value = format!("_{}{}", self.fn_expr_name, count).into();
                    }
                    id_value
                };
                let id = (self.fn_expr_name.clone(), id_span.ctxt());
                rename_map.insert(id, new_id);
                n.function.visit_mut_children_with(&mut rename(&rename_map));
            }

            self.in_body = old_in_body;
            self.fn_expr_name = old_fn_expr_name;
            self.destructured_id_span = old_span;
        }
    }

    fn visit_mut_ident(&mut self, ident: &mut Ident) {
        if self.in_body && self.fn_expr_name != ident.sym {
            self.other_ident_symbols.insert(ident.sym.clone());
        }
    }

    fn visit_mut_member_prop(&mut self, p: &mut MemberProp) {
        if let MemberProp::Computed(..) = p {
            p.visit_mut_children_with(self)
        }
    }

    fn visit_mut_prop_name(&mut self, p: &mut PropName) {
        if let PropName::Computed(..) = p {
            p.visit_mut_children_with(self)
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{chain, Mark};
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::{test, HygieneTester};

    use super::*;

    fn tr() -> impl Fold {
        chain!(
            resolver(Mark::new(), Mark::new(), false),
            safari_id_destructuring_collision_in_function_expression()
        )
    }

    test!(
        Syntax::default(),
        |_| tr(),
        basic,
        "(function a ([a]) { a });
         (function a({ ...a }) { a });
         (function a({ a }) { a });",
        "(function a([_a]) { _a; });
         (function a({ ..._a }) { _a; });
         (function a({ a: _a }) { _a; });"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        avoid_collision_1,
        "(function a([a, _a]) { a + _a })",
        "(function a([_a1, _a]) {
          _a1 + _a;
        });"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        use_duplicated_id,
        "(function a([a]) { console.log(_a); })",
        "(function a([_a1]) { console.log(_a); });"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        avoid_collision_2,
        "(function _a([_a]) { console.log(_a); })",
        "(function _a([__a]) { console.log(__a); });"
    );

    test!(
        Syntax::default(),
        |_| tr(),
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
        Syntax::default(),
        |_| tr(),
        assignment_expr_in_default_value,
        "(function a([a = a = 3]) {})",
        "(function a([_a = _a = 3]) {})"
    );

    test!(
        Syntax::default(),
        |_| chain!(tr(), HygieneTester),
        issue_4488_1,
        "
        export default function _typeof() {
            if (Date.now() > 0) {
                _typeof = function _typeof() {
                    console.log(0);
                };
            } else {
                _typeof = function _typeof() {
                    console.log(2);
                };
            }
        
            return _typeof();
        }
        ",
        "
        export default function _typeof__1() {
            if (Date__2.now() > 0) {
                _typeof__1 = function _typeof__3() {
                    console__2.log(0);
                };
            } else {
                _typeof__1 = function _typeof__4() {
                    console__2.log(2);
                };
            }
            return _typeof__1();
        }
        "
    );
}
