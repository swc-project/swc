use once_cell::sync::Lazy;
use rustc_hash::FxHashMap;
use serde::{Deserialize, Serialize};
use swc_atoms::Atom;

#[derive(Serialize, Deserialize, Debug)]
pub struct Entity {
    pub characters: String,
}

pub static HTML_ENTITIES: Lazy<FxHashMap<String, Entity>> = Lazy::new(|| {
    let entities: FxHashMap<String, Entity> =
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
    #[serde(default)]
    pub deprecated: Option<bool>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Element {
    _extends: Option<Vec<Atom>>,
    #[serde(flatten)]
    pub other: FxHashMap<Atom, AttributeInfo>,
}

pub static HTML_ELEMENTS_AND_ATTRIBUTES: Lazy<FxHashMap<Atom, Element>> = Lazy::new(|| {
    let default_attributes: FxHashMap<Atom, Element> =
        serde_json::from_str(include_str!("../data/html_elements_and_attributes.json"))
            .expect("failed to parse html_elements_and_attributes.json for default attributes");

    default_attributes
});

pub static SVG_ELEMENTS_AND_ATTRIBUTES: Lazy<FxHashMap<Atom, Element>> = Lazy::new(|| {
    let svg_elements_and_attributes: FxHashMap<Atom, Element> =
        serde_json::from_str(include_str!("../data/svg_elements_and_attributes.json"))
            .expect("failed to parse svg_elements_and_attributes.json for default attributes");

    svg_elements_and_attributes
});
