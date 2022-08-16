use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{FunctionEnvMut, Memory};

use crate::memory_interop::copy_bytes_into_host;

/// Environment states allow to return guest's transform result back to the
/// host, using a buffer `transform_result` attached to the environment.
///
/// When plugin performs its transform it'll fill in `transform_result` with
/// serialized result. Host will reconstruct AST from those value.
#[derive(Clone)]
pub struct TransformResultHostEnvironment {
    pub memory: Option<Memory>,
    pub transform_result: Arc<Mutex<Vec<u8>>>,
}

impl TransformResultHostEnvironment {
    pub fn new(transform_result: &Arc<Mutex<Vec<u8>>>) -> TransformResultHostEnvironment {
        TransformResultHostEnvironment {
            memory: None,
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
    mut env: FunctionEnvMut<TransformResultHostEnvironment>,
    bytes_ptr: i32,
    bytes_ptr_len: i32,
) {
    if let Some(memory) = env.data().memory.as_ref() {
        (*env.data_mut().transform_result.lock()) =
            copy_bytes_into_host(&memory.view(&env), bytes_ptr, bytes_ptr_len);
    }
}
