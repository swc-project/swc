use regex::Regex;
use serde::{Deserialize, Deserializer};
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::ast_serde;

/// JS Glue code converts regexp to this struct.
#[derive(Debug, Clone)]
pub struct JsRegexp {
    compiled: Arc<Regex>,
}

#[ast_serde("RegExp")]
struct JsRegexpDeser {
    pub source: JsWord,
    pub flags: JsWord,
}

impl<'de> Deserialize<'de> for JsRegexp {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let deserialized = JsRegexpDeser::deserialize(deserializer)?;
        Ok(JsRegexp {
            compiled: Arc::new(Regex::new(&deserialized.source).unwrap()),
        })
    }
}
