//! Rewrite import extensions
//!
//! This plugin is used to rewrite/remove extensions from import/export source.
//! It only handles sources that contain `/` or `\` in the source.
//!
//! Based on Babel's [plugin-rewrite-ts-imports](https://github.com/babel/babel/blob/3bcfee232506a4cebe410f02042fb0f0adeeb0b1/packages/babel-preset-typescript/src/plugin-rewrite-ts-imports.ts)

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use super::options::RewriteExtensionsMode;
use crate::{context::TraverseCtx, TypeScriptOptions};

/// Transform that rewrites or removes TypeScript file extensions in
/// import/export declarations.
///
/// This transform processes import and export declarations to rewrite
/// TypeScript file extensions (.ts, .tsx, .mts, .cts) to their JavaScript
/// equivalents (.js, .js, .mjs, .cjs) or removes them entirely based on the
/// configured mode.
pub struct TypeScriptRewriteExtensions {
    mode: RewriteExtensionsMode,
}

impl TypeScriptRewriteExtensions {
    /// Create a new `TypeScriptRewriteExtensions` transform.
    ///
    /// Returns `Some` if the `rewrite_import_extensions` option is configured,
    /// `None` otherwise.
    pub fn new(options: &TypeScriptOptions) -> Option<Self> {
        options.rewrite_import_extensions.map(|mode| Self { mode })
    }

    /// Rewrite or remove TypeScript file extensions in a string literal.
    ///
    /// Only processes sources that contain path separators (`/` or `\`).
    /// Rewrites extensions based on the configured mode:
    /// - `.ts`, `.tsx` -> `.js` (or removed)
    /// - `.mts` -> `.mjs` (or removed)
    /// - `.cts` -> `.cjs` (or removed)
    /// - Other extensions are left unchanged
    fn rewrite_extensions(&self, source: &mut Str) {
        let value = &source.value;

        // Find the extension
        let value_str = value.to_string_lossy();

        // Only process paths (sources containing '/' or '\')
        if !value_str.contains('/') && !value_str.contains('\\') {
            return;
        }
        let Some((without_extension, extension)) = value_str.rsplit_once('.') else {
            return;
        };

        // Determine the replacement based on the extension
        let replace = match extension {
            "mts" => ".mjs",
            "cts" => ".cjs",
            "ts" | "tsx" => ".js",
            _ => return, // Do not rewrite or remove other unknown extensions
        };

        // Update the source value based on the mode
        source.value = if self.mode.is_remove() {
            without_extension.into()
        } else {
            format!("{}{}", without_extension, replace).into()
        };

        // Clear the raw value since we've modified the value
        source.raw = None;
    }

    /// Handle import declarations.
    ///
    /// Rewrites extensions in import sources, skipping type-only imports.
    pub fn enter_import_declaration(&mut self, node: &mut ImportDecl, _ctx: &mut TraverseCtx) {
        if node.type_only {
            return;
        }
        self.rewrite_extensions(&mut node.src);
    }

    /// Handle named export declarations.
    ///
    /// Rewrites extensions in export sources, skipping type-only exports.
    pub fn enter_named_export(&mut self, node: &mut NamedExport, _ctx: &mut TraverseCtx) {
        if node.type_only {
            return;
        }
        if let Some(source) = node.src.as_deref_mut() {
            self.rewrite_extensions(source);
        }
    }

    /// Handle export-all declarations.
    ///
    /// Rewrites extensions in export sources, skipping type-only exports.
    pub fn enter_export_all(&mut self, node: &mut ExportAll, _ctx: &mut TraverseCtx) {
        if node.type_only {
            return;
        }
        self.rewrite_extensions(&mut node.src);
    }
}

impl VisitMutHook<TraverseCtx<'_>> for TypeScriptRewriteExtensions {
    // Implementation is delegated through the TypeScript visitor
    // See typescript/mod.rs for the visitor hooks
}
