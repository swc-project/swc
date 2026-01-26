use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::TraverseCtx;

macro_rules! chained_method {
    ($enter_name:ident, $exit_name:ident, $T:ty) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut TraverseCtx) {
            self.0.$enter_name(node, ctx);
            self.1.$enter_name(node, ctx);
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut TraverseCtx) {
            self.0.$exit_name(node, ctx);
            self.1.$exit_name(node, ctx);
        }
    };
}

/// Execution order: A => B (both for enter and exit)
pub(crate) struct OrderedChain<A, B>(pub A, pub B)
where
    A: VisitMutHook<TraverseCtx>,
    B: VisitMutHook<TraverseCtx>;

impl<A, B> VisitMutHook<TraverseCtx> for OrderedChain<A, B>
where
    A: VisitMutHook<TraverseCtx>,
    B: VisitMutHook<TraverseCtx>,
{
    chained_method!(enter_expr, exit_expr, Expr);

    chained_method!(enter_expr_stmt, exit_expr_stmt, ExprStmt);

    chained_method!(enter_pat, exit_pat, Pat);

    chained_method!(enter_stmt, exit_stmt, Stmt);

    chained_method!(enter_stmts, exit_stmts, Vec<Stmt>);

    chained_method!(enter_block_stmt, exit_block_stmt, BlockStmt);

    chained_method!(enter_module_item, exit_module_item, ModuleItem);

    chained_method!(enter_module_items, exit_module_items, Vec<ModuleItem>);

    chained_method!(enter_module, exit_module, Module);

    chained_method!(enter_script, exit_script, Script);

    chained_method!(enter_program, exit_program, Program);

    chained_method!(enter_catch_clause, exit_catch_clause, CatchClause);

    chained_method!(enter_function, exit_function, Function);

    chained_method!(enter_arrow_expr, exit_arrow_expr, ArrowExpr);

    chained_method!(enter_class, exit_class, Class);

    chained_method!(enter_constructor, exit_constructor, Constructor);

    chained_method!(enter_getter_prop, exit_getter_prop, GetterProp);

    chained_method!(enter_setter_prop, exit_setter_prop, SetterProp);

    chained_method!(enter_super, exit_super, Super);

    chained_method!(enter_var_decl, exit_var_decl, VarDecl);

    chained_method!(enter_for_in_stmt, exit_for_in_stmt, ForInStmt);

    chained_method!(enter_for_of_stmt, exit_for_of_stmt, ForOfStmt);

    chained_method!(enter_class_decl, exit_class_decl, ClassDecl);

    chained_method!(enter_class_expr, exit_class_expr, ClassExpr);

    chained_method!(enter_assign_pat, exit_assign_pat, AssignPat);

    chained_method!(enter_private_prop, exit_private_prop, PrivateProp);

    chained_method!(enter_prop, exit_prop, Prop);

    chained_method!(enter_assign_expr, exit_assign_expr, AssignExpr);

    chained_method!(enter_key_value_prop, exit_key_value_prop, KeyValueProp);

    chained_method!(enter_var_declarator, exit_var_declarator, VarDeclarator);

    chained_method!(enter_bin_expr, exit_bin_expr, BinExpr);

    chained_method!(enter_fn_decl, exit_fn_decl, FnDecl);

    chained_method!(enter_object_pat, exit_object_pat, ObjectPat);

    chained_method!(
        enter_block_stmt_or_expr,
        exit_block_stmt_or_expr,
        BlockStmtOrExpr
    );
}

pub(crate) struct NoopHook;

impl VisitMutHook<TraverseCtx> for NoopHook {}

pub(crate) struct HookBuilder<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    hook: H,
}

impl<H> HookBuilder<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    pub fn new(hook: H) -> Self {
        Self { hook }
    }

    pub fn chain<B>(self, hook: B) -> HookBuilder<impl VisitMutHook<TraverseCtx>>
    where
        B: VisitMutHook<TraverseCtx>,
    {
        HookBuilder {
            hook: OrderedChain(self.hook, hook),
        }
    }

    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<impl VisitMutHook<TraverseCtx>>
    where
        B: VisitMutHook<TraverseCtx>,
    {
        self.chain(hook)
    }

    pub fn build(self) -> impl VisitMutHook<TraverseCtx> {
        self.hook
    }
}
