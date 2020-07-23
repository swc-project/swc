use super::builtin::BUILTINS;
use crate::{version::should_enable, Versions};
use fxhash::FxHashSet;
use swc_atoms::js_word;
use swc_common::{util::move_map::MoveMap, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{Fold, FoldWith};

#[derive(Debug)]
pub struct Entry {
    is_any_target: bool,
    target: Versions,
    pub imports: FxHashSet<&'static str>,
}

impl Entry {
    pub fn new(target: Versions, regenerator: bool) -> Self {
        let is_any_target = target.is_any_target();
        let is_web_target = target.iter().any(|(k, v)| {
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
            v.imports.insert("web.timers".into());
            v.imports.insert("web.immediate".into());
            v.imports.insert("web.dom.iterable".into());
        }

        if regenerator {
            v.imports.insert("regenerator-runtime/runtime".into());
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
            self.add_inner(&feature, *version);
        }

        true
    }

    fn add_inner(&mut self, feature: &'static str, version: Versions) {
        if self.is_any_target || should_enable(self.target, version, true) {
            self.imports.insert(feature);
        }
    }
}

impl Fold for Entry {
    fn fold_import_decl(&mut self, i: ImportDecl) -> ImportDecl {
        let i: ImportDecl = i.fold_children_with(self);

        let remove = i.specifiers.is_empty() && self.add_all(&i.src.value);

        if remove {
            ImportDecl {
                src: Str {
                    span: DUMMY_SP,
                    value: js_word!(""),
                    ..i.src
                },
                ..i
            }
        } else {
            i
        }
    }

    fn fold_module_items(&mut self, items: Vec<ModuleItem>) -> Vec<ModuleItem> {
        items.move_flat_map(|item| {
            let item: ModuleItem = item.fold_with(self);

            match &item {
                ModuleItem::Stmt(Stmt::Expr(ExprStmt { expr, .. })) => match &**expr {
                    Expr::Call(CallExpr {
                        callee: ExprOrSuper::Expr(callee),
                        ref args,
                        ..
                    }) => match &**callee {
                        Expr::Ident(Ident {
                            sym: js_word!("require"),
                            ..
                        }) => {
                            if args.len() == 1
                                && match &args[0] {
                                    ExprOrSpread { spread: None, expr } => match &**expr {
                                        Expr::Lit(Lit::Str(s)) => {
                                            s.value == *"core-js"
                                                || s.value == *"@swc/polyfill"
                                                || s.value == *"@babel/polyfill"
                                        }
                                        _ => false,
                                    },
                                    _ => false,
                                }
                            {
                                if self.add_all("@swc/polyfill") {
                                    return None;
                                }
                            }
                        }

                        _ => {}
                    },
                    _ => {}
                },

                _ => {}
            }

            Some(item)
        })
    }
}
