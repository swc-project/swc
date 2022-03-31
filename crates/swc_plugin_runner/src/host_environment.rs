use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::{LazyInit, Memory, NativeFunc};

#[derive(wasmer::WasmerEnv, Clone)]
/// An external enviornment state imported (declared in host, injected into
/// guest) fn can access. This'll allow host access updated state via plugin's
/// transform.
/// ref: https://docs.wasmer.io/integrations/examples/host-functions#declaring-the-data
pub struct HostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    pub transform_result: Arc<Mutex<Vec<u8>>>,
    /// Attached imported fn `__alloc` to the hostenvironment to allow any other
    /// imported fn can allocate guest's memory space from host runtime.
    #[wasmer(export(name = "__alloc"))]
    pub alloc_guest_memory: LazyInit<NativeFunc<u32, i32>>,
}

impl HostEnvironment {
    pub fn new(transform_result: &Arc<Mutex<Vec<u8>>>) -> HostEnvironment {
        HostEnvironment {
            memory: LazyInit::default(),
            transform_result: transform_result.clone(),
            alloc_guest_memory: LazyInit::default(),
        }
    }
}
