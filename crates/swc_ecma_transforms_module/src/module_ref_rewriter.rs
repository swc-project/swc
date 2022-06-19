use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    DUMMY_SP,
};
use swc_ecma_ast::{Id, Ident, *};
use swc_ecma_utils::{undefined, ExprFactory, IntoIndirectCall};
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

    pub top_level: bool,
}

impl VisitMut for ModuleRefRewriter {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ref_ident) => {
                if let Some((mod_ident, mod_prop)) = self.import_map.get(&ref_ident.to_id()) {
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

                        *n = MemberExpr {
                            obj: Box::new(mod_expr),
                            span,
                            prop,
                        }
                        .into();
                    } else {
                        *n = mod_expr;
                    }
                }
            }

            Expr::This(ThisExpr { span }) => {
                if self.top_level {
                    *n = *undefined(*span);
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
                    .and_then(|(_, prop)| prop.as_ref())
                    .is_some();

                e.visit_mut_with(self);

                if is_indirect_callee {
                    *n = n.take().into_indirect()
                }
            }

            _ => n.visit_mut_children_with(self),
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        n.params.visit_mut_with(self);

        self.visit_mut_with_non_top_level(&mut n.body);
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        n.params.visit_mut_with(self);

        self.visit_mut_with_non_top_level(&mut n.body);
    }

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        n.key.visit_mut_with(self);

        self.visit_mut_with_non_top_level(&mut n.value);
    }

    fn visit_mut_static_block(&mut self, n: &mut StaticBlock) {
        self.visit_mut_with_non_top_level(&mut n.body);
    }
}

impl ModuleRefRewriter {
    fn visit_mut_with_non_top_level<T>(&mut self, n: &mut T)
    where
        T: VisitMutWith<Self>,
    {
        let top_level = self.top_level;

        self.top_level = false;
        n.visit_mut_with(self);
        self.top_level = top_level;
    }
}
