use std::{
    collections::{HashMap, HashSet},
    sync::Arc,
};

use bytes_str::BytesStr;
use dashmap::DashMap;
use once_cell::sync::Lazy;
use rustc_hash::{FxBuildHasher, FxHashMap};
use swc_atoms::{atom, Atom, Wtf8Atom};
use swc_common::{
    errors::HANDLER,
    sync::Lrc,
    util::{move_map::MoveMap, take::Take},
    FileName, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_parser::parse_file_as_expr;
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn const_modules(
    cm: Lrc<SourceMap>,
    globals: FxHashMap<Atom, FxHashMap<Atom, BytesStr>>,
) -> impl Pass {
    visit_mut_pass(ConstModules {
        globals: globals
            .into_iter()
            .map(|(src, map)| {
                let map = map
                    .into_iter()
                    .map(|(key, value)| {
                        let value = parse_option(&cm, &key, value);

                        (key.into(), value)
                    })
                    .collect();

                (src.into(), map)
            })
            .collect(),
        scope: Default::default(),
    })
}

fn parse_option(cm: &SourceMap, name: &str, src: BytesStr) -> Arc<Expr> {
    static CACHE: Lazy<DashMap<BytesStr, Arc<Expr>, FxBuildHasher>> = Lazy::new(DashMap::default);

    let fm = cm.new_source_file(
        FileName::Internal(format!("<const-module-{name}.js>")).into(),
        src,
    );
    if let Some(expr) = CACHE.get(&fm.src) {
        return expr.clone();
    }

    let expr = parse_file_as_expr(
        &fm,
        Default::default(),
        Default::default(),
        None,
        &mut Vec::new(),
    )
    .map_err(|e| {
        if HANDLER.is_set() {
            HANDLER.with(|h| e.into_diagnostic(h).emit())
        }
    })
    .map(drop_span)
    .unwrap_or_else(|()| {
        panic!(
            "failed to parse jsx option {}: '{}' is not an expression",
            name, fm.src,
        )
    });

    let expr = Arc::new(*expr);

    CACHE.insert(fm.src.clone(), expr.clone());

    expr
}

struct ConstModules {
    globals: HashMap<Wtf8Atom, HashMap<Wtf8Atom, Arc<Expr>>>,
    scope: Scope,
}

#[derive(Default)]
struct Scope {
    namespace: HashSet<Id>,
    imported: HashMap<Wtf8Atom, Arc<Expr>>,
}

impl VisitMut for ConstModules {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        *n = n.take().move_flat_map(|item| match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import)) => {
                let entry = self.globals.get(&import.src.value);
                if let Some(entry) = entry {
                    for s in &import.specifiers {
                        match *s {
                            ImportSpecifier::Named(ref s) => {
                                let imported = s
                                    .imported
                                    .as_ref()
                                    .map(|m| match m {
                                        ModuleExportName::Ident(id) => id.sym.clone().into(),
                                        ModuleExportName::Str(s) => s.value.clone(),
                                        #[cfg(swc_ast_unknown)]
                                        _ => panic!("unable to access unknown nodes"),
                                    })
                                    .unwrap_or_else(|| s.local.sym.clone().into());
                                let value = entry.get(&imported).cloned().unwrap_or_else(|| {
                                    panic!(
                                        "The requested const_module `{:?}` does not provide an \
                                         export named `{:?}`",
                                        import.src.value, imported
                                    )
                                });
                                self.scope.imported.insert(imported.clone(), value);
                            }
                            ImportSpecifier::Namespace(ref s) => {
                                self.scope.namespace.insert(s.local.to_id());
                            }
                            ImportSpecifier::Default(ref s) => {
                                let imported: Wtf8Atom = s.local.sym.clone().into();
                                let default_import_key: Wtf8Atom = atom!("default").into();
                                let value =
                                    entry.get(&default_import_key).cloned().unwrap_or_else(|| {
                                        panic!(
                                            "The requested const_module `{:?}` does not provide \
                                             default export",
                                            import.src.value
                                        )
                                    });
                                self.scope.imported.insert(imported, value);
                            }
                            #[cfg(swc_ast_unknown)]
                            _ => panic!("unable to access unknown nodes"),
                        };
                    }

                    None
                } else {
                    Some(import.into())
                }
            }
            _ => Some(item),
        });

        if self.scope.imported.is_empty() && self.scope.namespace.is_empty() {
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ref id @ Ident { ref sym, .. }) => {
                let sym_wtf8: Wtf8Atom = sym.clone().into();
                if let Some(value) = self.scope.imported.get(&sym_wtf8) {
                    *n = (**value).clone();
                    return;
                }

                if self.scope.namespace.contains(&id.to_id()) {
                    panic!(
                        "The const_module namespace `{sym}` cannot be used without member accessor"
                    )
                }
            }
            Expr::Member(MemberExpr { obj, prop, .. }) if obj.is_ident() => {
                if let Some(module_name) = obj
                    .as_ident()
                    .filter(|member_obj| self.scope.namespace.contains(&member_obj.to_id()))
                    .map(|member_obj| &member_obj.sym)
                {
                    let imported_name: Wtf8Atom = match prop {
                        MemberProp::Ident(ref id) => id.sym.clone().into(),
                        MemberProp::Computed(ref p) => match &*p.expr {
                            Expr::Lit(Lit::Str(s)) => s.value.clone(),
                            _ => return,
                        },
                        MemberProp::PrivateName(..) => return,
                        #[cfg(swc_ast_unknown)]
                        _ => panic!("unable to access unknown nodes"),
                    };

                    let module_name_wtf8: Wtf8Atom = module_name.clone().into();
                    let value = self
                        .globals
                        .get(&module_name_wtf8)
                        .and_then(|entry| entry.get(&imported_name))
                        .unwrap_or_else(|| {
                            panic!(
                                "The requested const_module `{module_name}` does not provide an \
                                 export named `{imported_name:?}`"
                            )
                        });

                    *n = (**value).clone();
                } else {
                    n.visit_mut_children_with(self);
                }
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        };
    }

    fn visit_mut_prop(&mut self, n: &mut Prop) {
        match n {
            Prop::Shorthand(id) => {
                let sym_wtf8: Wtf8Atom = id.sym.clone().into();
                if let Some(value) = self.scope.imported.get(&sym_wtf8) {
                    *n = Prop::KeyValue(KeyValueProp {
                        key: id.take().into(),
                        value: Box::new((**value).clone()),
                    });
                    return;
                }

                if self.scope.namespace.contains(&id.to_id()) {
                    panic!(
                        "The const_module namespace `{}` cannot be used without member accessor",
                        id.sym
                    )
                }
            }
            _ => n.visit_mut_children_with(self),
        }
    }
}
