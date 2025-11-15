//! Rewrite import extensions
//!
//! This plugin is used to rewrite/remove extensions from import/export source.
//! It is only handled source that contains `/` or `\` in the source.
//!
//! Based on Babel's [plugin-rewrite-ts-imports](https://github.com/babel/babel/blob/3bcfee232506a4cebe410f02042fb0f0adeeb0b1/packages/babel-preset-typescript/src/plugin-rewrite-ts-imports.ts)

use oxc_ast::ast::{
    ExportAllDeclaration, ExportNamedDeclaration, ImportDeclaration, StringLiteral,
};
use oxc_span::Atom;
use oxc_traverse::Traverse;

use crate::{TypeScriptOptions, context::TraverseCtx, state::TransformState};

use super::options::RewriteExtensionsMode;

pub struct TypeScriptRewriteExtensions {
    mode: RewriteExtensionsMode,
}

impl TypeScriptRewriteExtensions {
    pub fn new(options: &TypeScriptOptions) -> Option<Self> {
        options.rewrite_import_extensions.map(|mode| Self { mode })
    }

    pub fn rewrite_extensions<'a>(&self, source: &mut StringLiteral<'a>, ctx: &TraverseCtx<'a>) {
        let value = source.value.as_str();
        if !value.contains(['/', '\\']) {
            return;
        }

        let Some((without_extension, extension)) = value.rsplit_once('.') else { return };

        let replace = match extension {
            "mts" => ".mjs",
            "cts" => ".cjs",
            "ts" | "tsx" => ".js",
            _ => return, // do not rewrite or remove other unknown extensions
        };

        source.value = if self.mode.is_remove() {
            Atom::from(without_extension)
        } else {
            ctx.ast.atom_from_strs_array([without_extension, replace])
        };
        source.raw = None;
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for TypeScriptRewriteExtensions {
    fn enter_import_declaration(
        &mut self,
        node: &mut ImportDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if node.import_kind.is_type() {
            return;
        }
        self.rewrite_extensions(&mut node.source, ctx);
    }

    fn enter_export_named_declaration(
        &mut self,
        node: &mut ExportNamedDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if node.export_kind.is_type() {
            return;
        }
        if let Some(source) = node.source.as_mut() {
            self.rewrite_extensions(source, ctx);
        }
    }

    fn enter_export_all_declaration(
        &mut self,
        node: &mut ExportAllDeclaration<'a>,
        ctx: &mut TraverseCtx<'a>,
    ) {
        if node.export_kind.is_type() {
            return;
        }
        self.rewrite_extensions(&mut node.source, ctx);
    }
}
