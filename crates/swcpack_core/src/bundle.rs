use anyhow::Result;
use async_trait::async_trait;

use crate::{esm::EsModule, resource::Res};

/// Work on the bundle. Used for minification.
#[async_trait]
pub trait BundleProcessor: Send + Sync {
    async fn process_bundle(&self, bundle: Vec<Res<EsModule>>) -> Result<()>;
}
