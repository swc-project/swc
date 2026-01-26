use std::collections::VecDeque;

use rustc_hash::FxHashMap;
use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;

use crate::option::CompressOptions;

/// Records all import specifiers for a single source module.
#[derive(Default)]
struct ImportRecord {
    /// Default imports: stores local Id in order
    /// e.g., `import A, { default as B, "default" as C } from 'm.js'`
    /// stores A's Id, B's Id, C's Id
    defaults: VecDeque<Ident>,

    /// Namespace imports: stores local Id in order
    /// e.g., `import * as X from 'm.js'` stores X's Id
    namespaces: VecDeque<Ident>,

    /// Named imports: stores (import_name, local_id) in order
    /// e.g., `import { foo } from 'm.js'` stores ("foo", foo's Id)
    /// e.g., `import { foo as bar } from 'm.js'` stores ("foo", bar's Id)
    /// Note: import_name "default" cases are classified into defaults
    named: VecDeque<(Atom, Ident)>,
}

impl ImportRecord {
    fn is_empty(&self) -> bool {
        self.defaults.is_empty() && self.namespaces.is_empty() && self.named.is_empty()
    }
}

pub fn postcompress_optimizer(program: &mut Program, options: &CompressOptions) {
    if !options.merge_imports {
        return;
    }

    let Some(module) = program.as_mut_module() else {
        return;
    };

    // First pass: collect all imports and exports
    let mut import_map = FxHashMap::<Wtf8Atom, ImportRecord>::default();
    // Re-exports: only named re-exports can be merged
    let mut reexport_map =
        FxHashMap::<Wtf8Atom, VecDeque<(ModuleExportName, Option<ModuleExportName>)>>::default();
    // Local exports without source: `export { foo, bar }`
    let mut local_export_list = Vec::default();

    for item in &module.body {
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                // Skip conditions
                if import_decl.type_only {
                    continue;
                }
                if import_decl.with.is_some() {
                    continue;
                }
                if import_decl.phase != ImportPhase::Evaluation {
                    continue;
                }

                let src = import_decl.src.value.clone();
                let record = import_map.entry(src).or_default();

                for spec in &import_decl.specifiers {
                    match spec {
                        ImportSpecifier::Default(d) => {
                            record.defaults.push_back(d.local.clone());
                        }
                        ImportSpecifier::Namespace(ns) => {
                            record.namespaces.push_back(ns.local.clone());
                        }
                        ImportSpecifier::Named(n) => {
                            debug_assert!(
                                !n.is_type_only,
                                "type-only imports/exports should be stripped earlier"
                            );
                            if n.is_type_only {
                                continue;
                            }
                            let remote: Atom = n
                                .imported
                                .as_ref()
                                .map(|i| match i {
                                    ModuleExportName::Ident(id) => id.sym.clone(),
                                    ModuleExportName::Str(s) => {
                                        Atom::new(s.value.to_string_lossy())
                                    }
                                })
                                .unwrap_or_else(|| n.local.sym.clone());
                            let local_id = n.local.clone();

                            // If remote is "default", classify as default import
                            if &*remote == "default" {
                                record.defaults.push_back(local_id);
                            } else {
                                record.named.push_back((remote, local_id));
                            }
                        }
                    }
                }
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export_named)) => {
                if export_named.type_only {
                    continue;
                }
                if export_named.with.is_some() {
                    continue;
                }

                if let Some(ref src) = export_named.src {
                    // Re-export: `export { foo } from 'm.js'`
                    // Only collect named specifiers; namespace/default can't be merged
                    let has_non_named = export_named.specifiers.iter().any(|s| {
                        matches!(
                            s,
                            ExportSpecifier::Namespace(_) | ExportSpecifier::Default(_)
                        )
                    });
                    if has_non_named {
                        // Keep as-is, don't collect
                        continue;
                    }

                    let reexports = reexport_map.entry(src.value.clone()).or_default();

                    for spec in &export_named.specifiers {
                        if let ExportSpecifier::Named(n) = spec {
                            debug_assert!(
                                !n.is_type_only,
                                "type-only imports/exports should be stripped earlier"
                            );
                            if n.is_type_only {
                                continue;
                            }
                            let orig = n.orig.clone();
                            let exported = n.exported.clone();
                            reexports.push_back((orig, exported));
                        }
                    }
                } else {
                    // Local export: `export { foo, bar }`
                    for spec in &export_named.specifiers {
                        if let ExportSpecifier::Named(..) = spec {
                            local_export_list.push(spec.clone());
                        }
                    }
                }
            }
            _ => {}
        }
    }

    if import_map.is_empty() && reexport_map.is_empty() && local_export_list.is_empty() {
        return;
    }

    let mut run_once = false;

    module.body.retain_mut(|item| {
        match item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                // Don't process these, keep as-is
                if import_decl.type_only {
                    return true;
                }
                if import_decl.with.is_some() {
                    return true;
                }
                if import_decl.phase != ImportPhase::Evaluation {
                    return true;
                }

                let src = &import_decl.src.value;
                let Some(record) = import_map.get_mut(src) else {
                    return false; // No record, remove
                };

                let has_namespace = import_decl
                    .specifiers
                    .iter()
                    .any(|s| matches!(s, ImportSpecifier::Namespace(_)));

                let mut new_specs: Vec<ImportSpecifier> = Vec::new();

                if has_namespace || (record.named.is_empty() && !record.namespaces.is_empty()) {
                    // Has namespace: take one default + one namespace
                    if let Some(local) = record.defaults.pop_front() {
                        new_specs.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                            span: DUMMY_SP,
                            local,
                        }));
                    }
                    if let Some(local) = record.namespaces.pop_front() {
                        new_specs.push(ImportSpecifier::Namespace(ImportStarAsSpecifier {
                            span: DUMMY_SP,
                            local,
                        }));
                    }
                } else {
                    // No namespace: take one default + remaining defaults as named + all named
                    if let Some(local) = record.defaults.pop_front() {
                        new_specs.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                            span: DUMMY_SP,
                            local,
                        }));
                    }

                    // Keep ns_count defaults for later namespace imports
                    let ns_count = record.namespaces.len();
                    let drain_count = record.defaults.len().saturating_sub(ns_count);

                    // Remaining defaults become { default as X }
                    for local in record.defaults.drain(..drain_count) {
                        new_specs.push(ImportSpecifier::Named(ImportNamedSpecifier {
                            span: DUMMY_SP,
                            local,
                            imported: Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                                "default".into(),
                                DUMMY_SP,
                            ))),
                            is_type_only: false,
                        }));
                    }

                    // All named imports
                    for (remote, local) in record.named.drain(..) {
                        let imported = if remote == local.sym {
                            None
                        } else {
                            Some(ModuleExportName::Ident(Ident::new_no_ctxt(
                                remote, DUMMY_SP,
                            )))
                        };
                        new_specs.push(ImportSpecifier::Named(ImportNamedSpecifier {
                            span: DUMMY_SP,
                            local,
                            imported,
                            is_type_only: false,
                        }));
                    }
                }

                if record.is_empty() {
                    import_map.remove(src);
                }

                import_decl.specifiers = new_specs;
                true
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export_named)) => {
                if export_named.type_only {
                    return true;
                }
                if export_named.with.is_some() {
                    return true;
                }

                if let Some(ref src) = export_named.src {
                    // Re-export: `export { foo } from 'm.js'`
                    // Statements with namespace/default specifiers are kept as-is
                    let has_non_named = export_named.specifiers.iter().any(|s| {
                        matches!(
                            s,
                            ExportSpecifier::Namespace(_) | ExportSpecifier::Default(_)
                        )
                    });
                    if has_non_named {
                        return true;
                    }

                    let Some(reexports) = reexport_map.get_mut(&src.value) else {
                        return false;
                    };

                    let mut new_specs: Vec<ExportSpecifier> = Vec::new();

                    // Take named exports
                    for (orig, exported) in reexports.drain(..) {
                        new_specs.push(ExportSpecifier::Named(ExportNamedSpecifier {
                            span: DUMMY_SP,
                            orig,
                            exported,
                            is_type_only: false,
                        }));
                    }

                    if reexports.is_empty() {
                        reexport_map.remove(&src.value);
                    }

                    export_named.specifiers = new_specs;

                    true
                } else {
                    if run_once {
                        return false;
                    }

                    export_named.specifiers = local_export_list.take();
                    run_once = true;

                    true
                }
            }
            _ => true,
        }
    });
}
