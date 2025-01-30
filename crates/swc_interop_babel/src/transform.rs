use napi::JsFunction;
use napi_derive::napi;
use serde::{Deserialize, Serialize};
use swc_interop_nodejs::{js_hook::JsHook, types::AsJsonString};

pub struct JsTrasnform {
    f: JsHook<AsJsonString<TransformOutput>, AsJsonString<TransformOutput>>,
}

#[napi(object)]
#[derive(Debug, Serialize, Deserialize)]
pub struct TransformOutput {
    pub code: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub map: Option<String>,
}

impl JsTrasnform {
    pub fn new(env: &napi::Env, f: &JsFunction) -> napi::Result<Self> {
        Ok(Self {
            f: JsHook::new(env, f)?,
        })
    }

    pub async fn transform(&self, input: TransformOutput) -> napi::Result<TransformOutput> {
        Ok(self.f.call(AsJsonString(input)).await?.0)
    }
}
