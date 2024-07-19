use std::{
    alloc::{AllocError, Layout},
    cell::Cell,
    mem::transmute,
    ops::{Deref, DerefMut},
    ptr::NonNull,
};

use bumpalo::Bump;

use crate::FastAlloc;

thread_local! {
  static ALLOC: Cell<Option<&'static Allocator>> = const { Cell::new(None) };
}

/// The actual storage for [FastAlloc].
#[derive(Default)]
pub struct Allocator {
    alloc: Bump,
}

pub struct AllocGuard {
    orig: Option<&'static Allocator>,
}

impl Drop for AllocGuard {
    fn drop(&mut self) {
        ALLOC.set(self.orig.take());
    }
}

impl Allocator {
    /// Creates a RAII guard that enables optimized allocation.
    ///
    /// # Safety
    ///
    /// [Allocator] must outlive [crate::boxed::Box] and [crate::vec::Vec]
    /// created while the guard is active.
    pub unsafe fn guard(&self) -> AllocGuard {
        let orig = ALLOC.get();

        let s = unsafe {
            // Safery: We are using a scoped API
            transmute::<&Allocator, &'static Allocator>(self)
        };

        ALLOC.set(Some(s));
        AllocGuard { orig }
    }
}

impl Default for FastAlloc {
    fn default() -> Self {
        Self {
            #[cfg(feature = "scoped")]
            alloc: if let Some(v) = ALLOC.get() {
                Some(v)
            } else {
                None
            },
        }
    }
}

impl FastAlloc {
    /// `true` is passed to `f` if the box is allocated with a custom allocator.
    fn with_allocator<T>(&self, f: impl FnOnce(&dyn std::alloc::Allocator, bool) -> T) -> T {
        #[cfg(feature = "scoped")]
        if let Some(arena) = &self.alloc {
            return f((&&arena.alloc) as &dyn std::alloc::Allocator, true);
        }

        f(&std::alloc::Global, false)
    }
}

fn mark_ptr_as_arena_mode(ptr: NonNull<[u8]>) -> NonNull<[u8]> {
    ptr
}

unsafe impl std::alloc::Allocator for FastAlloc {
    #[inline]
    fn allocate(&self, layout: Layout) -> Result<NonNull<[u8]>, AllocError> {
        self.with_allocator(|a, is_arena_mode| {
            let ptr = a.allocate(layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    #[inline]
    fn allocate_zeroed(&self, layout: Layout) -> Result<NonNull<[u8]>, AllocError> {
        self.with_allocator(|a, is_arena_mode| {
            let ptr = a.allocate_zeroed(layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    #[inline]
    unsafe fn deallocate(&self, ptr: NonNull<u8>, layout: Layout) {
        #[cfg(feature = "scoped")]
        if self.alloc.is_some() {
            self.with_allocator(|alloc, _| alloc.deallocate(ptr, layout));
            return;
        }

        std::alloc::Global.deallocate(ptr, layout)
    }

    #[inline]
    unsafe fn grow(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.grow(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    #[inline]
    unsafe fn grow_zeroed(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.grow_zeroed(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    #[inline]
    unsafe fn shrink(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.shrink(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    #[inline(always)]
    fn by_ref(&self) -> &Self
    where
        Self: Sized,
    {
        self
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
