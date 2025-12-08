use swc_ecma_ast::*;
use swc_ecma_hooks::{CompositeHook, VisitMutHook};

use crate::TraverseCtx;

pub(crate) struct OptionalHook<H>(pub Option<H>)
where
    H: VisitMutHook<TraverseCtx>;

macro_rules! optional_method {
    ($enter_name:ident, $exit_name:ident, $T:ty) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut TraverseCtx) {
            if let Some(hook) = &mut self.0 {
                hook.$enter_name(node, ctx);
            }
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut TraverseCtx) {
            if let Some(hook) = &mut self.0 {
                hook.$exit_name(node, ctx);
            }
        }
    };
}

impl<H> VisitMutHook<TraverseCtx> for OptionalHook<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    // TODO: Implement lots of hooks, or move it to `swc_ecma_hooks`

    optional_method!(enter_expr, exit_expr, Expr);

    optional_method!(enter_expr_stmt, exit_expr_stmt, ExprStmt);

    optional_method!(enter_pat, exit_pat, Pat);

    optional_method!(enter_stmt, exit_stmt, Stmt);

    optional_method!(enter_stmts, exit_stmts, Vec<Stmt>);

    optional_method!(enter_block_stmt, exit_block_stmt, BlockStmt);

    optional_method!(enter_module_item, exit_module_item, ModuleItem);

    optional_method!(enter_module_items, exit_module_items, Vec<ModuleItem>);

    optional_method!(enter_module, exit_module, Module);

    optional_method!(enter_script, exit_script, Script);

    optional_method!(enter_program, exit_program, Program);

    optional_method!(enter_catch_clause, exit_catch_clause, CatchClause);

    optional_method!(enter_for_in_stmt, exit_for_in_stmt, ForInStmt);

    optional_method!(enter_for_of_stmt, exit_for_of_stmt, ForOfStmt);

    optional_method!(enter_for_stmt, exit_for_stmt, ForStmt);

    optional_method!(enter_while_stmt, exit_while_stmt, WhileStmt);

    optional_method!(enter_do_while_stmt, exit_do_while_stmt, DoWhileStmt);

    optional_method!(enter_switch_stmt, exit_switch_stmt, SwitchStmt);

    optional_method!(enter_labeled_stmt, exit_labeled_stmt, LabeledStmt);

    optional_method!(enter_break_stmt, exit_break_stmt, BreakStmt);

    optional_method!(enter_continue_stmt, exit_continue_stmt, ContinueStmt);

    optional_method!(enter_return_stmt, exit_return_stmt, ReturnStmt);

    optional_method!(enter_throw_stmt, exit_throw_stmt, ThrowStmt);

    optional_method!(enter_try_stmt, exit_try_stmt, TryStmt);

    optional_method!(enter_with_stmt, exit_with_stmt, WithStmt);

    optional_method!(enter_debugger_stmt, exit_debugger_stmt, DebuggerStmt);

    optional_method!(enter_function, exit_function, Function);

    optional_method!(enter_arrow_expr, exit_arrow_expr, ArrowExpr);

    optional_method!(enter_var_decl, exit_var_decl, VarDecl);

    optional_method!(enter_var_declarator, exit_var_declarator, VarDeclarator);
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
            hook: CompositeHook {
                first: self.hook,
                second: hook,
            },
        }
    }

    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<impl VisitMutHook<TraverseCtx>>
    where
        B: VisitMutHook<TraverseCtx>,
    {
        self.chain(OptionalHook(hook))
    }

    pub fn build(self) -> impl VisitMutHook<TraverseCtx> {
        self.hook
    }
}
