//! Runtime support for the swc plugins.
//!
//!
//! This is copied from wasm-bindgen.

use std::{
    alloc::{alloc, dealloc, realloc, Layout},
    mem,
};

#[no_mangle]
pub extern "C" fn __swc_malloc(size: usize) -> *mut u8 {
    let align = mem::align_of::<usize>();
    if let Ok(layout) = Layout::from_size_align(size, align) {
        unsafe {
            if layout.size() > 0 {
                let ptr = alloc(layout);
                if !ptr.is_null() {
                    return ptr;
                }
            } else {
                return align as *mut u8;
            }
        }
    }

    malloc_failure();
}

#[no_mangle]
pub unsafe extern "C" fn __swc_realloc(ptr: *mut u8, old_size: usize, new_size: usize) -> *mut u8 {
    let align = mem::align_of::<usize>();
    debug_assert!(old_size > 0);
    debug_assert!(new_size > 0);
    if let Ok(layout) = Layout::from_size_align(old_size, align) {
        let ptr = realloc(ptr, layout, new_size);
        if !ptr.is_null() {
            return ptr;
        }
    }
    malloc_failure();
}

#[cold]
fn malloc_failure() -> ! {
    if cfg!(debug_assertions) {
        super::throw_str("invalid malloc request")
    } else {
        std::process::abort();
    }
}

#[no_mangle]
pub unsafe extern "C" fn __swc_free(ptr: *mut u8, size: usize) {
    // This happens for zero-length slices, and in that case `ptr` is
    // likely bogus so don't actually send this to the system allocator
    if size == 0 {
        return;
    }
    let align = mem::align_of::<usize>();
    let layout = Layout::from_size_align_unchecked(size, align);
    dealloc(ptr, layout);
}
