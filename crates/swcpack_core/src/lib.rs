use std::{fmt::Display, sync::Arc, time::Instant};

use anyhow::{Context, Result};
use swc_common::FileName;
use swc_ecma_loader::resolve::Resolve;
use tracing::info;

use self::{
    asset::{AssetGraphPlugin, AssetLoader, AssetProcessor},
    bundle::BundleProcessor,
    driver::Drive,
    esm::{EsmLoader, EsmLoaderStorage, EsmPreprocessor, EsmProcessor},
};

pub mod asset;
pub mod bundle;
pub mod driver;
pub mod esm;
pub mod file;
pub mod input;
pub mod metadata;
pub mod resource;

pub struct Bundler<D>
where
    D: Drive,
{
    driver: D,
    data: BundlerData,
}

#[derive(Default)]
struct BundlerData {
    esm_loader_cache: Arc<EsmLoaderStorage>,
}

impl<D> Bundler<D>
where
    D: Drive,
{
    pub fn new(driver: D) -> Self {
        Self {
            driver,
            data: Default::default(),
        }
    }

    pub async fn bundle(&mut self) -> Result<()> {
        // Load modules and invoke preprocessors.
        let module_graph = self
            .driver
            .create_module_graph(self.data.esm_loader_cache.clone())
            .await
            .context("Driver::create_module_graph failed")?;

        if cfg!(debug_assertions) {
            info!("Driver::Driver::create_module_graph is done");
        }

        // TODO(kdy1): Run asset graph plugins

        // TODO(kdy1): Bundle

        //

        Ok(())
    }

    pub async fn notify_change(&mut self, file: Arc<FileName>) -> Result<()> {
        Ok(())
    }
}

/// See documentation for each trait to know what does each trait do.
#[derive(Clone)]
pub struct Mode {
    /// Resolving can be cached, if underlying resolver is identical.
    pub resolver: Arc<dyn Resolve + Send + Sync>,

    pub esm_loader: Arc<dyn EsmLoader>,

    pub esm_preprocessor: Arc<dyn EsmPreprocessor>,

    pub esm_processor: Arc<dyn EsmProcessor>,

    pub asset_loader: Arc<dyn AssetLoader>,

    pub asset_processor: Arc<dyn AssetProcessor>,

    pub asset_graph_plugin: Arc<dyn AssetGraphPlugin>,

    pub bundle_processor: Arc<dyn BundleProcessor>,
}

pub struct Timer {
    op: String,
    start: Instant,
}

impl Drop for Timer {
    fn drop(&mut self) {
        info!("{} :{}ms", self.op, self.start.elapsed().as_millis());
    }
}

impl Timer {
    pub fn new(op: impl Display) -> Self {
        Self {
            op: op.to_string(),
            start: Instant::now(),
        }
    }
}
