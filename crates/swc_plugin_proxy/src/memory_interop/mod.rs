mod read_returned_result_from_host;
#[cfg(all(
    feature = "encoding-impl",
    feature = "__plugin_mode",
    target_arch = "wasm32"
))]
pub(crate) use read_returned_result_from_host::read_returned_result_from_host;
pub use read_returned_result_from_host::AllocatedBytesPtr;
