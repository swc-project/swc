use crate::{BrowserData, Versions};
use once_cell::sync::Lazy;
use std::collections::HashMap;

pub(crate) static BUILTINS: Lazy<HashMap<String, Versions>> = Lazy::new(|| {
    let map: HashMap<_, BrowserData<Option<String>>> =
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
