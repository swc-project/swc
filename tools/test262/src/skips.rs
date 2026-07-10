//! Auditable, typed policy for cases that cannot be evaluated.

use std::{fs, path::Path};

use anyhow::{bail, Context, Result};
use globset::{Glob, GlobMatcher};
use serde::{Deserialize, Serialize};

use crate::model::{SkipReason, Suite};

#[derive(Debug, Deserialize)]
#[serde(deny_unknown_fields)]
struct SkipFile {
    #[serde(default)]
    skip: Vec<SkipRuleConfig>,
}

#[derive(Debug, Clone, Deserialize, Serialize)]
#[serde(deny_unknown_fields)]
pub struct SkipRuleConfig {
    pub suite: Suite,
    pub path: String,
    pub reason: SkipReason,
    pub description: String,
    #[serde(default)]
    pub issue: Option<String>,
}

#[derive(Debug)]
struct SkipRule {
    config: SkipRuleConfig,
    matcher: GlobMatcher,
}

#[derive(Debug, Default)]
pub struct SkipPolicy {
    rules: Vec<SkipRule>,
}

impl SkipPolicy {
    pub fn load(path: &Path) -> Result<Self> {
        let source = fs::read_to_string(path)
            .with_context(|| format!("failed to read skip policy `{}`", path.display()))?;
        Self::parse(&source)
            .with_context(|| format!("failed to parse skip policy `{}`", path.display()))
    }

    fn parse(source: &str) -> Result<Self> {
        let file: SkipFile = toml::from_str(source)?;
        let mut rules = Vec::with_capacity(file.skip.len());
        for config in file.skip {
            if config.description.trim().is_empty() {
                bail!("skip rule `{}` must have a description", config.path);
            }
            if config.path.trim().is_empty() {
                bail!("skip rule path cannot be empty");
            }
            let matcher = Glob::new(&config.path)
                .with_context(|| format!("invalid skip glob `{}`", config.path))?
                .compile_matcher();
            rules.push(SkipRule { config, matcher });
        }
        Ok(Self { rules })
    }

    pub fn matching(&self, suite: Suite, path: &Path) -> Option<&SkipRuleConfig> {
        let normalized = path.to_string_lossy().replace('\\', "/");
        self.rules
            .iter()
            .find(|rule| rule.config.suite == suite && rule.matcher.is_match(&normalized))
            .map(|rule| &rule.config)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn matches_only_the_declared_suite() {
        let policy = SkipPolicy::parse(
            r#"
[[skip]]
suite = "runtime"
path = "built-ins/Atomics/**"
reason = "unsupported-host-capability"
description = "Requires host agents."
"#,
        )
        .unwrap();

        let path = Path::new("built-ins/Atomics/example.js");
        assert!(policy.matching(Suite::Runtime, path).is_some());
        assert!(policy.matching(Suite::Parser, path).is_none());
    }

    #[test]
    fn rejects_unexplained_skips() {
        let result = SkipPolicy::parse(
            r#"
[[skip]]
suite = "runtime"
path = "built-ins/**"
reason = "resource-limit"
description = ""
"#,
        );
        assert!(result.is_err());
    }
}
