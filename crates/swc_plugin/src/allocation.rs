use std::alloc::{alloc as global_alloc, dealloc as global_dealloc, Layout};

/// Allocate bytes that won't be dropped by the allocator.
/// Return the pointer to the leaked allocation so the host can write to it.
///
/// Note: Can be bit confusing but alloc / free should be called in host even
/// though this fn is exposed in plugin binary: Host owns responsibility to
/// allocate / free memory space in wasm
#[doc(hidden)]
#[cfg(target_arch = "wasm32")]
#[no_mangle]
#[inline(always)]
pub extern "C" fn __alloc(size: i32) -> *mut u8 {
    // create a new mutable buffer with specified capacity
    let mut buf = Vec::with_capacity(size as usize);
    // take a mutable pointer to the buffer
    let ptr = buf.as_mut_ptr();
    // take ownership of the memory block and
    // ensure the its destructor is not
    // called when the object goes out of scope
    // at the end of the function
    std::mem::forget(buf);
    // return the pointer so the runtime
    // can write data at this offset
    ptr
}

/// Free previously allocated memory via __alloc.
#[doc(hidden)]
#[cfg(target_arch = "wasm32")]
#[no_mangle]
#[inline(always)]
pub extern "C" fn __free(ptr: *mut u8, size: i32) -> i32 {
    let data = unsafe { Vec::from_raw_parts(ptr, size as usize, size as usize) };
    std::mem::drop(data);
    0 as _
}

/// Allocates memory area of specified size and returns its address.
/// Returns 0 if supplied size is too long.
/// [TODO]: This is for the experiment to alloc memory with specified layout instead of
/// manually creating Vec::new() and forget it. This is not used yet.
#[doc(hidden)]
#[cfg(all(target_arch = "wasm32", feature = "layout_alloc"))]
#[no_mangle]
#[inline(always)]
pub unsafe fn __alloc(size: usize) -> usize {
    let layout = match Layout::from_size_align(size as usize, std::mem::align_of::<u8>()) {
        Ok(layout) => layout,
        // in this case a err may occur only in a case of too long allocated size,
        // so just return 0
        Err(_) => return 0 as _,
    };

    unsafe { global_alloc(layout) as _ }
}

/// Deallocates memory area for provided memory pointer and size.
/// Does nothing if supplied size is too long.
/// [TODO]: This is for the experiment to free memory with specified layout with explicit
/// dealloc instead of dropping it. This is not used yet.
#[doc(hidden)]
#[cfg(all(target_arch = "wasm32", feature = "layout_alloc"))]
#[no_mangle]
#[inline(always)]
pub unsafe fn __free(ptr: *mut u8, size: usize) {
    let layout = match Layout::from_size_align(size as usize, std::mem::align_of::<u8>()) {
        Ok(layout) => layout,
        // in this case a err may occur only in a case of too long allocated size,
        // so just done nothing
        Err(_) => return 0 as _,
    };

    unsafe {
        global_dealloc(ptr, layout);
    }
    0 as _
}
