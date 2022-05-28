use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use swc_common::FileName;

#[async_trait]
pub trait FileLoader {
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Arc<Vec<u8>>>;
}
