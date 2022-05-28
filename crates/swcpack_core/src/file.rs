use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use swc_common::FileName;

use crate::resource::Res;

#[async_trait]
pub trait FileLoader: Send + Sync {
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Res<Vec<u8>>>;
}
