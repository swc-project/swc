//! Ported from https://github.com/zloirock/core-js/tree/master/packages/core-js-compat

use crate::Versions;
use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;

pub static DATA: Lazy<FxHashMap<String, Versions>> = Lazy::new(|| {
    serde_json::from_str(include_str!("compat.json"))
        .expect("failed parse corejs3-compat data.json")
});
