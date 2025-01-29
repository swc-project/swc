use napi::JsFunction;
use serde::{Deserialize, Serialize};
use swc_interop_nodejs::{js_hook::JsHook, types::AsJsonString};

pub struct JsTrasnform {
    f: JsHook<AsJsonString<SourceFile>, AsJsonString<SourceFile>>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SourceFile {
    pub code: String,
    #[serde(default)]
    pub map: Option<String>,
}

impl JsTrasnform {
    pub fn new(env: &napi::Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            f: JsHook::new(env, f)?,
        })
    }

    pub async fn transform(&self, input: SourceFile) -> napi::Result<SourceFile> {
        Ok(self.f.call(AsJsonString(input)).await?.0)
    }
}
