use swc_common::plugin::serialized::PluginSerializedBytes;

use crate::runtime;

#[tracing::instrument(level = "info", skip_all)]
pub fn copy_bytes_into_host(
    caller: &dyn runtime::Caller<'_>,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
    buf: &mut Vec<u8>,
) {
    let len: usize = bytes_ptr_len.try_into().unwrap();
    buf.resize(len, 0);
    caller
        .read_buf(bytes_ptr as u32, buf)
        .expect("Should able to read memory from given ptr");
}

/// Locate a view from given memory, write serialized bytes into.
#[tracing::instrument(level = "info", skip_all)]
pub fn write_into_memory_view<F>(
    view: &mut dyn runtime::Caller<'_>,
    serialized_bytes: &PluginSerializedBytes,
    get_allocated_ptr: F,
) -> (u32, u32)
where
    F: Fn(&mut dyn runtime::Caller<'_>, usize) -> u32,
{
    let serialized_len = serialized_bytes.as_slice().len();

    let ptr_start = get_allocated_ptr(view, serialized_len);
    let serialized_size = serialized_len
        .try_into()
        .expect("Should be able to convert to i32");

    // Note: it's important to get a view from memory _after_ alloc completes
    view.write_buf(ptr_start, serialized_bytes.as_slice())
        .expect("Should able to write into memory view");

    (ptr_start, serialized_size)
}

/// Set `return` value to pass into guest from functions returning values with
/// non-deterministic size like `Vec<Comment>`. Guest pre-allocates a struct to
/// contain ptr to the value, host in here allocates guest memory for the actual
/// value then returns its ptr with length to the preallocated struct.
#[tracing::instrument(level = "info", skip_all)]
pub fn allocate_return_values_into_guest(
    caller: &mut dyn runtime::Caller<'_>,
    allocated_ret_ptr: u32,
    serialized_bytes: &PluginSerializedBytes,
) {
    let serialized_bytes_len: usize = serialized_bytes.as_slice().len();
    let serialized_bytes_len = serialized_bytes_len
        .try_into()
        .expect("Should be able to convert size");

    // In most cases our host-plugin trampoline works in a way that
    // plugin pre-allocates
    // memory before calling host imported fn. But in case of
    // comments return value is Vec<Comments> which
    // guest cannot predetermine size to allocate, instead
    // let host allocate by calling guest's alloc via attached
    // hostenvironment.
    let guest_memory_ptr = caller
        .alloc(serialized_bytes_len)
        .expect("Should able to allocate memory in the plugin");

    let (allocated_ptr, allocated_ptr_len) =
        write_into_memory_view(caller, serialized_bytes, |_, _| guest_memory_ptr);

    // We cannot use cbor serialization because it is a variable-length encoding.
    let allocated_fatptr = {
        let allocated_ptr = allocated_ptr.to_le_bytes();
        let allocated_ptr_len = allocated_ptr_len.to_le_bytes();
        [
            allocated_ptr[0],
            allocated_ptr[1],
            allocated_ptr[2],
            allocated_ptr[3],
            allocated_ptr_len[0],
            allocated_ptr_len[1],
            allocated_ptr_len[2],
            allocated_ptr_len[3],
        ]
    };
    caller
        .write_buf(allocated_ret_ptr, &allocated_fatptr)
        .expect("Should able to write into memory view");
}
