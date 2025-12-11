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

    optional_method!(enter_function, exit_function, Function);

    optional_method!(enter_arrow_expr, exit_arrow_expr, ArrowExpr);

    optional_method!(enter_class, exit_class, Class);

    optional_method!(enter_constructor, exit_constructor, Constructor);

    optional_method!(enter_getter_prop, exit_getter_prop, GetterProp);

    optional_method!(enter_setter_prop, exit_setter_prop, SetterProp);

    optional_method!(enter_super, exit_super, Super);

    optional_method!(enter_var_decl, exit_var_decl, VarDecl);

    optional_method!(enter_for_in_stmt, exit_for_in_stmt, ForInStmt);

    optional_method!(enter_for_of_stmt, exit_for_of_stmt, ForOfStmt);
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
                first: hook,
                second: self.hook,
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
