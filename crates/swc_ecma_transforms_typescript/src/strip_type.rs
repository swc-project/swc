use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

pub fn hook() -> StripType {
    StripType::default()
}

/// This Module will strip all types/generics/interface/declares
/// and type import/export.
///
/// `export declare var` in a namespace will be retained.
#[derive(Default)]
pub(crate) struct StripType {
    in_namespace: bool,
}

impl VisitMutHook<()> for StripType {
    fn enter_opt_ts_type(&mut self, node: &mut Option<Box<TsType>>, _ctx: &mut ()) {
        *node = None;
    }

    fn enter_opt_ts_type_ann(&mut self, node: &mut Option<Box<TsTypeAnn>>, _ctx: &mut ()) {
        *node = None;
    }

    fn enter_opt_ts_type_param_decl(
        &mut self,
        node: &mut Option<Box<TsTypeParamDecl>>,
        _ctx: &mut (),
    ) {
        *node = None;
    }

    fn enter_opt_ts_type_param_instantiation(
        &mut self,
        node: &mut Option<Box<TsTypeParamInstantiation>>,
        _ctx: &mut (),
    ) {
        *node = None;
    }

    fn exit_array_pat(&mut self, n: &mut ArrayPat, _ctx: &mut ()) {
        n.optional = false;
    }

    fn exit_auto_accessor(&mut self, n: &mut AutoAccessor, _ctx: &mut ()) {
        n.type_ann = None;
        n.accessibility = None;
        n.definite = false;
        n.is_override = false;
        n.is_abstract = false;
    }

    fn exit_class(&mut self, n: &mut Class, _ctx: &mut ()) {
        n.is_abstract = false;
        n.implements.clear();
    }

    fn enter_class_members(&mut self, n: &mut Vec<ClassMember>, _ctx: &mut ()) {
        n.retain(|member| match member {
            ClassMember::TsIndexSignature(..) => false,
            ClassMember::Constructor(Constructor { body: None, .. }) => false,

            ClassMember::Method(ClassMethod {
                is_abstract,
                function,
                ..
            })
            | ClassMember::PrivateMethod(PrivateMethod {
                is_abstract,
                function,
                ..
            }) => !is_abstract && function.body.is_some(),

            ClassMember::ClassProp(
                ClassProp { declare: true, .. }
                | ClassProp {
                    is_abstract: true, ..
                },
            )
            | ClassMember::AutoAccessor(AutoAccessor {
                is_abstract: true, ..
            }) => false,

            _ => true,
        });
    }

    fn exit_class_method(&mut self, n: &mut ClassMethod, _ctx: &mut ()) {
        n.accessibility = None;
        n.is_override = false;
        n.is_abstract = false;
        n.is_optional = false;
    }

    fn exit_class_prop(&mut self, prop: &mut ClassProp, _ctx: &mut ()) {
        prop.declare = false;
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.is_abstract = false;
        prop.definite = false;
        prop.accessibility = None;
    }

    fn exit_private_method(&mut self, n: &mut PrivateMethod, _ctx: &mut ()) {
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
    }

    fn exit_constructor(&mut self, n: &mut Constructor, _ctx: &mut ()) {
        n.accessibility = None;
    }

    fn enter_export_specifiers(&mut self, n: &mut Vec<ExportSpecifier>, _ctx: &mut ()) {
        n.retain(|s| match s {
            ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => !is_type_only,
            _ => true,
        })
    }

    fn enter_expr(&mut self, n: &mut Expr, _ctx: &mut ()) {
        // https://github.com/tc39/proposal-type-annotations#type-assertions
        // https://github.com/tc39/proposal-type-annotations#non-nullable-assertions
        while let Expr::TsAs(TsAsExpr { expr, .. })
        | Expr::TsNonNull(TsNonNullExpr { expr, .. })
        | Expr::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | Expr::TsConstAssertion(TsConstAssertion { expr, .. })
        | Expr::TsInstantiation(TsInstantiation { expr, .. })
        | Expr::TsSatisfies(TsSatisfiesExpr { expr, .. }) = n
        {
            *n = *expr.take();
        }
    }

    // https://github.com/tc39/proposal-type-annotations#parameter-optionality
    fn exit_ident(&mut self, n: &mut Ident, _ctx: &mut ()) {
        n.optional = false;
    }

    fn enter_import_specifiers(&mut self, n: &mut Vec<ImportSpecifier>, _ctx: &mut ()) {
        n.retain(|s| !matches!(s, ImportSpecifier::Named(named) if named.is_type_only));
    }

    fn enter_ts_module_block(&mut self, _node: &mut TsModuleBlock, _ctx: &mut ()) {
        self.in_namespace = true;
    }

    fn exit_ts_module_block(&mut self, _node: &mut TsModuleBlock, _ctx: &mut ()) {
        self.in_namespace = false;
    }

    fn enter_module_items(&mut self, n: &mut Vec<ModuleItem>, _ctx: &mut ()) {
        n.retain(|item| should_retain_module_item(item, self.in_namespace));
    }

    fn exit_object_pat(&mut self, pat: &mut ObjectPat, _ctx: &mut ()) {
        pat.optional = false;
    }

    // https://github.com/tc39/proposal-type-annotations#this-parameters
    fn enter_params(&mut self, n: &mut Vec<Param>, _ctx: &mut ()) {
        if n.first()
            .filter(|param| {
                matches!(
                    &param.pat,
                    Pat::Ident(BindingIdent {
                        id: Ident { sym, .. },
                        ..
                    }) if &**sym == "this"
                )
            })
            .is_some()
        {
            n.drain(0..1);
        }
    }

    fn exit_private_prop(&mut self, prop: &mut PrivateProp, _ctx: &mut ()) {
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.definite = false;
        prop.accessibility = None;
    }

    fn exit_setter_prop(&mut self, n: &mut SetterProp, _ctx: &mut ()) {
        n.this_param = None;
    }

    fn enter_simple_assign_target(&mut self, n: &mut SimpleAssignTarget, _ctx: &mut ()) {
        // https://github.com/tc39/proposal-type-annotations#type-assertions
        // https://github.com/tc39/proposal-type-annotations#non-nullable-assertions
        while let SimpleAssignTarget::TsAs(TsAsExpr { expr, .. })
        | SimpleAssignTarget::TsNonNull(TsNonNullExpr { expr, .. })
        | SimpleAssignTarget::TsTypeAssertion(TsTypeAssertion { expr, .. })
        | SimpleAssignTarget::TsInstantiation(TsInstantiation { expr, .. })
        | SimpleAssignTarget::TsSatisfies(TsSatisfiesExpr { expr, .. }) = n
        {
            *n = expr.take().try_into().unwrap();
        }
    }

    fn exit_stmts(&mut self, n: &mut Vec<Stmt>, _ctx: &mut ()) {
        n.retain(|s| !matches!(s, Stmt::Empty(e) if e.span.is_dummy()));
    }

    fn enter_stmt(&mut self, n: &mut Stmt, _ctx: &mut ()) {
        if !should_retain_stmt(n) && !n.is_empty() {
            n.take();
        }
    }
}

fn should_retain_module_item(module_item: &ModuleItem, in_namespace: bool) -> bool {
    match module_item {
        ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
            // https://github.com/swc-project/swc/issues/9821
            // `export declare var` in namespace should be retained
            // This will help the following transforms to work correctly
            if in_namespace && export_decl.decl.is_var() {
                return true;
            }

            should_retain_decl(&export_decl.decl)
        }
        ModuleItem::Stmt(stmt) => should_retain_stmt(stmt),
        _ => module_item.is_concrete(),
    }
}

fn should_retain_stmt(stmt: &Stmt) -> bool {
    match stmt {
        Stmt::Decl(decl) => should_retain_decl(decl),
        _ => stmt.is_concrete(),
    }
}

fn should_retain_decl(decl: &Decl) -> bool {
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
            Self::Fn(r#fn) => r#fn.function.body.is_some(),
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
            Self::Class(_) => true,
            Self::Fn(r#fn) => r#fn.function.body.is_some(),
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
            Decl::Class(class) => class.declare,
            Decl::Fn(r#fn) => r#fn.declare,
            Decl::Var(var) => var.declare,
            Decl::Using(_) => false,
            // NOTE: TsInterface/TsTypeAlias is not relevant
            Decl::TsInterface(_) | Decl::TsTypeAlias(_) => true,
            Decl::TsEnum(ts_enum) => ts_enum.declare,
            Decl::TsModule(ts_module) => ts_module.declare || ts_module.global,
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}
