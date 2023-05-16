use swc_common::plugin::serialized::{PluginSerializedBytes, VersionedSerializable};
use swc_plugin_proxy::AllocatedBytesPtr;
use wasmer::{Memory, MemoryView, StoreMut, TypedFunction, WasmPtr};

#[tracing::instrument(level = "info", skip_all)]
pub fn copy_bytes_into_host(memory: &MemoryView, bytes_ptr: i32, bytes_ptr_len: i32) -> Vec<u8> {
    let ptr: WasmPtr<u8> = WasmPtr::new(bytes_ptr as _);
    let values = ptr
        .slice(memory, bytes_ptr_len as u32)
        .expect("Should able to get a slice from memory view");

    values
        .read_to_vec()
        .expect("Should able to read memory from given ptr")
}

/// Locate a view from given memory, write serialized bytes into.
#[tracing::instrument(level = "info", skip_all)]
pub fn write_into_memory_view<F>(
    memory: &Memory,
    store: &mut StoreMut,
    serialized_bytes: &PluginSerializedBytes,
    get_allocated_ptr: F,
) -> (u32, u32)
where
    F: Fn(&mut StoreMut, usize) -> u32,
{
    let serialized_len = serialized_bytes.as_ptr().1;

    let ptr_start = get_allocated_ptr(store, serialized_len);
    let ptr_start_size: u64 = ptr_start as u64;

    // Note: it's important to get a view from memory _after_ alloc completes
    let view = memory.view(store);
    // [TODO]: we need wasmer@3 compatible optimization like before
    // https://github.com/swc-project/swc/blob/f73f96dd94639f8b7edcdb6290653e16bf848db6/crates/swc_plugin_runner/src/memory_interop.rs#L54
    view.write(ptr_start_size, serialized_bytes.as_slice())
        .expect("Should able to write into memory view");

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
#[tracing::instrument(level = "info", skip_all)]
pub fn allocate_return_values_into_guest(
    memory: &Memory,
    store: &mut StoreMut,
    alloc_guest_memory: &TypedFunction<u32, u32>,
    allocated_ret_ptr: u32,
    serialized_bytes: &PluginSerializedBytes,
) {
    let serialized_bytes_len: usize = serialized_bytes.as_ptr().1;

    // In most cases our host-plugin trampoline works in a way that
    // plugin pre-allocates
    // memory before calling host imported fn. But in case of
    // comments return value is Vec<Comments> which
    // guest cannot predetermine size to allocate, instead
    // let host allocate by calling guest's alloc via attached
    // hostenvironment.
    let guest_memory_ptr = alloc_guest_memory
        .call(
            store,
            serialized_bytes_len
                .try_into()
                .expect("Should be able to convert size"),
        )
        .expect("Should able to allocate memory in the plugin");

    let (allocated_ptr, allocated_ptr_len) =
        write_into_memory_view(memory, store, serialized_bytes, |_, _| guest_memory_ptr);

    let allocated_bytes =
        VersionedSerializable::new(AllocatedBytesPtr(allocated_ptr, allocated_ptr_len));
    // Retuning (allocated_ptr, len) into caller (plugin)
    let comment_ptr_serialized =
        PluginSerializedBytes::try_serialize(&allocated_bytes).expect("Should be serializable");

    write_into_memory_view(memory, store, &comment_ptr_serialized, |_, _| {
        allocated_ret_ptr
    });
}
