use swc_common::util::take::Take;
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::stack_size::maybe_grow_default;

use super::context::TypeScriptCtx;
use crate::strip_type::IsConcrete;

/// Create the StripType hook
pub fn hook() -> impl VisitMutHook<TypeScriptCtx> {
    StripTypeHook
}

/// Hook that strips all TypeScript-specific syntax
struct StripTypeHook;

impl VisitMutHook<TypeScriptCtx> for StripTypeHook {
    // Set type annotations to None in ENTER hooks to prevent visiting them
    fn enter_opt_ts_type(&mut self, node: &mut Option<Box<TsType>>, _: &mut TypeScriptCtx) {
        *node = None;
    }

    fn enter_opt_ts_type_ann(&mut self, node: &mut Option<Box<TsTypeAnn>>, _: &mut TypeScriptCtx) {
        *node = None;
    }

    fn enter_opt_ts_type_param_decl(
        &mut self,
        node: &mut Option<Box<TsTypeParamDecl>>,
        _: &mut TypeScriptCtx,
    ) {
        *node = None;
    }

    fn enter_opt_ts_type_param_instantiation(
        &mut self,
        node: &mut Option<Box<TsTypeParamInstantiation>>,
        _: &mut TypeScriptCtx,
    ) {
        *node = None;
    }

    fn enter_ts_module_block(&mut self, _: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        ctx.strip_type.in_namespace = true;
    }

    fn exit_ts_module_block(&mut self, node: &mut TsModuleBlock, ctx: &mut TypeScriptCtx) {
        ctx.strip_type.in_namespace = false;
        // Note: children are already visited by VisitMutWithHook
    }

    fn exit_module_items(&mut self, n: &mut Vec<ModuleItem>, ctx: &mut TypeScriptCtx) {
        n.retain(|item| should_retain_module_item(item, ctx.strip_type.in_namespace));
    }

    fn exit_array_pat(&mut self, n: &mut ArrayPat, _: &mut TypeScriptCtx) {
        n.optional = false;
        n.type_ann = None;
    }

    fn exit_auto_accessor(&mut self, n: &mut AutoAccessor, _: &mut TypeScriptCtx) {
        n.type_ann = None;
        n.accessibility = None;
        n.definite = false;
        n.is_override = false;
        n.is_abstract = false;
    }

    fn exit_class(&mut self, n: &mut Class, _: &mut TypeScriptCtx) {
        n.is_abstract = false;
        n.implements.clear();
        n.type_params = None;
        n.super_type_params = None;
    }

    fn exit_class_members(&mut self, n: &mut Vec<ClassMember>, _: &mut TypeScriptCtx) {
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

    fn exit_class_method(&mut self, n: &mut ClassMethod, _: &mut TypeScriptCtx) {
        n.accessibility = None;
        n.is_override = false;
        n.is_abstract = false;
        n.is_optional = false;
    }

    fn exit_class_prop(&mut self, prop: &mut ClassProp, _: &mut TypeScriptCtx) {
        prop.declare = false;
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.is_abstract = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.type_ann = None;
    }

    fn exit_private_method(&mut self, n: &mut PrivateMethod, _: &mut TypeScriptCtx) {
        n.accessibility = None;
        n.is_abstract = false;
        n.is_optional = false;
        n.is_override = false;
    }

    fn exit_constructor(&mut self, n: &mut Constructor, _: &mut TypeScriptCtx) {
        n.accessibility = None;
    }

    fn exit_export_specifiers(&mut self, n: &mut Vec<ExportSpecifier>, _: &mut TypeScriptCtx) {
        n.retain(|s| match s {
            ExportSpecifier::Named(ExportNamedSpecifier { is_type_only, .. }) => !is_type_only,
            _ => true,
        })
    }

    fn exit_expr(&mut self, n: &mut Expr, _: &mut TypeScriptCtx) {
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

        maybe_grow_default(|| {});
    }

    fn exit_ident(&mut self, n: &mut Ident, _: &mut TypeScriptCtx) {
        // https://github.com/tc39/proposal-type-annotations#parameter-optionality
        n.optional = false;
    }

    fn exit_import_specifiers(&mut self, n: &mut Vec<ImportSpecifier>, _: &mut TypeScriptCtx) {
        n.retain(|s| !matches!(s, ImportSpecifier::Named(named) if named.is_type_only));
    }

    fn exit_object_pat(&mut self, pat: &mut ObjectPat, _: &mut TypeScriptCtx) {
        pat.optional = false;
        pat.type_ann = None;
    }

    fn exit_params(&mut self, n: &mut Vec<Param>, _: &mut TypeScriptCtx) {
        // https://github.com/tc39/proposal-type-annotations#this-parameters
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

    fn exit_private_prop(&mut self, prop: &mut PrivateProp, _: &mut TypeScriptCtx) {
        prop.readonly = false;
        prop.is_override = false;
        prop.is_optional = false;
        prop.definite = false;
        prop.accessibility = None;
        prop.type_ann = None;
    }

    fn exit_setter_prop(&mut self, n: &mut SetterProp, _: &mut TypeScriptCtx) {
        n.this_param = None;
    }

    fn exit_simple_assign_target(&mut self, n: &mut SimpleAssignTarget, _: &mut TypeScriptCtx) {
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

    fn exit_stmts(&mut self, n: &mut Vec<Stmt>, _: &mut TypeScriptCtx) {
        n.retain(|s| !matches!(s, Stmt::Empty(e) if e.span.is_dummy()));
    }

    fn exit_stmt(&mut self, n: &mut Stmt, _: &mut TypeScriptCtx) {
        if !should_retain_stmt(n) && !n.is_empty() {
            n.take();
        }
    }

    fn exit_function(&mut self, n: &mut Function, _: &mut TypeScriptCtx) {
        n.type_params = None;
        n.return_type = None;
    }

    fn exit_arrow_expr(&mut self, n: &mut ArrowExpr, _: &mut TypeScriptCtx) {
        n.type_params = None;
        n.return_type = None;
    }

    fn exit_fn_decl(&mut self, n: &mut FnDecl, _: &mut TypeScriptCtx) {
        n.declare = false;
    }

    fn exit_class_decl(&mut self, n: &mut ClassDecl, _: &mut TypeScriptCtx) {
        n.declare = false;
    }

    fn exit_var_decl(&mut self, n: &mut VarDecl, _: &mut TypeScriptCtx) {
        n.declare = false;
    }

    fn exit_ts_param_prop(&mut self, n: &mut TsParamProp, _: &mut TypeScriptCtx) {
        // Children are already visited
    }

    fn exit_getter_prop(&mut self, n: &mut GetterProp, _: &mut TypeScriptCtx) {
        n.type_ann = None;
    }

    fn exit_method_prop(&mut self, n: &mut MethodProp, _: &mut TypeScriptCtx) {
        // Function is already visited and cleaned
    }

    fn exit_binding_ident(&mut self, n: &mut BindingIdent, _: &mut TypeScriptCtx) {
        n.type_ann = None;
    }

    fn exit_assign_pat_prop(&mut self, n: &mut AssignPatProp, _: &mut TypeScriptCtx) {
        // Children already visited
    }

    fn exit_rest_pat(&mut self, n: &mut RestPat, _: &mut TypeScriptCtx) {
        n.type_ann = None;
    }

    fn exit_key_value_pat_prop(&mut self, n: &mut KeyValuePatProp, _: &mut TypeScriptCtx) {
        // Children already visited
    }

    fn exit_param(&mut self, n: &mut Param, _: &mut TypeScriptCtx) {
        // Pat is already cleaned
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
    if is_declare(decl) {
        return false;
    }

    decl.is_concrete()
}

fn is_declare(decl: &Decl) -> bool {
    match decl {
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
