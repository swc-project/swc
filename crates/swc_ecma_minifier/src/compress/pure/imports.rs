use std::collections::{HashMap, HashSet};
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
    // Track used local names to avoid conflicts
    used_local_names: HashSet<String>,
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
                        used_local_names: HashSet::new(),
                    }
                });
                
                // Collect specifiers with intelligent merging
                for specifier in &import_decl.specifiers {
                    self.merge_specifier_intelligently(info, specifier);
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

impl ImportMerger {
    /// Intelligently merge import specifiers, handling aliases and conflicts
    fn merge_specifier_intelligently(&mut self, info: &mut ImportMergeInfo, new_spec: &ImportSpecifier) {
        match new_spec {
            ImportSpecifier::Named(new_named) => {
                let imported_name = new_named.imported.as_ref()
                    .map(|imported| match imported {
                        ModuleExportName::Ident(id) => id.sym.as_str(),
                        ModuleExportName::Str(s) => s.value.as_str(),
                    })
                    .unwrap_or(new_named.local.sym.as_str());
                
                let new_local_name = new_named.local.sym.as_str();
                
                // Check if we already have an import for this exported name
                let existing_index = info.specifiers.iter().position(|existing| {
                    if let ImportSpecifier::Named(existing_named) = existing {
                        let existing_imported = existing_named.imported.as_ref()
                            .map(|imported| match imported {
                                ModuleExportName::Ident(id) => id.sym.as_str(),
                                ModuleExportName::Str(s) => s.value.as_str(),
                            })
                            .unwrap_or(existing_named.local.sym.as_str());
                        existing_imported == imported_name
                    } else {
                        false
                    }
                });
                
                if let Some(index) = existing_index {
                    // We have a duplicate import for the same exported name
                    if let ImportSpecifier::Named(existing_named) = &info.specifiers[index] {
                        let existing_local_name = existing_named.local.sym.as_str();
                        
                        // Choose the better local name:
                        // 1. Prefer the original name (without alias) if possible
                        // 2. If there's a conflict, prefer the shorter name
                        // 3. If both are aliases, prefer the first one seen
                        
                        let should_replace = self.should_replace_existing_import(
                            existing_local_name,
                            existing_named.imported.is_some(),
                            new_local_name,
                            new_named.imported.is_some(),
                            &info.used_local_names,
                            imported_name,
                        );
                        
                        if should_replace {
                            // Remove the old local name from used names
                            info.used_local_names.remove(existing_local_name);
                            
                            // Replace with the new import
                            info.specifiers[index] = new_spec.clone();
                            info.used_local_names.insert(new_local_name.to_string());
                        }
                        // If not replacing, we keep the existing one and ignore the new one
                    }
                } else {
                    // New import, check for local name conflict
                    if info.used_local_names.contains(new_local_name) {
                        // There's a local name conflict, but it's for a different imported name
                        // Keep both imports as they're importing different things
                        info.specifiers.push(new_spec.clone());
                    } else {
                        // No conflict, add the new import
                        info.specifiers.push(new_spec.clone());
                        info.used_local_names.insert(new_local_name.to_string());
                    }
                }
            },
            ImportSpecifier::Default(_default) => {
                // For default imports, just check if we already have one
                if !info.specifiers.iter().any(|existing| matches!(existing, ImportSpecifier::Default(_))) {
                    info.specifiers.push(new_spec.clone());
                }
            },
            ImportSpecifier::Namespace(namespace) => {
                let local_name = namespace.local.sym.as_str();
                // For namespace imports, check if we already have one with the same local name
                if !info.specifiers.iter().any(|existing| {
                    if let ImportSpecifier::Namespace(existing_ns) = existing {
                        existing_ns.local.sym.as_str() == local_name
                    } else {
                        false
                    }
                }) {
                    info.specifiers.push(new_spec.clone());
                }
            },
        }
    }
    
    /// Determine if we should replace an existing import with a new one
    fn should_replace_existing_import(
        &self,
        existing_local: &str,
        existing_is_aliased: bool,
        new_local: &str,
        new_is_aliased: bool,
        used_names: &HashSet<String>,
        imported_name: &str,
    ) -> bool {
        // If the existing import uses the original name and the new one is aliased,
        // keep the existing one (prefer non-aliased)
        if !existing_is_aliased && new_is_aliased {
            return false;
        }
        
        // If the existing import is aliased and the new one uses the original name,
        // replace with the new one (prefer non-aliased)
        if existing_is_aliased && !new_is_aliased {
            // But only if the new local name doesn't conflict with another used name
            return !used_names.contains(new_local) || new_local == imported_name;
        }
        
        // If both are aliased or both are non-aliased, prefer the shorter name
        if existing_local.len() != new_local.len() {
            return new_local.len() < existing_local.len();
        }
        
        // If same length, keep the existing one (first wins)
        false
    }
}