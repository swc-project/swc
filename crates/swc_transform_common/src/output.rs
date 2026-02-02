//! (Experimental) Output capturing.
//!
//! This module provides a way to emit metadata to the JS caller.

use std::cell::RefCell;

use better_scoped_tls::scoped_tls;
use rustc_hash::FxHashMap;

scoped_tls!(static OUTPUT: RefCell<FxHashMap<String, String>>);

/// (Experimental) Captures output.
///
/// This is not stable and may be removed in the future.
pub fn capture<Ret>(f: impl FnOnce() -> Ret) -> (Ret, FxHashMap<String, String>) {
    let output = RefCell::new(Default::default());

    let ret = OUTPUT.set(&output, f);

    (ret, output.into_inner())
}

#[cfg(all(feature = "plugin-mode", target_arch = "wasm32"))]
extern "C" {
    fn __emit_output(output_ptr: u32, output_len: u32);
}

/// (Experimental) Emits a value to the JS caller.
///
/// This is not stable and may be removed in the future.
#[cfg(all(feature = "plugin-mode", target_arch = "wasm32"))]
pub fn experimental_emit(key: String, value: String) {
    let output = swc_common::plugin::emit::PluginEmitOutput { key, value };

    let diag = swc_common::plugin::serialized::PluginSerializedBytes::try_serialize(
        &swc_common::plugin::serialized::VersionedSerializable::new(output),
    )
    .expect("Should able to serialize String");
    let (ptr, len) = diag.as_ptr();

    unsafe {
        __emit_output(ptr as u32, len as u32);
    }
}

/// (Experimental) Emits a value to the JS caller.
///
/// This is not stable and may be removed in the future.
#[cfg(not(all(feature = "plugin-mode", target_arch = "wasm32")))]
pub fn experimental_emit(key: String, value: String) {
    OUTPUT.with(|output| {
        let previous = output.borrow_mut().insert(key, value);

        if let Some(previous) = previous {
            panic!("Key already set. Previous value: {previous:?}");
        }
    });
}
