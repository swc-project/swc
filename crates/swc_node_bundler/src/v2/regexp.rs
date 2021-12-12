use regex::Regex;
use std::sync::Arc;
use swc_atoms::JsWord;
use swc_common::ast_serde;

/// JS Glue code converts regexp to this struct.
#[derive(Debug, Clone)]
pub struct JsRegexp {
    pub source: JsWord,
    pub flags: JsWord,
    compiled: Arc<Regex>,
}

#[ast_serde("RegExp")]
struct JsRegexpDeser {
    pub source: JsWord,
    pub flags: JsWord,
}
