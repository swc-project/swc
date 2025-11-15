//! Hook-based transformer architecture for SWC, inspired by OXC.
//!
//! This crate provides infrastructure for composing AST transformations using a
//! hooks-based API, similar to how OXC's transformer works. Instead of
//! implementing `VisitMut` directly, individual transforms implement
//! `VisitMutHook<TraverseCtx>` which provides `enter_*` and `exit_*` methods
//! for each AST node type.
//!
//! # Architecture
//!
//! The architecture follows OXC's design:
//!
//! - **`TraverseCtx`**: A context type that provides utilities for AST
//!   transformation, including unique identifier generation, AST helper
//!   methods, etc.
//!
//! - **`Transformer`**: The main orchestrator that implements `VisitMut` and
//!   delegates to composed hooks. All transforms run in a single AST traversal
//!   pass for performance.
//!
//! - **Individual Transforms**: ES20xx transforms, TypeScript, etc. implement
//!   `VisitMutHook<TraverseCtx>` instead of `VisitMut` directly.
//!
//! # Benefits
//!
//! - **Single-pass**: All transforms run in one AST traversal, improving
//!   performance
//! - **Composable**: Hooks can be easily composed using `CompositeHook`
//! - **Maintainable**: Each transform is isolated and follows a consistent
//!   pattern
//! - **Testable**: Individual hooks can be tested independently
//!
//! # Comparison to Direct `VisitMut` Usage
//!
//! ## Traditional Approach (Direct `VisitMut`)
//!
//! ```rust,ignore
//! use swc_ecma_visit::{VisitMut, VisitMutWith};
//!
//! struct Transform1;
//! impl VisitMut for Transform1 {
//!     fn visit_mut_expr(&mut self, expr: &mut Expr) {
//!         // Transform logic
//!         expr.visit_mut_children_with(self);
//!     }
//! }
//!
//! struct Transform2;
//! impl VisitMut for Transform2 {
//!     fn visit_mut_expr(&mut self, expr: &mut Expr) {
//!         // Transform logic
//!         expr.visit_mut_children_with(self);
//!     }
//! }
//!
//! // Need multiple passes through the AST
//! program.visit_mut_with(&mut Transform1);
//! program.visit_mut_with(&mut Transform2);
//! ```
//!
//! ## Hook-based Approach (This Crate)
//!
//! ```rust
//! use swc_ecma_transformer::{Transformer, TransformerBuilder, TraverseCtx};
//! use swc_ecma_hooks::VisitMutHook;
//! use swc_ecma_ast::*;
//! use swc_ecma_visit::VisitMutWith;
//! use swc_common::Mark;
//!
//! #[derive(Default)]
//! struct Transform1;
//! impl VisitMutHook<TraverseCtx> for Transform1 {
//!     fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
//!         // Transform logic with access to context utilities
//!     }
//!
//!     fn exit_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
//!         // Post-traversal logic
//!     }
//! }
//!
//! #[derive(Default)]
//! struct Transform2;
//! impl VisitMutHook<TraverseCtx> for Transform2 {
//!     fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
//!         // Transform logic
//!     }
//! }
//!
//! // Single pass through the AST with both transforms
//! let ctx = TraverseCtx::new();
//! let mut transformer = TransformerBuilder::new(ctx, Transform1::default())
//!     .with_hook(Transform2::default())
//!     .build();
//!
//! // program.visit_mut_with(&mut transformer);
//! ```
//!
//! # Usage Example: Simple Identifier Renamer
//!
//! ```rust
//! use swc_ecma_transformer::{Transformer, TraverseCtx};
//! use swc_ecma_hooks::{VisitMutHook, VisitMutWithHook};
//! use swc_ecma_ast::*;
//! use swc_ecma_visit::VisitMutWith;
//! use swc_atoms::{atom, Atom};
//!
//! /// A transform that renames identifiers
//! struct IdentifierRenamer {
//!     from: String,
//!     to: String,
//! }
//!
//! impl VisitMutHook<TraverseCtx> for IdentifierRenamer {
//!     fn enter_ident(&mut self, ident: &mut Ident, _ctx: &mut TraverseCtx) {
//!         if &*ident.sym == self.from {
//!             ident.sym = Atom::from(&*self.to);
//!         }
//!     }
//! }
//!
//! // Create and use the transformer
//! let ctx = TraverseCtx::new();
//! let hook = IdentifierRenamer {
//!     from: "oldName".to_string(),
//!     to: "newName".to_string(),
//! };
//! let mut transformer = VisitMutWithHook { hook, context: ctx };
//!
//! // Transform your AST
//! // program.visit_mut_with(&mut transformer);
//! ```
//!
//! # Usage Example: Using Context Utilities
//!
//! ```rust
//! use swc_ecma_transformer::{Transformer, TraverseCtx};
//! use swc_ecma_hooks::VisitMutHook;
//! use swc_ecma_ast::*;
//! use swc_common::{Mark, DUMMY_SP};
//!
//! /// A transform that creates temporary variables
//! struct TempVarGenerator {
//!     temps_created: usize,
//! }
//!
//! impl VisitMutHook<TraverseCtx> for TempVarGenerator {
//!     fn enter_expr(&mut self, expr: &mut Expr, ctx: &mut TraverseCtx) {
//!         // Generate a unique temporary identifier
//!         let temp_id = ctx.create_unique_ident("temp");
//!         self.temps_created += 1;
//!
//!         // Use the identifier in your transformation
//!         // ...
//!     }
//! }
//! ```
//!
//! # Migration Guide
//!
//! To migrate from direct `VisitMut` usage to this hook-based approach:
//!
//! 1. **Change the trait**: Instead of `impl VisitMut for MyTransform`, use
//!    `impl VisitMutHook<TraverseCtx> for MyTransform`
//!
//! 2. **Split visit methods**: Replace `visit_mut_*` with `enter_*` and
//!    `exit_*`:
//!    - Code before `visit_mut_children_with` -> `enter_*`
//!    - Code after `visit_mut_children_with` -> `exit_*`
//!
//! 3. **Remove manual traversal**: Don't call `visit_mut_children_with` - the
//!    framework handles traversal automatically
//!
//! 4. **Add context parameter**: All hook methods receive `&mut TraverseCtx`
//!    for utilities
//!
//! 5. **Use `Transformer`**: Instead of directly using your transform as a
//!    visitor, wrap it in a `Transformer`: ```rust,ignore let transformer =
//!    Transformer::new(ctx, my_hook); program.visit_mut_with(&mut transformer);
//!    ```
//!
//! # Performance Considerations
//!
//! Per the SWC project guidelines, performance is a top priority. This
//! architecture achieves performance through:
//!
//! - **Single-pass traversal**: All transforms run in one pass through the AST
//! - **Zero-cost abstractions**: The hook composition compiles down to
//!   efficient code
//! - **Minimal allocations**: Context utilities reuse allocations where
//!   possible
//! - **Inline-friendly**: Small hook methods are marked `#[inline]` for
//!   optimization

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]

pub use swc_ecma_ast;
pub use swc_ecma_hooks;
pub use swc_ecma_visit;

mod context;
mod transformer;

pub use context::TraverseCtx;
pub use transformer::{Transformer, TransformerBuilder};
