#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[cfg(any(feature = "__plugin_rt", feature = "__plugin_mode"))]
use swc_common::plugin::serialized::PluginSerializedBytes;

/// A struct to exchange allocated data between memory spaces.
pub struct AllocatedBytesPtr(pub u32, pub u32);

#[cfg(target_arch = "wasm32")]
extern "C" {
    fn __free(ptr: *mut u8, size: i32) -> i32;
}
#[cfg(target_arch = "wasm32")]
impl Drop for AllocatedBytesPtr {
    fn drop(&mut self) {
        unsafe {
            __free(self.0 as _, self.1 as _);
        }
    }
}

#[cfg(not(feature = "encoding-impl"))]
fn read_returned_result_from_host_inner<F>(f: F) -> Option<AllocatedBytesPtr> {
    unimplemented!("Plugin proxy does not work without serialization support")
}

/// Performs an interop while calling host fn to get non-determined size return
/// values from the host. This is based on the contract between host's imported
/// fn, by imported fn allocated memory for the guest space then hand over its
/// ptr and length via a struct. Refer plugin_runner/imported_fn/mod.rs for the
/// detail.
///
/// Returns a struct AllocatedBytesPtr to the ptr for actual return value if
/// host fn allocated return value, None otherwise.
#[cfg(all(
    feature = "encoding-impl",
    feature = "__plugin_mode",
    target_arch = "wasm32"
))]
#[tracing::instrument(level = "info", skip_all)]
fn read_returned_result_from_host_inner<F>(f: F) -> Option<AllocatedBytesPtr>
where
    F: FnOnce(u32) -> u32,
{
    use std::cell::UnsafeCell;

    // Allocate AllocatedBytesPtr to get return value from the host
    //
    // @quininer: I'm not sure if `.as_mut_ptr()` creates an alias for array,
    // so using `UnsafeCell` here makes the semantics clearer.
    let allocated_bytes_ptr: UnsafeCell<[u32; 2]> = UnsafeCell::new([0; 2]);
    let serialized_allocated_bytes_raw_ptr = allocated_bytes_ptr.get();

    assert_eq!(std::mem::size_of::<*mut u32>(), std::mem::size_of::<u32>());

    let ret = f(serialized_allocated_bytes_raw_ptr as _);

    // Host fn call completes: by contract in host proxy, if return value is 0
    // we know there's no value to read. Otherwise, we know host filled in
    // AllocatedBytesPtr to the pointer for the actual value for the
    // results.
    if ret == 0 {
        return None;
    }

    let allocated_bytes_ptr = allocated_bytes_ptr.into_inner();

    // Return reconstructted AllocatedBytesPtr to reveal ptr to the allocated bytes
    Some(AllocatedBytesPtr(
        allocated_bytes_ptr[0],
        allocated_bytes_ptr[1],
    ))
}

#[cfg(not(feature = "encoding-impl"))]
pub fn read_returned_result_from_host<F, R>(f: F) -> Option<R> {
    unimplemented!("Plugin proxy does not work without serialization support")
}

/// Performs deserialization to the actual return value type from returned ptr.
///
/// This fn is for the Infallible types works for most of the cases.
#[cfg(all(
    feature = "encoding-impl",
    feature = "__plugin_mode",
    target_arch = "wasm32"
))]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[tracing::instrument(level = "info", skip_all)]
pub fn read_returned_result_from_host<F, R>(f: F) -> Option<R>
where
    F: FnOnce(u32) -> u32,
    R: for<'de> cbor4ii::core::dec::Decode<'de>,
{
    let allocated_returned_value_ptr = read_returned_result_from_host_inner(f);

    // Using AllocatedBytesPtr's value, reconstruct actual return value
    allocated_returned_value_ptr.map(|allocated_returned_value_ptr| {
        PluginSerializedBytes::from_raw_ptr(
            allocated_returned_value_ptr.0 as _,
            allocated_returned_value_ptr
                .1
                .try_into()
                .expect("Should able to convert ptr length"),
        )
        .deserialize()
        .expect("Returned value should be serializable")
        .into_inner()
    })
}
