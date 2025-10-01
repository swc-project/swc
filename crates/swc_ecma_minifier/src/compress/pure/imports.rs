use std::collections::HashMap;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Merges duplicate named imports from the same module
pub(crate) fn merge_duplicate_imports() -> impl VisitMut {
    ImportMerger::default()
}

#[derive(Default)]
struct ImportMerger {
    imports_by_source: HashMap<String, ImportMergeInfo>,
}

#[derive(Debug)]
struct ImportMergeInfo {
    span: swc_common::Span,
    specifiers: Vec<ImportSpecifier>,
    type_only: bool,
    with: Option<Box<ObjectLit>>,
}

impl VisitMut for ImportMerger {
    noop_visit_mut_type!(fail);

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        // First, collect all import declarations
        let mut import_indices = Vec::new();
        
        for (i, item) in items.iter().enumerate() {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(_import_decl)) = item {
                import_indices.push(i);
            }
        }

        // Fast path: if no imports, return early
        if import_indices.is_empty() {
            return;
        }

        // Group imports by source, but keep namespace imports separate
        for &index in &import_indices {
            if let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = &items[index] {
                let source = import_decl.src.value.to_string();
                
                // Check if this import has a namespace import
                let has_namespace = import_decl.specifiers.iter()
                    .any(|spec| matches!(spec, ImportSpecifier::Namespace(_)));
                
                // If there's a namespace import, don't merge with other imports from the same source
                let key = if has_namespace {
                    format!("{}#{}", source, index) // Make unique per import
                } else {
                    source.clone()
                };
                
                let info = self.imports_by_source.entry(key).or_insert_with(|| {
                    ImportMergeInfo {
                        span: import_decl.span,
                        specifiers: Vec::new(),
                        type_only: import_decl.type_only,
                        with: import_decl.with.clone(),
                    }
                });
                
                // Collect specifiers
                for specifier in &import_decl.specifiers {
                    // Check for duplicates before adding
                    let should_add = match specifier {
                        ImportSpecifier::Named(named) => {
                            !info.specifiers.iter().any(|existing| {
                                if let ImportSpecifier::Named(existing_named) = existing {
                                    // Check if the local name is the same
                                    existing_named.local.sym == named.local.sym
                                } else {
                                    false
                                }
                            })
                        },
                        ImportSpecifier::Default(_default) => {
                            !info.specifiers.iter().any(|existing| {
                                matches!(existing, ImportSpecifier::Default(_))
                            })
                        },
                        ImportSpecifier::Namespace(namespace) => {
                            !info.specifiers.iter().any(|existing| {
                                if let ImportSpecifier::Namespace(existing_ns) = existing {
                                    existing_ns.local.sym == namespace.local.sym
                                } else {
                                    false
                                }
                            })
                        },
                    };
                    
                    if should_add {
                        info.specifiers.push(specifier.clone());
                    }
                }
            }
        }

        // Remove original import declarations (in reverse order to maintain indices)
        for &index in import_indices.iter().rev() {
            items.remove(index);
        }

        // Add merged imports back
        for (key, info) in &self.imports_by_source {
            if !info.specifiers.is_empty() {
                // Extract the real source name (remove the #index suffix if present)
                let source = if let Some(hash_pos) = key.find('#') {
                    &key[..hash_pos]
                } else {
                    key
                };
                
                let merged_import = ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: info.span,
                    specifiers: info.specifiers.clone(),
                    src: Box::new(Str {
                        span: DUMMY_SP,
                        value: source.into(),
                        raw: None,
                    }),
                    type_only: info.type_only,
                    with: info.with.clone(),
                    phase: Default::default(),
                }));
                
                items.push(merged_import);
            }
        }

        // Continue with child nodes
        items.visit_mut_children_with(self);
    }
}