use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{visit_mut_pass, VisitMut};

pub fn strip_type() -> impl VisitMut {
    visit_mut_pass(swc_ecma_hooks::VisitMutWithHook {
        hook: hook(),
        context: (),
    })
}

/// Returns a hook that strips all TypeScript types, generics, interfaces, and
/// type declarations.
///
/// `export declare var` in a namespace will be retained.
pub fn hook() -> impl VisitMutHook<()> {
    StripType::default()
}

#[derive(Default)]
pub(crate) struct StripType {
    in_namespace: bool,
}

impl VisitMutHook<()> for StripType {
    // Strip type annotations from patterns
    fn enter_binding_ident(&mut self, n: &mut BindingIdent, _: &mut ()) {
        n.type_ann = None;
    }

    fn enter_array_pat(&mut self, n: &mut ArrayPat, _: &mut ()) {
        n.optional = false;
        n.type_ann = None;
    }

    fn enter_object_pat(&mut self, pat: &mut ObjectPat, _: &mut ()) {
        pat.optional = false;
        pat.type_ann = None;
    }

    fn enter_rest_pat(&mut self, n: &mut RestPat, _: &mut ()) {
        n.type_ann = None;
    }

    // Strip type annotations from function-related nodes
    fn enter_function(&mut self, n: &mut Function, _: &mut ()) {
        n.return_type = None;
        n.type_params = None;
    }

    fn enter_arrow_expr(&mut self, n: &mut ArrowExpr, _: &mut ()) {
        n.return_type = None;
        n.type_params = None;
    }

    // Strip type parameters from call/new expressions
    fn enter_call_expr(&mut self, n: &mut CallExpr, _: &mut ()) {
        n.type_args = None;
    }

    fn enter_new_expr(&mut self, n: &mut NewExpr, _: &mut ()) {
        n.type_args = None;
    }

    fn enter_tagged_tpl(&mut self, n: &mut TaggedTpl, _: &mut ()) {
        n.type_params = None;
    }

    // Strip type arguments from JSX
    fn enter_jsx_opening_element(&mut self, n: &mut JSXOpeningElement, _: &mut ()) {
        n.type_args = None;
    }

    // Strip types from class-related nodes
    fn enter_class(&mut self, n: &mut Class, _: &mut ()) {
        n.is_abstract = false;
        n.implements.clear();
        n.type_params = None;
        n.super_type_params = None;
    }

    // Filter class members BEFORE children are visited (so abstract/declare flags
    // are still set)
    fn enter_class_members(&mut self, n: &mut Vec<ClassMember>, _: &mut ()) {
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

    fn enter_class_method(&mut self, n: &mut ClassMethod, _: &mut ()) {
        n.accessibility = None;
        n.is_override = false;
        n.is_abstract = false;
        n.is_optional = false;
    }

    fn enter_class_prop(&mut self, prop: &mut ClassProp, _: &mut ()) {
        prop.declare = false;
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.is_abstract = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.type_ann = None;
    }

    fn enter_private_method(&mut self, n: &mut PrivateMethod, _: &mut ()) {
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
    }

    fn enter_private_prop(&mut self, prop: &mut PrivateProp, _: &mut ()) {
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.type_ann = None;
    }

    fn enter_constructor(&mut self, n: &mut Constructor, _: &mut ()) {
        n.accessibility = None;
    }

    fn enter_auto_accessor(&mut self, n: &mut AutoAccessor, _: &mut ()) {
        n.type_ann = None;
        n.accessibility = None;
        n.definite = false;
        n.is_override = false;
        n.is_abstract = false;
    }

    // Strip types from other nodes
    fn enter_getter_prop(&mut self, n: &mut GetterProp, _: &mut ()) {
        n.type_ann = None;
    }

    fn enter_setter_prop(&mut self, n: &mut SetterProp, _: &mut ()) {
        n.this_param = None;
    }

    // Strip type assertions from expressions
    fn enter_expr(&mut self, n: &mut Expr, _: &mut ()) {
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

    fn enter_simple_assign_target(&mut self, n: &mut SimpleAssignTarget, _: &mut ()) {
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

    // https://github.com/tc39/proposal-type-annotations#parameter-optionality
    fn enter_ident(&mut self, n: &mut Ident, _: &mut ()) {
        n.optional = false;
    }

    // Strip type-only specifiers
    fn exit_export_specifiers(&mut self, n: &mut Vec<ExportSpecifier>, _: &mut ()) {
        n.retain(|s| match s {
            ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => !is_type_only,
            _ => true,
        })
    }

    fn exit_import_specifiers(&mut self, n: &mut Vec<ImportSpecifier>, _: &mut ()) {
        n.retain(|s| !matches!(s, ImportSpecifier::Named(named) if named.is_type_only));
    }

    // Handle namespace context for module items
    fn enter_ts_module_block(&mut self, _node: &mut TsModuleBlock, _: &mut ()) {
        self.in_namespace = true;
    }

    fn exit_ts_module_block(&mut self, _node: &mut TsModuleBlock, _: &mut ()) {
        self.in_namespace = false;
    }

    fn exit_module_items(&mut self, n: &mut Vec<ModuleItem>, _: &mut ()) {
        let in_namespace = self.in_namespace;
        n.retain(|item| should_retain_module_item(item, in_namespace));
    }

    // https://github.com/tc39/proposal-type-annotations#this-parameters
    fn exit_params(&mut self, n: &mut Vec<Param>, _: &mut ()) {
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

    fn exit_stmts(&mut self, n: &mut Vec<Stmt>, _: &mut ()) {
        n.retain(|s| !matches!(s, Stmt::Empty(e) if e.span.is_dummy()));
    }

    fn enter_stmt(&mut self, n: &mut Stmt, _: &mut ()) {
        if !should_retain_stmt(n) && !n.is_empty() {
            n.take();
        }
    }

    fn enter_ts_param_prop(&mut self, _n: &mut TsParamProp, _: &mut ()) {
        // skip accessibility - only visit decorators and param
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
