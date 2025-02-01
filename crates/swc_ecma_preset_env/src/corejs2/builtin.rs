use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;

use crate::{BrowserData, Versions};

pub(crate) static BUILTINS: Lazy<FxHashMap<String, Versions>> = Lazy::new(|| {
    let map: FxHashMap<_, BrowserData<Option<String>>> =
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
