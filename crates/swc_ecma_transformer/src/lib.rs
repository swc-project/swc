//! ECMAScript transformer using VisitMutHook for composable AST
//! transformations.
//!
//! This crate provides a foundational framework for building composable AST
//! transformations using the `VisitMutHook` trait from `swc_ecma_hooks`.
//!
//! # Architecture
//!
//! The transformer architecture consists of three main components:
//!
//! 1. **`TraverseCtx`**: Holds shared state and context during transformations
//!    - Tracks ancestry stack for parent node queries
//!    - Provides helper methods for creating AST nodes
//!    - Manages scope depth and identifier metadata
//!    - Offers context predicates (in_function, in_loop, etc.)
//! 2. **`Transformer`**: Implements `VisitMut` by delegating to composed hooks
//!    - Automatically maintains parent tracking during traversal
//!    - Supports composing multiple transformation hooks
//! 3. **Transform Hooks**: Individual transforms that implement
//!    `VisitMutHook<TraverseCtx>`
//!
//! # Design Principles
//!
//! - **Composability**: Multiple transforms can be composed using
//!   `CompositeHook`
//! - **Single-pass**: All transforms run in a single AST traversal
//! - **Shared Context**: `TraverseCtx` provides state sharing across transforms
//! - **Type Safety**: The hook system ensures correct composition at compile
//!   time
//!
//! # Comparison with oxc_transformer
//!
//! This crate is designed to port transforms from oxc to SWC's architecture:
//!
//! - oxc uses `Traverse` trait with `TraverseCtx<TransformState>`
//! - SWC uses `VisitMut` trait for AST transformations
//! - This crate bridges the gap using `VisitMutHook<TraverseCtx>`
//!
//! # Example
//!
//! ```ignore
//! use swc_ecma_transformer::{Transformer, TraverseCtx};
//! use swc_ecma_hooks::VisitMutHook;
//! use swc_ecma_ast::*;
//! use swc_ecma_visit::VisitMutWith;
//!
//! // Define a custom transformation hook
//! struct MyTransform;
//!
//! impl VisitMutHook<TraverseCtx> for MyTransform {
//!     fn enter_function(&mut self, node: &mut Function, ctx: &mut TraverseCtx) {
//!         // Transform function nodes
//!         ctx.enter_scope();
//!     }
//!
//!     fn exit_function(&mut self, node: &mut Function, ctx: &mut TraverseCtx) {
//!         ctx.exit_scope();
//!     }
//! }
//!
//! // Use the transformer
//! let mut transformer = Transformer::with_hook(MyTransform);
//! let mut program = /* ... */;
//! program.visit_mut_with(&mut transformer);
//! ```
//!
//! # Module Organization
//!
//! Future transforms will be organized as:
//!
//! - `es2015`: ES2015 transforms (arrow functions, classes, etc.)
//! - `es2016`: ES2016 transforms (exponentiation operator)
//! - `es2017`: ES2017 transforms (async/await)
//! - `es2018`: ES2018 transforms (object rest/spread, async iteration)
//! - `es2019`: ES2019 transforms (optional catch binding)
//! - `es2020`: ES2020 transforms (optional chaining, nullish coalescing)
//! - `es2021`: ES2021 transforms (logical assignment)
//! - `es2022`: ES2022 transforms (class fields, private methods)
//! - `typescript`: TypeScript-specific transforms
//! - `jsx`: JSX/React transforms

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]

// Re-export dependencies for convenience
pub use swc_ecma_ast;
pub use swc_ecma_hooks;
pub use swc_ecma_visit;

// Core modules
mod context;
mod transformer;

// Public API exports
pub use crate::{
    context::{AncestorNode, IdentifierMetadata, TraverseCtx},
    transformer::Transformer,
};
