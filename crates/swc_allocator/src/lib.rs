//! Allocator for swc.
//!
//! API designed after [`oxc_allocator`](https://github.com/oxc-project/oxc/tree/725571aad193ec6ba779c820baeb4a7774533ed7/crates/oxc_allocator/src).

use alloc::{SwcAlloc, ALLOC};
use std::ops::{Deref, DerefMut};

use bumpalo::Bump;
use rkyv::vec::{ArchivedVec, VecResolver};
use serde_derive::{Deserialize, Serialize};

mod alloc;
pub mod boxed;

#[derive(Default)]
pub struct Allocator {
    alloc: Bump,
}

impl Allocator {
    /// Invokes `f` in a scope where the allocations are done in this allocator.
    #[inline(always)]
    pub fn scope<F, R>(&self, f: F) -> R
    where
        F: FnOnce() -> R,
    {
        ALLOC.set(self, f)
    }
}

impl From<Bump> for Allocator {
    fn from(alloc: Bump) -> Self {
        Self { alloc }
    }
}

impl Deref for Allocator {
    type Target = Bump;

    fn deref(&self) -> &Bump {
        &self.alloc
    }
}

impl DerefMut for Allocator {
    fn deref_mut(&mut self) -> &mut Bump {
        &mut self.alloc
    }
}

#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[repr(transparent)]
pub struct Vec<T>(allocator_api2::vec::Vec<T, SwcAlloc>);

impl<T> Deref for Vec<T> {
    type Target = [T];

    fn deref(&self) -> &[T] {
        &self.0
    }
}

impl<T> DerefMut for Vec<T> {
    fn deref_mut(&mut self) -> &mut [T] {
        &mut self.0
    }
}

impl<T> Default for Vec<T> {
    fn default() -> Self {
        Self(allocator_api2::vec::Vec::new_in(SwcAlloc::default()))
    }
}

impl<T> IntoIterator for Vec<T> {
    type IntoIter = allocator_api2::vec::IntoIter<T, SwcAlloc>;
    type Item = T;

    fn into_iter(self) -> Self::IntoIter {
        self.0.into_iter()
    }
}

impl<T> rkyv::Archive for Vec<T>
where
    T: rkyv::Archive,
{
    type Archived = rkyv::vec::ArchivedVec<T::Archived>;
    type Resolver = rkyv::vec::VecResolver;

    unsafe fn resolve(&self, pos: usize, resolver: Self::Resolver, out: *mut Self::Archived) {
        rkyv::vec::ArchivedVec::resolve_from_slice(self, pos, resolver, out);
    }
}
