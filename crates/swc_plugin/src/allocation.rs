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
pub extern "C" fn __alloc(size: usize) -> *mut u8 {
    // create a new mutable buffer with specified capacity
    let mut buf = Vec::with_capacity(size);
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
pub extern "C" fn __free(ptr: *mut u8, size: usize) -> i32 {
    let data = unsafe { Vec::from_raw_parts(ptr, size, size) };
    std::mem::drop(data);
    0
}
