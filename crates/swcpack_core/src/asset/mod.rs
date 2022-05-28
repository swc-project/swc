use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use swc_common::FileName;
use tokio::sync::Mutex;

use crate::{esm::EsModule, metadata::Metadata, resource::Res};

/// TODO: Provide `Context` which can be used to dependency from asset
/// plugin.
///
/// Loading of assets can be cached, if underlying asset loader is
/// identical.
///
/// e.g. (css processor + css modules)
#[async_trait]
pub trait AssetLoader: Send + Sync {
    ///
    ///
    /// The returned [EsModule] works as a virtual module. (e.g. css module)
    async fn load_asset<'a>(
        &'a self,
        ctx: AssetLoaderContext<'a>,
        filename: Arc<FileName>,
    ) -> Result<Res<EsModule>>;
}

pub struct AssetLoaderContext<'a> {
    pub file_metadata: &'a mut Metadata,
    pub driver_metadata: &'a Mutex<Metadata>,
}

/// Plugin that operates on each asset file.
///
///
/// ## Using multiple plugins
///
/// If you want to use multiple plugins, see `chain` method.

///
///
/// ## Role
///
///  - `postcss`
#[async_trait]
pub trait AssetProcessor: Send + Sync {
    async fn process_asset(&self, m: &mut Res<EsModule>) -> Result<()>;
}

/// Plugin that operates on multiple assets.
///
/// ## Using multiple plugins
///
/// If you want to use multiple plugins, see `chain` method.
pub trait AssetGraphPlugin: Send + Sync {}
