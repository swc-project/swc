//! (Experimental) Output capturing.
//!
//! This module provides a way to emit metadata to the JS caller.

use std::cell::RefCell;

use better_scoped_tls::scoped_tls;
use rustc_hash::FxHashMap;
use serde_json::Value;

scoped_tls!(static OUTPUT: RefCell<FxHashMap<String, serde_json::Value>>);

/// (Experimental) Captures output.
///
/// This is not stable and may be removed in the future.
pub fn capture<Ret>(f: impl FnOnce() -> Ret) -> (Ret, FxHashMap<String, serde_json::Value>) {
    let output = RefCell::new(Default::default());

    let ret = OUTPUT.set(&output, f);

    (ret, output.into_inner())
}

/// (Experimental) Emits a value to the JS caller.
///
/// This is not stable and may be removed in the future.
pub fn emit(key: String, value: Value) {
    OUTPUT.with(|output| {
        let previous = output.borrow_mut().insert(key, value);

        if let Some(previous) = previous {
            panic!("Key already set. Previous value: {previous:?}");
        }
    });
}
