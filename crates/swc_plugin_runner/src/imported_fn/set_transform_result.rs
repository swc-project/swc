use std::sync::Arc;

use parking_lot::Mutex;

use crate::{memory_interop::copy_bytes_into_host, runtime};

/// Environment states allow to return guest's transform result back to the
/// host, using a buffer `transform_result` attached to the environment.
///
/// When plugin performs its transform it'll fill in `transform_result` with
/// serialized result. Host will reconstruct AST from those value.
#[derive(Clone)]
pub struct TransformResultHostEnvironment {
    pub transform_result: Arc<Mutex<Vec<u8>>>,
}

impl TransformResultHostEnvironment {
    pub fn new(transform_result: &Arc<Mutex<Vec<u8>>>) -> TransformResultHostEnvironment {
        TransformResultHostEnvironment {
            transform_result: transform_result.clone(),
        }
    }
}

/// Set plugin's transformed result into host's environment.
/// This is an `imported` fn - when we instantiate plugin module, we inject this
/// fn into plugin's export space. Once transform completes, plugin will call
/// this to set its result back to host.
#[tracing::instrument(level = "info", skip_all)]
pub fn set_transform_result(
    caller: &mut dyn runtime::Caller<'_>,
    env: &TransformResultHostEnvironment,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    let mut buf = env.transform_result.lock();
    copy_bytes_into_host(caller, bytes_ptr, bytes_ptr_len, &mut buf);
}
