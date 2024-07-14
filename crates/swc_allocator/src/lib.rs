//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

#![allow(clippy::needless_doctest_main)]

use alloc::SwcAlloc;
use std::ops::{Deref, DerefMut};

use bumpalo::Bump;

use crate::alloc::ALLOC;

mod alloc;
pub mod boxed;
pub mod vec;

#[derive(Debug, Clone, Copy)]
pub struct FastAlloc {
    is_arena_mode: bool,
}

impl FastAlloc {
    fn swc_alloc(self) -> SwcAlloc {
        SwcAlloc {
            is_arena_mode: self.is_arena_mode,
        }
    }
}

#[derive(Default)]
pub struct MemorySpace {
    alloc: Bump,
}

impl MemorySpace {
    /// Invokes `f` in a scope where the allocations are done in this allocator.
    #[inline(always)]
    pub fn scope<F, R>(&self, f: F) -> R
    where
        F: FnOnce() -> R,
    {
        ALLOC.set(self, f)
    }
}

impl From<Bump> for MemorySpace {
    fn from(alloc: Bump) -> Self {
        Self { alloc }
    }
}

impl Deref for MemorySpace {
    type Target = Bump;

    fn deref(&self) -> &Bump {
        &self.alloc
    }
}

impl DerefMut for MemorySpace {
    fn deref_mut(&mut self) -> &mut Bump {
        &mut self.alloc
    }
}
