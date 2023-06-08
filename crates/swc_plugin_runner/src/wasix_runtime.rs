use std::{path::PathBuf, sync::Arc};

use wasmer_wasix::WasiRuntime;

/// Construct a runtime for the wasix engine depends on the compilation
/// features.
///
/// This is mainly for the case if a host already sets up its runtime, which
/// makes wasix initialization fails due to conflicting runtime. When specified,
/// instead of using default runtime it'll try to use shared one.
pub fn build_wasi_runtime(
    fs_cache_path: Option<PathBuf>,
) -> Option<Arc<dyn WasiRuntime + Send + Sync>> {
    #[cfg(not(feature = "plugin_transform_host_native_shared_runtime"))]
    return None;

    #[cfg(feature = "plugin_transform_host_native_shared_runtime")]
    {
        use wasmer_wasix::{
            runners::Runner, runtime::task_manager::tokio::TokioTaskManager, PluggableRuntime,
        };

        let tasks = TokioTaskManager::new(tokio::runtime::Handle::current());
        let mut rt = PluggableRuntime::new(Arc::new(tasks));

        /* [TODO]: wasmer@4
        #[cfg(all(not(target_arch = "wasm32"), feature = "filesystem_cache"))]
        let cache = if let Some(fs_cache_path) = fs_cache_path {
            SharedCache::default().with_fallback(wasmer_cache::FileSystemCache::new(fs_cache_path))
        } else {
            SharedCache::default().with_fallback(wasmer_wasix::runtime::module_cache::in_memory())
        };

        #[cfg(not(feature = "filesystem_cache"))]
        let cache = SharedCache::default().with_fallback(in_memory());
         */

        rt.set_engine(Some(wasmer::Engine::default()));
        //[TODO]: wasmer@4
        //rt.set_module_cache(cache);

        return Some(Arc::new(rt));
    }
}
