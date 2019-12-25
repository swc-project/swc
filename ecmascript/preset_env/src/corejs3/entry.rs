use fxhash::FxHashMap;
use once_cell::sync::Lazy;
use swc_atoms::JsWord;

static ENTRIES: Lazy<FxHashMap<String, Vec<String>>> = Lazy::new(|| {
    serde_json::from_str(include_str!("entries.json"))
        .expect("failed to parse entries.json from core js 3")
});

#[derive(Debug)]
pub struct Entry {
    pub imports: Vec<JsWord>,
}

impl Entry {
    pub fn new() -> Self {
        Entry {
            imports: Default::default(),
        }
    }
}
