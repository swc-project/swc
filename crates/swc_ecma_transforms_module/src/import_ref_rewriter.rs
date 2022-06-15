use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, util::take::Take, DUMMY_SP};
use swc_ecma_ast::{Id, Ident, *};
use swc_ecma_utils::IntoIndirectCall;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::util::prop_name;

pub type ImportMap = AHashMap<Id, (Ident, Option<JsWord>)>;

pub(crate) struct ImportRefRewriter {
    /// ```javascript
    /// import foo, { a as b, c } from "mod";
    /// import * as x from "x";
    /// foo, b, c;
    /// x;
    /// ```
    /// ->
    /// ```javascript
    /// _mod.default, _mod.a, _mod.c;
    /// _x;
    ///
    /// Map(
    ///     foo => (_mod, Some("default")),
    ///     b => (_mod, Some("a")),
    ///     c => (_mod, Some("c")),
    ///     x => (_x, None),
    /// )
    /// ```
    pub import_map: ImportMap,
}

impl VisitMut for ImportRefRewriter {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ref_ident) => {
                if let Some((mod_ident, mod_prop)) = self.import_map.get(&ref_ident.to_id()) {
                    if let Some(imported_name) = mod_prop {
                        let prop = prop_name(imported_name, ref_ident.span).into();

                        *n = MemberExpr {
                            obj: Box::new(mod_ident.clone().into()),
                            span: DUMMY_SP,
                            prop,
                        }
                        .into()
                    } else {
                        let span = ref_ident.span.with_ctxt(mod_ident.span.ctxt);
                        *ref_ident = mod_ident.clone();
                        ref_ident.span = span;
                    }
                }
            }

            _ => n.visit_mut_children_with(self),
        };
    }

    fn visit_mut_callee(&mut self, n: &mut Callee) {
        match n {
            Callee::Expr(e) if e.is_ident() => {
                let is_imported_callee =
                    matches!(e.as_ident(), Some(i) if self.import_map.contains_key(&i.to_id()));

                e.visit_mut_with(self);

                if is_imported_callee {
                    *n = n.take().into_indirect()
                }
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}
