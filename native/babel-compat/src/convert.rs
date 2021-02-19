use serde::de::DeserializeOwned;
use serde::Serialize;
use std::sync::Arc;
use swc_common::SourceMap;

#[derive(Clone)]
pub struct Context {
    pub cm: Arc<SourceMap>,
}

pub trait Babelify {
    type Output: Serialize + DeserializeOwned;

    fn babelify(self, ctx: &mut Context) -> Self::Output;
}
