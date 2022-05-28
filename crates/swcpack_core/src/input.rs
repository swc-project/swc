use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use swc_common::FileName;

/// TODO: Change detection.
#[async_trait]
pub trait BundlerInput: Send + Sync {
    async fn get_inputs(&self) -> Result<Vec<Arc<FileName>>>;
}

#[async_trait]
impl BundlerInput for Vec<Arc<FileName>> {
    async fn get_inputs(&self) -> Result<Vec<Arc<FileName>>> {
        Ok(self.clone())
    }
}
