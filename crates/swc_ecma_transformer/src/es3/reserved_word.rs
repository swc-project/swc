//! babel: `@babel/plugin-transform-reserved-words`
//!
//! Some words were reserved in ES3 as potential future keywords but were not
//! reserved in ES5 and later. This plugin, to be used when targeting ES3
//! environments, renames variables from that set of words.
//!
//! # Input
//! ```js
//! var abstract = 1;
//! var x = abstract + 1;
//! ```
//!
//! # Output
//! ```js
//! var _abstract = 1;
//! var x = _abstract + 1;
//! ```

use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

/// Context for tracking when to skip identifier transformation.
#[derive(Default)]
pub struct ReservedWordContext {
    /// Skip transforming identifiers when inside these contexts
    skip_depth: u32,
    /// Skip transforming identifiers in named exports with source
    in_named_export_with_src: bool,
    /// Skip transforming the `imported` field in import specifiers
    skip_imported: bool,
    /// Track how many ModuleExportNames we've seen in the current export
    /// specifier to skip the exported (second one) but not the orig (first
    /// one)
    export_specifier_module_export_name_count: u32,
    /// Whether we're in an export specifier with a reserved orig
    in_reserved_export_specifier: bool,
}

/// Creates a reserved words transformation hook.
pub(crate) fn hook(preserve_import: bool) -> impl VisitMutHook<TraverseCtx> {
    ReservedWordHook { preserve_import }
}

struct ReservedWordHook {
    preserve_import: bool,
}

impl VisitMutHook<TraverseCtx> for ReservedWordHook {
    // Skip transforming identifiers in member expression properties
    fn enter_member_prop(&mut self, _n: &mut MemberProp, ctx: &mut TraverseCtx) {
        ctx.es3.skip_depth += 1;
    }

    fn exit_member_prop(&mut self, _n: &mut MemberProp, ctx: &mut TraverseCtx) {
        ctx.es3.skip_depth -= 1;
    }

    // Skip transforming identifiers in property names
    fn enter_prop_name(&mut self, _n: &mut PropName, ctx: &mut TraverseCtx) {
        ctx.es3.skip_depth += 1;
    }

    fn exit_prop_name(&mut self, _n: &mut PropName, ctx: &mut TraverseCtx) {
        ctx.es3.skip_depth -= 1;
    }

    // Track when we're in a named export with source (re-export)
    fn enter_named_export(&mut self, n: &mut NamedExport, ctx: &mut TraverseCtx) {
        if n.src.is_some() {
            ctx.es3.in_named_export_with_src = true;
            ctx.es3.skip_depth += 1;
        }
    }

    fn exit_named_export(&mut self, n: &mut NamedExport, ctx: &mut TraverseCtx) {
        if n.src.is_some() {
            ctx.es3.in_named_export_with_src = false;
            ctx.es3.skip_depth -= 1;
        }
    }

    // Handle import specifiers specially - set imported before the ident is visited
    fn enter_import_named_specifier(
        &mut self,
        s: &mut ImportNamedSpecifier,
        ctx: &mut TraverseCtx,
    ) {
        // Preserve the original imported name if the local is reserved
        if s.local.is_reserved_in_es3() && s.imported.is_none() {
            s.imported = Some(s.local.clone().into());
        }
        // Mark that we should skip the imported field (the ModuleExportName)
        ctx.es3.skip_imported = true;
    }

    fn exit_import_named_specifier(
        &mut self,
        _s: &mut ImportNamedSpecifier,
        ctx: &mut TraverseCtx,
    ) {
        ctx.es3.skip_imported = false;
    }

    // Handle export specifiers specially - set exported before the ident is visited
    fn enter_export_named_specifier(
        &mut self,
        n: &mut ExportNamedSpecifier,
        ctx: &mut TraverseCtx,
    ) {
        // Don't transform in re-exports
        if ctx.es3.in_named_export_with_src {
            return;
        }

        // Check if orig is reserved
        let orig_is_reserved =
            matches!(&n.orig, ModuleExportName::Ident(ident) if ident.is_reserved_in_es3());

        // Check if exported is reserved (for specifiers we created in
        // enter_module_items)
        let exported_is_reserved = matches!(
            &n.exported,
            Some(ModuleExportName::Ident(ident)) if ident.is_reserved_in_es3()
        );

        if orig_is_reserved && n.exported.is_none() {
            n.exported = Some(n.orig.clone());
        }

        // If either orig or exported contains a reserved word, we need to skip the
        // exported field
        if orig_is_reserved || exported_is_reserved {
            ctx.es3.in_reserved_export_specifier = true;
            ctx.es3.export_specifier_module_export_name_count = 0;
        }
    }

    fn exit_export_named_specifier(
        &mut self,
        _n: &mut ExportNamedSpecifier,
        ctx: &mut TraverseCtx,
    ) {
        // Reset state
        ctx.es3.in_reserved_export_specifier = false;
        ctx.es3.export_specifier_module_export_name_count = 0;
    }

    // Track ModuleExportName visits within export specifiers to skip the second one
    // (exported)
    fn enter_module_export_name(&mut self, _n: &mut ModuleExportName, ctx: &mut TraverseCtx) {
        // Handle import specifiers - skip the imported field
        if ctx.es3.skip_imported {
            ctx.es3.skip_depth += 1;
            return;
        }

        // Handle export specifiers - skip the second ModuleExportName (exported)
        if ctx.es3.in_reserved_export_specifier {
            ctx.es3.export_specifier_module_export_name_count += 1;
            // The second ModuleExportName is the exported field - skip it
            if ctx.es3.export_specifier_module_export_name_count == 2 {
                ctx.es3.skip_depth += 1;
            }
        }
    }

    fn exit_module_export_name(&mut self, _n: &mut ModuleExportName, ctx: &mut TraverseCtx) {
        // Handle import specifiers
        if ctx.es3.skip_imported {
            ctx.es3.skip_depth -= 1;
            return;
        }

        // Handle export specifiers - only decrement if we incremented
        if ctx.es3.in_reserved_export_specifier
            && ctx.es3.export_specifier_module_export_name_count == 2
        {
            ctx.es3.skip_depth -= 1;
        }
    }

    fn exit_ident(&mut self, i: &mut Ident, ctx: &mut TraverseCtx) {
        // Skip if we're in a context where identifiers shouldn't be transformed
        if ctx.es3.skip_depth > 0 {
            return;
        }

        if self.preserve_import && i.sym == *"import" {
            return;
        }

        if i.is_reserved_in_es3() {
            i.sym = format!("_{}", i.sym).into()
        }
    }

    // Use enter_module_items to process BEFORE children are visited
    fn enter_module_items(&mut self, n: &mut Vec<ModuleItem>, _ctx: &mut TraverseCtx) {
        let mut extra_exports = Vec::new();

        for module_item in n.iter_mut() {
            match module_item {
                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: decl @ Decl::Fn(..) | decl @ Decl::Class(..),
                    ..
                })) => {
                    let ident = match decl {
                        Decl::Class(d) => d.ident.clone(),
                        Decl::Fn(d) => d.ident.clone(),
                        _ => {
                            unreachable!()
                        }
                    };

                    if ident.is_reserved_in_es3() {
                        // Take the declaration out and make it a regular statement
                        let new_decl = decl.take();
                        *module_item = new_decl.into();

                        // Create the renamed identifier
                        let mut orig = ident.clone();
                        rename_reserved_ident(&mut orig, self.preserve_import);

                        // Add an export with the original name as the exported name
                        extra_exports.push(
                            ExportNamedSpecifier {
                                span: DUMMY_SP,
                                orig: orig.into(),
                                exported: Some(ident.into()),
                                is_type_only: false,
                            }
                            .into(),
                        );
                    }
                }

                ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
                    decl: Decl::Var(var),
                    ..
                })) => {
                    // Check if any variable name is a reserved word
                    let has_reserved = var.decls.iter().any(|v| {
                        if let Pat::Ident(i) = &v.name {
                            i.sym.is_reserved_in_es3()
                        } else {
                            false
                        }
                    });

                    if has_reserved {
                        for v in &var.decls {
                            let ident = Ident::from(v.name.clone().expect_ident());

                            if ident.is_reserved_in_es3() {
                                let mut orig = ident.clone();
                                rename_reserved_ident(&mut orig, self.preserve_import);

                                extra_exports.push(
                                    ExportNamedSpecifier {
                                        span: DUMMY_SP,
                                        orig: orig.into(),
                                        exported: Some(ident.into()),
                                        is_type_only: false,
                                    }
                                    .into(),
                                );
                            }
                        }

                        *module_item = var.take().into();
                    }
                }

                _ => {}
            }
        }

        if !extra_exports.is_empty() {
            let module_item = NamedExport {
                span: DUMMY_SP,
                specifiers: extra_exports,
                src: None,
                type_only: false,
                with: None,
            }
            .into();

            n.push(module_item);
        }
    }
}

/// Renames an identifier if it's a reserved word in ES3.
fn rename_reserved_ident(i: &mut Ident, preserve_import: bool) {
    if preserve_import && i.sym == *"import" {
        return;
    }

    if i.is_reserved_in_es3() {
        i.sym = format!("_{}", i.sym).into()
    }
}
