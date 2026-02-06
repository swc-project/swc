use swc_ecma_ast::*;

/// Returns true if a module item should survive TS type-stripping.
pub(crate) fn should_retain_module_item(module_item: &ModuleItem, in_namespace: bool) -> bool {
    match module_item {
        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
            // Keep `export declare var` in namespace blocks for downstream transforms.
            if in_namespace && export_decl.decl.is_var() {
                return true;
            }

            should_retain_decl(&export_decl.decl)
        }
        ModuleItem::Stmt(stmt) => should_retain_stmt(stmt),
        _ => module_item.is_concrete(),
    }
}

/// Returns true if a statement should survive TS type-stripping.
pub(crate) fn should_retain_stmt(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Decl(decl) => should_retain_decl(decl),
        _ => stmt.is_concrete(),
    }
}

/// Returns true if a declaration has runtime semantics.
pub(crate) fn should_retain_decl(decl: &Decl) -> bool {
    if decl.is_declare() {
        return false;
    }

    decl.is_concrete()
}

pub(crate) trait IsConcrete {
    fn is_concrete(&self) -> bool;
}

impl IsConcrete for TsModuleDecl {
    fn is_concrete(&self) -> bool {
        self.body
            .as_ref()
            .map(|body| body.is_concrete())
            .unwrap_or_default()
    }
}

impl IsConcrete for TsNamespaceBody {
    fn is_concrete(&self) -> bool {
        match self {
            Self::TsModuleBlock(ts_module_block) => {
                ts_module_block.body.iter().any(|item| item.is_concrete())
            }
            Self::TsNamespaceDecl(ts_namespace_decl) => ts_namespace_decl.body.is_concrete(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl IsConcrete for ModuleItem {
    fn is_concrete(&self) -> bool {
        match self {
            Self::ModuleDecl(module_decl) => module_decl.is_concrete(),
            Self::Stmt(stmt) => stmt.is_concrete(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl IsConcrete for ModuleDecl {
    fn is_concrete(&self) -> bool {
        match self {
            Self::Import(import_decl) => !import_decl.type_only,
            Self::ExportDecl(export_decl) => export_decl.decl.is_concrete(),
            Self::ExportNamed(named_export) => !named_export.type_only,
            Self::ExportDefaultDecl(export_default_decl) => export_default_decl.decl.is_concrete(),
            Self::ExportDefaultExpr(..) => true,
            Self::ExportAll(export_all) => !export_all.type_only,
            Self::TsImportEquals(ts_import_equals) => !ts_import_equals.is_type_only,
            Self::TsExportAssignment(..) => true,
            Self::TsNamespaceExport(..) => false,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl IsConcrete for Decl {
    fn is_concrete(&self) -> bool {
        match self {
            Self::TsInterface(..) | Self::TsTypeAlias(..) => false,
            Self::Fn(function_decl) => function_decl.function.body.is_some(),
            Self::Class(..) | Self::Var(..) | Self::Using(..) | Self::TsEnum(..) => true,
            Self::TsModule(ts_module) => ts_module.is_concrete(),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl IsConcrete for DefaultDecl {
    fn is_concrete(&self) -> bool {
        match self {
            Self::Class(..) => true,
            Self::Fn(function_expr) => function_expr.function.body.is_some(),
            Self::TsInterfaceDecl(..) => false,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

impl IsConcrete for Stmt {
    fn is_concrete(&self) -> bool {
        match self {
            Self::Empty(..) => false,
            Self::Decl(decl) => decl.is_concrete(),
            _ => true,
        }
    }
}

trait IsDeclare {
    fn is_declare(&self) -> bool;
}

impl IsDeclare for Decl {
    fn is_declare(&self) -> bool {
        match self {
            Decl::Class(class_decl) => class_decl.declare,
            Decl::Fn(function_decl) => function_decl.declare,
            Decl::Var(var_decl) => var_decl.declare,
            Decl::Using(..) => false,
            Decl::TsInterface(..) | Decl::TsTypeAlias(..) => true,
            Decl::TsEnum(ts_enum_decl) => ts_enum_decl.declare,
            Decl::TsModule(ts_module_decl) => ts_module_decl.declare || ts_module_decl.global,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}
