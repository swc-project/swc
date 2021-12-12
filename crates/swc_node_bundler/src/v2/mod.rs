use serde::Deserialize;
use swc_common::collections::AHashMap;

use self::regexp::JsRegexp;

mod regexp;

/// https://rollupjs.org/guide/en/#big-list-of-options

#[derive(Debug, Clone, Deserialize)]
pub struct BundlerConfig {
    pub(crate) external: ExternalConfig,

    pub(crate) input: InputConfig,
}

/// https://rollupjs.org/guide/en/#external
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
pub enum ExternalConfig {
    Regex(JsRegexp),
    Str(String),
    RegexList(Vec<JsRegexp>),
    StrList(Vec<String>),
}

/// https://rollupjs.org/guide/en/#input
#[derive(Debug, Clone, Deserialize)]
#[serde(untagged)]
pub enum InputConfig {
    Str(String),
    List(Vec<String>),
    Map(AHashMap<String, String>),
}
