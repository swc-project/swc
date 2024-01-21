use std::collections::{BTreeMap, HashSet};
use std::fmt;
use std::path::PathBuf;

use serde::de::{self, Deserialize, Deserializer, MapAccess, Visitor};

/// The parsed representation of the "exports" field in a package.json file.
/// See https://nodejs.org/api/packages.html#package-entry-points for syntax.
#[derive(Debug)]
pub(super) struct Exports {
    subpaths: BTreeMap<String, Subpath>
}

impl Exports {
    /// Resolves a relative path to a target file path.
    pub fn resolve_import_path(&self, rel_path: &str, conditions: &HashSet<&str>) -> Option<PathBuf> {
        let mut wildcard_match = None;
        for (candidate, subpath) in self.subpaths.iter() {
            match candidate_matches(candidate, rel_path) {
                None => continue,
                Some(Match::Exact) => {
                    return subpath.matches(&conditions).and_then(|m| {
                        match m {
                            SubpathMatch::Target(path) => Some(path.into()),
                            SubpathMatch::Exclude => None,
                        }
                    });
                }
                Some(Match::Wildcard { replacement }) => {
                    match subpath.matches(&conditions) {
                        None => continue,

                        // If we have a target, save it as a candidate.
                        // We have to keep looking as there may be an exclude directive later.
                        Some(SubpathMatch::Target(path)) => {
                            if wildcard_match.is_none() {
                                wildcard_match = Some((path, replacement));
                            }
                        }

                        // If we have an exclude, stop looking and immediately return none.
                        Some(SubpathMatch::Exclude) => return None,
                    }
                }
            }
        }

        match wildcard_match {
            None => None,
            Some((path, replacement)) => {
                Some(path.replace("*", replacement).into())
            }
        }
    }
}


enum Match<'a> {
    Exact,
    Wildcard { replacement: &'a str },
}

fn candidate_matches<'a>(candidate: &str, rel_path: &'a str) -> Option<Match<'a>> {
    let candidate = match (candidate, rel_path) {
        (".", "") => return Some(Match::Exact),
        (".", _) => return None,
        (_, _) => {
            // Strip "./" prefix.
            let candidate = candidate.strip_prefix("./").unwrap_or(candidate);
            if candidate == rel_path {
                return Some(Match::Exact);
            }
            candidate
        }
    };

    if let Some(idx) = candidate.find('*') {
        let (prefix, suffix) = candidate.split_at(idx);
        if rel_path.starts_with(prefix) && rel_path.ends_with(suffix) {
            // Get the middle part of the path, to be injected into the result.
            let replacement = &rel_path[prefix.len()..(rel_path.len() - suffix.len())];
            return Some(Match::Wildcard { replacement })
        }
    }

    None
}

#[derive(Debug, PartialEq, Eq)]
enum Subpath {
    Target(String),
    Conditions(BTreeMap<String, Subpath>),
    Exclude,
}

enum SubpathMatch<'a> {
    Target(&'a str),
    Exclude,
}

impl Subpath {
    fn matches(&self, active_conditions: &HashSet<&str>) -> Option<SubpathMatch> {
        match self {
            Subpath::Target(path) => Some(SubpathMatch::Target(&path)),
            Subpath::Exclude => Some(SubpathMatch::Exclude),
            Subpath::Conditions(conds) => {
                for (cond, subpath) in conds.iter() {
                    if active_conditions.contains(cond.as_str()) {
                        return subpath.matches(&active_conditions);
                    }
                }
                None
            }
        }
    }
}

// The "exports" value can be defined in lots of ways.
//
// - A single subpath, e.g. "exports": "./index.js".
//   Syntactic sugar for {".": "./index.js"}
//
// - A condition spec: {"node": "./index.node.js"}
//   Conditions can be nested: {"node": {"import": "./index.node.js", "default": "./index.js"}}
//
// - An ordered map of subpaths key-value pairs: {".": "./index.js", "./foo/*": "./foo/*.js"}
// - Each subpath value can be one of:
//   - A single target path, e.g. "./index.js" (possibly with wildcards, "./foo/*.js")
//   - A condition spec.
//   - Null, indicating the subpath is not exported (overriding other exports that may match).

impl<'de> Deserialize<'de> for Exports {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where D: Deserializer<'de>
    {
        struct StringOrMap;
        impl<'de> Visitor<'de> for StringOrMap {
            type Value = Exports;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("string or map")
            }

            fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
                where
                    E: de::Error,
            {
                let mut subpaths =  BTreeMap::<String, Subpath>::new();
                subpaths.insert(".".into(), Subpath::Target(value.to_string()));
                Ok(Exports { subpaths })
            }

            fn visit_map<M>(self, mut access: M) -> Result<Self::Value, M::Error>
                where
                    M: MapAccess<'de>,
            {

                let mut subpaths = BTreeMap::new();

                // Peek at the first entry to decide whether it's a map of subpaths or conditions.
                let Some((key, value)) = access.next_entry::<String, Subpath>()? else {
                    // Empty map.
                    return Ok(Exports { subpaths });
                };

                if !key.starts_with(".") {
                    let mut conditions: BTreeMap<String, Subpath> = Deserialize::deserialize(de::value::MapAccessDeserializer::new(access))?;
                    conditions.insert(key, value);
                    subpaths.insert(".".to_string(), Subpath::Conditions(conditions));
                    return Ok(Exports { subpaths });
                }

                subpaths.insert(key, value);
                while let Some((key, value)) = access.next_entry::<String, Subpath>()? {
                    subpaths.insert(key, value);
                }

                Ok(Exports { subpaths })
            }
        }

        deserializer.deserialize_any(StringOrMap)
    }
}

struct SubpathVisitor;

impl<'de> Visitor<'de> for SubpathVisitor {
    type Value = Subpath;

    fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
        formatter.write_str("string or map")
    }

    fn visit_unit<E>(self) -> Result<Self::Value, E> where E: de::Error {
        Ok(Subpath::Exclude)
    }

    fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: de::Error,
    {
        Ok(Subpath::Target(value.to_string()))
    }

    fn visit_map<M>(self, map: M) -> Result<Self::Value, M::Error>
        where
            M: MapAccess<'de>,
    {
        let conditions: BTreeMap<String, Subpath> = Deserialize::deserialize(de::value::MapAccessDeserializer::new(map))?;
        Ok(Subpath::Conditions(conditions))
    }
}

impl<'de> Deserialize<'de> for Subpath {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
        where D: Deserializer<'de>
    {
        deserializer.deserialize_any(SubpathVisitor)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_subpaths() {
        let exports: Exports = serde_json::from_str(r#"{
            ".": "./index.js",
            "./foo/*": "./foo/*.js",
            "./bar": {"node": "./bar.node.js", "default": "./bar.js"},
            "./baz": {"node": "./baz.node.js", "default": null},
            "./qux": null
        }"#).unwrap();
        assert_eq!(exports.subpaths.len(), 5);
        assert_eq!(exports.subpaths.get(".").unwrap(), &Subpath::Target("./index.js".into()));
        assert_eq!(exports.subpaths.get("./foo/*").unwrap(), &Subpath::Target("./foo/*.js".into()));
        assert_eq!(exports.subpaths.get("./bar").unwrap(), &Subpath::Conditions({
            let mut map = BTreeMap::new();
            map.insert("node".to_owned(), Subpath::Target("./bar.node.js".into()));
            map.insert("default".to_owned(), Subpath::Target("./bar.js".into()));
            map
        }));
        assert_eq!(exports.subpaths.get("./baz").unwrap(), &Subpath::Conditions({
            let mut map = BTreeMap::new();
            map.insert("node".to_owned(), Subpath::Target("./baz.node.js".into()));
            map.insert("default".to_owned(), Subpath::Exclude);
            map
        }));
        assert_eq!(exports.subpaths.get("./qux").unwrap(), &Subpath::Exclude);
    }

    #[test]
    fn parse_toplevel_conditions() {
        let exports: Exports = serde_json::from_str(r#"{
            "node": {"import": "./bar.node.js", "default": "./bar.js"},
            "default": "./index.js"
        }"#).unwrap();
        assert_eq!(exports.subpaths.len(), 1);
        assert_eq!(exports.subpaths.get(".").unwrap(), &Subpath::Conditions({
            let mut map = BTreeMap::new();
            map.insert("node".to_owned(), Subpath::Conditions({
                let mut map = BTreeMap::new();
                map.insert("import".to_owned(), Subpath::Target("./bar.node.js".into()));
                map.insert("default".to_owned(), Subpath::Target("./bar.js".into()));
                map
            }));
            map.insert("default".to_owned(), Subpath::Target("./index.js".into()));
            map
        }));
    }
}
