//! ES2020: Export Namespace From
//!
//! This plugin transforms `export * as ns from "mod"` to `import * as _ns from "mod"; export { _ns as ns }`.
//!
//! > This plugin is included in `preset-env`, in ES2020
//!
//! ## Example
//!
//! Input:
//! ```js
//! export * as ns from "mod";
//! ```
//!
//! Output:
//! ```js
//! import * as _ns from "mod";
//! export { _ns as ns };
//! ```
//!
//! ## Implementation
//!
//! Implementation based on [@babel/plugin-transform-export-namespace-from](https://babeljs.io/docs/babel-plugin-transform-export-namespace-from).
//!
//! ## References:
//! * Babel plugin implementation: <https://github.com/babel/babel/tree/v7.28.4/packages/babel-plugin-transform-export-namespace-from>
//! * "export ns from" TC39 proposal: <https://github.com/tc39/proposal-export-ns-from>

use oxc_allocator::TakeIn;
use oxc_ast::{NONE, ast::*};
use oxc_semantic::SymbolFlags;
use oxc_span::SPAN;
use oxc_traverse::Traverse;

use crate::{
    context::{TransformCtx, TraverseCtx},
    state::TransformState,
};

pub struct ExportNamespaceFrom<'a, 'ctx> {
    _ctx: &'ctx TransformCtx<'a>,
}

impl<'a, 'ctx> ExportNamespaceFrom<'a, 'ctx> {
    pub fn new(ctx: &'ctx TransformCtx<'a>) -> Self {
        Self { _ctx: ctx }
    }
}

impl<'a> Traverse<'a, TransformState<'a>> for ExportNamespaceFrom<'a, '_> {
    fn exit_program(&mut self, program: &mut Program<'a>, ctx: &mut TraverseCtx<'a>) {
        // Early return if there's no `export * as ns from "mod"` to transform
        let has_export_namespace = program.body.iter().any(
            |stmt| matches!(stmt, Statement::ExportAllDeclaration(decl) if decl.exported.is_some()),
        );
        if !has_export_namespace {
            return;
        }

        let mut new_statements = ctx.ast.vec_with_capacity(program.body.len());

        for stmt in program.body.take_in(ctx.ast) {
            match stmt {
                Statement::ExportAllDeclaration(export_all) if export_all.exported.is_some() => {
                    // Transform `export * as ns from "mod"` to:
                    // `import * as _ns from "mod"; export { _ns as ns };`

                    let ExportAllDeclaration { span, exported, source, export_kind, .. } =
                        export_all.unbox();
                    let exported_name = exported.unwrap();

                    // Create a unique binding for the import based on the exported name
                    let binding = ctx.generate_uid_based_on_node(
                        &exported_name,
                        program.scope_id(),
                        SymbolFlags::Import,
                    );

                    // Create `import * as _ns from "mod"`
                    let import_specifier = ImportDeclarationSpecifier::ImportNamespaceSpecifier(
                        ctx.ast.alloc_import_namespace_specifier(
                            SPAN,
                            binding.create_binding_identifier(ctx),
                        ),
                    );

                    let import_decl = ctx.ast.alloc_import_declaration(
                        SPAN,
                        Some(ctx.ast.vec1(import_specifier)),
                        source,
                        None,
                        NONE,
                        export_kind,
                    );
                    new_statements.push(Statement::ImportDeclaration(import_decl));

                    // Create `export { _ns as ns }`
                    let local =
                        ModuleExportName::IdentifierReference(binding.create_read_reference(ctx));
                    let export_specifier =
                        ctx.ast.export_specifier(span, local, exported_name, export_kind);

                    let export_named_decl = ctx.ast.alloc_export_named_declaration(
                        span,
                        None,
                        ctx.ast.vec1(export_specifier),
                        None,
                        export_kind,
                        NONE,
                    );
                    new_statements.push(Statement::ExportNamedDeclaration(export_named_decl));
                }
                _ => {
                    new_statements.push(stmt);
                }
            }
        }

        program.body = new_statements;
    }
}
