//! Direct namespace value contributions. Nested bodies contribute on exit from
//! the collector's ordinary declaration walk, so each body is inspected once.

use super::*;

pub(super) fn item_has_value(item: &ModuleItem) -> bool {
    match item {
        ModuleItem::Stmt(Stmt::Decl(declaration))
        | ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl {
            decl: declaration,
            ..
        })) => !matches!(
            declaration,
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) | Decl::TsModule(_)
        ),
        ModuleItem::ModuleDecl(ModuleDecl::TsImportEquals(alias)) => {
            // An exported alias instantiates its namespace even when its
            // target is erased. A private import alone does not instantiate it.
            alias.is_export && !alias.is_type_only
        }
        ModuleItem::ModuleDecl(ModuleDecl::ExportNamed(export)) => {
            !export.type_only
                && export.specifiers.iter().any(
                    |specifier| matches!(specifier, ExportSpecifier::Named(named) if !named.is_type_only),
                )
        }
        ModuleItem::Stmt(Stmt::Empty(_))
        | ModuleItem::ModuleDecl(ModuleDecl::TsNamespaceExport(_)) => false,
        _ => true,
    }
}
