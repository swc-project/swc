use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged, rename_all = "camelCase")]
pub enum SourceMapContent {
    Str(String),
    Parsed {
        version: usize,
        sources: Vec<String>,
        names: Vec<String>,
        mappings: String,
        file: Option<String>,
        source_root: Option<String>,
        sources_content: Option<Vec<String>>,
    },
}

impl SourceMapContent {}
