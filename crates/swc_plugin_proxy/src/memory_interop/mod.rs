mod read_returned_result_from_host;
pub use read_returned_result_from_host::AllocatedBytesPtr;
#[cfg_attr(not(target_arch = "wasm32"), allow(unused))]
pub(crate) use read_returned_result_from_host::{
    read_returned_result_from_host, read_returned_result_from_host_fallible,
};
