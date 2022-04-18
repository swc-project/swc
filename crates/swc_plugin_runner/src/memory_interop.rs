use swc_common::plugin::Serialized;
use swc_plugin_proxy::AllocatedBytesPtr;
use wasmer::{Array, Memory, NativeFunc, WasmPtr};

#[tracing::instrument(level = "info", skip_all)]
pub fn copy_bytes_into_host(memory: &Memory, bytes_ptr: i32, bytes_ptr_len: i32) -> Vec<u8> {
    let ptr: WasmPtr<u8, Array> = WasmPtr::new(bytes_ptr as _);

    // Deref & read through plugin's wasm memory space via returned ptr
    let derefed_ptr = ptr
        .deref(memory, 0, bytes_ptr_len as u32)
        .expect("Should able to deref from given ptr");

    derefed_ptr
        .iter()
        .enumerate()
        .take(bytes_ptr_len as usize)
        .map(|(_size, cell)| cell.get())
        .collect::<Vec<u8>>()
}

/// Locate a view from given memory, write serialized bytes into.
#[tracing::instrument(level = "info", skip_all)]
pub fn write_into_memory_view<F>(
    memory: &Memory,
    serialized_bytes: &Serialized,
    get_allocated_ptr: F,
) -> (i32, i32)
where
    F: Fn(usize) -> i32,
{
    let serialized = serialized_bytes.as_ref();
    let serialized_len = serialized.len();

    let ptr_start = get_allocated_ptr(serialized_len);
    let ptr_start_size = ptr_start
        .try_into()
        .expect("Should be able to convert to usize");
    let serialized_len_size: u32 = serialized_len
        .try_into()
        .expect("Should be able to convert to u32");

    // Note: it's important to get a view from memory _after_ alloc completes
    let view = memory.view::<u8>();

    // Get a subarray for current memoryview starting from ptr address we just
    // allocated above, perform copying into specified ptr. Wasm's memory layout
    // is linear and we have atomic guarantee by not having any thread access,
    // so can safely get subarray from allocated ptr address.
    //
    // If we want safer operation instead, refer previous implementation
    // https://github.com/swc-project/swc/blob/1ef8f3749b6454eb7d40a36a5f9366137fa97928/crates/swc_plugin_runner/src/lib.rs#L56-L61
    unsafe {
        view.subarray(ptr_start_size, ptr_start_size + serialized_len_size)
            .copy_from(serialized);
    }

    (
        ptr_start,
        serialized_len
            .try_into()
            .expect("Should be able to convert to i32"),
    )
}

/// Set `return` value to pass into guest from functions returning values with
/// non-deterministic size like `Vec<Comment>`. Guest pre-allocates a struct to
/// contain ptr to the value, host in here allocates guest memory for the actual
/// value then returns its ptr with length to the preallocated struct.
pub fn allocate_return_values_into_guest(
    memory: &Memory,
    alloc_guest_memory: &NativeFunc<u32, i32>,
    allocated_ret_ptr: i32,
    serialized_bytes: &Serialized,
) {
    let serialized_bytes_len = serialized_bytes.as_ref().len();

    let (allocated_ptr, allocated_ptr_len) =
        write_into_memory_view(memory, serialized_bytes, |_| {
            // In most cases our host-plugin trampoline works in a way that
            // plugin pre-allocates
            // memory before calling host imported fn. But in case of
            // comments return value is Vec<Comments> which
            // guest cannot predetermine size to allocate, instead
            // let host allocate by calling guest's alloc via attached
            // hostenvironment.
            alloc_guest_memory
                .call(
                    serialized_bytes_len
                        .try_into()
                        .expect("Should be able to convert size"),
                )
                .expect("Should able to allocate memory in the plugin")
        });

    // Retuning (allocated_ptr, len) into caller (plugin)
    let comment_ptr_serialized =
        Serialized::serialize(&AllocatedBytesPtr(allocated_ptr, allocated_ptr_len))
            .expect("Should be serializable");

    write_into_memory_view(memory, &comment_ptr_serialized, |_| allocated_ret_ptr);
}
