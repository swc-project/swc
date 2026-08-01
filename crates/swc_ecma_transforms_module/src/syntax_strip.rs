use swc_atoms::atom;
use swc_ecma_ast::*;
use swc_ecma_utils::{private_ident, ExprFactory};

use crate::module_record::{
    LocalExportEntries, LocalExportEntry, RequestedModules, SourceModule, SourceModuleItem,
};

/// Source module after module syntax is stripped from the executable body.
#[derive(Debug)]
pub(crate) struct SyntaxStrippedModule {
    pub directives: Vec<Stmt>,
    pub has_use_strict: bool,
    pub requested_modules: RequestedModules,
    pub local_export_entries: LocalExportEntries,
    pub export_assign: Option<Box<Expr>>,
    pub body: Vec<ModuleItem>,
    pub has_module_syntax: bool,
}

pub(crate) fn lower(source: SourceModule, const_var_kind: VarDeclKind) -> SyntaxStrippedModule {
    let SourceModule {
        directives,
        has_use_strict,
        requested_modules,
        mut local_export_entries,
        ts_export_assignment,
        body,
        has_module_syntax,
    } = source;
    let mut lowered_body = Vec::with_capacity(body.len());

    for item in body {
        match item {
            SourceModuleItem::Stmt(stmt) => lowered_body.push(stmt.into()),
            SourceModuleItem::ExportDecl(export) => lowered_body.push(export.decl.into()),
            SourceModuleItem::ExportDefaultDecl(export) => {
                lowered_body.extend(lower_export_default_decl(export, &mut local_export_entries));
            }
            SourceModuleItem::ExportDefaultExpr(export) => {
                lowered_body.push(lower_export_default_expr(
                    export,
                    &mut local_export_entries,
                    const_var_kind,
                ));
            }
            SourceModuleItem::TsImportEquals(import) => {
                lowered_body.push(ModuleDecl::TsImportEquals(import).into());
            }
        }
    }

    SyntaxStrippedModule {
        directives,
        has_use_strict,
        requested_modules,
        local_export_entries,
        export_assign: ts_export_assignment,
        body: lowered_body,
        has_module_syntax,
    }
}

fn lower_export_default_decl(
    export: ExportDefaultDecl,
    local_export_entries: &mut LocalExportEntries,
) -> Option<ModuleItem> {
    match export.decl {
        DefaultDecl::Class(mut class_expr) => {
            let ident = class_expr
                .ident
                .get_or_insert_with(|| private_ident!(export.span, "_default"))
                .clone();

            local_export_entries.insert(
                atom!("default"),
                LocalExportEntry::new((export.span, Default::default()), ident),
            );

            class_expr.as_class_decl().map(From::from)
        }
        DefaultDecl::Fn(mut fn_expr) => {
            let ident = fn_expr
                .ident
                .get_or_insert_with(|| private_ident!(export.span, "_default"))
                .clone();

            local_export_entries.insert(
                atom!("default"),
                LocalExportEntry::new((export.span, Default::default()), ident),
            );

            fn_expr.as_fn_decl().map(From::from)
        }
        DefaultDecl::TsInterfaceDecl(_) => None,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

fn lower_export_default_expr(
    export: ExportDefaultExpr,
    local_export_entries: &mut LocalExportEntries,
    const_var_kind: VarDeclKind,
) -> ModuleItem {
    let ident = private_ident!(export.span, "_default");

    local_export_entries.insert(
        atom!("default"),
        LocalExportEntry::new((export.span, Default::default()), ident.clone()),
    );

    let stmt: Stmt = export
        .expr
        .into_var_decl(const_var_kind, ident.into())
        .into();

    stmt.into()
}
