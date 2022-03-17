use std::sync::Arc;

use parking_lot::Mutex;
use wasmer::Memory;

#[derive(wasmer::WasmerEnv, Clone)]
/// An external enviornment state imported (declared in host, injected into
/// guest) fn can access. This'll allow host access updated state via plugin's
/// transform.
/// ref: https://docs.wasmer.io/integrations/examples/host-functions#declaring-the-data
pub struct HostEnvironment {
    #[wasmer(export)]
    pub memory: wasmer::LazyInit<Memory>,
    pub transform_result: Arc<Mutex<Vec<u8>>>,
}
