//! Main transformer orchestrator that delegates to hooks.
//!
//! This module provides the `Transformer` type which is the main entry point
//! for composing multiple transformation hooks into a single AST visitor.

use swc_ecma_hooks::{CompositeHook, VisitMutHook, VisitMutWithHook};

use crate::TraverseCtx;

/// A transformer that orchestrates multiple transformation hooks.
///
/// This is a type alias for `VisitMutWithHook` configured with `TraverseCtx`.
/// It provides a way to compose multiple transformation hooks together and
/// execute them in a single AST traversal pass.
pub type Transformer<H> = VisitMutWithHook<H, TraverseCtx>;

/// Builder for creating transformers with multiple hooks.
pub struct TransformerBuilder<H> {
    context: TraverseCtx,
    hook: H,
}

impl TransformerBuilder<()> {
    /// Creates a new builder with the first hook.
    pub fn new<H>(context: TraverseCtx, hook: H) -> TransformerBuilder<H>
    where
        H: VisitMutHook<TraverseCtx>,
    {
        TransformerBuilder { context, hook }
    }
}

impl<H> TransformerBuilder<H>
where
    H: VisitMutHook<TraverseCtx>,
{
    /// Adds another hook to the transformer.
    pub fn with_hook<H2>(self, hook: H2) -> TransformerBuilder<CompositeHook<H, H2>>
    where
        H2: VisitMutHook<TraverseCtx>,
    {
        TransformerBuilder {
            context: self.context,
            hook: CompositeHook {
                first: self.hook,
                second: hook,
            },
        }
    }

    /// Builds the final transformer.
    pub fn build(self) -> Transformer<H> {
        VisitMutWithHook {
            hook: self.hook,
            context: self.context,
        }
    }
}

#[cfg(test)]
mod tests {
    use swc_atoms::{atom, Atom};
    use swc_common::DUMMY_SP;
    use swc_ecma_ast::*;
    use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
    use swc_ecma_visit::VisitMutWith;

    use super::*;

    #[derive(Default)]
    struct CountingHook {
        enter_count: usize,
        exit_count: usize,
    }

    impl VisitMutHook<TraverseCtx> for CountingHook {
        fn enter_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.enter_count += 1;
        }

        fn exit_expr(&mut self, _expr: &mut Expr, _ctx: &mut TraverseCtx) {
            self.exit_count += 1;
        }
    }

    #[test]
    fn test_transformer_basic() {
        let ctx = TraverseCtx::default();
        let hook = CountingHook::default();
        let mut transformer = VisitMutWithHook { hook, context: ctx };

        let mut expr = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
        expr.visit_mut_with(&mut transformer);

        assert_eq!(transformer.hook.enter_count, 1);
        assert_eq!(transformer.hook.exit_count, 1);
    }

    #[test]
    fn test_transformer_nested() {
        let ctx = TraverseCtx::default();
        let hook = CountingHook::default();
        let mut transformer = VisitMutWithHook { hook, context: ctx };

        let mut expr = Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: BinaryOp::Add,
            left: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
            right: Box::new(Expr::Lit(Lit::Null(Null { span: DUMMY_SP }))),
        });

        expr.visit_mut_with(&mut transformer);

        assert_eq!(transformer.hook.enter_count, 3);
        assert_eq!(transformer.hook.exit_count, 3);
    }

    #[test]
    fn test_transformer_builder() {
        let ctx = TraverseCtx::default();
        let hook1 = CountingHook::default();
        let hook2 = CountingHook::default();

        let mut transformer = TransformerBuilder::new(ctx, hook1).with_hook(hook2).build();

        let mut expr = Expr::Lit(Lit::Null(Null { span: DUMMY_SP }));
        expr.visit_mut_with(&mut transformer);

        assert_eq!(transformer.hook.first.enter_count, 1);
        assert_eq!(transformer.hook.second.enter_count, 1);
    }

    #[derive(Default)]
    struct IdentifierReplacer {
        from: String,
        to: String,
    }

    impl VisitMutHook<TraverseCtx> for IdentifierReplacer {
        fn enter_ident(&mut self, ident: &mut Ident, _ctx: &mut TraverseCtx) {
            if *ident.sym == *self.from {
                ident.sym = Atom::from(&*self.to);
            }
        }
    }

    #[test]
    fn test_transformer_actual_transformation() {
        let ctx = TraverseCtx::default();
        let hook = IdentifierReplacer {
            from: "foo".to_string(),
            to: "bar".to_string(),
        };
        let mut transformer = VisitMutWithHook { hook, context: ctx };

        let mut ident = Ident::new(atom!("foo"), DUMMY_SP, Default::default());
        ident.visit_mut_with(&mut transformer);

        assert_eq!(&*ident.sym, "bar");
    }
}
