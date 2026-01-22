//! Hook utilities for composing AST visitors in the minifier.
//!
//! This module provides a hook-based API similar to `swc_ecma_transformer`
//! for combining multiple visitor operations into a single AST traversal.

use swc_ecma_ast::{
    AssignExpr, BlockStmt, BreakStmt, CallExpr, ContinueStmt, ExportDecl, ExportDefaultDecl,
    ExportDefaultExpr, Expr, FnDecl, FnExpr, Function, Ident, LabeledStmt, Module, ModuleItem,
    NamedExport, NewExpr, PrivateName, Program, Script, Stmt, TaggedTpl, UpdateExpr, VarDecl,
    VarDeclarator,
};
use swc_ecma_hooks::VisitMutHook;

/// A simple hook that does nothing. Used as a starting point for hook chains.
pub(crate) struct NoopHook;

impl<C> VisitMutHook<C> for NoopHook {}

/// Execution order: A => B (both for enter and exit)
///
/// Unlike `CompositeHook` in swc_ecma_hooks which uses reverse order for exit,
/// this chain executes both enter and exit in the same order (A then B).
pub(crate) struct OrderedChain<A, B, C>(pub A, pub B, std::marker::PhantomData<C>)
where
    A: VisitMutHook<C>,
    B: VisitMutHook<C>;

impl<A, B, C> OrderedChain<A, B, C>
where
    A: VisitMutHook<C>,
    B: VisitMutHook<C>,
{
    pub fn new(a: A, b: B) -> Self {
        Self(a, b, std::marker::PhantomData)
    }
}

macro_rules! chained_method {
    ($enter_name:ident, $exit_name:ident, $T:ty, $C:ident) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut $C) {
            self.0.$enter_name(node, ctx);
            self.1.$enter_name(node, ctx);
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut $C) {
            self.0.$exit_name(node, ctx);
            self.1.$exit_name(node, ctx);
        }
    };
}

impl<A, B, C> VisitMutHook<C> for OrderedChain<A, B, C>
where
    A: VisitMutHook<C>,
    B: VisitMutHook<C>,
{
    // Name mangling hooks
    chained_method!(enter_private_name, exit_private_name, PrivateName, C);

    chained_method!(enter_labeled_stmt, exit_labeled_stmt, LabeledStmt, C);

    chained_method!(enter_continue_stmt, exit_continue_stmt, ContinueStmt, C);

    chained_method!(enter_break_stmt, exit_break_stmt, BreakStmt, C);

    // Top-level traversal hooks
    chained_method!(enter_program, exit_program, Program, C);

    chained_method!(enter_module, exit_module, Module, C);

    chained_method!(enter_script, exit_script, Script, C);

    // Statement hooks
    chained_method!(enter_stmt, exit_stmt, Stmt, C);

    chained_method!(enter_stmts, exit_stmts, Vec<Stmt>, C);

    chained_method!(enter_block_stmt, exit_block_stmt, BlockStmt, C);

    // Module item hooks
    chained_method!(enter_module_item, exit_module_item, ModuleItem, C);

    chained_method!(enter_module_items, exit_module_items, Vec<ModuleItem>, C);

    // Expression hooks
    chained_method!(enter_expr, exit_expr, Expr, C);

    chained_method!(enter_call_expr, exit_call_expr, CallExpr, C);

    chained_method!(enter_new_expr, exit_new_expr, NewExpr, C);

    chained_method!(enter_tagged_tpl, exit_tagged_tpl, TaggedTpl, C);

    // Declaration hooks
    chained_method!(enter_var_decl, exit_var_decl, VarDecl, C);

    chained_method!(enter_var_declarator, exit_var_declarator, VarDeclarator, C);

    chained_method!(enter_fn_decl, exit_fn_decl, FnDecl, C);

    chained_method!(enter_fn_expr, exit_fn_expr, FnExpr, C);

    chained_method!(enter_function, exit_function, Function, C);

    // Export hooks
    chained_method!(
        enter_export_default_decl,
        exit_export_default_decl,
        ExportDefaultDecl,
        C
    );

    chained_method!(
        enter_export_default_expr,
        exit_export_default_expr,
        ExportDefaultExpr,
        C
    );

    chained_method!(enter_export_decl, exit_export_decl, ExportDecl, C);

    // Identifier hooks
    chained_method!(enter_ident, exit_ident, Ident, C);

    // Assignment and update expression hooks (for GlobalDefs)
    chained_method!(enter_assign_expr, exit_assign_expr, AssignExpr, C);

    chained_method!(enter_update_expr, exit_update_expr, UpdateExpr, C);

    // Named export hooks (for MergeExports)
    chained_method!(enter_named_export, exit_named_export, NamedExport, C);
}

/// A builder for composing hooks in a fluent API style.
pub(crate) struct HookBuilder<H, C>
where
    H: VisitMutHook<C>,
{
    hook: H,
    _marker: std::marker::PhantomData<C>,
}

impl<H, C> HookBuilder<H, C>
where
    H: VisitMutHook<C>,
{
    pub fn new(hook: H) -> Self {
        Self {
            hook,
            _marker: std::marker::PhantomData,
        }
    }

    pub fn chain<B>(self, hook: B) -> HookBuilder<OrderedChain<H, B, C>, C>
    where
        B: VisitMutHook<C>,
    {
        HookBuilder {
            hook: OrderedChain::new(self.hook, hook),
            _marker: std::marker::PhantomData,
        }
    }

    #[allow(dead_code)]
    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<OrderedChain<H, Option<B>, C>, C>
    where
        B: VisitMutHook<C>,
    {
        self.chain(hook)
    }

    pub fn build(self) -> H {
        self.hook
    }
}
