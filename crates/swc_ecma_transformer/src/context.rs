//! Transformer context for managing state during AST traversal.
//!
//! This module provides the `TraverseCtx` type that serves as a shared context
//! for all transformer hooks. It provides utilities for AST manipulation,
//! identifier generation, and accessing transformation state.

use std::sync::atomic::{AtomicUsize, Ordering};

use swc_atoms::Atom;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;

/// Context type used by transformer hooks.
///
/// This context is passed to all `enter_*` and `exit_*` hook methods,
/// providing access to utilities needed during AST transformation.
#[derive(Debug, Default)]
pub struct TraverseCtx {
    /// Counter for generating unique identifiers
    uid_counter: AtomicUsize,
}

impl TraverseCtx {
    /// Creates a new traversal context.
    pub fn new() -> Self {
        Self {
            uid_counter: AtomicUsize::new(0),
        }
    }

    /// Generates a unique identifier with the given base name.
    pub fn generate_uid(&self, base: &str) -> Atom {
        let count = self.uid_counter.fetch_add(1, Ordering::Relaxed);
        Atom::from(format!("_{base}_{count}"))
    }

    /// Creates a new identifier with the given name.
    pub fn create_ident(&self, name: &str) -> Ident {
        Ident::new(Atom::from(name), DUMMY_SP, Default::default())
    }

    /// Creates a unique identifier with the given base name.
    pub fn create_unique_ident(&self, base: &str) -> Ident {
        let name = self.generate_uid(base);
        Ident::new(name, DUMMY_SP, Default::default())
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_uid() {
        let ctx = TraverseCtx::default();

        let id1 = ctx.generate_uid("temp");
        let id2 = ctx.generate_uid("temp");
        let id3 = ctx.generate_uid("ref");

        assert_eq!(&*id1, "_temp_0");
        assert_eq!(&*id2, "_temp_1");
        assert_eq!(&*id3, "_ref_2");
    }

    #[test]
    fn test_create_ident() {
        let ctx = TraverseCtx::default();
        let ident = ctx.create_ident("myVar");

        assert_eq!(&*ident.sym, "myVar");
        assert!(!ident.optional);
    }

    #[test]
    fn test_create_unique_ident() {
        let ctx = TraverseCtx::default();

        let ident1 = ctx.create_unique_ident("temp");
        let ident2 = ctx.create_unique_ident("temp");

        assert_ne!(ident1.sym, ident2.sym);
        assert_eq!(&*ident1.sym, "_temp_0");
        assert_eq!(&*ident2.sym, "_temp_1");
    }
}
