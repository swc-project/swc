//! Ported from https://github.com/zloirock/core-js/tree/master/packages/core-js-compat

use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;

use crate::Versions;

pub static DATA: Lazy<FxHashMap<String, Versions>> = Lazy::new(|| {
    serde_json::from_str(include_str!("../../data/core-js-compat/data.json"))
        .expect("failed parse corejs3-compat data.json")
});
