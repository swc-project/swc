use swc_atoms::JsWord;
use swc_common::{
    collections::{AHashMap, AHashSet},
    util::take::Take,
    DUMMY_SP,
};
use swc_ecma_ast::*;
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

    pub allow_top_level_this: bool,

    pub is_global_this: bool,
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

            Expr::This(ThisExpr { span }) => {
                if !self.allow_top_level_this && self.is_global_this {
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

    fn visit_mut_function(&mut self, n: &mut Function) {
        self.visit_mut_with_non_global_this(n);
    }

    fn visit_mut_constructor(&mut self, n: &mut Constructor) {
        self.visit_mut_with_non_global_this(n);
    }

    fn visit_mut_class_prop(&mut self, n: &mut ClassProp) {
        n.key.visit_mut_with(self);

        self.visit_mut_with_non_global_this(&mut n.value);
    }

    fn visit_mut_private_prop(&mut self, n: &mut PrivateProp) {
        self.visit_mut_with_non_global_this(n);
    }

    fn visit_mut_getter_prop(&mut self, n: &mut GetterProp) {
        self.visit_mut_with_non_global_this(n);
    }

    fn visit_mut_setter_prop(&mut self, n: &mut SetterProp) {
        self.visit_mut_with_non_global_this(n);
    }

    fn visit_mut_static_block(&mut self, n: &mut StaticBlock) {
        self.visit_mut_with_non_global_this(n);
    }
}

impl ModuleRefRewriter {
    fn visit_mut_with_non_global_this<T>(&mut self, n: &mut T)
    where
        T: VisitMutWith<Self>,
    {
        let top_level = self.is_global_this;

        self.is_global_this = false;
        n.visit_mut_children_with(self);
        self.is_global_this = top_level;
    }

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
