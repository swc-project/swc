use rustc_hash::FxHashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use crate::maybe_par;

/// Merge duplicate import statements from the same module source.
///
/// This optimization reduces bundle size by combining multiple imports from
/// the same source into a single import declaration.
///
/// # Examples
///
/// ```js
/// // Before
/// import { add } from 'math';
/// import { subtract } from 'math';
///
/// // After
/// import { add, subtract } from 'math';
/// ```
pub(crate) fn merge_imports() -> impl VisitMut {
    Merger::default()
}

#[derive(Default)]
struct Merger {
    /// Grouped imports by their source path and metadata.
    /// Key: (source, type_only, phase, with_hash)
    /// Value: Vec of ImportDecl
    import_groups: FxHashMap<ImportKey, Vec<ImportDecl>>,
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
        use std::collections::hash_map::DefaultHasher;
        use std::hash::{Hash, Hasher};

        let with_hash = decl.with.as_ref().map(|w| {
            let mut hasher = DefaultHasher::new();
            // Hash the with clause structure
            format!("{:?}", w).hash(&mut hasher);
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

impl VisitMut for Merger {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        // Fast-path: check if there are any imports
        let has_imports = maybe_par!(
            items.iter().any(|item| matches!(
                item,
                ModuleItem::ModuleDecl(ModuleDecl::Import(..))
            )),
            *crate::LIGHT_TASK_PARALLELS
        );

        if !has_imports {
            return;
        }

        items.visit_mut_children_with(self);

        // Group imports by source and metadata
        self.import_groups.clear();

        for item in items.iter() {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
                // Skip side-effect only imports (no specifiers)
                if import_decl.specifiers.is_empty() {
                    continue;
                }

                let key = ImportKey::from_import_decl(import_decl);
                self.import_groups
                    .entry(key)
                    .or_insert_with(Vec::new)
                    .push(import_decl.clone());
            }
        }

        // Remove all imports that will be merged (except side-effect imports)
        items.retain(|item| {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item {
                // Keep side-effect imports
                if import_decl.specifiers.is_empty() {
                    return true;
                }

                let key = ImportKey::from_import_decl(import_decl);
                // Only keep if there's just one import for this key (no merging needed)
                self.import_groups.get(&key).map_or(true, |v| v.len() <= 1)
            } else {
                true
            }
        });

        // Create merged imports and add them back
        for (key, import_decls) in self.import_groups.iter() {
            if import_decls.len() <= 1 {
                // No merging needed, already retained above
                continue;
            }

            let merged_imports = self.merge_import_decls(import_decls, key);
            for merged in merged_imports {
                items.push(ModuleItem::ModuleDecl(ModuleDecl::Import(merged)));
            }
        }
    }
}

impl Merger {
    /// Merge multiple ImportDecl nodes.
    /// Returns a Vec because in some cases (namespace + named), we need to create
    /// multiple import statements since they cannot be combined in valid ES syntax.
    fn merge_import_decls(&self, decls: &[ImportDecl], key: &ImportKey) -> Vec<ImportDecl> {
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
                        if !seen_named.contains_key(&spec_key) {
                            seen_named.insert(spec_key, ());
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
        // - default + namespace
        // Note: namespace + named (without default) is NOT valid - must split

        if let Some(namespace) = namespace_spec {
            if default_spec.is_some() {
                // default + namespace (+ maybe named)
                let mut specs = vec![default_spec.unwrap(), namespace];
                specs.extend(named_specs.clone());
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
}

/// Key to identify unique import specifiers.
/// This allows us to detect duplicates while preserving different aliases.
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
