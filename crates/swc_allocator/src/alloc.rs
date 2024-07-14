use std::{alloc::Layout, ptr::NonNull};

use allocator_api2::alloc::Global;
use scoped_tls::scoped_thread_local;

use crate::{FastAlloc, MemorySpace};

scoped_thread_local!(pub(crate) static ALLOC: MemorySpace);

#[derive(Debug, Clone, Copy)]
pub struct SwcAlloc {
    pub(crate) is_arena_mode: bool,
}

impl Default for FastAlloc {
    fn default() -> Self {
        Self {
            is_arena_mode: ALLOC.is_set(),
        }
    }
}

impl Default for SwcAlloc {
    fn default() -> Self {
        SwcAlloc {
            is_arena_mode: ALLOC.is_set(),
        }
    }
}

impl SwcAlloc {
    /// `true` is passed to `f` if the box is allocated with a custom allocator.
    fn with_allocator<T>(
        &self,
        f: impl FnOnce(&dyn allocator_api2::alloc::Allocator, bool) -> T,
    ) -> T {
        if self.is_arena_mode {
            ALLOC.with(|a| {
                //
                f(&&**a as &dyn allocator_api2::alloc::Allocator, true)
            })
        } else {
            f(&allocator_api2::alloc::Global, false)
        }
    }
}

fn mark_ptr_as_arena_mode(ptr: NonNull<[u8]>) -> NonNull<[u8]> {
    ptr
}

unsafe impl allocator_api2::alloc::Allocator for SwcAlloc {
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
        if self.is_arena_mode {
            debug_assert!(
                ALLOC.is_set(),
                "Deallocating a pointer allocated with arena mode with a non-arena mode allocator"
            );

            ALLOC.with(|alloc| {
                unsafe {
                    // Safety: We are in unsafe fn
                    (&**alloc).deallocate(ptr, layout)
                }
            })
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
        if self.is_arena_mode {
            debug_assert!(
                ALLOC.is_set(),
                "Growing a pointer allocated with arena mode with a non-arena mode allocator"
            );

            ALLOC.with(|alloc| (&**alloc).grow(ptr, old_layout, new_layout))
        } else {
            Global.grow(ptr, old_layout, new_layout)
        }
    }

    unsafe fn grow_zeroed(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        if self.is_arena_mode {
            debug_assert!(
                ALLOC.is_set(),
                "Growing a pointer allocated with arena mode with a non-arena mode allocator"
            );

            ALLOC.with(|alloc| (&**alloc).grow_zeroed(ptr, old_layout, new_layout))
        } else {
            Global.grow_zeroed(ptr, old_layout, new_layout)
        }
    }

    unsafe fn shrink(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        if self.is_arena_mode {
            debug_assert!(
                ALLOC.is_set(),
                "Shrinking a pointer allocated with arena mode with a non-arena mode allocator"
            );

            ALLOC.with(|alloc| (&**alloc).shrink(ptr, old_layout, new_layout))
        } else {
            Global.shrink(ptr, old_layout, new_layout)
        }
    }

    fn by_ref(&self) -> &Self
    where
        Self: Sized,
    {
        self
    }
}
