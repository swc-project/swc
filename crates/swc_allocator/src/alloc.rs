use std::{alloc::Layout, ptr::NonNull};

use scoped_tls::scoped_thread_local;

use crate::Allocator;

scoped_thread_local!(pub(crate) static ALLOC: Allocator);

pub(crate) struct SwcAlloc {
    pub is_custom: bool,
}

impl SwcAlloc {
    /// `true` is passed to `f` if the box is allocated with a custom allocator.
    fn with_allocator<T>(&self, f: impl FnOnce(&dyn allocator_api2::alloc::Allocator) -> T) -> T {
        if self.is_custom {
            ALLOC.with(|a| {
                //
                f(&&**a as &dyn allocator_api2::alloc::Allocator)
            })
        } else {
            f(&allocator_api2::alloc::Global)
        }
    }
}

unsafe impl allocator_api2::alloc::Allocator for SwcAlloc {
    fn allocate(&self, layout: Layout) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a| a.allocate(layout))
    }

    fn allocate_zeroed(
        &self,
        layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a| a.allocate_zeroed(layout))
    }

    unsafe fn deallocate(&self, ptr: NonNull<u8>, layout: Layout) {
        self.with_allocator(|a| a.deallocate(ptr, layout))
    }

    unsafe fn grow(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a| a.grow(ptr, old_layout, new_layout))
    }

    unsafe fn grow_zeroed(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a| a.grow_zeroed(ptr, old_layout, new_layout))
    }

    unsafe fn shrink(
        &self,
        ptr: NonNull<u8>,
        old_layout: Layout,
        new_layout: Layout,
    ) -> Result<NonNull<[u8]>, allocator_api2::alloc::AllocError> {
        self.with_allocator(|a| a.shrink(ptr, old_layout, new_layout))
    }

    fn by_ref(&self) -> &Self
    where
        Self: Sized,
    {
        self
    }
}
