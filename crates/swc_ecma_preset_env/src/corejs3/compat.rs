//! Ported from https://github.com/zloirock/core-js/tree/master/packages/core-js-compat

use once_cell::sync::Lazy;
use swc_common::collections::AHashMap;

use crate::Versions;

pub static DATA: Lazy<AHashMap<String, Versions>> = Lazy::new(|| {
    serde_json::from_str(include_str!("../../data/core-js-compat/data.json"))
        .expect("failed parse corejs3-compat data.json")
});
