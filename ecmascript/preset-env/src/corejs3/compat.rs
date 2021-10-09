//! Ported from https://github.com/zloirock/core-js/tree/master/packages/core-js-compat

use crate::Versions;
use once_cell::sync::Lazy;
use swc_common::collections::AHashMap;

pub static DATA: Lazy<AHashMap<String, Versions>> = Lazy::new(|| {
    serde_json::from_str(include_str!("compat.json"))
        .expect("failed parse corejs3-compat data.json")
});
