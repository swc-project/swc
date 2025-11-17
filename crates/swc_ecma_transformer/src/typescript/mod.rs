//! TypeScript-specific transformations.
//!
//! This module provides transformations for TypeScript-specific syntax,
//! converting it to valid JavaScript. Based on the architecture from
//! oxc_transformer's TypeScript module but adapted for SWC's hook pattern.
//!
//! # Transformations
//!
//! - **Type stripping**: Removes type annotations and type-only constructs
//! - **Enums**: Transforms TypeScript enums to JavaScript objects
//! - **Namespaces**: Converts namespaces to IIFEs
//! - **Parameter properties**: Transforms to class property assignments
//! - **Decorators**: Handles TypeScript decorators
//! - **Import/export types**: Strips type-only imports/exports

mod annotations;
mod r#enum;
mod namespace;
mod options;

pub use options::TypeScriptOptions;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use self::{annotations::TypeAnnotations, namespace::TypeScriptNamespace, r#enum::TypeScriptEnum};
use crate::context::TransformCtx;

/// Main TypeScript transformer that orchestrates all TypeScript-specific
/// transformations using the hook pattern.
///
/// This transformer implements `VisitMutHook<TransformCtx>` to integrate
/// with the main transformer architecture.
pub struct TypeScript {
    options: TypeScriptOptions,
    annotations: TypeAnnotations,
    r#enum: TypeScriptEnum,
    namespace: TypeScriptNamespace,
}

impl TypeScript {
    /// Creates a new TypeScript transformer with the given options.
    pub fn new(options: TypeScriptOptions) -> Self {
        Self {
            options,
            annotations: TypeAnnotations::new(),
            r#enum: TypeScriptEnum::new(),
            namespace: TypeScriptNamespace::new(),
        }
    }
}

impl VisitMutHook<TransformCtx> for TypeScript {
    fn enter_program(&mut self, _n: &mut Program, _ctx: &mut TransformCtx) {
        // Initialize any state needed for the transformation
    }

    fn exit_program(&mut self, _n: &mut Program, _ctx: &mut TransformCtx) {
        // Clean up any state after transformation
    }
}

impl VisitMut for TypeScript {
    fn visit_mut_program(&mut self, n: &mut Program) {
        // First, transform TypeScript-specific constructs
        n.visit_mut_children_with(self);

        // Apply sub-transformers in sequence
        if self.options.strip_annotations {
            n.visit_mut_with(&mut self.annotations);
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        n.visit_mut_children_with(self);
    }

    fn visit_mut_module_items(&mut self, items: &mut Vec<ModuleItem>) {
        // Process enum and namespace declarations
        items.visit_mut_children_with(self);
    }

    fn visit_mut_stmt(&mut self, n: &mut Stmt) {
        // Handle TypeScript-specific statements
        match n {
            Stmt::Decl(Decl::TsEnum(enum_decl)) => {
                // Transform enum to JavaScript
                self.r#enum.transform_enum(enum_decl);
            }
            Stmt::Decl(Decl::TsModule(module_decl)) => {
                // Transform namespace to IIFE
                self.namespace.transform_namespace(module_decl);
            }
            _ => {
                n.visit_mut_children_with(self);
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_typescript_transformer_creation() {
        let options = TypeScriptOptions::default();
        let transformer = TypeScript::new(options);
        assert_eq!(transformer.options.strip_annotations, true);
    }
}
