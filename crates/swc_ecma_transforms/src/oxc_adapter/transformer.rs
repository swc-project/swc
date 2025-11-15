/// Base Transformer infrastructure for executing VisitMutHook implementations.
///
/// This module provides the bridge between SWC's `VisitMut` trait and the
/// `VisitMutHook` pattern, enabling composable transformers.
///
/// # Architecture
///
/// ```text
/// ┌─────────────────────────────────────────────────────┐
/// │              Program (AST Root)                     │
/// └────────────────┬────────────────────────────────────┘
///                  │
///                  │ visit_mut_with()
///                  ▼
/// ┌─────────────────────────────────────────────────────┐
/// │         Transformer<Hook, Context>                  │
/// │         (implements VisitMut)                       │
/// └────────────────┬────────────────────────────────────┘
///                  │
///                  │ For each AST node:
///                  │ 1. hook.enter_*(&mut node, &mut ctx)
///                  │ 2. node.visit_mut_children_with(self)
///                  │ 3. hook.exit_*(&mut node, &mut ctx)
///                  ▼
/// ┌─────────────────────────────────────────────────────┐
/// │         Hook (implements VisitMutHook<Ctx>)         │
/// │         - ES2020Transform                           │
/// │         - TypeScriptTransform                       │
/// │         - etc.                                      │
/// └─────────────────────────────────────────────────────┘
/// ```
///
/// # Example
///
/// ```rust,ignore
/// use swc_ecma_ast::*;
/// use swc_ecma_visit::VisitMut;
/// use swc_ecma_hooks::VisitMutHook;
/// use swc_ecma_transforms::oxc_adapter::{Transformer, TraverseCtx};
///
/// // Define your transform as a VisitMutHook
/// struct MyTransform;
///
/// impl VisitMutHook<TraverseCtx> for MyTransform {
///     fn enter_expr(&mut self, node: &mut Expr, ctx: &mut TraverseCtx) {
///         // Transform logic
///     }
/// }
///
/// // Create and use the transformer
/// let hook = MyTransform;
/// let context = TraverseCtx::new();
/// let mut transformer = Transformer::new(hook, context);
///
/// // Apply to AST
/// program.visit_mut_with(&mut transformer);
/// ```
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;
use swc_ecma_visit::{VisitMut, VisitMutWith};

use super::TraverseCtx;

/// A transformer that implements VisitMut by delegating to a VisitMutHook.
///
/// This is the core adapter that allows hook-based transformers to work
/// within SWC's visitor pattern.
///
/// # Type Parameters
///
/// - `H`: The hook type that implements `VisitMutHook<C>`
/// - `C`: The context type passed through all hook methods
pub struct Transformer<H, C = TraverseCtx> {
    /// The hook that implements the transformation logic
    pub hook: H,

    /// The context passed to all hook methods
    pub context: C,
}

impl<H, C> Transformer<H, C> {
    /// Creates a new Transformer with the given hook and context.
    ///
    /// # Arguments
    ///
    /// * `hook` - The hook implementation
    /// * `context` - The context to pass to hook methods
    ///
    /// # Example
    ///
    /// ```rust,ignore
    /// let transformer = Transformer::new(MyHook, TraverseCtx::new());
    /// ```
    pub fn new(hook: H, context: C) -> Self {
        Self { hook, context }
    }

    /// Gets a reference to the hook
    pub fn hook(&self) -> &H {
        &self.hook
    }

    /// Gets a mutable reference to the hook
    pub fn hook_mut(&mut self) -> &mut H {
        &mut self.hook
    }

    /// Gets a reference to the context
    pub fn context(&self) -> &C {
        &self.context
    }

    /// Gets a mutable reference to the context
    pub fn context_mut(&mut self) -> &mut C {
        &mut self.context
    }

    /// Consumes the transformer and returns the hook and context
    pub fn into_parts(self) -> (H, C) {
        (self.hook, self.context)
    }
}

// Note: The actual VisitMut implementation will be provided by VisitMutWithHook
// from swc_ecma_hooks, which already implements this pattern.
//
// For now, we provide a simplified implementation for demonstration purposes.
// In production, you would use: VisitMutWithHook { hook, context }

impl<H> VisitMut for Transformer<H, TraverseCtx>
where
    H: VisitMutHook<TraverseCtx>,
{
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

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        self.context.enter_node();
        self.hook.enter_expr(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_expr(node, &mut self.context);
        self.context.exit_node();
    }

    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        self.context.enter_node();
        self.hook.enter_stmt(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_stmt(node, &mut self.context);
        self.context.exit_node();
    }

    fn visit_mut_decl(&mut self, node: &mut Decl) {
        self.hook.enter_decl(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_decl(node, &mut self.context);
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        self.hook.enter_class(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_class(node, &mut self.context);
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        self.hook.enter_function(node, &mut self.context);
        node.visit_mut_children_with(self);
        self.hook.exit_function(node, &mut self.context);
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    struct TestHook {
        enter_count: usize,
        exit_count: usize,
    }

    impl VisitMutHook<TraverseCtx> for TestHook {
        fn enter_expr(&mut self, _node: &mut Expr, _ctx: &mut TraverseCtx) {
            self.enter_count += 1;
        }

        fn exit_expr(&mut self, _node: &mut Expr, _ctx: &mut TraverseCtx) {
            self.exit_count += 1;
        }
    }

    #[test]
    fn test_transformer_creation() {
        let hook = TestHook {
            enter_count: 0,
            exit_count: 0,
        };
        let context = TraverseCtx::new();
        let transformer = Transformer::new(hook, context);

        assert_eq!(transformer.hook().enter_count, 0);
        assert_eq!(transformer.hook().exit_count, 0);
    }

    #[test]
    fn test_transformer_into_parts() {
        let hook = TestHook {
            enter_count: 0,
            exit_count: 0,
        };
        let context = TraverseCtx::new();
        let transformer = Transformer::new(hook, context);

        let (hook, _context) = transformer.into_parts();
        assert_eq!(hook.enter_count, 0);
        assert_eq!(hook.exit_count, 0);
    }
}
