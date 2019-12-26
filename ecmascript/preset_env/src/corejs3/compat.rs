//! Ported from https://github.com/zloirock/core-js/tree/master/packages/core-js-compat

use crate::Versions;
use fxhash::FxHashMap;
use once_cell::sync::Lazy;

pub static DATA: Lazy<FxHashMap<String, Versions>> = Lazy::new(|| {
    serde_json::from_str(include_str!("compat.json"))
        .expect("failed parse corejs3-compat data.json")
});
