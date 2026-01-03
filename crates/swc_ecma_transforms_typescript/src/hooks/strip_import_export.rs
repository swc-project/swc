use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMutWith, VisitWith};

use super::context::TypeScriptCtx;
use crate::strip_import_export::UsageCollect;

pub fn hook() -> impl VisitMutHook<TypeScriptCtx> {
    StripImportExportHook
}

struct StripImportExportHook;

impl VisitMutHook<TypeScriptCtx> for StripImportExportHook {
    fn enter_ts_module_block(&mut self, _n: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        ctx.strip_import_export.in_namespace = true;
    }

    fn exit_ts_module_block(&mut self, _n: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        ctx.strip_import_export.in_namespace = false;
    }

    fn enter_module(&mut self, n: &mut Module, ctx: &mut TypeScriptCtx) {
        // Collect usage information
        n.visit_with(&mut ctx.strip_import_export.usage_info);
        n.visit_with(&mut ctx.strip_import_export.declare_info);

        ctx.strip_import_export.usage_info.analyze_import_chain();
    }

    fn exit_module_items(&mut self, n: &mut Vec<ModuleItem>, ctx: &mut TypeScriptCtx) {
        let mut strip_ts_import_equals = StripTsImportEquals;

        n.retain_mut(|module_item| match module_item {
            ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                specifiers,
                type_only: false,
                ..
            })) if !specifiers.is_empty() => {
                // Note: If import specifiers is originally empty, then we leave it alone.
                // This is weird but it matches TS.

                specifiers.retain(|import_specifier| match import_specifier {
                    ImportSpecifier::Named(named) => {
                        if named.is_type_only {
                            return false;
                        }

                        let id = named.local.to_id();

                        if ctx.strip_import_export.declare_info.has_value(&id) {
                            return false;
                        }

                        ctx.strip_import_export.usage_info.has_usage(&id)
                    }
                    ImportSpecifier::Default(default) => {
                        let id = default.local.to_id();

                        if ctx.strip_import_export.declare_info.has_value(&id) {
                            return false;
                        }

                        ctx.strip_import_export.usage_info.has_usage(&id)
                    }
                    ImportSpecifier::Namespace(namespace) => {
                        let id = namespace.local.to_id();

                        if ctx.strip_import_export.declare_info.has_value(&id) {
                            return false;
                        }

                        ctx.strip_import_export.usage_info.has_usage(&id)
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                ctx.strip_import_export.import_not_used_as_values
                    == crate::config::ImportsNotUsedAsValues::Preserve
                    || !specifiers.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                specifiers,
                src,
                type_only: false,
                ..
            })) => {
                specifiers.retain(|export_specifier| match export_specifier {
                    ExportSpecifier::Namespace(..) => true,
                    ExportSpecifier::Default(..) => true,

                    ExportSpecifier::Named(ExportNamedSpecifier {
                        orig: ModuleExportName::Ident(ident),
                        is_type_only: false,
                        ..
                    }) if src.is_none() => {
                        let id = ident.to_id();

                        !ctx.strip_import_export.declare_info.has_pure_type(&id)
                    }
                    ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => {
                        !is_type_only
                    }
                    #[cfg(swc_ast_unknown)]
                    _ => panic!("unable to access unknown nodes"),
                });

                !specifiers.is_empty()
            }
            ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(NamedExport {
                ref type_only, ..
            })) => !type_only,
            ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(ExportDefaultExpr {
                ref expr,
                ..
            })) => expr
                .as_ident()
                .map(|ident| {
                    let id = ident.to_id();

                    !ctx.strip_import_export.declare_info.has_pure_type(&id)
                })
                .unwrap_or(true),
            ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(ts_import_equals_decl)) => {
                if ts_import_equals_decl.is_type_only {
                    return false;
                }

                // In namespaces, TsImportEquals will be transformed by Transform hook
                // Don't filter them here
                if ctx.strip_import_export.in_namespace {
                    return true;
                }

                if ts_import_equals_decl.is_export {
                    return true;
                }

                ctx.strip_import_export
                    .usage_info
                    .has_usage(&ts_import_equals_decl.id.to_id())
            }
            ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(ref ts_module)))
                if ts_module.body.is_some() =>
            {
                // Don't apply StripTsImportEquals inside namespaces
                // Transform hook will handle TsImportEquals transformation
                // Only apply if we're not already in a namespace
                if !ctx.strip_import_export.in_namespace {
                    module_item.visit_mut_with(&mut strip_ts_import_equals);
                }

                true
            }
            _ => true,
        });
    }

    fn enter_script(&mut self, n: &mut Script, _ctx: &mut TypeScriptCtx) {
        let mut visitor = StripTsImportEquals;
        for stmt in n.body.iter_mut() {
            if let Stmt::Decl(Decl::TsModule(..)) = stmt {
                stmt.visit_mut_with(&mut visitor);
            }
        }
    }
}

/// Helper visitor for stripping TsImportEquals in namespaces
struct StripTsImportEquals;

impl swc_ecma_visit::VisitMut for StripTsImportEquals {
    fn visit_mut_module_items(&mut self, n: &mut Vec<ModuleItem>) {
        let has_ts_import_equals = n.iter().any(|module_item| {
            matches!(
                module_item,
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(..))
            )
        });

        // TS1235: A namespace declaration is only allowed at the top level of a
        // namespace or module.
        let has_ts_module = n.iter().any(|module_item| {
            matches!(
                module_item,
                ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(..)))
            )
        });

        if has_ts_import_equals {
            let mut usage_info = UsageCollect::default();

            n.visit_with(&mut usage_info);

            n.retain(|module_item| match module_item {
                ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(ts_import_equals_decl)) => {
                    if ts_import_equals_decl.is_type_only {
                        return false;
                    }

                    if ts_import_equals_decl.is_export {
                        return true;
                    }

                    usage_info.has_usage(&ts_import_equals_decl.id.to_id())
                }
                _ => true,
            })
        }

        if has_ts_module {
            n.visit_mut_children_with(self);
        }
    }

    fn visit_mut_module_item(&mut self, n: &mut ModuleItem) {
        if let ModuleItem::Stmt(Stmt::Decl(Decl::TsModule(ref ts_module))) = n {
            if ts_module.body.is_some() {
                n.visit_mut_children_with(self)
            }
        }
    }
}
