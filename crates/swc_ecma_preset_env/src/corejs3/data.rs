use once_cell::sync::Lazy;
use preset_env_base::version::Version;
use swc_common::collections::AHashMap;

pub static POSSIBLE_GLOBAL_OBJECTS: &[&str] = &["global", "globalThis", "self", "window"];

pub static MODULES_BY_VERSION: Lazy<AHashMap<&'static str, Version>> = Lazy::new(|| {
    serde_json::from_str::<AHashMap<_, _>>(include_str!(
        "../../data/core-js-compat/modules-by-versions.json"
    ))
    .expect("failed to parse modules-by-versions.json")
    .into_iter()
    .flat_map(|(k, v): (Version, Vec<String>)| {
        v.into_iter()
            .map(|s: String| (&*Box::leak(s.into_boxed_str()), k))
            .collect::<Vec<_>>()
    })
    .collect()
});
