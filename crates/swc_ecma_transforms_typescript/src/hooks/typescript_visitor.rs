use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

use super::context::TypeScriptCtx;

/// Wrapper around hooks that implements VisitMut with TypeScript type node
/// support
pub struct TypeScriptVisitMutWithHook<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    pub(crate) hook: H,
    pub(crate) context: TypeScriptCtx,
}

impl<H> TypeScriptVisitMutWithHook<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    pub fn new(hook: H, context: TypeScriptCtx) -> Self {
        Self { hook, context }
    }
}

impl<H> VisitMut for TypeScriptVisitMutWithHook<H>
where
    H: VisitMutHook<TypeScriptCtx>,
{
    // Skip all TypeScript type nodes - this prevents visiting type annotations
    noop_visit_mut_type!();

    // Override visit_mut_opt_ts_* methods to call hooks but NOT visit children
    // This is critical to prevent TypeScript type nodes from being visited
    fn visit_mut_opt_ts_type_ann(&mut self, node: &mut Option<Box<TsTypeAnn>>) {
        self.hook.enter_opt_ts_type_ann(node, &mut self.context);
        // Do NOT call node.visit_mut_children_with(self) - would visit TsTypeAnn
        self.hook.exit_opt_ts_type_ann(node, &mut self.context);
    }

    fn visit_mut_opt_ts_type(&mut self, node: &mut Option<Box<TsType>>) {
        self.hook.enter_opt_ts_type(node, &mut self.context);
        self.hook.exit_opt_ts_type(node, &mut self.context);
    }

    fn visit_mut_opt_ts_type_param_decl(&mut self, node: &mut Option<Box<TsTypeParamDecl>>) {
        self.hook
            .enter_opt_ts_type_param_decl(node, &mut self.context);
        self.hook
            .exit_opt_ts_type_param_decl(node, &mut self.context);
    }

    fn visit_mut_opt_ts_type_param_instantiation(
        &mut self,
        node: &mut Option<Box<TsTypeParamInstantiation>>,
    ) {
        self.hook
            .enter_opt_ts_type_param_instantiation(node, &mut self.context);
        self.hook
            .exit_opt_ts_type_param_instantiation(node, &mut self.context);
    }

    fn visit_mut_opt_accessibility(&mut self, node: &mut Option<Accessibility>) {
        // Skip visiting Accessibility - it's a TypeScript-only enum
        // The StripType hook will remove it in exit_* methods
        *node = None;
    }

    // Standard pattern for all other nodes: enter -> children -> exit
    fn visit_mut_program(&mut self, node: &mut Program) {
        self.hook.enter_program(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_program(node, &mut self.context);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        self.hook.enter_module(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module(node, &mut self.context);
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        self.hook.enter_script(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_script(node, &mut self.context);
    }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        self.hook.enter_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_stmt(node, &mut self.context);
    }

    fn visit_mut_stmts(&mut self, node: &mut Vec<Stmt>) {
        self.hook.enter_stmts(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_stmts(node, &mut self.context);
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        self.hook.enter_expr(node, &mut self.context);

        // Handle TypeScript-specific expression variants specially
        // TsInstantiation has a non-optional type_args field that we can't visit
        match node {
            Expr::TsInstantiation(ts_inst) => {
                // Only visit the expr, not type_args
                ts_inst.expr.visit_mut_with(self);
            }
            _ => {
                node.visit_mut_children_with(self);
            }
        }

        self.hook.exit_expr(node, &mut self.context);
    }

    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        self.hook.enter_module_item(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_item(node, &mut self.context);
    }

    fn visit_mut_module_items(&mut self, node: &mut Vec<ModuleItem>) {
        self.hook.enter_module_items(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_items(node, &mut self.context);
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        self.hook.enter_class(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class(node, &mut self.context);
    }

    fn visit_mut_class_members(&mut self, node: &mut Vec<ClassMember>) {
        self.hook.enter_class_members(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_members(node, &mut self.context);
    }

    fn visit_mut_constructor(&mut self, node: &mut Constructor) {
        self.hook.enter_constructor(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_constructor(node, &mut self.context);
    }

    fn visit_mut_ts_enum_decl(&mut self, node: &mut TsEnumDecl) {
        self.hook.enter_ts_enum_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_enum_decl(node, &mut self.context);
    }

    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        self.hook.enter_ts_module_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_decl(node, &mut self.context);
    }

    fn visit_mut_ts_namespace_decl(&mut self, node: &mut TsNamespaceDecl) {
        self.hook.enter_ts_namespace_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_namespace_decl(node, &mut self.context);
    }

    fn visit_mut_ts_module_block(&mut self, node: &mut TsModuleBlock) {
        self.hook.enter_ts_module_block(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_block(node, &mut self.context);
    }

    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        self.hook.enter_export_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_decl(node, &mut self.context);
    }

    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        self.hook.enter_export_default_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_default_decl(node, &mut self.context);
    }

    fn visit_mut_pat(&mut self, node: &mut Pat) {
        self.hook.enter_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_pat(node, &mut self.context);
    }

    fn visit_mut_prop(&mut self, node: &mut Prop) {
        self.hook.enter_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_prop(node, &mut self.context);
    }

    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        self.hook.enter_var_declarator(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_declarator(node, &mut self.context);
    }

    fn visit_mut_assign_expr(&mut self, node: &mut AssignExpr) {
        self.hook.enter_assign_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_expr(node, &mut self.context);
    }

    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        self.hook.enter_update_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_update_expr(node, &mut self.context);
    }

    fn visit_mut_member_expr(&mut self, node: &mut MemberExpr) {
        self.hook.enter_member_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_member_expr(node, &mut self.context);
    }

    fn visit_mut_simple_assign_target(&mut self, node: &mut SimpleAssignTarget) {
        node.visit_mut_children_with(self);
        self.hook.exit_simple_assign_target(node, &mut self.context);
    }

    fn visit_mut_jsx_element_name(&mut self, node: &mut JSXElementName) {
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_element_name(node, &mut self.context);
    }

    fn visit_mut_jsx_object(&mut self, node: &mut JSXObject) {
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_object(node, &mut self.context);
    }

    fn visit_mut_object_pat_prop(&mut self, node: &mut ObjectPatProp) {
        node.visit_mut_children_with(self);
        self.hook.exit_object_pat_prop(node, &mut self.context);
    }

    // Override all node types that might contain TypeScript type annotations
    // We need to strip type annotations BEFORE visiting children to prevent them
    // from being visited
    fn visit_mut_class_prop(&mut self, node: &mut ClassProp) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
        self.hook.exit_class_prop(node, &mut self.context);
    }

    fn visit_mut_private_prop(&mut self, node: &mut PrivateProp) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
        self.hook.exit_private_prop(node, &mut self.context);
    }

    fn visit_mut_binding_ident(&mut self, node: &mut BindingIdent) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
        self.hook.exit_binding_ident(node, &mut self.context);
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        node.type_params = None;
        node.return_type = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        node.type_params = None;
        node.return_type = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        node.visit_mut_children_with(self);
    }

    fn visit_mut_private_method(&mut self, node: &mut PrivateMethod) {
        node.visit_mut_children_with(self);
    }

    fn visit_mut_auto_accessor(&mut self, node: &mut AutoAccessor) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_getter_prop(&mut self, node: &mut GetterProp) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_array_pat(&mut self, node: &mut ArrayPat) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat(&mut self, node: &mut ObjectPat) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_rest_pat(&mut self, node: &mut RestPat) {
        node.type_ann = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_params(&mut self, node: &mut Vec<Param>) {
        self.hook.enter_params(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_params(node, &mut self.context);
    }

    fn visit_mut_ident(&mut self, node: &mut Ident) {
        self.hook.enter_ident(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ident(node, &mut self.context);
    }

    // Strip TypeScript type arguments/params from expression nodes
    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        node.type_args = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        node.type_args = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_tagged_tpl(&mut self, node: &mut TaggedTpl) {
        node.type_params = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_jsx_opening_element(&mut self, node: &mut JSXOpeningElement) {
        node.type_args = None;
        node.visit_mut_children_with(self);
    }

    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        node.type_args = None;
        node.visit_mut_children_with(self);
    }
}
