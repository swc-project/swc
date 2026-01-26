//! Module for `browserslist` queries.
#![deny(clippy::all)]

use std::{collections::HashMap, path::PathBuf, sync::Arc};

use anyhow::{anyhow, Context, Error};
use dashmap::DashMap;
use from_variant::FromVariant;
use once_cell::sync::Lazy;
use rustc_hash::FxBuildHasher;
use serde::Deserialize;

use crate::{version::Version, BrowserData, Versions};

/// Result of resolving browser targets.
#[derive(Debug, Clone)]
pub struct TargetInfo {
    /// The resolved browser versions.
    pub versions: Arc<Versions>,
    /// True if the browserslist query returned an empty result (unknown browser
    /// version). When this is true, we should assume the browser is a
    /// recent version that supports all modern features (no transforms
    /// needed), similar to Babel's behavior.
    pub unknown_version: bool,
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
#[allow(clippy::large_enum_variant)]
pub enum Targets {
    Query(Query),
    EsModules(EsModules),
    Versions(Versions),
    HashMap(HashMap<String, QueryOrVersion, FxBuildHasher>),
}

#[derive(Debug, Clone, Copy, Deserialize)]
pub struct EsModules {
    #[allow(dead_code)]
    esmodules: bool,
}

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
pub enum QueryOrVersion {
    Query(Query),
    Version(Version),
}

#[derive(Debug, Clone, Deserialize, FromVariant, Eq, PartialEq, PartialOrd, Ord, Hash)]
#[serde(untagged)]
pub enum Query {
    Single(String),
    Multiple(Vec<String>),
}

/// Internal query result containing both versions and whether the query
/// returned empty.
type InternalQueryResult = Result<(Arc<Versions>, bool), Error>;

impl Query {
    fn exec(&self) -> InternalQueryResult {
        fn query<T>(s: &[T]) -> InternalQueryResult
        where
            T: AsRef<str>,
        {
            let distribs = browserslist::resolve(
                s,
                &browserslist::Opts {
                    mobile_to_desktop: true,
                    ignore_unknown_versions: true,
                    ..Default::default()
                },
            )
            .with_context(|| {
                format!(
                    "failed to resolve browserslist query: {:?}",
                    s.iter().map(|v| v.as_ref()).collect::<Vec<_>>()
                )
            })?;

            // Track if the browserslist query returned empty (unknown version).
            // When this happens, we should treat it as a recent browser version
            // that supports all features, not apply all transforms.
            let unknown_version = distribs.is_empty();

            let versions =
                BrowserData::parse_versions(distribs).expect("failed to parse browser version");

            Ok((Arc::new(versions), unknown_version))
        }

        static CACHE: Lazy<DashMap<Query, (Arc<Versions>, bool), FxBuildHasher>> =
            Lazy::new(Default::default);

        if let Some(v) = CACHE.get(self) {
            return Ok(v.clone());
        }

        let result = match *self {
            Query::Single(ref s) => {
                if s.is_empty() {
                    query(&["defaults"])
                } else {
                    query(&[s])
                }
            }
            Query::Multiple(ref s) => query(s),
        }
        .context("failed to execute query")?;

        CACHE.insert(self.clone(), result.clone());

        Ok(result)
    }
}

pub fn targets_to_versions(v: Option<Targets>, path: Option<PathBuf>) -> Result<TargetInfo, Error> {
    match v {
        #[cfg(not(target_arch = "wasm32"))]
        None => {
            let mut browserslist_opts = browserslist::Opts {
                mobile_to_desktop: true,
                ignore_unknown_versions: true,
                ..Default::default()
            };
            if let Some(path) = path {
                browserslist_opts.path = path
                    .clone()
                    .into_os_string()
                    .into_string()
                    .map_err(|_| anyhow!("Invalid path \"{path:?}\""))?
                    .into();
            }
            let distribs = browserslist::execute(&browserslist_opts)
                .with_context(|| "failed to resolve browserslist query from browserslist config")?;

            // When targets is None, it means the user didn't specify any targets.
            // We use browserslist config or defaults, so we should NOT treat empty
            // results as "unknown version". That case is for when a user explicitly
            // specifies a query like "Chrome > 99999" that returns empty.
            let versions = BrowserData::parse_versions(distribs)
                .with_context(|| "failed to parse browser version")?;

            Ok(TargetInfo {
                versions: Arc::new(versions),
                unknown_version: false,
            })
        }
        #[cfg(target_arch = "wasm32")]
        None => Ok(TargetInfo {
            versions: Default::default(),
            unknown_version: false,
        }),
        Some(Targets::Versions(v)) => Ok(TargetInfo {
            versions: Arc::new(v),
            unknown_version: false,
        }),
        Some(Targets::Query(q)) => {
            let (versions, unknown_version) = q
                .exec()
                .context("failed to convert target query to version data")?;
            Ok(TargetInfo {
                versions,
                unknown_version,
            })
        }
        Some(Targets::HashMap(mut map)) => {
            let q = map.remove("browsers").map(|q| match q {
                QueryOrVersion::Query(q) => q.exec().expect("failed to run query"),
                _ => unreachable!(),
            });

            let node = map.remove("node").map(|q| match q {
                QueryOrVersion::Version(v) => v,
                QueryOrVersion::Query(..) => unreachable!(),
            });

            // Track if any query returned empty (unknown version)
            let mut unknown_version = false;

            if map.is_empty() {
                if let Some((versions, is_unknown)) = q {
                    let mut versions = *versions;
                    versions.node = node;
                    unknown_version = is_unknown;
                    return Ok(TargetInfo {
                        versions: Arc::new(versions),
                        unknown_version,
                    });
                }
            }

            let mut result = Versions::default();
            for (k, v) in map.iter() {
                match v {
                    QueryOrVersion::Query(q) => {
                        let (versions, is_unknown) = q.exec().context("failed to run query")?;
                        unknown_version = unknown_version || is_unknown;

                        for (k, v) in versions.iter() {
                            result.insert(k, *v);
                        }
                    }
                    QueryOrVersion::Version(v) => {
                        result.insert(k, Some(*v));
                    }
                }
            }

            unimplemented!("Targets: {:?}", map)
        }
        _ => unimplemented!("Option<Targets>: {:?}", v),
    }
}

#[cfg(test)]
mod tests {
    use super::Query;

    #[test]
    fn test_empty() {
        let (res, unknown_version) = Query::Single("".into()).exec().unwrap();
        assert!(
            !res.is_any_target(),
            "empty query should return non-empty result"
        );
        assert!(
            !unknown_version,
            "empty query should not be unknown version"
        );
    }

    #[test]
    fn test_node_20_19() {
        let (res, unknown_version) = Query::Single("node 20.19".into()).exec().unwrap();
        let node_version = res.node.expect("node version should be resolved");
        assert_eq!(node_version.major, 20, "major version should be 20");
        assert_eq!(node_version.minor, 19, "minor version should be 19");
        assert!(
            !unknown_version,
            "known node version should not be unknown version"
        );
    }

    #[test]
    fn test_unknown_chrome_version() {
        // Chrome 999 is an unknown version, browserslist should return empty
        let (res, unknown_version) = Query::Single("Chrome > 9999999".into()).exec().unwrap();
        assert!(
            res.is_any_target(),
            "unknown chrome version should return empty result"
        );
        assert!(
            unknown_version,
            "unknown chrome version should be marked as unknown"
        );
    }
}
