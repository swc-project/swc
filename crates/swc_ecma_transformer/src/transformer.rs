//! Main transformer implementation using VisitMutHook architecture.
//!
//! This module provides the `Transformer` struct that implements `VisitMut`
//! by delegating to multiple child transformation hooks that implement
//! `VisitMutHook<TraverseCtx>`.

use swc_ecma_ast::*;
use swc_ecma_hooks::{CompositeHook, VisitMutHook};
use swc_ecma_visit::{VisitMut, VisitMutWith};

use crate::context::{AncestorNode, TraverseCtx};

/// Main transformer that coordinates multiple transformation passes.
///
/// The `Transformer` struct holds multiple child transformation hooks and
/// implements the `VisitMut` trait by delegating to those hooks. Each child
/// hook implements `VisitMutHook<TraverseCtx>` and receives the shared context.
///
/// # Architecture
///
/// This design follows the pattern:
/// - `Transformer` implements `VisitMut` (the standard SWC visitor trait)
/// - Child transforms implement `VisitMutHook<TraverseCtx>` (the composable
///   hook trait)
/// - `TraverseCtx` holds shared state across all transformations
///
/// # Example
///
/// ```ignore
/// use swc_ecma_transformer::{Transformer, TraverseCtx};
/// use swc_ecma_ast::*;
/// use swc_ecma_visit::VisitMutWith;
///
/// let mut transformer = Transformer::new();
/// let mut program = /* ... */;
/// program.visit_mut_with(&mut transformer);
/// ```
pub struct Transformer<H> {
    /// The composed hook containing all child transformations
    hook: H,

    /// Shared context passed to all transformation hooks
    context: TraverseCtx,
}

impl Transformer<()> {
    /// Creates a new empty transformer with no hooks.
    pub fn new() -> Self {
        Self {
            hook: (),
            context: TraverseCtx::new(),
        }
    }
}

impl Default for Transformer<()> {
    fn default() -> Self {
        Self::new()
    }
}

impl<H> Transformer<H> {
    /// Creates a transformer with a specific hook.
    pub fn with_hook(hook: H) -> Self {
        Self {
            hook,
            context: TraverseCtx::new(),
        }
    }

    /// Adds a new hook to the transformer, composing it with existing hooks.
    ///
    /// This allows building up a transformer by chaining multiple
    /// transformation passes together.
    pub fn add_hook<NewH>(self, new_hook: NewH) -> Transformer<CompositeHook<H, NewH>>
    where
        H: VisitMutHook<TraverseCtx>,
        NewH: VisitMutHook<TraverseCtx>,
    {
        Transformer {
            hook: CompositeHook {
                first: self.hook,
                second: new_hook,
            },
            context: self.context,
        }
    }

    /// Gets a reference to the transformation context.
    pub fn context(&self) -> &TraverseCtx {
        &self.context
    }

    /// Gets a mutable reference to the transformation context.
    pub fn context_mut(&mut self) -> &mut TraverseCtx {
        &mut self.context
    }

    /// Consumes the transformer and returns the context.
    pub fn into_context(self) -> TraverseCtx {
        self.context
    }
}

// Special implementation for empty transformer (no hooks)
impl VisitMut for Transformer<()> {
    // No-op implementations - just visit children
    fn visit_mut_program(&mut self, node: &mut Program) {
        node.visit_mut_children_with(self);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        node.visit_mut_children_with(self);
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        node.visit_mut_children_with(self);
    }
}

impl<H> VisitMut for Transformer<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    /// Delegates to the hook-based visitor implementation.
    ///
    /// This is the key integration point: we wrap ourselves in a way that
    /// allows the hook system to work properly. We delegate all visit_mut_*
    /// methods to a VisitMutWithHook wrapper.
    fn visit_mut_program(&mut self, node: &mut Program) {
        // Create a VisitMutWithHook adapter that properly delegates
        let mut adapter = HookAdapter { transformer: self };
        node.visit_mut_with(&mut adapter);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        let mut adapter = HookAdapter { transformer: self };
        node.visit_mut_with(&mut adapter);
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        let mut adapter = HookAdapter { transformer: self };
        node.visit_mut_with(&mut adapter);
    }
}

/// Internal adapter to properly delegate to the hook system.
struct HookAdapter<'a, H> {
    transformer: &'a mut Transformer<H>,
}

impl<'a, H> VisitMut for HookAdapter<'a, H>
where
    H: VisitMutHook<TraverseCtx>,
{
    // Delegate to VisitMutWithHook by forwarding all methods
    fn visit_mut_program(&mut self, node: &mut Program) {
        self.transformer
            .hook
            .enter_program(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_program(node, &mut self.transformer.context);
    }

    fn visit_mut_module(&mut self, node: &mut Module) {
        self.transformer
            .hook
            .enter_module(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_module(node, &mut self.transformer.context);
    }

    fn visit_mut_script(&mut self, node: &mut Script) {
        self.transformer
            .hook
            .enter_script(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_script(node, &mut self.transformer.context);
    }

    // Implement other visitor methods to properly delegate through hooks
    fn visit_mut_stmt(&mut self, node: &mut Stmt) {
        self.transformer
            .hook
            .enter_stmt(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_stmt(node, &mut self.transformer.context);
    }

    fn visit_mut_expr(&mut self, node: &mut Expr) {
        self.transformer
            .hook
            .enter_expr(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_expr(node, &mut self.transformer.context);
    }

    fn visit_mut_function(&mut self, node: &mut Function) {
        self.transformer
            .context
            .push_ancestor(AncestorNode::Function);
        self.transformer
            .hook
            .enter_function(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_function(node, &mut self.transformer.context);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_arrow_expr(&mut self, node: &mut ArrowExpr) {
        self.transformer
            .context
            .push_ancestor(AncestorNode::ArrowFunction);
        self.transformer
            .hook
            .enter_arrow_expr(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_arrow_expr(node, &mut self.transformer.context);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        self.transformer.context.push_ancestor(AncestorNode::Class);
        self.transformer
            .hook
            .enter_class(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_class(node, &mut self.transformer.context);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_block_stmt(&mut self, node: &mut BlockStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Block);
        self.transformer
            .hook
            .enter_block_stmt(node, &mut self.transformer.context);
        node.visit_mut_children_with(self);
        self.transformer
            .hook
            .exit_block_stmt(node, &mut self.transformer.context);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_for_stmt(&mut self, node: &mut ForStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Loop);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_for_in_stmt(&mut self, node: &mut ForInStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Loop);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_for_of_stmt(&mut self, node: &mut ForOfStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Loop);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_while_stmt(&mut self, node: &mut WhileStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Loop);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_do_while_stmt(&mut self, node: &mut DoWhileStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Loop);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_try_stmt(&mut self, node: &mut TryStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Try);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_catch_clause(&mut self, node: &mut CatchClause) {
        self.transformer.context.push_ancestor(AncestorNode::Catch);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_switch_stmt(&mut self, node: &mut SwitchStmt) {
        self.transformer.context.push_ancestor(AncestorNode::Switch);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        self.transformer.context.push_ancestor(AncestorNode::If);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_cond_expr(&mut self, node: &mut CondExpr) {
        self.transformer
            .context
            .push_ancestor(AncestorNode::Conditional);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        self.transformer.context.push_ancestor(AncestorNode::Call);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_with_stmt(&mut self, node: &mut WithStmt) {
        self.transformer.context.push_ancestor(AncestorNode::With);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_class_method(&mut self, node: &mut ClassMethod) {
        self.transformer.context.push_ancestor(AncestorNode::Method);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }

    fn visit_mut_private_method(&mut self, node: &mut PrivateMethod) {
        self.transformer.context.push_ancestor(AncestorNode::Method);
        node.visit_mut_children_with(self);
        self.transformer.context.pop_ancestor();
    }
}

/// Example hook implementation (for documentation purposes).
///
/// This demonstrates how to implement a transformation hook.
#[cfg(doc)]
mod example {
    use super::*;

    /// Example transform that tracks function depth.
    struct FunctionDepthTracker {
        max_depth: usize,
    }

    impl VisitMutHook<TraverseCtx> for FunctionDepthTracker {
        fn enter_function(&mut self, _node: &mut Function, ctx: &mut TraverseCtx) {
            ctx.enter_scope();
            if ctx.scope_depth() > self.max_depth {
                self.max_depth = ctx.scope_depth();
            }
        }

        fn exit_function(&mut self, _node: &mut Function, ctx: &mut TraverseCtx) {
            ctx.exit_scope();
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    /// Test that the transformer can be instantiated.
    #[test]
    fn test_transformer_creation() {
        let transformer = Transformer::new();
        assert_eq!(transformer.context().scope_depth(), 0);
    }

    /// Test adding hooks to a transformer.
    #[test]
    fn test_add_hook() {
        // Create simple test hooks
        struct FirstHook;
        impl VisitMutHook<TraverseCtx> for FirstHook {}

        struct SecondHook;
        impl VisitMutHook<TraverseCtx> for SecondHook {}

        let transformer = Transformer::with_hook(FirstHook);
        let _transformer_with_hooks = transformer.add_hook(SecondHook);
    }
}
