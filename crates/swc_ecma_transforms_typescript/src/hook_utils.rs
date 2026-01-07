use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_utils::stack_size::maybe_grow_default;
use swc_ecma_visit::*;

/// Fork of [VisitMutWithHook] that has [maybe_grow_default] applied to it.
pub(crate) struct VisitMutImpl<H, C> {
    pub hook: H,
    pub context: C,
}
impl<H: VisitMutHook<C>, C> VisitMut for VisitMutImpl<H, C> {
    #[doc = "Visits a node of type `Accessibility` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_accessibility(&mut self, node: &mut Accessibility) {
        self.hook.enter_accessibility(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_accessibility(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ArrayLit` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_array_lit(&mut self, node: &mut ArrayLit) {
        self.hook.enter_array_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_array_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ArrayPat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_array_pat(&mut self, node: &mut ArrayPat) {
        self.hook.enter_array_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_array_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ArrowExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.hook.enter_arrow_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_arrow_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_expr(&mut self, node: &mut AssignExpr) {
        self.hook.enter_assign_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignOp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_op(&mut self, node: &mut AssignOp) {
        self.hook.enter_assign_op(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_op(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignPat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_pat(&mut self, node: &mut AssignPat) {
        self.hook.enter_assign_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignPatProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_pat_prop(&mut self, node: &mut AssignPatProp) {
        self.hook.enter_assign_pat_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_pat_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_prop(&mut self, node: &mut AssignProp) {
        self.hook.enter_assign_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignTarget` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_target(&mut self, node: &mut AssignTarget) {
        self.hook.enter_assign_target(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_target(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AssignTargetPat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_assign_target_pat(&mut self, node: &mut AssignTargetPat) {
        self.hook.enter_assign_target_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_assign_target_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `swc_atoms :: Atom` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_atom(&mut self, node: &mut swc_atoms::Atom) {
        self.hook.enter_atom(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_atom(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AutoAccessor` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_auto_accessor(&mut self, node: &mut AutoAccessor) {
        self.hook.enter_auto_accessor(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_auto_accessor(node, &mut self.context);
    }

    #[doc = "Visits a node of type `AwaitExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_await_expr(&mut self, node: &mut AwaitExpr) {
        self.hook.enter_await_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_await_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BigInt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_big_int(&mut self, node: &mut BigInt) {
        self.hook.enter_big_int(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_big_int(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BigIntValue` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_big_int_value(&mut self, node: &mut BigIntValue) {
        self.hook.enter_big_int_value(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_big_int_value(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BinExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_bin_expr(&mut self, node: &mut BinExpr) {
        self.hook.enter_bin_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_bin_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BinaryOp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_binary_op(&mut self, node: &mut BinaryOp) {
        self.hook.enter_binary_op(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_binary_op(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BindingIdent` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_binding_ident(&mut self, node: &mut BindingIdent) {
        self.hook.enter_binding_ident(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_binding_ident(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BlockStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.hook.enter_block_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_block_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BlockStmtOrExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_block_stmt_or_expr(&mut self, node: &mut BlockStmtOrExpr) {
        self.hook.enter_block_stmt_or_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_block_stmt_or_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Bool` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_bool(&mut self, node: &mut Bool) {
        self.hook.enter_bool(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_bool(node, &mut self.context);
    }

    #[doc = "Visits a node of type `BreakStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_break_stmt(&mut self, node: &mut BreakStmt) {
        self.hook.enter_break_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_break_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `CallExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        self.hook.enter_call_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_call_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Callee` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_callee(&mut self, node: &mut Callee) {
        self.hook.enter_callee(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_callee(node, &mut self.context);
    }

    #[doc = "Visits a node of type `CatchClause` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        self.hook.enter_catch_clause(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_catch_clause(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Class` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class(&mut self, node: &mut Class) {
        self.hook.enter_class(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ClassDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_decl(&mut self, node: &mut ClassDecl) {
        self.hook.enter_class_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ClassExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_expr(&mut self, node: &mut ClassExpr) {
        self.hook.enter_class_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ClassMember` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_member(&mut self, node: &mut ClassMember) {
        self.hook.enter_class_member(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_member(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ClassMember >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_members(&mut self, node: &mut Vec<ClassMember>) {
        self.hook.enter_class_members(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_members(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ClassMethod` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        self.hook.enter_class_method(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_method(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ClassProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_class_prop(&mut self, node: &mut ClassProp) {
        self.hook.enter_class_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ComputedPropName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_computed_prop_name(&mut self, node: &mut ComputedPropName) {
        self.hook.enter_computed_prop_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_computed_prop_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `CondExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_cond_expr(&mut self, node: &mut CondExpr) {
        self.hook.enter_cond_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_cond_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Constructor` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_constructor(&mut self, node: &mut Constructor) {
        self.hook.enter_constructor(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_constructor(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ContinueStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_continue_stmt(&mut self, node: &mut ContinueStmt) {
        self.hook.enter_continue_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_continue_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `DebuggerStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_debugger_stmt(&mut self, node: &mut DebuggerStmt) {
        self.hook.enter_debugger_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_debugger_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Decl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_decl(&mut self, node: &mut Decl) {
        self.hook.enter_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Decorator` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_decorator(&mut self, node: &mut Decorator) {
        self.hook.enter_decorator(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_decorator(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Decorator >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_decorators(&mut self, node: &mut Vec<Decorator>) {
        self.hook.enter_decorators(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_decorators(node, &mut self.context);
    }

    #[doc = "Visits a node of type `DefaultDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_default_decl(&mut self, node: &mut DefaultDecl) {
        self.hook.enter_default_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_default_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `DoWhileStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        self.hook.enter_do_while_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_do_while_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `EmptyStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_empty_stmt(&mut self, node: &mut EmptyStmt) {
        self.hook.enter_empty_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_empty_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportAll` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_all(&mut self, node: &mut ExportAll) {
        self.hook.enter_export_all(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_all(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_decl(&mut self, node: &mut ExportDecl) {
        self.hook.enter_export_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportDefaultDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_default_decl(&mut self, node: &mut ExportDefaultDecl) {
        self.hook.enter_export_default_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_default_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportDefaultExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_default_expr(&mut self, node: &mut ExportDefaultExpr) {
        self.hook.enter_export_default_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_default_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportDefaultSpecifier` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_export_default_specifier(&mut self, node: &mut ExportDefaultSpecifier) {
        self.hook
            .enter_export_default_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_export_default_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportNamedSpecifier` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_named_specifier(&mut self, node: &mut ExportNamedSpecifier) {
        self.hook
            .enter_export_named_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_export_named_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportNamespaceSpecifier` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_export_namespace_specifier(&mut self, node: &mut ExportNamespaceSpecifier) {
        self.hook
            .enter_export_namespace_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_export_namespace_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExportSpecifier` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_export_specifier(&mut self, node: &mut ExportSpecifier) {
        self.hook.enter_export_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ExportSpecifier >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_export_specifiers(&mut self, node: &mut Vec<ExportSpecifier>) {
        self.hook.enter_export_specifiers(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_export_specifiers(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Expr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_expr(&mut self, node: &mut Expr) {
        self.hook.enter_expr(node, &mut self.context);
        maybe_grow_default(|| node.visit_mut_children_with(self));
        self.hook.exit_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExprOrSpread` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_expr_or_spread(&mut self, node: &mut ExprOrSpread) {
        self.hook.enter_expr_or_spread(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_expr_or_spread(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ExprOrSpread >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_expr_or_spreads(&mut self, node: &mut Vec<ExprOrSpread>) {
        self.hook.enter_expr_or_spreads(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_expr_or_spreads(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ExprStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_expr_stmt(&mut self, node: &mut ExprStmt) {
        self.hook.enter_expr_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_expr_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Box < Expr > >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_exprs(&mut self, node: &mut Vec<Box<Expr>>) {
        self.hook.enter_exprs(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_exprs(node, &mut self.context);
    }

    #[doc = "Visits a node of type `FnDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_fn_decl(&mut self, node: &mut FnDecl) {
        self.hook.enter_fn_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_fn_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `FnExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_fn_expr(&mut self, node: &mut FnExpr) {
        self.hook.enter_fn_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_fn_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ForHead` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_for_head(&mut self, node: &mut ForHead) {
        self.hook.enter_for_head(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_for_head(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ForInStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        self.hook.enter_for_in_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_for_in_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ForOfStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        self.hook.enter_for_of_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_for_of_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ForStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        self.hook.enter_for_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_for_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Function` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_function(&mut self, node: &mut Function) {
        self.hook.enter_function(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_function(node, &mut self.context);
    }

    #[doc = "Visits a node of type `GetterProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_getter_prop(&mut self, node: &mut GetterProp) {
        self.hook.enter_getter_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_getter_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Ident` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ident(&mut self, node: &mut Ident) {
        self.hook.enter_ident(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ident(node, &mut self.context);
    }

    #[doc = "Visits a node of type `IdentName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ident_name(&mut self, node: &mut IdentName) {
        self.hook.enter_ident_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ident_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `IfStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        self.hook.enter_if_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_if_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Import` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import(&mut self, node: &mut Import) {
        self.hook.enter_import(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_decl(&mut self, node: &mut ImportDecl) {
        self.hook.enter_import_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportDefaultSpecifier` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_import_default_specifier(&mut self, node: &mut ImportDefaultSpecifier) {
        self.hook
            .enter_import_default_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_import_default_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportNamedSpecifier` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_named_specifier(&mut self, node: &mut ImportNamedSpecifier) {
        self.hook
            .enter_import_named_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_import_named_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportPhase` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_phase(&mut self, node: &mut ImportPhase) {
        self.hook.enter_import_phase(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_phase(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportSpecifier` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_specifier(&mut self, node: &mut ImportSpecifier) {
        self.hook.enter_import_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ImportSpecifier >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_import_specifiers(&mut self, node: &mut Vec<ImportSpecifier>) {
        self.hook.enter_import_specifiers(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_specifiers(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportStarAsSpecifier` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_star_as_specifier(&mut self, node: &mut ImportStarAsSpecifier) {
        self.hook
            .enter_import_star_as_specifier(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_import_star_as_specifier(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportWith` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_with(&mut self, node: &mut ImportWith) {
        self.hook.enter_import_with(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_with(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ImportWithItem` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_import_with_item(&mut self, node: &mut ImportWithItem) {
        self.hook.enter_import_with_item(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_with_item(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ImportWithItem >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_import_with_items(&mut self, node: &mut Vec<ImportWithItem>) {
        self.hook.enter_import_with_items(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_import_with_items(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Invalid` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_invalid(&mut self, node: &mut Invalid) {
        self.hook.enter_invalid(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_invalid(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXAttr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_attr(&mut self, node: &mut JSXAttr) {
        self.hook.enter_jsx_attr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_attr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXAttrName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_attr_name(&mut self, node: &mut JSXAttrName) {
        self.hook.enter_jsx_attr_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_attr_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXAttrOrSpread` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_attr_or_spread(&mut self, node: &mut JSXAttrOrSpread) {
        self.hook.enter_jsx_attr_or_spread(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_attr_or_spread(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < JSXAttrOrSpread >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_jsx_attr_or_spreads(&mut self, node: &mut Vec<JSXAttrOrSpread>) {
        self.hook.enter_jsx_attr_or_spreads(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_attr_or_spreads(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXAttrValue` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_attr_value(&mut self, node: &mut JSXAttrValue) {
        self.hook.enter_jsx_attr_value(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_attr_value(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXClosingElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_closing_element(&mut self, node: &mut JSXClosingElement) {
        self.hook.enter_jsx_closing_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_closing_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXClosingFragment` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_closing_fragment(&mut self, node: &mut JSXClosingFragment) {
        self.hook
            .enter_jsx_closing_fragment(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_closing_fragment(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_element(&mut self, node: &mut JSXElement) {
        self.hook.enter_jsx_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXElementChild` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_element_child(&mut self, node: &mut JSXElementChild) {
        self.hook.enter_jsx_element_child(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_element_child(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < JSXElementChild >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_jsx_element_childs(&mut self, node: &mut Vec<JSXElementChild>) {
        self.hook.enter_jsx_element_childs(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_element_childs(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXElementName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_element_name(&mut self, node: &mut JSXElementName) {
        self.hook.enter_jsx_element_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_element_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXEmptyExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_empty_expr(&mut self, node: &mut JSXEmptyExpr) {
        self.hook.enter_jsx_empty_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_empty_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_expr(&mut self, node: &mut JSXExpr) {
        self.hook.enter_jsx_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXExprContainer` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_expr_container(&mut self, node: &mut JSXExprContainer) {
        self.hook.enter_jsx_expr_container(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_expr_container(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXFragment` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_fragment(&mut self, node: &mut JSXFragment) {
        self.hook.enter_jsx_fragment(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_fragment(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXMemberExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_member_expr(&mut self, node: &mut JSXMemberExpr) {
        self.hook.enter_jsx_member_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_member_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXNamespacedName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_namespaced_name(&mut self, node: &mut JSXNamespacedName) {
        self.hook.enter_jsx_namespaced_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_namespaced_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXObject` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_object(&mut self, node: &mut JSXObject) {
        self.hook.enter_jsx_object(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_object(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXOpeningElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_opening_element(&mut self, node: &mut JSXOpeningElement) {
        self.hook.enter_jsx_opening_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_opening_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXOpeningFragment` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_opening_fragment(&mut self, node: &mut JSXOpeningFragment) {
        self.hook
            .enter_jsx_opening_fragment(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_opening_fragment(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXSpreadChild` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_spread_child(&mut self, node: &mut JSXSpreadChild) {
        self.hook.enter_jsx_spread_child(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_spread_child(node, &mut self.context);
    }

    #[doc = "Visits a node of type `JSXText` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_jsx_text(&mut self, node: &mut JSXText) {
        self.hook.enter_jsx_text(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_jsx_text(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Key` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_key(&mut self, node: &mut Key) {
        self.hook.enter_key(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_key(node, &mut self.context);
    }

    #[doc = "Visits a node of type `KeyValuePatProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_key_value_pat_prop(&mut self, node: &mut KeyValuePatProp) {
        self.hook.enter_key_value_pat_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_key_value_pat_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `KeyValueProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_key_value_prop(&mut self, node: &mut KeyValueProp) {
        self.hook.enter_key_value_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_key_value_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `LabeledStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_labeled_stmt(&mut self, node: &mut LabeledStmt) {
        self.hook.enter_labeled_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_labeled_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Lit` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_lit(&mut self, node: &mut Lit) {
        self.hook.enter_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MemberExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_member_expr(&mut self, node: &mut MemberExpr) {
        self.hook.enter_member_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_member_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MemberProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_member_prop(&mut self, node: &mut MemberProp) {
        self.hook.enter_member_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_member_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MetaPropExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_meta_prop_expr(&mut self, node: &mut MetaPropExpr) {
        self.hook.enter_meta_prop_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_meta_prop_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MetaPropKind` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_meta_prop_kind(&mut self, node: &mut MetaPropKind) {
        self.hook.enter_meta_prop_kind(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_meta_prop_kind(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MethodKind` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_method_kind(&mut self, node: &mut MethodKind) {
        self.hook.enter_method_kind(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_method_kind(node, &mut self.context);
    }

    #[doc = "Visits a node of type `MethodProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_method_prop(&mut self, node: &mut MethodProp) {
        self.hook.enter_method_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_method_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Module` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_module(&mut self, node: &mut Module) {
        self.hook.enter_module(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ModuleDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_module_decl(&mut self, node: &mut ModuleDecl) {
        self.hook.enter_module_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ModuleExportName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_module_export_name(&mut self, node: &mut ModuleExportName) {
        self.hook.enter_module_export_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_export_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ModuleItem` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_module_item(&mut self, node: &mut ModuleItem) {
        self.hook.enter_module_item(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_item(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ModuleItem >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_module_items(&mut self, node: &mut Vec<ModuleItem>) {
        self.hook.enter_module_items(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_module_items(node, &mut self.context);
    }

    #[doc = "Visits a node of type `NamedExport` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_named_export(&mut self, node: &mut NamedExport) {
        self.hook.enter_named_export(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_named_export(node, &mut self.context);
    }

    #[doc = "Visits a node of type `NewExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_new_expr(&mut self, node: &mut NewExpr) {
        self.hook.enter_new_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_new_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Null` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_null(&mut self, node: &mut Null) {
        self.hook.enter_null(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_null(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Number` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_number(&mut self, node: &mut Number) {
        self.hook.enter_number(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_number(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ObjectLit` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_object_lit(&mut self, node: &mut ObjectLit) {
        self.hook.enter_object_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_object_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ObjectPat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_object_pat(&mut self, node: &mut ObjectPat) {
        self.hook.enter_object_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_object_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ObjectPatProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_object_pat_prop(&mut self, node: &mut ObjectPatProp) {
        self.hook.enter_object_pat_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_object_pat_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ObjectPatProp >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_object_pat_props(&mut self, node: &mut Vec<ObjectPatProp>) {
        self.hook.enter_object_pat_props(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_object_pat_props(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Accessibility >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_accessibility(&mut self, node: &mut Option<Accessibility>) {
        self.hook.enter_opt_accessibility(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_accessibility(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < swc_atoms :: Atom >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_atom(&mut self, node: &mut Option<swc_atoms::Atom>) {
        self.hook.enter_opt_atom(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_atom(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < BlockStmt >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_block_stmt(&mut self, node: &mut Option<BlockStmt>) {
        self.hook.enter_opt_block_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_block_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `OptCall` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        self.hook.enter_opt_call(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_call(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < CatchClause >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_catch_clause(&mut self, node: &mut Option<CatchClause>) {
        self.hook.enter_opt_catch_clause(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_catch_clause(node, &mut self.context);
    }

    #[doc = "Visits a node of type `OptChainBase` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_chain_base(&mut self, node: &mut OptChainBase) {
        self.hook.enter_opt_chain_base(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_chain_base(node, &mut self.context);
    }

    #[doc = "Visits a node of type `OptChainExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_chain_expr(&mut self, node: &mut OptChainExpr) {
        self.hook.enter_opt_chain_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_chain_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < Expr > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_expr(&mut self, node: &mut Option<Box<Expr>>) {
        self.hook.enter_opt_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < ExprOrSpread >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_expr_or_spread(&mut self, node: &mut Option<ExprOrSpread>) {
        self.hook.enter_opt_expr_or_spread(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_expr_or_spread(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Vec < ExprOrSpread > >` using the hook's enter and \
             exit methods."]
    #[inline]
    fn visit_mut_opt_expr_or_spreads(&mut self, node: &mut Option<Vec<ExprOrSpread>>) {
        self.hook.enter_opt_expr_or_spreads(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_expr_or_spreads(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Ident >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_ident(&mut self, node: &mut Option<Ident>) {
        self.hook.enter_opt_ident(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_ident(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < JSXAttrValue >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_jsx_attr_value(&mut self, node: &mut Option<JSXAttrValue>) {
        self.hook.enter_opt_jsx_attr_value(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_jsx_attr_value(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < JSXClosingElement >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_jsx_closing_element(&mut self, node: &mut Option<JSXClosingElement>) {
        self.hook
            .enter_opt_jsx_closing_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_jsx_closing_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < ModuleExportName >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_module_export_name(&mut self, node: &mut Option<ModuleExportName>) {
        self.hook
            .enter_opt_module_export_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_module_export_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < ObjectLit > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_object_lit(&mut self, node: &mut Option<Box<ObjectLit>>) {
        self.hook.enter_opt_object_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_object_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Pat >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_opt_pat(&mut self, node: &mut Option<Pat>) {
        self.hook.enter_opt_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < swc_common :: Span >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_span(&mut self, node: &mut Option<swc_common::Span>) {
        self.hook.enter_opt_span(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_span(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < Stmt > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_stmt(&mut self, node: &mut Option<Box<Stmt>>) {
        self.hook.enter_opt_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < Str > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_str(&mut self, node: &mut Option<Box<Str>>) {
        self.hook.enter_opt_str(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_str(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < TruePlusMinus >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_true_plus_minus(&mut self, node: &mut Option<TruePlusMinus>) {
        self.hook.enter_opt_true_plus_minus(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_true_plus_minus(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < TsEntityName >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_ts_entity_name(&mut self, node: &mut Option<TsEntityName>) {
        self.hook.enter_opt_ts_entity_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_ts_entity_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < TsImportCallOptions >` using the hook's enter and \
             exit methods."]
    #[inline]
    fn visit_mut_opt_ts_import_call_options(&mut self, node: &mut Option<TsImportCallOptions>) {
        self.hook
            .enter_opt_ts_import_call_options(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_ts_import_call_options(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < TsNamespaceBody >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_ts_namespace_body(&mut self, node: &mut Option<TsNamespaceBody>) {
        self.hook
            .enter_opt_ts_namespace_body(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_ts_namespace_body(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < TsType > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_ts_type(&mut self, node: &mut Option<Box<TsType>>) {
        self.hook.enter_opt_ts_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_ts_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < TsTypeAnn > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_ts_type_ann(&mut self, node: &mut Option<Box<TsTypeAnn>>) {
        self.hook.enter_opt_ts_type_ann(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_ts_type_ann(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < TsTypeParamDecl > >` using the hook's enter and \
             exit methods."]
    #[inline]
    fn visit_mut_opt_ts_type_param_decl(&mut self, node: &mut Option<Box<TsTypeParamDecl>>) {
        self.hook
            .enter_opt_ts_type_param_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_ts_type_param_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < Box < TsTypeParamInstantiation > >` using the hook's \
             enter and exit methods."]
    #[inline]
    fn visit_mut_opt_ts_type_param_instantiation(
        &mut self,
        node: &mut Option<Box<TsTypeParamInstantiation>>,
    ) {
        self.hook
            .enter_opt_ts_type_param_instantiation(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_ts_type_param_instantiation(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < VarDeclOrExpr >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_var_decl_or_expr(&mut self, node: &mut Option<VarDeclOrExpr>) {
        self.hook
            .enter_opt_var_decl_or_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_var_decl_or_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Option < ExprOrSpread > >` using the hook's enter and \
             exit methods."]
    #[inline]
    fn visit_mut_opt_vec_expr_or_spreads(&mut self, node: &mut Vec<Option<ExprOrSpread>>) {
        self.hook
            .enter_opt_vec_expr_or_spreads(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_opt_vec_expr_or_spreads(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Option < Pat > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_opt_vec_pats(&mut self, node: &mut Vec<Option<Pat>>) {
        self.hook.enter_opt_vec_pats(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_vec_pats(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Option < swc_atoms :: Wtf8Atom >` using the hook's enter and \
             exit methods."]
    #[inline]
    fn visit_mut_opt_wtf_8_atom(&mut self, node: &mut Option<swc_atoms::Wtf8Atom>) {
        self.hook.enter_opt_wtf_8_atom(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_opt_wtf_8_atom(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Param` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_param(&mut self, node: &mut Param) {
        self.hook.enter_param(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_param(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ParamOrTsParamProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_param_or_ts_param_prop(&mut self, node: &mut ParamOrTsParamProp) {
        self.hook
            .enter_param_or_ts_param_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_param_or_ts_param_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < ParamOrTsParamProp >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_param_or_ts_param_props(&mut self, node: &mut Vec<ParamOrTsParamProp>) {
        self.hook
            .enter_param_or_ts_param_props(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_param_or_ts_param_props(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Param >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_params(&mut self, node: &mut Vec<Param>) {
        self.hook.enter_params(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_params(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ParenExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_paren_expr(&mut self, node: &mut ParenExpr) {
        self.hook.enter_paren_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_paren_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Pat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_pat(&mut self, node: &mut Pat) {
        self.hook.enter_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Pat >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_pats(&mut self, node: &mut Vec<Pat>) {
        self.hook.enter_pats(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_pats(node, &mut self.context);
    }

    #[doc = "Visits a node of type `PrivateMethod` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_private_method(&mut self, node: &mut PrivateMethod) {
        self.hook.enter_private_method(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_private_method(node, &mut self.context);
    }

    #[doc = "Visits a node of type `PrivateName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_private_name(&mut self, node: &mut PrivateName) {
        self.hook.enter_private_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_private_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `PrivateProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_private_prop(&mut self, node: &mut PrivateProp) {
        self.hook.enter_private_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_private_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Program` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_program(&mut self, node: &mut Program) {
        self.hook.enter_program(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_program(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Prop` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_prop(&mut self, node: &mut Prop) {
        self.hook.enter_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `PropName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_prop_name(&mut self, node: &mut PropName) {
        self.hook.enter_prop_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_prop_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `PropOrSpread` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_prop_or_spread(&mut self, node: &mut PropOrSpread) {
        self.hook.enter_prop_or_spread(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_prop_or_spread(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < PropOrSpread >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_prop_or_spreads(&mut self, node: &mut Vec<PropOrSpread>) {
        self.hook.enter_prop_or_spreads(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_prop_or_spreads(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Regex` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_regex(&mut self, node: &mut Regex) {
        self.hook.enter_regex(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_regex(node, &mut self.context);
    }

    #[doc = "Visits a node of type `RestPat` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_rest_pat(&mut self, node: &mut RestPat) {
        self.hook.enter_rest_pat(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_rest_pat(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ReturnStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_return_stmt(&mut self, node: &mut ReturnStmt) {
        self.hook.enter_return_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_return_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Script` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_script(&mut self, node: &mut Script) {
        self.hook.enter_script(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_script(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SeqExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_seq_expr(&mut self, node: &mut SeqExpr) {
        self.hook.enter_seq_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_seq_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SetterProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_setter_prop(&mut self, node: &mut SetterProp) {
        self.hook.enter_setter_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_setter_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SimpleAssignTarget` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_simple_assign_target(&mut self, node: &mut SimpleAssignTarget) {
        self.hook
            .enter_simple_assign_target(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_simple_assign_target(node, &mut self.context);
    }

    #[doc = "Visits a node of type `swc_common :: Span` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_span(&mut self, node: &mut swc_common::Span) {
        self.hook.enter_span(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_span(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SpreadElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_spread_element(&mut self, node: &mut SpreadElement) {
        self.hook.enter_spread_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_spread_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `StaticBlock` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_static_block(&mut self, node: &mut StaticBlock) {
        self.hook.enter_static_block(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_static_block(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Stmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        self.hook.enter_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Stmt >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_stmts(&mut self, node: &mut Vec<Stmt>) {
        self.hook.enter_stmts(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_stmts(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Str` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_str(&mut self, node: &mut Str) {
        self.hook.enter_str(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_str(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Super` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_super(&mut self, node: &mut Super) {
        self.hook.enter_super(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_super(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SuperProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_super_prop(&mut self, node: &mut SuperProp) {
        self.hook.enter_super_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_super_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SuperPropExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_super_prop_expr(&mut self, node: &mut SuperPropExpr) {
        self.hook.enter_super_prop_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_super_prop_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SwitchCase` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_switch_case(&mut self, node: &mut SwitchCase) {
        self.hook.enter_switch_case(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_switch_case(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < SwitchCase >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_switch_cases(&mut self, node: &mut Vec<SwitchCase>) {
        self.hook.enter_switch_cases(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_switch_cases(node, &mut self.context);
    }

    #[doc = "Visits a node of type `SwitchStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_switch_stmt(&mut self, node: &mut SwitchStmt) {
        self.hook.enter_switch_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_switch_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `swc_common :: SyntaxContext` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_syntax_context(&mut self, node: &mut swc_common::SyntaxContext) {
        self.hook.enter_syntax_context(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_syntax_context(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TaggedTpl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_tagged_tpl(&mut self, node: &mut TaggedTpl) {
        self.hook.enter_tagged_tpl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_tagged_tpl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ThisExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_this_expr(&mut self, node: &mut ThisExpr) {
        self.hook.enter_this_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_this_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `ThrowStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_throw_stmt(&mut self, node: &mut ThrowStmt) {
        self.hook.enter_throw_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_throw_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Tpl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_tpl(&mut self, node: &mut Tpl) {
        self.hook.enter_tpl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_tpl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TplElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_tpl_element(&mut self, node: &mut TplElement) {
        self.hook.enter_tpl_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_tpl_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TplElement >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_tpl_elements(&mut self, node: &mut Vec<TplElement>) {
        self.hook.enter_tpl_elements(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_tpl_elements(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TruePlusMinus` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_true_plus_minus(&mut self, node: &mut TruePlusMinus) {
        self.hook.enter_true_plus_minus(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_true_plus_minus(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TryStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        self.hook.enter_try_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_try_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsArrayType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_array_type(&mut self, node: &mut TsArrayType) {
        self.hook.enter_ts_array_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_array_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsAsExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_as_expr(&mut self, node: &mut TsAsExpr) {
        self.hook.enter_ts_as_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_as_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsCallSignatureDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_call_signature_decl(&mut self, node: &mut TsCallSignatureDecl) {
        self.hook
            .enter_ts_call_signature_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_call_signature_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsConditionalType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_conditional_type(&mut self, node: &mut TsConditionalType) {
        self.hook.enter_ts_conditional_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_conditional_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsConstAssertion` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_const_assertion(&mut self, node: &mut TsConstAssertion) {
        self.hook.enter_ts_const_assertion(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_const_assertion(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsConstructSignatureDecl` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_construct_signature_decl(&mut self, node: &mut TsConstructSignatureDecl) {
        self.hook
            .enter_ts_construct_signature_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_construct_signature_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsConstructorType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_constructor_type(&mut self, node: &mut TsConstructorType) {
        self.hook.enter_ts_constructor_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_constructor_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsEntityName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_entity_name(&mut self, node: &mut TsEntityName) {
        self.hook.enter_ts_entity_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_entity_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsEnumDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_enum_decl(&mut self, node: &mut TsEnumDecl) {
        self.hook.enter_ts_enum_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_enum_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsEnumMember` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_enum_member(&mut self, node: &mut TsEnumMember) {
        self.hook.enter_ts_enum_member(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_enum_member(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsEnumMemberId` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_enum_member_id(&mut self, node: &mut TsEnumMemberId) {
        self.hook.enter_ts_enum_member_id(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_enum_member_id(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsEnumMember >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_enum_members(&mut self, node: &mut Vec<TsEnumMember>) {
        self.hook.enter_ts_enum_members(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_enum_members(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsExportAssignment` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_export_assignment(&mut self, node: &mut TsExportAssignment) {
        self.hook
            .enter_ts_export_assignment(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_export_assignment(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsExprWithTypeArgs` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_expr_with_type_args(&mut self, node: &mut TsExprWithTypeArgs) {
        self.hook
            .enter_ts_expr_with_type_args(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_expr_with_type_args(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsExprWithTypeArgs >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_expr_with_type_argss(&mut self, node: &mut Vec<TsExprWithTypeArgs>) {
        self.hook
            .enter_ts_expr_with_type_argss(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_expr_with_type_argss(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsExternalModuleRef` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_external_module_ref(&mut self, node: &mut TsExternalModuleRef) {
        self.hook
            .enter_ts_external_module_ref(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_external_module_ref(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsFnOrConstructorType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_fn_or_constructor_type(&mut self, node: &mut TsFnOrConstructorType) {
        self.hook
            .enter_ts_fn_or_constructor_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_fn_or_constructor_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsFnParam` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_fn_param(&mut self, node: &mut TsFnParam) {
        self.hook.enter_ts_fn_param(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_fn_param(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsFnParam >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_fn_params(&mut self, node: &mut Vec<TsFnParam>) {
        self.hook.enter_ts_fn_params(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_fn_params(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsFnType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_fn_type(&mut self, node: &mut TsFnType) {
        self.hook.enter_ts_fn_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_fn_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsGetterSignature` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_getter_signature(&mut self, node: &mut TsGetterSignature) {
        self.hook.enter_ts_getter_signature(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_getter_signature(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsImportCallOptions` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_import_call_options(&mut self, node: &mut TsImportCallOptions) {
        self.hook
            .enter_ts_import_call_options(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_import_call_options(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsImportEqualsDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_import_equals_decl(&mut self, node: &mut TsImportEqualsDecl) {
        self.hook
            .enter_ts_import_equals_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_import_equals_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsImportType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_import_type(&mut self, node: &mut TsImportType) {
        self.hook.enter_ts_import_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_import_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsIndexSignature` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_index_signature(&mut self, node: &mut TsIndexSignature) {
        self.hook.enter_ts_index_signature(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_index_signature(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsIndexedAccessType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_indexed_access_type(&mut self, node: &mut TsIndexedAccessType) {
        self.hook
            .enter_ts_indexed_access_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_indexed_access_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsInferType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_infer_type(&mut self, node: &mut TsInferType) {
        self.hook.enter_ts_infer_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_infer_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsInstantiation` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_instantiation(&mut self, node: &mut TsInstantiation) {
        self.hook.enter_ts_instantiation(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_instantiation(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsInterfaceBody` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_interface_body(&mut self, node: &mut TsInterfaceBody) {
        self.hook.enter_ts_interface_body(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_interface_body(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsInterfaceDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_interface_decl(&mut self, node: &mut TsInterfaceDecl) {
        self.hook.enter_ts_interface_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_interface_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsIntersectionType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_intersection_type(&mut self, node: &mut TsIntersectionType) {
        self.hook
            .enter_ts_intersection_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_intersection_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsKeywordType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_keyword_type(&mut self, node: &mut TsKeywordType) {
        self.hook.enter_ts_keyword_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_keyword_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsKeywordTypeKind` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_keyword_type_kind(&mut self, node: &mut TsKeywordTypeKind) {
        self.hook
            .enter_ts_keyword_type_kind(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_keyword_type_kind(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsLit` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_lit(&mut self, node: &mut TsLit) {
        self.hook.enter_ts_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsLitType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_lit_type(&mut self, node: &mut TsLitType) {
        self.hook.enter_ts_lit_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_lit_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsMappedType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_mapped_type(&mut self, node: &mut TsMappedType) {
        self.hook.enter_ts_mapped_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_mapped_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsMethodSignature` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_method_signature(&mut self, node: &mut TsMethodSignature) {
        self.hook.enter_ts_method_signature(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_method_signature(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsModuleBlock` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_module_block(&mut self, node: &mut TsModuleBlock) {
        self.hook.enter_ts_module_block(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_block(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsModuleDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_module_decl(&mut self, node: &mut TsModuleDecl) {
        self.hook.enter_ts_module_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsModuleName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_module_name(&mut self, node: &mut TsModuleName) {
        self.hook.enter_ts_module_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsModuleRef` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_module_ref(&mut self, node: &mut TsModuleRef) {
        self.hook.enter_ts_module_ref(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_module_ref(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsNamespaceBody` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_namespace_body(&mut self, node: &mut TsNamespaceBody) {
        self.hook.enter_ts_namespace_body(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_namespace_body(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsNamespaceDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_namespace_decl(&mut self, node: &mut TsNamespaceDecl) {
        self.hook.enter_ts_namespace_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_namespace_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsNamespaceExportDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_namespace_export_decl(&mut self, node: &mut TsNamespaceExportDecl) {
        self.hook
            .enter_ts_namespace_export_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_namespace_export_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsNonNullExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_non_null_expr(&mut self, node: &mut TsNonNullExpr) {
        self.hook.enter_ts_non_null_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_non_null_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsOptionalType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_optional_type(&mut self, node: &mut TsOptionalType) {
        self.hook.enter_ts_optional_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_optional_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsParamProp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_param_prop(&mut self, node: &mut TsParamProp) {
        self.hook.enter_ts_param_prop(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_param_prop(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsParamPropParam` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_param_prop_param(&mut self, node: &mut TsParamPropParam) {
        self.hook.enter_ts_param_prop_param(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_param_prop_param(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsParenthesizedType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_parenthesized_type(&mut self, node: &mut TsParenthesizedType) {
        self.hook
            .enter_ts_parenthesized_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_parenthesized_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsPropertySignature` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_property_signature(&mut self, node: &mut TsPropertySignature) {
        self.hook
            .enter_ts_property_signature(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_property_signature(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsQualifiedName` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_qualified_name(&mut self, node: &mut TsQualifiedName) {
        self.hook.enter_ts_qualified_name(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_qualified_name(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsRestType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_rest_type(&mut self, node: &mut TsRestType) {
        self.hook.enter_ts_rest_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_rest_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsSatisfiesExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_satisfies_expr(&mut self, node: &mut TsSatisfiesExpr) {
        self.hook.enter_ts_satisfies_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_satisfies_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsSetterSignature` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_setter_signature(&mut self, node: &mut TsSetterSignature) {
        self.hook.enter_ts_setter_signature(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_setter_signature(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsThisType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_this_type(&mut self, node: &mut TsThisType) {
        self.hook.enter_ts_this_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_this_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsThisTypeOrIdent` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_this_type_or_ident(&mut self, node: &mut TsThisTypeOrIdent) {
        self.hook
            .enter_ts_this_type_or_ident(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_this_type_or_ident(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTplLitType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_tpl_lit_type(&mut self, node: &mut TsTplLitType) {
        self.hook.enter_ts_tpl_lit_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_tpl_lit_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTupleElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_tuple_element(&mut self, node: &mut TsTupleElement) {
        self.hook.enter_ts_tuple_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_tuple_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsTupleElement >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_tuple_elements(&mut self, node: &mut Vec<TsTupleElement>) {
        self.hook.enter_ts_tuple_elements(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_tuple_elements(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTupleType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_tuple_type(&mut self, node: &mut TsTupleType) {
        self.hook.enter_ts_tuple_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_tuple_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type(&mut self, node: &mut TsType) {
        self.hook.enter_ts_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeAliasDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_alias_decl(&mut self, node: &mut TsTypeAliasDecl) {
        self.hook.enter_ts_type_alias_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_alias_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeAnn` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_ann(&mut self, node: &mut TsTypeAnn) {
        self.hook.enter_ts_type_ann(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_ann(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeAssertion` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_assertion(&mut self, node: &mut TsTypeAssertion) {
        self.hook.enter_ts_type_assertion(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_assertion(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeElement` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_element(&mut self, node: &mut TsTypeElement) {
        self.hook.enter_ts_type_element(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_element(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsTypeElement >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_elements(&mut self, node: &mut Vec<TsTypeElement>) {
        self.hook.enter_ts_type_elements(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_elements(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeLit` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_lit(&mut self, node: &mut TsTypeLit) {
        self.hook.enter_ts_type_lit(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_lit(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeOperator` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_operator(&mut self, node: &mut TsTypeOperator) {
        self.hook.enter_ts_type_operator(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_operator(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeOperatorOp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_operator_op(&mut self, node: &mut TsTypeOperatorOp) {
        self.hook.enter_ts_type_operator_op(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_operator_op(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeParam` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_param(&mut self, node: &mut TsTypeParam) {
        self.hook.enter_ts_type_param(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_param(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeParamDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_param_decl(&mut self, node: &mut TsTypeParamDecl) {
        self.hook.enter_ts_type_param_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_param_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeParamInstantiation` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_type_param_instantiation(&mut self, node: &mut TsTypeParamInstantiation) {
        self.hook
            .enter_ts_type_param_instantiation(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_type_param_instantiation(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < TsTypeParam >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_params(&mut self, node: &mut Vec<TsTypeParam>) {
        self.hook.enter_ts_type_params(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_params(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypePredicate` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_predicate(&mut self, node: &mut TsTypePredicate) {
        self.hook.enter_ts_type_predicate(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_predicate(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeQuery` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_query(&mut self, node: &mut TsTypeQuery) {
        self.hook.enter_ts_type_query(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_query(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeQueryExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_query_expr(&mut self, node: &mut TsTypeQueryExpr) {
        self.hook.enter_ts_type_query_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_query_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsTypeRef` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_type_ref(&mut self, node: &mut TsTypeRef) {
        self.hook.enter_ts_type_ref(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_type_ref(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < Box < TsType > >` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_types(&mut self, node: &mut Vec<Box<TsType>>) {
        self.hook.enter_ts_types(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_types(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsUnionOrIntersectionType` using the hook's enter and exit \
             methods."]
    #[inline]
    fn visit_mut_ts_union_or_intersection_type(&mut self, node: &mut TsUnionOrIntersectionType) {
        self.hook
            .enter_ts_union_or_intersection_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook
            .exit_ts_union_or_intersection_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `TsUnionType` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_ts_union_type(&mut self, node: &mut TsUnionType) {
        self.hook.enter_ts_union_type(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_ts_union_type(node, &mut self.context);
    }

    #[doc = "Visits a node of type `UnaryExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_unary_expr(&mut self, node: &mut UnaryExpr) {
        self.hook.enter_unary_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_unary_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `UnaryOp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_unary_op(&mut self, node: &mut UnaryOp) {
        self.hook.enter_unary_op(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_unary_op(node, &mut self.context);
    }

    #[doc = "Visits a node of type `UpdateExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_update_expr(&mut self, node: &mut UpdateExpr) {
        self.hook.enter_update_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_update_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `UpdateOp` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_update_op(&mut self, node: &mut UpdateOp) {
        self.hook.enter_update_op(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_update_op(node, &mut self.context);
    }

    #[doc = "Visits a node of type `UsingDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_using_decl(&mut self, node: &mut UsingDecl) {
        self.hook.enter_using_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_using_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `VarDecl` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_var_decl(&mut self, node: &mut VarDecl) {
        self.hook.enter_var_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_decl(node, &mut self.context);
    }

    #[doc = "Visits a node of type `VarDeclKind` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_var_decl_kind(&mut self, node: &mut VarDeclKind) {
        self.hook.enter_var_decl_kind(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_decl_kind(node, &mut self.context);
    }

    #[doc = "Visits a node of type `VarDeclOrExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_var_decl_or_expr(&mut self, node: &mut VarDeclOrExpr) {
        self.hook.enter_var_decl_or_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_decl_or_expr(node, &mut self.context);
    }

    #[doc = "Visits a node of type `VarDeclarator` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_var_declarator(&mut self, node: &mut VarDeclarator) {
        self.hook.enter_var_declarator(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_declarator(node, &mut self.context);
    }

    #[doc = "Visits a node of type `Vec < VarDeclarator >` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_var_declarators(&mut self, node: &mut Vec<VarDeclarator>) {
        self.hook.enter_var_declarators(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_var_declarators(node, &mut self.context);
    }

    #[doc = "Visits a node of type `WhileStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        self.hook.enter_while_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_while_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `WithStmt` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_with_stmt(&mut self, node: &mut WithStmt) {
        self.hook.enter_with_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_with_stmt(node, &mut self.context);
    }

    #[doc = "Visits a node of type `swc_atoms :: Wtf8Atom` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_wtf_8_atom(&mut self, node: &mut swc_atoms::Wtf8Atom) {
        self.hook.enter_wtf_8_atom(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_wtf_8_atom(node, &mut self.context);
    }

    #[doc = "Visits a node of type `YieldExpr` using the hook's enter and exit methods."]
    #[inline]
    fn visit_mut_yield_expr(&mut self, node: &mut YieldExpr) {
        self.hook.enter_yield_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_yield_expr(node, &mut self.context);
    }
}
