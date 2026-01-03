use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use super::context::TypeScriptCtx;

/// A hook that does nothing - useful as a base for building hook chains
pub(crate) struct NoopHook;

impl VisitMutHook<TypeScriptCtx> for NoopHook {}

/// Optional hook wrapper - executes the inner hook only if it's Some
pub(crate) struct OptionalHook<H>(pub Option<H>)
where
    H: VisitMutHook<TypeScriptCtx>;

macro_rules! optional_method {
    ($enter_name:ident, $exit_name:ident, $T:ty) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut TypeScriptCtx) {
            if let Some(hook) = &mut self.0 {
                hook.$enter_name(node, ctx);
            }
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut TypeScriptCtx) {
            if let Some(hook) = &mut self.0 {
                hook.$exit_name(node, ctx);
            }
        }
    };
}

impl<H> VisitMutHook<TypeScriptCtx> for OptionalHook<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    optional_method!(enter_expr, exit_expr, Expr);

    optional_method!(enter_stmt, exit_stmt, Stmt);

    optional_method!(enter_stmts, exit_stmts, Vec<Stmt>);

    optional_method!(enter_module_item, exit_module_item, ModuleItem);

    optional_method!(enter_module_items, exit_module_items, Vec<ModuleItem>);

    optional_method!(enter_module, exit_module, Module);

    optional_method!(enter_script, exit_script, Script);

    optional_method!(enter_program, exit_program, Program);

    optional_method!(enter_class, exit_class, Class);

    optional_method!(enter_class_members, exit_class_members, Vec<ClassMember>);

    optional_method!(enter_constructor, exit_constructor, Constructor);

    optional_method!(enter_ts_enum_decl, exit_ts_enum_decl, TsEnumDecl);

    optional_method!(enter_ts_module_decl, exit_ts_module_decl, TsModuleDecl);

    optional_method!(
        enter_ts_namespace_decl,
        exit_ts_namespace_decl,
        TsNamespaceDecl
    );

    optional_method!(enter_ts_module_block, exit_ts_module_block, TsModuleBlock);

    optional_method!(enter_export_decl, exit_export_decl, ExportDecl);

    optional_method!(
        enter_export_default_decl,
        exit_export_default_decl,
        ExportDefaultDecl
    );

    optional_method!(
        enter_export_default_expr,
        exit_export_default_expr,
        ExportDefaultExpr
    );

    optional_method!(
        enter_export_named_specifier,
        exit_export_named_specifier,
        ExportNamedSpecifier
    );

    optional_method!(
        enter_ts_import_equals_decl,
        exit_ts_import_equals_decl,
        TsImportEqualsDecl
    );

    optional_method!(enter_pat, exit_pat, Pat);

    optional_method!(enter_prop, exit_prop, Prop);

    optional_method!(enter_var_declarator, exit_var_declarator, VarDeclarator);

    optional_method!(enter_assign_expr, exit_assign_expr, AssignExpr);

    optional_method!(enter_assign_pat, exit_assign_pat, AssignPat);

    optional_method!(enter_update_expr, exit_update_expr, UpdateExpr);

    optional_method!(enter_assign_pat_prop, exit_assign_pat_prop, AssignPatProp);

    optional_method!(enter_member_expr, exit_member_expr, MemberExpr);

    optional_method!(
        enter_simple_assign_target,
        exit_simple_assign_target,
        SimpleAssignTarget
    );

    optional_method!(
        enter_jsx_element_name,
        exit_jsx_element_name,
        JSXElementName
    );

    optional_method!(enter_jsx_object, exit_jsx_object, JSXObject);

    optional_method!(enter_object_pat_prop, exit_object_pat_prop, ObjectPatProp);

    optional_method!(enter_auto_accessor, exit_auto_accessor, AutoAccessor);

    optional_method!(enter_getter_prop, exit_getter_prop, GetterProp);

    optional_method!(enter_setter_prop, exit_setter_prop, SetterProp);

    optional_method!(enter_method_prop, exit_method_prop, MethodProp);

    optional_method!(enter_private_prop, exit_private_prop, PrivateProp);

    optional_method!(enter_class_prop, exit_class_prop, ClassProp);

    optional_method!(enter_class_method, exit_class_method, ClassMethod);

    optional_method!(enter_private_method, exit_private_method, PrivateMethod);

    optional_method!(enter_binding_ident, exit_binding_ident, BindingIdent);

    optional_method!(enter_array_pat, exit_array_pat, ArrayPat);

    optional_method!(enter_object_pat, exit_object_pat, ObjectPat);

    optional_method!(enter_rest_pat, exit_rest_pat, RestPat);

    optional_method!(enter_function, exit_function, Function);

    optional_method!(enter_arrow_expr, exit_arrow_expr, ArrowExpr);

    optional_method!(enter_fn_decl, exit_fn_decl, FnDecl);

    optional_method!(enter_class_decl, exit_class_decl, ClassDecl);

    optional_method!(enter_var_decl, exit_var_decl, VarDecl);

    optional_method!(enter_param, exit_param, Param);

    optional_method!(enter_params, exit_params, Vec<Param>);

    optional_method!(enter_ident, exit_ident, Ident);

    optional_method!(
        enter_key_value_pat_prop,
        exit_key_value_pat_prop,
        KeyValuePatProp
    );

    optional_method!(enter_ts_param_prop, exit_ts_param_prop, TsParamProp);

    optional_method!(
        enter_export_specifiers,
        exit_export_specifiers,
        Vec<ExportSpecifier>
    );

    optional_method!(
        enter_import_specifiers,
        exit_import_specifiers,
        Vec<ImportSpecifier>
    );

    optional_method!(enter_opt_ts_type, exit_opt_ts_type, Option<Box<TsType>>);

    optional_method!(
        enter_opt_ts_type_ann,
        exit_opt_ts_type_ann,
        Option<Box<TsTypeAnn>>
    );

    optional_method!(
        enter_opt_ts_type_param_decl,
        exit_opt_ts_type_param_decl,
        Option<Box<TsTypeParamDecl>>
    );

    optional_method!(
        enter_opt_ts_type_param_instantiation,
        exit_opt_ts_type_param_instantiation,
        Option<Box<TsTypeParamInstantiation>>
    );
}

/// Ordered chain of two hooks - executes A then B for both enter and exit
macro_rules! chained_method {
    ($enter_name:ident, $exit_name:ident, $T:ty) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut TypeScriptCtx) {
            self.0.$enter_name(node, ctx);
            self.1.$enter_name(node, ctx);
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut TypeScriptCtx) {
            self.0.$exit_name(node, ctx);
            self.1.$exit_name(node, ctx);
        }
    };
}

pub(crate) struct OrderedChain<A, B>(pub A, pub B)
where
    A: VisitMutHook<TypeScriptCtx>,
    B: VisitMutHook<TypeScriptCtx>;

impl<A, B> VisitMutHook<TypeScriptCtx> for OrderedChain<A, B>
where
    A: VisitMutHook<TypeScriptCtx>,
    B: VisitMutHook<TypeScriptCtx>,
{
    chained_method!(enter_expr, exit_expr, Expr);

    chained_method!(enter_stmt, exit_stmt, Stmt);

    chained_method!(enter_stmts, exit_stmts, Vec<Stmt>);

    chained_method!(enter_module_item, exit_module_item, ModuleItem);

    chained_method!(enter_module_items, exit_module_items, Vec<ModuleItem>);

    chained_method!(enter_module, exit_module, Module);

    chained_method!(enter_script, exit_script, Script);

    chained_method!(enter_program, exit_program, Program);

    chained_method!(enter_class, exit_class, Class);

    chained_method!(enter_class_members, exit_class_members, Vec<ClassMember>);

    chained_method!(enter_constructor, exit_constructor, Constructor);

    chained_method!(enter_ts_enum_decl, exit_ts_enum_decl, TsEnumDecl);

    chained_method!(enter_ts_module_decl, exit_ts_module_decl, TsModuleDecl);

    chained_method!(
        enter_ts_namespace_decl,
        exit_ts_namespace_decl,
        TsNamespaceDecl
    );

    chained_method!(enter_ts_module_block, exit_ts_module_block, TsModuleBlock);

    chained_method!(enter_export_decl, exit_export_decl, ExportDecl);

    chained_method!(
        enter_export_default_decl,
        exit_export_default_decl,
        ExportDefaultDecl
    );

    chained_method!(
        enter_export_default_expr,
        exit_export_default_expr,
        ExportDefaultExpr
    );

    chained_method!(
        enter_export_named_specifier,
        exit_export_named_specifier,
        ExportNamedSpecifier
    );

    chained_method!(
        enter_ts_import_equals_decl,
        exit_ts_import_equals_decl,
        TsImportEqualsDecl
    );

    chained_method!(enter_pat, exit_pat, Pat);

    chained_method!(enter_prop, exit_prop, Prop);

    chained_method!(enter_var_declarator, exit_var_declarator, VarDeclarator);

    chained_method!(enter_assign_expr, exit_assign_expr, AssignExpr);

    chained_method!(enter_assign_pat, exit_assign_pat, AssignPat);

    chained_method!(enter_update_expr, exit_update_expr, UpdateExpr);

    chained_method!(enter_assign_pat_prop, exit_assign_pat_prop, AssignPatProp);

    chained_method!(enter_member_expr, exit_member_expr, MemberExpr);

    chained_method!(
        enter_simple_assign_target,
        exit_simple_assign_target,
        SimpleAssignTarget
    );

    chained_method!(
        enter_jsx_element_name,
        exit_jsx_element_name,
        JSXElementName
    );

    chained_method!(enter_jsx_object, exit_jsx_object, JSXObject);

    chained_method!(enter_object_pat_prop, exit_object_pat_prop, ObjectPatProp);

    chained_method!(enter_auto_accessor, exit_auto_accessor, AutoAccessor);

    chained_method!(enter_getter_prop, exit_getter_prop, GetterProp);

    chained_method!(enter_setter_prop, exit_setter_prop, SetterProp);

    chained_method!(enter_method_prop, exit_method_prop, MethodProp);

    chained_method!(enter_private_prop, exit_private_prop, PrivateProp);

    chained_method!(enter_class_prop, exit_class_prop, ClassProp);

    chained_method!(enter_class_method, exit_class_method, ClassMethod);

    chained_method!(enter_private_method, exit_private_method, PrivateMethod);

    chained_method!(enter_binding_ident, exit_binding_ident, BindingIdent);

    chained_method!(enter_array_pat, exit_array_pat, ArrayPat);

    chained_method!(enter_object_pat, exit_object_pat, ObjectPat);

    chained_method!(enter_rest_pat, exit_rest_pat, RestPat);

    chained_method!(enter_function, exit_function, Function);

    chained_method!(enter_arrow_expr, exit_arrow_expr, ArrowExpr);

    chained_method!(enter_fn_decl, exit_fn_decl, FnDecl);

    chained_method!(enter_class_decl, exit_class_decl, ClassDecl);

    chained_method!(enter_var_decl, exit_var_decl, VarDecl);

    chained_method!(enter_param, exit_param, Param);

    chained_method!(enter_params, exit_params, Vec<Param>);

    chained_method!(enter_ident, exit_ident, Ident);

    chained_method!(
        enter_key_value_pat_prop,
        exit_key_value_pat_prop,
        KeyValuePatProp
    );

    chained_method!(enter_ts_param_prop, exit_ts_param_prop, TsParamProp);

    chained_method!(
        enter_export_specifiers,
        exit_export_specifiers,
        Vec<ExportSpecifier>
    );

    chained_method!(
        enter_import_specifiers,
        exit_import_specifiers,
        Vec<ImportSpecifier>
    );

    chained_method!(enter_opt_ts_type, exit_opt_ts_type, Option<Box<TsType>>);

    chained_method!(
        enter_opt_ts_type_ann,
        exit_opt_ts_type_ann,
        Option<Box<TsTypeAnn>>
    );

    chained_method!(
        enter_opt_ts_type_param_decl,
        exit_opt_ts_type_param_decl,
        Option<Box<TsTypeParamDecl>>
    );

    chained_method!(
        enter_opt_ts_type_param_instantiation,
        exit_opt_ts_type_param_instantiation,
        Option<Box<TsTypeParamInstantiation>>
    );
}

/// Builder for composing multiple hooks
pub(crate) struct HookBuilder<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    hook: H,
}

impl<H> HookBuilder<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    pub fn new(hook: H) -> Self {
        Self { hook }
    }

    pub fn chain<B>(self, hook: B) -> HookBuilder<impl VisitMutHook<TypeScriptCtx>>
    where
        B: VisitMutHook<TypeScriptCtx>,
    {
        HookBuilder {
            hook: OrderedChain(self.hook, hook),
        }
    }

    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<impl VisitMutHook<TypeScriptCtx>>
    where
        B: VisitMutHook<TypeScriptCtx>,
    {
        self.chain(OptionalHook(hook))
    }

    pub fn build(self) -> impl VisitMutHook<TypeScriptCtx> {
        self.hook
    }
}
