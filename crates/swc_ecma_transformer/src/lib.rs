//! Hook-based AST transformer for SWC ECMAScript.
//!
//! This crate provides a composable transformer architecture that uses the
//! hook-based pattern from `swc_ecma_hooks`. Unlike the existing
//! `swc_ecma_transforms_*` crates which use the visitor pattern directly, this
//! crate allows for better composition and organization of transforms through
//! the `VisitMutHook` trait.
//!
//! # Architecture
//!
//! The main `Transformer` struct implements the `VisitMut` trait and delegates
//! to child transforms that implement `VisitMutHook<TransformCtx>`. This allows
//! for:
//!
//! - Better separation of concerns
//! - Easier composition of transforms
//! - Shared context across all transforms
//! - Clear enter/exit semantics for each AST node
//!
//! # Example
//!
//! ```rust,ignore
//! use swc_ecma_transformer::{Transformer, TransformCtx, TransformerOptions};
//! use swc_ecma_visit::VisitMutWith;
//!
//! let options = TransformerOptions::default();
//! let mut transformer = Transformer::new(options);
//! program.visit_mut_with(&mut transformer);
//! ```

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![allow(clippy::ptr_arg)]
#![allow(clippy::boxed_local)]

pub use swc_ecma_ast;
pub use swc_ecma_hooks;
pub use swc_ecma_visit;

mod context;
mod options;
mod transformer;

pub use context::TransformCtx;
pub use options::TransformerOptions;
pub use transformer::Transformer;
