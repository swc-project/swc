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

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct AttributeMetaData {
    #[serde(default)]
    pub initial: Option<String>,
    #[serde(default)]
    pub inherited: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element(pub AHashMap<String, AttributeMetaData>);

pub static HTML_DEFAULT_ATTRIBUTES: Lazy<AHashMap<String, Element>> = Lazy::new(|| {
    let default_attributes: AHashMap<String, Element> =
        serde_json::from_str(include_str!("./html_default_attributes.json"))
            .expect("failed to parse html_default_attributes.json for default attributes");

    default_attributes
});

pub static SVG_DEFAULT_ATTRIBUTES: Lazy<AHashMap<String, Element>> = Lazy::new(|| {
    let default_attributes: AHashMap<String, Element> =
        serde_json::from_str(include_str!("./svg_default_attributes.json"))
            .expect("failed to parse svg_default_attributes.json for default attributes");

    default_attributes
});
