//! Module for `browserslist` queries.
#![deny(clippy::all)]

use std::collections::HashMap;

use anyhow::{Context, Error};
use dashmap::DashMap;
use from_variant::FromVariant;
use once_cell::sync::Lazy;
use serde::Deserialize;

use crate::{version::Version, BrowserData, Versions};

#[derive(Debug, Clone, Deserialize, FromVariant)]
#[serde(untagged)]
#[allow(clippy::large_enum_variant)]
pub enum Targets {
    Query(Query),
    EsModules(EsModules),
    Versions(Versions),
    /// This uses `ahash` directly to reduce build time.
    ///
    /// This type is identical to `swc_common::collections::AHashMap`
    HashMap(HashMap<String, QueryOrVersion, ahash::RandomState>),
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

type QueryResult = Result<Versions, Error>;

impl Query {
    fn exec(&self) -> QueryResult {
        fn query<T>(s: &[T]) -> QueryResult
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

            let versions =
                BrowserData::parse_versions(distribs).expect("failed to parse browser version");

            Ok(versions)
        }

        static CACHE: Lazy<DashMap<Query, Versions, ahash::RandomState>> =
            Lazy::new(Default::default);

        if let Some(v) = CACHE.get(self) {
            return Ok(*v);
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

        CACHE.insert(self.clone(), result);

        Ok(result)
    }
}

pub fn targets_to_versions(v: Option<Targets>) -> Result<Versions, Error> {
    match v {
        None => Ok(Default::default()),
        Some(Targets::Versions(v)) => Ok(v),
        Some(Targets::Query(q)) => q
            .exec()
            .context("failed to convert target query to version data"),
        Some(Targets::HashMap(mut map)) => {
            let q = map.remove("browsers").map(|q| match q {
                QueryOrVersion::Query(q) => q.exec().expect("failed to run query"),
                _ => unreachable!(),
            });

            let node = map.remove("node").map(|q| match q {
                QueryOrVersion::Version(v) => v,
                QueryOrVersion::Query(..) => unreachable!(),
            });

            if map.is_empty() {
                if let Some(mut q) = q {
                    q.node = node;
                    return Ok(q);
                }
            }

            let mut result = Versions::default();
            for (k, v) in map.iter() {
                match v {
                    QueryOrVersion::Query(q) => {
                        let v = q.exec().context("failed to run query")?;

                        for (k, v) in v {
                            result.insert(k, v);
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
        let res = Query::Single("".into()).exec().unwrap();
        assert!(
            !res.is_any_target(),
            "empty query should return non-empty result"
        );
    }
}
