use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_common::collections::AHashMap;

#[derive(Serialize, Deserialize, Debug)]
pub struct Entity {
    pub characters: String,
}

pub static HTML_ENTITIES: Lazy<AHashMap<String, Entity>> = Lazy::new(|| {
    let entities: AHashMap<String, Entity> =
        serde_json::from_str(include_str!("../data/entities.json"))
            .expect("failed to parse entities.json for html entities");

    entities
});

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct AttributeInfo {
    #[serde(default)]
    pub initial: Option<String>,
    #[serde(default)]
    pub inherited: Option<bool>,
    #[serde(default)]
    pub boolean: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    _extends: Option<Vec<String>>,
    #[serde(flatten)]
    pub other: AHashMap<String, AttributeInfo>,
}

pub static HTML_ELEMENTS_AND_ATTRIBUTES: Lazy<AHashMap<String, Element>> = Lazy::new(|| {
    let default_attributes: AHashMap<String, Element> =
        serde_json::from_str(include_str!("../data/html_elements_and_attributes.json"))
            .expect("failed to parse html_elements_and_attributes.json for default attributes");

    default_attributes
});

pub static SVG_ELEMENTS_AND_ATTRIBUTES: Lazy<AHashMap<String, Element>> = Lazy::new(|| {
    let svg_elements_and_attributes: AHashMap<String, Element> =
        serde_json::from_str(include_str!("../data/svg_elements_and_attributes.json"))
            .expect("failed to parse svg_elements_and_attributes.json for default attributes");

    svg_elements_and_attributes
});
