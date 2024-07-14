use std::{alloc::Layout, ptr::NonNull};

use allocator_api2::alloc::Global;
use scoped_tls::scoped_thread_local;

use crate::Allocator;

scoped_thread_local!(pub(crate) static ALLOC: Allocator);

#[derive(Debug, Clone, Copy, Default)]
pub struct SwcAlloc;

impl SwcAlloc {
    /// `true` is passed to `f` if the box is allocated with a custom allocator.
    fn with_allocator<T>(
        &self,
        f: impl FnOnce(&dyn allocator_api2::alloc::Allocator, bool) -> T,
    ) -> T {
        if ALLOC.is_set() {
            ALLOC.with(|a| {
                //
                f(&&**a as &dyn allocator_api2::alloc::Allocator, true)
            })
        } else {
            f(&allocator_api2::alloc::Global, false)
        }
    }
}

/// Set the last bit to 1
fn mark_ptr_as_arena_mode(ptr: NonNull<[u8]>) -> NonNull<[u8]> {
    let (mut raw_ptr, metadata) = ptr_meta::PtrExt::to_raw_parts(ptr.as_ptr());

    raw_ptr = (raw_ptr as usize | 1) as *mut ();

    unsafe {
        // Safety:
        NonNull::new_unchecked(ptr_meta::from_raw_parts_mut(raw_ptr, metadata))
    }
}

fn is_ptr_in_arena_mode(ptr: NonNull<u8>) -> bool {
    let ptr = ptr.as_ptr() as usize;
    ptr & 1 == 1
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
        if is_ptr_in_arena_mode(ptr) {
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
        if is_ptr_in_arena_mode(ptr) {
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
        if is_ptr_in_arena_mode(ptr) {
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
        if is_ptr_in_arena_mode(ptr) {
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
