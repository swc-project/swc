use std::{ops::Deref, sync::Arc};

pub use anyhow::Error;
use anyhow::{Context, Result};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regress::Regex;
use rustc_hash::FxBuildHasher;

#[derive(Debug, Clone)]
pub struct CachedJsRegex {
    regex: Arc<Regex>,
}

impl Deref for CachedJsRegex {
    type Target = Regex;

    fn deref(&self) -> &Self::Target {
        &self.regex
    }
}

impl CachedJsRegex {
    /// Get or create a cached regex. This will return the previous instance if
    /// it's already cached.
    pub fn new(input: &str) -> Result<Self> {
        static CACHE: Lazy<DashMap<String, Arc<Regex>, FxBuildHasher>> =
            Lazy::new(Default::default);

        if let Some(cache) = CACHE.get(input).as_deref().cloned() {
            return Ok(Self { regex: cache });
        }

        let regex =
            Regex::new(input).with_context(|| format!("failed to parse `{input}` as regex"))?;
        let regex = Arc::new(regex);

        CACHE.insert(input.to_owned(), regex.clone());

        Ok(CachedJsRegex { regex })
    }
}
