use rustc_hash::FxHashMap;
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;

use crate::option::CompressOptions;

pub fn postcompress_optimizer(program: &mut Program, options: &CompressOptions) {
    let Some(module) = program.as_mut_module() else {
        return;
    };

    for item in &mut module.body {
        let Some(m) = item.as_mut_module_decl() else {
            continue;
        };

        if let ModuleDecl::ExportDefaultExpr(e) = m {
            match &mut *e.expr {
                Expr::Fn(f) => {
                    if f.ident.is_some() {
                        if options.top_level() {
                            *m = ExportDefaultDecl {
                                span: e.span,
                                decl: DefaultDecl::Fn(f.take()),
                            }
                            .into()
                        }
                    } else {
                        *m = ExportDefaultDecl {
                            span: e.span,
                            decl: DefaultDecl::Fn(f.take()),
                        }
                        .into()
                    }
                }
                Expr::Class(c) => {
                    if c.ident.is_some() {
                        if options.top_level() {
                            *m = ExportDefaultDecl {
                                span: e.span,
                                decl: DefaultDecl::Class(c.take()),
                            }
                            .into()
                        }
                    } else {
                        *m = ExportDefaultDecl {
                            span: e.span,
                            decl: DefaultDecl::Class(c.take()),
                        }
                        .into()
                    }
                }
                _ => (),
            }
        }
    }

    // Merge duplicate imports if enabled
    if options.merge_imports {
        merge_imports_in_module(module);
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct ImportKey {
    src: String,
    type_only: bool,
    phase: ImportPhase,
    /// Hash of the `with` clause to group imports with the same assertions
    with_hash: Option<u64>,
}

impl ImportKey {
    fn from_import_decl(decl: &ImportDecl) -> Self {
        use std::{
            collections::hash_map::DefaultHasher,
            hash::{Hash, Hasher},
        };

        let with_hash = decl.with.as_ref().map(|w| {
            let mut hasher = DefaultHasher::new();
            // Hash the with clause structure
            format!("{w:?}").hash(&mut hasher);
            hasher.finish()
        });

        Self {
            src: decl.src.value.to_string(),
            type_only: decl.type_only,
            phase: decl.phase,
            with_hash,
        }
    }
}

/// Key to identify unique import specifiers.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
enum SpecifierKey {
    /// Named import: (imported name, local name, is_type_only)
    Named(String, String, bool),
    /// Default import: (local name)
    Default(String),
    /// Namespace import: (local name)
    Namespace(String),
}

impl SpecifierKey {
    fn from_specifier(spec: &ImportSpecifier) -> Self {
        match spec {
            ImportSpecifier::Named(named) => {
                let imported = named
                    .imported
                    .as_ref()
                    .map(|n| match n {
                        ModuleExportName::Ident(id) => id.sym.to_string(),
                        ModuleExportName::Str(s) => s.value.to_string(),
                    })
                    .unwrap_or_else(|| named.local.sym.to_string());

                SpecifierKey::Named(imported, named.local.sym.to_string(), named.is_type_only)
            }
            ImportSpecifier::Default(default) => {
                SpecifierKey::Default(default.local.sym.to_string())
            }
            ImportSpecifier::Namespace(ns) => SpecifierKey::Namespace(ns.local.sym.to_string()),
        }
    }
}

/// Merge duplicate import statements from the same module source.
///
/// This optimization reduces bundle size by combining multiple imports from
/// the same source into a single import declaration.
fn merge_imports_in_module(module: &mut Module) {
    // Group imports by source and metadata
    let mut import_groups: FxHashMap<ImportKey, Vec<ImportDecl>> = FxHashMap::default();

    for item in module.body.iter() {
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
            // Skip side-effect only imports (no specifiers)
            if import_decl.specifiers.is_empty() {
                continue;
            }

            let key = ImportKey::from_import_decl(import_decl);
            import_groups
                .entry(key)
                .or_default()
                .push(import_decl.clone());
        }
    }

    // Remove all imports that will be merged (except side-effect imports)
    module.body.retain(|item| {
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
            // Keep side-effect imports
            if import_decl.specifiers.is_empty() {
                return true;
            }

            let key = ImportKey::from_import_decl(import_decl);
            // Only keep if there's just one import for this key (no merging needed)
            import_groups.get(&key).map_or(true, |v| v.len() <= 1)
        } else {
            true
        }
    });

    // Create merged imports and add them back
    for (key, import_decls) in import_groups.iter() {
        if import_decls.len() <= 1 {
            // No merging needed, already retained above
            continue;
        }

        let merged_imports = merge_import_decls(import_decls, key);
        for merged in merged_imports {
            module
                .body
                .push(ModuleItem::ModuleDecl(ModuleDecl::Import(merged)));
        }
    }
}

/// Merge multiple ImportDecl nodes.
/// Returns a Vec because in some cases (namespace + named), we need to create
/// multiple import statements since they cannot be combined in valid ES syntax.
fn merge_import_decls(decls: &[ImportDecl], key: &ImportKey) -> Vec<ImportDecl> {
    let mut default_spec: Option<ImportSpecifier> = None;
    let mut namespace_spec: Option<ImportSpecifier> = None;
    let mut named_specs: Vec<ImportSpecifier> = Vec::new();
    let mut seen_named: FxHashMap<SpecifierKey, ()> = FxHashMap::default();

    let first_decl = &decls[0];
    let span = first_decl.span;

    // Separate specifiers by type
    for decl in decls {
        for spec in &decl.specifiers {
            match spec {
                ImportSpecifier::Default(_) => {
                    if default_spec.is_none() {
                        default_spec = Some(spec.clone());
                    }
                }
                ImportSpecifier::Namespace(_) => {
                    if namespace_spec.is_none() {
                        namespace_spec = Some(spec.clone());
                    }
                }
                ImportSpecifier::Named(_) => {
                    let spec_key = SpecifierKey::from_specifier(spec);
                    if let std::collections::hash_map::Entry::Vacant(e) = seen_named.entry(spec_key)
                    {
                        e.insert(());
                        named_specs.push(spec.clone());
                    }
                }
            }
        }
    }

    let mut result = Vec::new();

    // Valid combinations in ES modules:
    // - default only
    // - namespace only
    // - named only
    // - default + named
    // - default + namespace (ONLY these two, no named allowed)
    // Note: namespace + named (without default) is NOT valid - must split
    // Note: default + namespace + named is NOT valid - must split

    if let Some(namespace) = namespace_spec {
        if default_spec.is_some() {
            if named_specs.is_empty() {
                // default + namespace only (valid combination)
                result.push(ImportDecl {
                    span,
                    specifiers: vec![default_spec.unwrap(), namespace],
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: key.src.clone().into(),
                        raw: None,
                    }),
                    type_only: key.type_only,
                    with: first_decl.with.clone(),
                    phase: key.phase,
                });
            } else {
                // default + namespace + named - MUST SPLIT
                // Create one import for default + named
                let mut specs = vec![default_spec.unwrap()];
                specs.extend(named_specs);
                result.push(ImportDecl {
                    span,
                    specifiers: specs,
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: key.src.clone().into(),
                        raw: None,
                    }),
                    type_only: key.type_only,
                    with: first_decl.with.clone(),
                    phase: key.phase,
                });
                // Create one import for namespace
                result.push(ImportDecl {
                    span,
                    specifiers: vec![namespace],
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: key.src.clone().into(),
                        raw: None,
                    }),
                    type_only: key.type_only,
                    with: first_decl.with.clone(),
                    phase: key.phase,
                });
            }
        } else if named_specs.is_empty() {
            // Just namespace
            result.push(ImportDecl {
                span,
                specifiers: vec![namespace],
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: key.src.clone().into(),
                    raw: None,
                }),
                type_only: key.type_only,
                with: first_decl.with.clone(),
                phase: key.phase,
            });
        } else {
            // namespace + named without default - MUST SPLIT
            // Create one import for namespace
            result.push(ImportDecl {
                span,
                specifiers: vec![namespace],
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: key.src.clone().into(),
                    raw: None,
                }),
                type_only: key.type_only,
                with: first_decl.with.clone(),
                phase: key.phase,
            });
            // Create one import for named
            result.push(ImportDecl {
                span,
                specifiers: named_specs,
                src: Box::new(Str {
                    span: DUMMY_SP,
                    value: key.src.clone().into(),
                    raw: None,
                }),
                type_only: key.type_only,
                with: first_decl.with.clone(),
                phase: key.phase,
            });
        }
    } else {
        // No namespace - merge default and/or named
        let mut specs = Vec::new();
        if let Some(default) = default_spec {
            specs.push(default);
        }
        specs.extend(named_specs);

        result.push(ImportDecl {
            span,
            specifiers: specs,
            src: Box::new(Str {
                span: DUMMY_SP,
                value: key.src.clone().into(),
                raw: None,
            }),
            type_only: key.type_only,
            with: first_decl.with.clone(),
            phase: key.phase,
        });
    }

    result
}
