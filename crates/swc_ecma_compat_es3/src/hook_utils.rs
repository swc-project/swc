//! Hook utilities for composing AST visitors.
//!
//! This module provides a hook-based API for combining multiple visitor
//! operations into a single AST traversal.

use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

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
    // MemberExpr hooks (for member_expression_literals)
    chained_method!(enter_member_expr, exit_member_expr, MemberExpr, C);

    // PropName hooks (for property_literals)
    chained_method!(enter_prop_name, exit_prop_name, PropName, C);

    // Ident hooks (for reserved_words)
    chained_method!(enter_ident, exit_ident, Ident, C);

    // Module item hooks (for reserved_words export handling)
    chained_method!(enter_module_items, exit_module_items, Vec<ModuleItem>, C);

    chained_method!(
        enter_export_named_specifier,
        exit_export_named_specifier,
        ExportNamedSpecifier,
        C
    );

    chained_method!(enter_named_export, exit_named_export, NamedExport, C);

    chained_method!(
        enter_import_named_specifier,
        exit_import_named_specifier,
        ImportNamedSpecifier,
        C
    );

    // Top-level traversal hooks
    chained_method!(enter_program, exit_program, Program, C);

    chained_method!(enter_module, exit_module, Module, C);

    chained_method!(enter_script, exit_script, Script, C);
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

    pub fn build(self) -> H {
        self.hook
    }
}
