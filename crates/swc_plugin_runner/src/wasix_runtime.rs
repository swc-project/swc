use std::{path::PathBuf, sync::Arc};

use wasmer_wasix::Runtime;

#[derive(Debug)]
struct StubHttpClient;

impl wasmer_wasix::http::HttpClient for StubHttpClient {
    fn request(
        &self,
        _request: wasmer_wasix::http::HttpRequest,
    ) -> futures::future::BoxFuture<'_, Result<wasmer_wasix::http::HttpResponse, anyhow::Error>>
    {
        unimplemented!()
    }
}

/// Construct a runtime for the wasix engine depends on the compilation
/// features.
///
/// This is mainly for the case if a host already sets up its runtime, which
/// makes wasix initialization fails due to conflicting runtime. When specified,
/// instead of using default runtime it'll try to use shared one.
pub fn build_wasi_runtime(
    _fs_cache_path: Option<PathBuf>,
) -> Option<Arc<dyn Runtime + Send + Sync>> {
    use wasmer_wasix::{
        runtime::{
            module_cache::{ModuleCache, SharedCache},
            package_loader::BuiltinPackageLoader,
            resolver::MultiSource,
            task_manager::tokio::TokioTaskManager,
        },
        virtual_net, PluggableRuntime,
    };

    let cache =
        SharedCache::default().with_fallback(wasmer_wasix::runtime::module_cache::in_memory());

    let dummy_loader = BuiltinPackageLoader::new_with_client(".", Arc::new(StubHttpClient));

    let rt = PluggableRuntime {
        rt: Arc::new(TokioTaskManager::shared()),
        networking: Arc::new(virtual_net::UnsupportedVirtualNetworking::default()),
        engine: Some(wasmer::Engine::default()),
        tty: None,
        source: Arc::new(MultiSource::new()),
        module_cache: Arc::new(cache),
        http_client: None,
        package_loader: Arc::new(dummy_loader),
    };

    Some(Arc::new(rt))
}
