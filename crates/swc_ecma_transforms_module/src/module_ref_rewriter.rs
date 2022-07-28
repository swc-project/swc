use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_utils::{ExprFactory, IntoIndirectCall};
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::util::prop_name;

pub type ImportMap = AHashMap<Id, (Ident, Option<JsWord>)>;

pub(crate) struct ModuleRefRewriter {
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

    pub lazy_record: AHashSet<Id>,
}

impl VisitMut for ModuleRefRewriter {
    noop_visit_mut_type!();

    /// replace bar in binding pattern
    /// const foo = { bar }
    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(shorthand) => {
                if let Some(expr) = self.map_module_ref_ident(shorthand) {
                    *n = KeyValueProp {
                        key: shorthand.take().into(),
                        value: Box::new(expr),
                    }
                    .into()
                }
            }
            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ref_ident) => {
                if let Some(expr) = self.map_module_ref_ident(ref_ident) {
                    *n = expr;
                }
            }

            _ => n.visit_mut_children_with(self),
        };
    }

    fn visit_mut_callee(&mut self, n: &mut Callee) {
        match n {
            Callee::Expr(e) if e.is_ident() => {
                let is_indirect_callee = e
                    .as_ident()
                    .and_then(|ident| self.import_map.get(&ident.to_id()))
                    .map(|(_, prop)| prop.is_some())
                    .unwrap_or_default();

                e.visit_mut_with(self);

                if is_indirect_callee {
                    *n = n.take().into_indirect()
                }
            }

            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_tagged_tpl(&mut self, n: &mut TaggedTpl) {
        let is_indirect = n
            .tag
            .as_ident()
            .and_then(|ident| self.import_map.get(&ident.to_id()))
            .map(|(_, prop)| prop.is_some())
            .unwrap_or_default();

        n.visit_mut_children_with(self);

        if is_indirect {
            *n = n.take().into_indirect()
        }
    }
}

impl ModuleRefRewriter {
    fn map_module_ref_ident(&mut self, ref_ident: &Ident) -> Option<Expr> {
        self.import_map
            .get(&ref_ident.to_id())
            .map(|(mod_ident, mod_prop)| -> Expr {
                let mut mod_ident = mod_ident.clone();
                let span = ref_ident.span.with_ctxt(mod_ident.span.ctxt);
                mod_ident.span = span;

                let mod_expr = if self.lazy_record.contains(&mod_ident.to_id()) {
                    mod_ident.as_call(span, Default::default())
                } else {
                    mod_ident.into()
                };

                if let Some(imported_name) = mod_prop {
                    let prop = prop_name(imported_name, DUMMY_SP).into();

                    MemberExpr {
                        obj: Box::new(mod_expr),
                        span,
                        prop,
                    }
                    .into()
                } else {
                    mod_expr
                }
            })
    }
}
