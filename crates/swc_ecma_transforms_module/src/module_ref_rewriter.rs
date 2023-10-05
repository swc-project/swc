use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    SyntaxContext, DUMMY_SP,
};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helpers::HELPERS;
use swc_ecma_utils::{ExprFactory, QueryRef, RefRewriter};
use swc_ecma_visit::VisitMutWith;

use crate::util::prop_name;

pub type ImportMap = AHashMap<Id, (Ident, Option<JsWord>)>;

pub(crate) struct ImportQuery {
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
    import_map: ImportMap,
    lazy_record: AHashSet<Id>,
    helper_ctxt: Option<SyntaxContext>,
}

impl QueryRef for ImportQuery {
    fn query_ref(&self, ident: &Ident) -> Option<Expr> {
        self.import_map
            .get(&ident.to_id())
            .map(|(mod_ident, mod_prop)| -> Expr {
                let mut mod_ident = mod_ident.clone();
                let span = ident.span.with_ctxt(mod_ident.span.ctxt);
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

    fn query_lhs(&self, _: &Ident) -> Option<Expr> {
        // import binding cannot be used as lhs
        None
    }

    fn should_fix_this(&self, ident: &Ident) -> bool {
        if self.helper_ctxt.iter().any(|ctxt| ctxt == &ident.span.ctxt) {
            return false;
        }

        self.import_map
            .get(&ident.to_id())
            .map(|(_, prop)| prop.is_some())
            .unwrap_or_default()
    }
}

pub(crate) fn rewrite_import_bindings<V>(
    node: &mut V,
    import_map: ImportMap,
    lazy_record: AHashSet<Id>,
) where
    V: VisitMutWith<RefRewriter<ImportQuery>>,
{
    let mut v = RefRewriter {
        query: ImportQuery {
            import_map,
            lazy_record,
            helper_ctxt: {
                HELPERS
                    .is_set()
                    .then(|| HELPERS.with(|helper| helper.mark()))
                    .map(|mark| SyntaxContext::empty().apply_mark(mark))
            },
        },
    };

    node.visit_mut_with(&mut v);
}
