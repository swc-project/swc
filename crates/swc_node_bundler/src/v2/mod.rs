use serde::Deserialize;

use self::regexp::JsRegexp;

mod regexp;

/// https://rollupjs.org/guide/en/#big-list-of-options

#[derive(Debug, Clone, Deserialize)]
pub struct BundlerConfig {
    pub(crate) external: ExternalConfig,
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
