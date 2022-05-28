use std::sync::Arc;

use anyhow::{Context, Result};
use async_recursion::async_recursion;
use async_trait::async_trait;
use futures::future::join_all;
use petgraph::graphmap::DiGraphMap;
use swc_common::{collections::AHashMap, FileName};
use swc_ecma_loader::resolve::Resolve;
use tokio::{join, spawn, sync::Mutex, task::yield_now, try_join};
use tracing::{debug, info};

use self::private::Sealed;
use crate::{
    asset::{AssetLoader, AssetLoaderContext, AssetProcessor},
    esm::{
        deps::collect_deps, AnalyzedFile, EsModule, EsmLoader, EsmLoaderCache, EsmLoaderContext,
        EsmPreprocessor, EsmProcessor,
    },
    input::BundlerInput,
    metadata::Metadata,
    resource::{Res, ResourceId},
    Mode,
};

/// Input + Processing mode.
///
///
/// This is sealed and methods are not public.
#[async_trait]
pub trait Drive: Sized + Send + Sync + Sealed {
    type LoadedModule: Send + Sync;

    /// Note: This should apply preprocessors.
    ///
    ///
    /// This do
    ///
    ///  - Load modules and invoke preprocessors.
    ///  - Analyzes dependencies.
    ///  - Load/preprecess dependencies repeatedly.
    ///  - Apply processors
    async fn create_module_graph(
        &mut self,
        esm_cache: Arc<EsmLoaderCache>,
    ) -> Result<Self::LoadedModule>;
}

/// Filled module graph.
///
/// Used by [Driver]   
pub struct ModuleGraph {
    entries: Vec<ResourceId>,
    graph: DiGraphMap<ResourceId, ()>,
}

pub struct Driver {
    mode: Mode,

    input: Box<dyn BundlerInput>,

    /// This is stored at the driver level, to make cache efficient.
    file_metadata: Arc<Mutex<AHashMap<Arc<FileName>, Metadata>>>,
    driver_metadata: Arc<Mutex<Metadata>>,
}

impl Sealed for Driver {}

impl Driver {
    pub fn new(mode: Mode, input: Box<dyn BundlerInput>) -> Self {
        Self {
            input,
            mode,
            file_metadata: Default::default(),
            driver_metadata: Default::default(),
        }
    }
}

#[async_trait]
impl Drive for Driver {
    type LoadedModule = ModuleGraph;

    async fn create_module_graph(
        &mut self,
        esm_cache: Arc<EsmLoaderCache>,
    ) -> Result<Self::LoadedModule> {
        if cfg!(debug_assertions) {
            info!("Driver::create_module_graph started");
        }

        let inputs = self.input.get_inputs().await?;

        let esm_loader = self.mode.esm_loader.clone();

        let worker = Arc::new(Worker {
            resolver: self.mode.resolver.clone(),

            esm_loader,
            esm_preprocessor: self.mode.esm_preprocessor.clone(),
            esm_processor: self.mode.esm_processor.clone(),

            asset_loader: self.mode.asset_loader.clone(),
            asset_processor: self.mode.asset_processor.clone(),

            file_metadata: self.file_metadata.clone(),
            driver_metadata: self.driver_metadata.clone(),
        });

        let entry_modules = {
            let mut handles = vec![];

            // We load all dependencies in parallel
            for input in inputs.iter() {
                let worker = worker.clone();
                let esm_cache = esm_cache.clone();

                let fut = spawn(worker.load_esm_recursively(input.clone(), esm_cache.clone()));

                handles.push(fut);
            }

            yield_now().await;

            join_all(handles).await
        };

        let mut entries = vec![];
        let mut graph = DiGraphMap::default();

        for entry in entry_modules.into_iter().filter_map(Result::ok) {
            let entry = entry?;

            entries.push(entry.res.id());

            graph.add_node(entry.res.id());

            for dep in entry.deps.iter().copied() {
                graph.add_node(dep);

                graph.add_edge(entry.res.id(), dep, ());
            }
        }

        Ok(ModuleGraph { entries, graph })
    }
}

struct Worker {
    resolver: Arc<dyn Resolve + Send + Sync>,

    esm_loader: Arc<dyn EsmLoader>,
    esm_preprocessor: Arc<dyn EsmPreprocessor>,
    esm_processor: Arc<dyn EsmProcessor>,

    asset_loader: Arc<dyn AssetLoader>,
    asset_processor: Arc<dyn AssetProcessor>,

    file_metadata: Arc<Mutex<AHashMap<Arc<FileName>, Metadata>>>,
    driver_metadata: Arc<Mutex<Metadata>>,
}

impl Worker {
    /// TODO: Return graph based on resource id
    #[async_recursion]
    async fn load_esm_recursively(
        self: Arc<Self>,
        filename: Arc<FileName>,
        esm_cache: Arc<EsmLoaderCache>,
    ) -> Result<AnalyzedFile> {
        if let Some(cached) = esm_cache.get(&filename).await {
            return Ok(cached);
        }

        if cfg!(debug_assertions) {
            debug!("load_esm_recursively: {}", filename);
        }

        yield_now().await;

        let main = self.clone().load_one_esm(filename.clone()).await?;

        if let Some(cached) = esm_cache.get(&filename).await {
            return Ok(cached);
        }

        // Load deps
        let mut deps = collect_deps(&main.ast);

        deps.sort();
        deps.dedup();

        let mut handles = vec![];

        for dep in deps {
            let dep_path = self.resolver.resolve(&filename, &dep)?;
            let dep_path = Arc::new(dep_path);

            // We load dependencies in parallel
            handles.push(spawn({
                let worker = self.clone();
                let esm_cache = esm_cache.clone();

                async move {
                    // TODO(kdy1): Check for loader rules.
                    // e.g. css

                    let is_esm = match &*dep_path {
                        FileName::Real(path) => path.extension() == Some("js".as_ref()),
                        _ => false,
                    };

                    if is_esm {
                        worker
                            .load_esm_recursively(dep_path.clone(), esm_cache.clone())
                            .await
                    } else {
                        worker.load_asset_recursively(dep_path.clone()).await
                    }
                }
            }));
        }

        yield_now().await;

        let results = join_all(handles).await;

        let mut deps = vec![];

        for result in results.into_iter().filter_map(Result::ok) {
            let result = result?;
            deps.push(result.res.id());
        }

        // As we loaded an esm and all dependencies, we can now invoke esm processor
        // TODO(kdy1): Use the results of previous join
        let results = spawn(self.apply_esm_processor(main.clone()));

        yield_now().await;
        let record = AnalyzedFile {
            res: main,
            deps: Arc::new(deps),
        };

        let (a, _) = join!(results, esm_cache.insert(filename.clone(), record.clone()));

        a??;

        Ok(record)
    }

    async fn apply_esm_processor(self: Arc<Self>, mut module: Res<EsModule>) -> Result<()> {
        let esm_processor = self.esm_processor.clone();

        esm_processor.process_esm(&mut module).await
    }

    /// Load `file` and apply preprocessors.
    async fn load_one_esm(self: Arc<Self>, filename: Arc<FileName>) -> Result<Res<EsModule>> {
        let mut file_metadata = Metadata::default();
        let mut esm_ctx = EsmLoaderContext {
            file_metadata: &mut file_metadata,
            driver_metadata: &self.driver_metadata,
        };
        let mut m = self
            .esm_loader
            .load_esm(&mut esm_ctx, filename.clone())
            .await?;
        self.file_metadata
            .lock()
            .await
            .insert(filename.clone(), file_metadata);

        self.esm_preprocessor.preprocess_esm(&mut m).await?;

        Ok(m)
    }

    async fn load_asset_recursively(
        self: Arc<Self>,
        filename: Arc<FileName>,
    ) -> Result<AnalyzedFile> {
        // TODO(kdy1); Pass context to asset loader so it can add dependencies
        let res = self.load_one_asset(filename.clone()).await?;

        Ok(AnalyzedFile {
            res,
            deps: Default::default(),
        })
    }

    async fn load_one_asset(self: Arc<Self>, filename: Arc<FileName>) -> Result<Res<EsModule>> {
        let mut file_metadata = Metadata::default();
        let ctx = AssetLoaderContext {
            file_metadata: &mut file_metadata,
            driver_metadata: &self.driver_metadata,
        };
        let mut asset = self.asset_loader.load_asset(ctx, filename.clone()).await?;

        self.asset_processor.process_asset(&mut asset).await?;

        Ok(asset)
    }
}

pub struct Multi<A, B> {
    first: A,
    second: B,
}

pub struct MultiModuleGraph<A, B> {
    first: A,
    second: B,
}

impl<A, B> Sealed for Multi<A, B> {}

#[async_trait]
impl<A, B> Drive for Multi<A, B>
where
    A: Drive,
    B: Drive,
{
    type LoadedModule = MultiModuleGraph<A::LoadedModule, B::LoadedModule>;

    async fn create_module_graph(
        &mut self,
        esm_cache: Arc<EsmLoaderCache>,
    ) -> Result<Self::LoadedModule> {
        let first = self.first.create_module_graph(esm_cache.clone());
        let second = self.second.create_module_graph(esm_cache);

        let (first, second) = try_join!(first, second).context("load_all failed")?;

        Ok(MultiModuleGraph { first, second })
    }
}

mod private {

    pub trait Sealed {}
}
