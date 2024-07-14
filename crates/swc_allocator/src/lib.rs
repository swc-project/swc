//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

#![allow(clippy::needless_doctest_main)]

use std::ops::{Deref, DerefMut};

use bumpalo::Bump;

pub use crate::alloc::SwcAllocator;

mod alloc;
pub mod boxed;
pub mod vec;

#[derive(Clone)]
pub struct FastAlloc {
    alloc: Option<SwcAllocator>,
}

#[derive(Default)]
struct MemorySpace {
    alloc: Bump,
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
