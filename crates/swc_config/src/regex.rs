//! Regex cache

use std::{
    hash::{Hash, Hasher},
    ops::Deref,
    str::FromStr,
    sync::Arc,
};

pub use anyhow::Error;
use anyhow::{Context, Result};
use dashmap::DashMap;
use once_cell::sync::Lazy;
use regex::Regex;
use rustc_hash::FxBuildHasher;
use serde::{Deserialize, Serialize};

/// A regex which can be used as a configuration.
///
/// While deserializing, this will be converted to a string and cached based on
/// the pattern.
#[derive(Debug, Clone)]
pub struct CachedRegex {
    regex: Arc<Regex>,
}

impl Deref for CachedRegex {
    type Target = Regex;

    fn deref(&self) -> &Self::Target {
        &self.regex
    }
}

// Note: PartialEq, Eq, and Hash for CachedRegex should use the pattern string
// for comparison and hashing, as recommended in https://github.com/rust-lang/regex/issues/670.
// These traits are implemented below by delegating to the `as_str()` of the
// internal Regex.
impl PartialEq for CachedRegex {
    fn eq(&self, other: &Self) -> bool {
        self.regex.as_str() == other.regex.as_str()
    }
}

impl Eq for CachedRegex {}

impl Hash for CachedRegex {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.regex.as_str().hash(state);
    }
}

impl CachedRegex {
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

        Ok(CachedRegex { regex })
    }
}

impl<'de> Deserialize<'de> for CachedRegex {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: serde::Deserializer<'de>,
    {
        use serde::de::Error;

        let s = String::deserialize(deserializer)?;

        Self::new(&s).map_err(|err| D::Error::custom(err.to_string()))
    }
}

impl Serialize for CachedRegex {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let s = self.regex.as_str();

        serializer.serialize_str(s)
    }
}

/// This will panic for wrong patterns.
impl From<&'_ str> for CachedRegex {
    fn from(s: &'_ str) -> Self {
        Self::new(s).unwrap()
    }
}

impl FromStr for CachedRegex {
    type Err = Error;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        Self::new(s)
    }
}
