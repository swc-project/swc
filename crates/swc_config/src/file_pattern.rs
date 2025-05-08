use serde::{Deserialize, Serialize};

use crate::{glob::CachedGlob, regex::CachedRegex};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(untagged)]
pub enum FilePattern {
    Regex(CachedRegex),
    Glob { glob: CachedGlob },
}
