use crate::{BrowserData, Versions};
use once_cell::sync::Lazy;
use swc_common::collections::AHashMap;

pub(crate) static BUILTINS: Lazy<AHashMap<String, Versions>> = Lazy::new(|| {
    let map: AHashMap<_, BrowserData<Option<String>>> =
        serde_json::from_str(include_str!("builtin.json")).expect("failed to parse json");

    map.into_iter()
        .map(|(feature, version)| {
            (
                feature,
                version.map_value(|version| version.map(|v| v.parse().unwrap())),
            )
        })
        .collect()
});
