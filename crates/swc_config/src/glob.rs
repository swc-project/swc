use anyhow::Result;
use fast_glob::glob_match;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone)]
pub struct CachedGlob {
    glob: String,
}

impl CachedGlob {
    pub fn new(glob: &str) -> Result<Self> {
        Ok(Self {
            glob: glob.to_string(),
        })
    }

    pub fn matches(&self, path: &str) -> bool {
        glob_match(&self.glob, path)
    }
}

impl Serialize for CachedGlob {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        String::serialize(&self.glob, serializer)
    }
}

impl<'de> Deserialize<'de> for CachedGlob {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        let glob = String::deserialize(deserializer)?;
        Ok(Self { glob })
    }
}
