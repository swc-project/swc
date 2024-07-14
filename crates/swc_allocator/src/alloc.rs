use std::{alloc::Layout, mem::transmute, ptr::NonNull};

use allocator_api2::alloc::Global;
use scoped_tls::scoped_thread_local;

use crate::{FastAlloc, MemorySpace};

scoped_thread_local!(pub(crate) static ALLOC: &'static SwcAllocator);

#[derive(Default)]
pub struct SwcAllocator(MemorySpace);

impl SwcAllocator {
    /// Invokes `f` in a scope where the allocations are done in this allocator.
    #[inline(always)]
    pub fn scope<'a, F, R>(&'a self, f: F) -> R
    where
        F: FnOnce() -> R,
    {
        let s = unsafe {
            // Safery: We are using a scoped API
            transmute::<&'a SwcAllocator, &'static SwcAllocator>(self)
        };

        ALLOC.set(&s, f)
    }
}

impl Default for FastAlloc {
    fn default() -> Self {
        Self {
            alloc: if ALLOC.is_set() {
                Some(ALLOC.with(|v| *v))
            } else {
                None
            },
        }
    }
}

impl FastAlloc {
    /// `true` is passed to `f` if the box is allocated with a custom allocator.
    fn with_allocator<T>(
        &self,
        f: impl FnOnce(&dyn allocator_api2::alloc::Allocator, bool) -> T,
    ) -> T {
        if let Some(arena) = &self.alloc {
            f((&&*arena.0) as &dyn allocator_api2::alloc::Allocator, true)
        } else {
            f(&allocator_api2::alloc::Global, false)
        }
    }
}

fn mark_ptr_as_arena_mode(ptr: NonNull<[u8]>) -> NonNull<[u8]> {
    ptr
}

unsafe impl allocator_api2::alloc::Allocator for FastAlloc {
    fn allocate(&self, layout: Layout) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a, is_arena_mode| {
            let ptr = a.allocate(layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    fn allocate_zeroed(
        &self,
        layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a, is_arena_mode| {
            let ptr = a.allocate_zeroed(layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    unsafe fn deallocate(&self, ptr: NonNull<u8>, layout: Layout) {
        if self.alloc.is_some() {
            debug_assert!(
                ALLOC.is_set(),
                "Deallocating a pointer allocated with arena mode with a non-arena mode allocator"
            );

            self.with_allocator(|alloc, _| alloc.deallocate(ptr, layout))
        } else {
            Global.deallocate(ptr, layout)
        }
    }

    unsafe fn grow(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.grow(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    unsafe fn grow_zeroed(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.grow_zeroed(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    unsafe fn shrink(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|alloc, is_arena_mode| {
            let ptr = alloc.shrink(ptr, old_layout, new_layout)?;

            if is_arena_mode {
                Ok(mark_ptr_as_arena_mode(ptr))
            } else {
                Ok(ptr)
            }
        })
    }

    fn by_ref(&self) -> &Self
    where
        Self: Sized,
    {
        self
    }
}
