use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_common::collections::AHashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct Entity {
    pub characters: String,
}

pub static HTML_ENTITIES: Lazy<AHashMap<String, Entity>> = Lazy::new(|| {
    let entities: AHashMap<String, Entity> = serde_json::from_str(include_str!("./entities.json"))
        .expect("failed to parse entities.json for html entities");

    entities
});
