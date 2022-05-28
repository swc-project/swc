use std::sync::Arc;

use anyhow::Result;
use async_trait::async_trait;
use swc_common::FileName;

use crate::resource::Res;

#[async_trait]
pub trait FileLoader: Send + Sync {
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Res<Vec<u8>>>;
}

#[async_trait]
impl<FL: ?Sized> FileLoader for Arc<FL>
where
    FL: FileLoader,
{
    async fn load_file(&self, filename: Arc<FileName>) -> Result<Res<Vec<u8>>> {
        self.as_ref().load_file(filename).await
    }
}
