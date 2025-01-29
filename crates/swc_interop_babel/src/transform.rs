use serde::{Deserialize, Serialize};
use swc_interop_nodejs::{js_hook::JsHook, types::AsJson};

pub struct JsTrasnform {
    f: JsHook<AsJson<TransformUnit>, AsJson<TransformUnit>>,
}

#[derive(Debug, Serialize, Deserialize)]
struct TransformUnit {
    code: String,
    #[serde(default)]
    map: Option<String>,
}
