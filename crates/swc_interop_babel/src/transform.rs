use napi::JsFunction;
use serde::{Deserialize, Serialize};
use swc_interop_nodejs::{js_hook::JsHook, types::AsJson};

pub struct JsTrasnform {
    f: JsHook<AsJson<SourceFile>, AsJson<SourceFile>>,
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
        Ok(self.f.call(AsJson(input)).await?.0)
    }
}
