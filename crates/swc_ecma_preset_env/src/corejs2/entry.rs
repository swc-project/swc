use indexmap::IndexSet;
use preset_env_base::{version::should_enable, Versions};
use swc_atoms::js_word;
use swc_common::{collections::ARandomState, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::builtin::BUILTINS;

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Versions,
    pub imports: IndexSet<&'static str, ARandomState>,
}

impl Entry {
    pub fn new(target: Versions, regenerator: bool) -> Self {
        let is_any_target = target.is_any_target();
        let is_web_target = target.into_iter().any(|(k, v)| {
            if k == "node" {
                return false;
            }

            v.is_some()
        });

        let mut v = Entry {
            is_any_target: target.is_any_target(),
            target,
            imports: Default::default(),
        };
        if is_any_target || is_web_target {
            v.imports.insert("web.timers");
            v.imports.insert("web.immediate");
            v.imports.insert("web.dom.iterable");
        }

        if regenerator {
            v.imports.insert("regenerator-runtime/runtime.js");
        }

        v
    }

    /// Add imports.
    /// Returns true if it's replaced.
    fn add_all(&mut self, src: &str) -> bool {
        if src != "@babel/polyfill" && src != "@swc/polyfill" && src != "core-js" {
            return false;
        }

        for (feature, version) in BUILTINS.iter() {
            self.add_inner(feature, *version);
        }

        true
    }

    fn add_inner(&mut self, feature: &'static str, version: Versions) {
        if self.is_any_target || should_enable(self.target, version, true) {
            self.imports.insert(feature);
        }
    }
}

impl VisitMut for Entry {
    noop_visit_mut_type!(fail);

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        let remove = i.specifiers.is_empty() && self.add_all(&i.src.value);

        if remove {
            i.src.value = js_word!("");
            i.src.span = DUMMY_SP;
        }
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        items.retain_mut(|item| {
            item.visit_mut_children_with(self);
            if let ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) = &item {
                if let Expr::Call(CallExpr {
                    callee: Callee::Expr(callee),
                    ref args,
                    ..
                }) = &**expr
                {
                    if callee.is_ident_ref_to("require")
                        && args.len() == 1
                        && if let ExprOrSpread { spread: None, expr } = &args[0] {
                            if let Expr::Lit(Lit::Str(s)) = &**expr {
                                s.value == *"core-js"
                                    || s.value == *"@swc/polyfill"
                                    || s.value == *"@babel/polyfill"
                            } else {
                                false
                            }
                        } else {
                            false
                        }
                        && self.add_all("@swc/polyfill")
                    {
                        return false;
                    }
                }
            }
            true
        })
    }
}
