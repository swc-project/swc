#[cfg(feature = "rkyv-impl")]
use rkyv;
#[cfg(feature = "rkyv-bytecheck-impl")]
use rkyv_latest as rkyv;
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
use swc_common::plugin::serialized::{
    deserialize_from_ptr, deserialize_from_ptr_into_fallible, PluginSerializedBytes,
};

/// A struct to exchange allocated data between memory spaces.
#[cfg_attr(
    feature = "__rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct AllocatedBytesPtr(pub i32, pub i32);

#[cfg(not(feature = "__rkyv"))]
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
#[cfg(feature = "__rkyv")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[tracing::instrument(level = "info", skip_all)]
fn read_returned_result_from_host_inner<F>(f: F) -> Option<AllocatedBytesPtr>
where
    F: FnOnce(i32) -> i32,
{
    // Allocate AllocatedBytesPtr to get return value from the host
    let allocated_bytes_ptr = AllocatedBytesPtr(0, 0);
    let serialized_allocated_bytes_ptr = PluginSerializedBytes::try_serialize(&allocated_bytes_ptr)
        .expect("Should able to serialize AllocatedBytesPtr");
    let (serialized_allocated_bytes_raw_ptr, serialized_allocated_bytes_raw_ptr_size) =
        serialized_allocated_bytes_ptr.as_ptr();

    #[cfg(target_arch = "wasm32")]
    {
        let ret = f(serialized_allocated_bytes_raw_ptr as _);

        // Host fn call completes: by contract in host proxy, if return value is 0
        // we know there's no value to read. Otherwise, we know host filled in
        // AllocatedBytesPtr to the pointer for the actual value for the
        // results.
        if ret == 0 {
            return None;
        }
    }

    // Return reconstructted AllocatedBytesPtr to reveal ptr to the allocated bytes
    Some(unsafe {
        deserialize_from_ptr(
            serialized_allocated_bytes_raw_ptr,
            serialized_allocated_bytes_raw_ptr_size
                .try_into()
                .expect("Should able to convert ptr length"),
        )
        .expect("Should able to deserialize AllocatedBytesPtr")
    })
}

#[cfg(not(feature = "__rkyv"))]
pub fn read_returned_result_from_host<F, R>(f: F) -> Option<R> {
    unimplemented!("Plugin proxy does not work without serialization support")
}

/// Performs deserialization to the actual return value type from returned ptr.
///
/// This fn is for the Infallible types works for most of the cases.
#[cfg(feature = "__rkyv")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[tracing::instrument(level = "info", skip_all)]
pub fn read_returned_result_from_host<F, R>(f: F) -> Option<R>
where
    F: FnOnce(i32) -> i32,
    R: rkyv::Archive,
    R::Archived: rkyv::Deserialize<R, rkyv::de::deserializers::SharedDeserializeMap>,
{
    let allocated_returned_value_ptr = read_returned_result_from_host_inner(f);

    // Using AllocatedBytesPtr's value, reconstruct actual return value
    allocated_returned_value_ptr.map(|allocated_returned_value_ptr| unsafe {
        deserialize_from_ptr(
            allocated_returned_value_ptr.0 as _,
            allocated_returned_value_ptr.1,
        )
        .expect("Returned value should be serializable")
    })
}

#[cfg(not(feature = "__rkyv"))]
pub fn read_returned_result_from_host_fallible<F, R>(f: F) -> Option<R> {
    unimplemented!("Plugin proxy does not work without serialization support")
}

/// Performs deserialization to the actual return value type from returned ptr.
///
/// This behaves same as read_returned_result_from_host, the only difference is
/// this is for the `Fallible` struct to deserialize. If a struct contains
/// shared pointers like Arc, Rc rkyv requires trait bounds to the
/// SharedSerializeRegistry which cannot be infallible.
#[cfg(feature = "__rkyv")]
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
#[tracing::instrument(level = "info", skip_all)]
pub fn read_returned_result_from_host_fallible<F, R>(f: F) -> Option<R>
where
    F: FnOnce(i32) -> i32,
    R: rkyv::Archive,
    R::Archived: rkyv::Deserialize<R, rkyv::de::deserializers::SharedDeserializeMap>,
{
    // Allocate AllocatedBytesPtr to get return value from the host
    let allocated_bytes_ptr = AllocatedBytesPtr(0, 0);
    let serialized_allocated_bytes_ptr = PluginSerializedBytes::try_serialize(&allocated_bytes_ptr)
        .expect("Should able to serialize AllocatedBytesPtr");
    let (serialized_allocated_bytes_raw_ptr, serialized_allocated_bytes_raw_ptr_size) =
        serialized_allocated_bytes_ptr.as_ptr();

    #[cfg(target_arch = "wasm32")]
    {
        let ret = f(serialized_allocated_bytes_raw_ptr as _);

        // Host fn call completes: by contract in host proxy, if return value is 0
        // we know there's no value to read. Otherwise, we know host filled in
        // AllocatedBytesPtr to the pointer for the actual value for the
        // results.
        if ret == 0 {
            return None;
        }
    }

    // Now reconstruct AllocatedBytesPtr to reveal ptr to the allocated bytes
    let allocated_returned_value_ptr: AllocatedBytesPtr = unsafe {
        deserialize_from_ptr(
            serialized_allocated_bytes_raw_ptr,
            serialized_allocated_bytes_raw_ptr_size as i32,
        )
        .expect("Should able to deserialize AllocatedBytesPtr")
    };

    // Using AllocatedBytesPtr's value, reconstruct actual return value
    Some(unsafe {
        deserialize_from_ptr_into_fallible(
            allocated_returned_value_ptr.0 as _,
            allocated_returned_value_ptr.1,
        )
        .expect("Returned value should be serializable")
    })
}
