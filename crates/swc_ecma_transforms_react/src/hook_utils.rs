//! Hook utilities for composing AST visitors in React transforms.
//!
//! This module provides a hook-based API similar to `swc_ecma_minifier`
//! for combining multiple visitor operations into a single AST traversal.

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

/// A simple hook that does nothing. Used as a starting point for hook chains.
pub(crate) struct NoopHook;

impl VisitMutHook<()> for NoopHook {}

/// Execution order: A => B (both for enter and exit)
///
/// Unlike `CompositeHook` in swc_ecma_hooks which uses reverse order for exit,
/// this chain executes both enter and exit in the same order (A then B).
pub(crate) struct OrderedChain<A, B>(pub A, pub B)
where
    A: VisitMutHook<()>,
    B: VisitMutHook<()>;

macro_rules! chained_method {
    ($enter_name:ident, $exit_name:ident, $T:ty) => {
        fn $enter_name(&mut self, node: &mut $T, ctx: &mut ()) {
            self.0.$enter_name(node, ctx);
            self.1.$enter_name(node, ctx);
        }

        fn $exit_name(&mut self, node: &mut $T, ctx: &mut ()) {
            self.0.$exit_name(node, ctx);
            self.1.$exit_name(node, ctx);
        }
    };
}

impl<A, B> VisitMutHook<()> for OrderedChain<A, B>
where
    A: VisitMutHook<()>,
    B: VisitMutHook<()>,
{
    // Top-level traversal hooks
    chained_method!(enter_module, exit_module, Module);

    chained_method!(enter_script, exit_script, Script);

    // Module item hooks
    chained_method!(enter_module_items, exit_module_items, Vec<ModuleItem>);

    chained_method!(enter_module_decl, exit_module_decl, ModuleDecl);

    // Expression hooks
    chained_method!(enter_expr, exit_expr, Expr);

    chained_method!(enter_call_expr, exit_call_expr, CallExpr);

    chained_method!(enter_assign_expr, exit_assign_expr, AssignExpr);

    // Declaration hooks
    chained_method!(enter_var_declarator, exit_var_declarator, VarDeclarator);

    chained_method!(enter_fn_decl, exit_fn_decl, FnDecl);

    chained_method!(enter_fn_expr, exit_fn_expr, FnExpr);

    // Class hooks
    chained_method!(enter_class, exit_class, Class);

    chained_method!(enter_constructor, exit_constructor, Constructor);

    chained_method!(enter_class_method, exit_class_method, ClassMethod);

    chained_method!(enter_private_method, exit_private_method, PrivateMethod);

    chained_method!(enter_static_block, exit_static_block, StaticBlock);

    // Property hooks
    chained_method!(enter_prop, exit_prop, Prop);

    chained_method!(enter_getter_prop, exit_getter_prop, GetterProp);

    chained_method!(enter_setter_prop, exit_setter_prop, SetterProp);

    chained_method!(enter_method_prop, exit_method_prop, MethodProp);

    // JSX hooks
    chained_method!(
        enter_jsx_opening_element,
        exit_jsx_opening_element,
        JSXOpeningElement
    );

    // TypeScript hooks
    chained_method!(enter_ts_module_decl, exit_ts_module_decl, TsModuleDecl);
}

/// A builder for composing hooks in a fluent API style.
pub(crate) struct HookBuilder<H>
where
    H: VisitMutHook<()>,
{
    hook: H,
}

impl<H> HookBuilder<H>
where
    H: VisitMutHook<()>,
{
    pub fn new(hook: H) -> Self {
        Self { hook }
    }

    pub fn chain<B>(self, hook: B) -> HookBuilder<impl VisitMutHook<()>>
    where
        B: VisitMutHook<()>,
    {
        HookBuilder {
            hook: OrderedChain(self.hook, hook),
        }
    }

    #[allow(dead_code)]
    pub fn chain_optional<B>(self, hook: Option<B>) -> HookBuilder<impl VisitMutHook<()>>
    where
        B: VisitMutHook<()>,
    {
        self.chain(hook)
    }

    pub fn build(self) -> impl VisitMutHook<()> {
        self.hook
    }
}
