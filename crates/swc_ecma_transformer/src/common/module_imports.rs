//! Utility for managing module imports.
//!
//! This module provides utilities for tracking and generating import statements
//! to be added at the top of a module. It's adapted from oxc_transformer's
//! module_imports module to work with SWC's AST.
//!
//! ## Usage
//!
//! ```ignore
//! use swc_ecma_transformer::common::ModuleImports;
//!
//! let mut imports = ModuleImports::new();
//!
//! // Add a default import
//! imports.add_default_import("react", "_React");
//!
//! // Add a named import
//! imports.add_named_import("react", "useState", "_useState");
//!
//! // Build import statements
//! let import_stmts = imports.build_stmts();
//! ```

use std::collections::HashMap;

use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

/// Type of import.
#[derive(Debug, Clone, PartialEq, Eq)]
enum ImportType {
    /// Default import: `import name from 'source'`
    Default(String),
    /// Named import: `import { imported as local } from 'source'`
    Named { imported: String, local: String },
}

/// Module imports manager.
///
/// This utility collects import statements during transformation passes
/// and allows building import statements to be inserted at the top of modules.
///
/// # Example
///
/// ```ignore
/// let mut imports = ModuleImports::new();
///
/// // Collect imports during transformation
/// imports.add_default_import("react", "React");
/// imports.add_named_import("react", "useState", "_useState");
/// imports.add_named_import("react-dom", "render", "render");
///
/// // Build import statements
/// let stmts = imports.build_stmts();
/// // This produces:
/// // import React, { useState as _useState } from 'react';
/// // import { render } from 'react-dom';
/// ```
pub struct ModuleImports {
    /// Map from source to list of imports from that source.
    /// Using Vec to maintain insertion order.
    imports: HashMap<String, Vec<ImportType>>,
    /// Tracks the order in which sources were first seen.
    source_order: Vec<String>,
}

impl ModuleImports {
    /// Creates a new module imports manager.
    pub fn new() -> Self {
        Self {
            imports: HashMap::new(),
            source_order: Vec::new(),
        }
    }

    /// Adds a default import.
    ///
    /// # Arguments
    ///
    /// * `source` - The module to import from (e.g., "react")
    /// * `local` - The local name for the import (e.g., "React")
    ///
    /// # Example
    ///
    /// ```ignore
    /// imports.add_default_import("react", "React");
    /// // Generates: import React from 'react';
    /// ```
    pub fn add_default_import(&mut self, source: impl Into<String>, local: impl Into<String>) {
        let source = source.into();
        let local = local.into();

        self.add_import(source, ImportType::Default(local));
    }

    /// Adds a named import.
    ///
    /// # Arguments
    ///
    /// * `source` - The module to import from (e.g., "react")
    /// * `imported` - The exported name (e.g., "useState")
    /// * `local` - The local name for the import (e.g., "_useState")
    ///
    /// # Example
    ///
    /// ```ignore
    /// imports.add_named_import("react", "useState", "_useState");
    /// // Generates: import { useState as _useState } from 'react';
    /// ```
    pub fn add_named_import(
        &mut self,
        source: impl Into<String>,
        imported: impl Into<String>,
        local: impl Into<String>,
    ) {
        let source = source.into();
        let imported = imported.into();
        let local = local.into();

        self.add_import(source, ImportType::Named { imported, local });
    }

    /// Returns whether there are any pending imports.
    pub fn has_imports(&self) -> bool {
        !self.imports.is_empty()
    }

    /// Returns the number of distinct sources being imported from.
    pub fn source_count(&self) -> usize {
        self.imports.len()
    }

    /// Returns the total number of imports.
    pub fn import_count(&self) -> usize {
        self.imports.values().map(|v| v.len()).sum()
    }

    /// Builds all import statements.
    ///
    /// Returns a vector of import declaration statements in the order
    /// that sources were first added.
    ///
    /// After calling this method, all imports are cleared.
    pub fn build_stmts(&mut self) -> Vec<ModuleItem> {
        let mut stmts = Vec::with_capacity(self.source_order.len());

        for source in std::mem::take(&mut self.source_order) {
            if let Some(import_types) = self.imports.remove(&source) {
                let stmt = self.build_import_decl(source, import_types);
                stmts.push(ModuleItem::ModuleDecl(ModuleDecl::Import(stmt)));
            }
        }

        stmts
    }

    /// Clears all pending imports without building them.
    pub fn clear(&mut self) {
        self.imports.clear();
        self.source_order.clear();
    }

    /// Internal method to add an import.
    fn add_import(&mut self, source: String, import_type: ImportType) {
        let is_new_source = !self.imports.contains_key(&source);

        self.imports
            .entry(source.clone())
            .or_default()
            .push(import_type);

        if is_new_source {
            self.source_order.push(source);
        }
    }

    /// Builds an import declaration for a given source.
    fn build_import_decl(&self, source: String, import_types: Vec<ImportType>) -> ImportDecl {
        let mut specifiers = Vec::with_capacity(import_types.len());

        for import_type in import_types {
            match import_type {
                ImportType::Default(local) => {
                    specifiers.push(ImportSpecifier::Default(ImportDefaultSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new(local.into(), DUMMY_SP, Default::default()),
                    }));
                }
                ImportType::Named { imported, local } => {
                    let imported_opt = if imported == local {
                        None
                    } else {
                        Some(ModuleExportName::Ident(Ident::new(
                            imported.into(),
                            DUMMY_SP,
                            Default::default(),
                        )))
                    };

                    specifiers.push(ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new(local.into(), DUMMY_SP, Default::default()),
                        imported: imported_opt,
                        is_type_only: false,
                    }));
                }
            }
        }

        ImportDecl {
            span: DUMMY_SP,
            specifiers,
            src: Box::new(Str {
                span: DUMMY_SP,
                value: source.into(),
                raw: None,
            }),
            type_only: false,
            with: None,
            phase: Default::default(),
        }
    }
}

impl Default for ModuleImports {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_default_import() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");

        assert!(imports.has_imports());
        assert_eq!(imports.source_count(), 1);
        assert_eq!(imports.import_count(), 1);
    }

    #[test]
    fn test_add_named_import() {
        let mut imports = ModuleImports::new();
        imports.add_named_import("react", "useState", "_useState");

        assert!(imports.has_imports());
        assert_eq!(imports.source_count(), 1);
        assert_eq!(imports.import_count(), 1);
    }

    #[test]
    fn test_multiple_imports_same_source() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");
        imports.add_named_import("react", "useState", "_useState");
        imports.add_named_import("react", "useEffect", "_useEffect");

        assert_eq!(imports.source_count(), 1);
        assert_eq!(imports.import_count(), 3);
    }

    #[test]
    fn test_multiple_sources() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");
        imports.add_named_import("react-dom", "render", "render");

        assert_eq!(imports.source_count(), 2);
        assert_eq!(imports.import_count(), 2);
    }

    #[test]
    fn test_build_stmts() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");
        imports.add_named_import("react", "useState", "_useState");

        let stmts = imports.build_stmts();
        assert_eq!(stmts.len(), 1);

        // After building, imports should be cleared
        assert!(!imports.has_imports());
    }

    #[test]
    fn test_build_default_import() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");

        let stmts = imports.build_stmts();
        assert_eq!(stmts.len(), 1);

        match &stmts[0] {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                assert_eq!(&*import_decl.src.value, "react");
                assert_eq!(import_decl.specifiers.len(), 1);

                match &import_decl.specifiers[0] {
                    ImportSpecifier::Default(spec) => {
                        assert_eq!(&*spec.local.sym, "React");
                    }
                    _ => panic!("Expected default import specifier"),
                }
            }
            _ => panic!("Expected import declaration"),
        }
    }

    #[test]
    fn test_build_named_import() {
        let mut imports = ModuleImports::new();
        imports.add_named_import("react", "useState", "_useState");

        let stmts = imports.build_stmts();
        assert_eq!(stmts.len(), 1);

        match &stmts[0] {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                assert_eq!(&*import_decl.src.value, "react");
                assert_eq!(import_decl.specifiers.len(), 1);

                match &import_decl.specifiers[0] {
                    ImportSpecifier::Named(spec) => {
                        assert_eq!(&*spec.local.sym, "_useState");
                        assert!(spec.imported.is_some());
                    }
                    _ => panic!("Expected named import specifier"),
                }
            }
            _ => panic!("Expected import declaration"),
        }
    }

    #[test]
    fn test_build_mixed_imports() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");
        imports.add_named_import("react", "useState", "_useState");

        let stmts = imports.build_stmts();
        assert_eq!(stmts.len(), 1);

        match &stmts[0] {
            ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) => {
                // Should have both default and named import
                assert_eq!(import_decl.specifiers.len(), 2);
            }
            _ => panic!("Expected import declaration"),
        }
    }

    #[test]
    fn test_source_order_preserved() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");
        imports.add_default_import("vue", "Vue");
        imports.add_default_import("angular", "Angular");

        let stmts = imports.build_stmts();
        assert_eq!(stmts.len(), 3);

        // Check order is preserved - verify count and first source
        // Verify first import is from "react"
        if let ModuleItem::ModuleDecl(ModuleDecl::Import(decl)) = &stmts[0] {
            assert_eq!(&*decl.src.value, "react");
        } else {
            panic!("Expected import declaration");
        }
    }

    #[test]
    fn test_clear() {
        let mut imports = ModuleImports::new();
        imports.add_default_import("react", "React");

        assert!(imports.has_imports());

        imports.clear();

        assert!(!imports.has_imports());
        assert_eq!(imports.source_count(), 0);
        assert_eq!(imports.import_count(), 0);
    }

    #[test]
    fn test_empty_build() {
        let mut imports = ModuleImports::new();
        let stmts = imports.build_stmts();
        assert!(stmts.is_empty());
    }
}
