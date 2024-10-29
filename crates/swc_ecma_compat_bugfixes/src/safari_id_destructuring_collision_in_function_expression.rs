use std::collections::HashMap;

use swc_atoms::JsWord;
use swc_common::{collections::AHashSet, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::hygiene::rename;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};
use swc_trace_macro::swc_trace;

pub fn safari_id_destructuring_collision_in_function_expression() -> impl Pass {
    visit_mut_pass(SafariIdDestructuringCollisionInFunctionExpression::default())
}

#[derive(Default, Clone)]
struct SafariIdDestructuringCollisionInFunctionExpression {
    fn_expr_name: JsWord,
    destructured_id_span: Option<SyntaxContext>,
    other_ident_symbols: AHashSet<JsWord>,
    in_body: bool,
}

impl SafariIdDestructuringCollisionInFunctionExpression {
    fn visit_mut_pat_id(&mut self, id: &Ident) {
        if !self.in_body && self.fn_expr_name == id.sym {
            self.destructured_id_span = Some(id.ctxt);
        } else {
            self.other_ident_symbols.insert(id.sym.clone());
        }
    }
}

#[swc_trace]
impl VisitMut for SafariIdDestructuringCollisionInFunctionExpression {
    noop_visit_mut_type!(fail);

    fn visit_mut_assign_pat_prop(&mut self, n: &mut AssignPatProp) {
        self.visit_mut_pat_id(&Ident::from(&n.key));

        n.value.visit_mut_with(self);
    }

    fn visit_mut_binding_ident(&mut self, binding_ident: &mut BindingIdent) {
        self.visit_mut_pat_id(&Ident::from(&*binding_ident))
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        let old_in_body = self.in_body;
        if let Some(ident) = &n.ident {
            let old_span = self.destructured_id_span.take();
            let old_fn_expr_name = self.fn_expr_name.clone();

            self.fn_expr_name = ident.sym.clone();
            self.in_body = false;
            n.function.params.visit_mut_children_with(self);
            self.in_body = true;
            n.function.body.visit_mut_children_with(self);

            if let Some(id_ctxt) = self.destructured_id_span.take() {
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
                let id = (self.fn_expr_name.clone(), id_ctxt);
                rename_map.insert(id, new_id);
                n.function.visit_mut_children_with(&mut rename(&rename_map));
            }

            self.fn_expr_name = old_fn_expr_name;
            self.destructured_id_span = old_span;
        } else {
            self.in_body = false;
            n.function.params.visit_mut_children_with(self);
            self.in_body = true;
            n.function.body.visit_mut_children_with(self);
        }
        self.in_body = old_in_body;
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
    use swc_common::Mark;
    use swc_ecma_parser::Syntax;
    use swc_ecma_transforms_base::resolver;
    use swc_ecma_transforms_testing::{test, HygieneTester};
    use swc_ecma_visit::fold_pass;

    use super::*;

    fn tr() -> impl Pass {
        (
            resolver(Mark::new(), Mark::new(), false),
            safari_id_destructuring_collision_in_function_expression(),
        )
    }

    test!(
        Syntax::default(),
        |_| tr(),
        basic,
        "(function a ([a]) { a });
         (function a({ ...a }) { a });
         (function a({ a }) { a });"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        avoid_collision_1,
        "(function a([a, _a]) { a + _a })"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        use_duplicated_id,
        "(function a([a]) { console.log(_a); })"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        avoid_collision_2,
        "(function _a([_a]) { console.log(_a); })"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        assign_outside_var,
        "let _a;
        (function a([a]) {
            _a = 3;
        })"
    );

    test!(
        Syntax::default(),
        |_| tr(),
        assignment_expr_in_default_value,
        "(function a([a = a = 3]) {})"
    );

    test!(
        Syntax::default(),
        |_| (tr(), fold_pass(HygieneTester)),
        issue_4488_1,
        "
        export default function _type_of() {
            if (Date.now() > 0) {
                _type_of = function _type_of() {
                    console.log(0);
                };
            } else {
                _type_of = function _type_of() {
                    console.log(2);
                };
            }
        
            return _type_of();
        }
        "
    );

    test!(
        Syntax::default(),
        |_| tr(),
        in_nameless_fn,
        "(function () {
          (function a(a) {a});
        });
        "
    );

    test!(
        Syntax::default(),
        |_| tr(),
        in_nameless_fn_multiple,
        "// nameless iife
        var x = function() {
            // not transformed
            var b = function a(a) {
                return a;
            };
        }();
        // nameless iife
        var x = function x() {
            var b = function a(_a) {
                return _a;
            };
        }();
        // nameless function
        (function() {
            // not transformed
            var b = function a(a) {
                return a;
            };
        });
        // named function
        (function x() {
            var b = function a(_a) {
                return _a;
            };
        });"
    );
}
