//! Helper for transforming environment variables to AST nodes.
use fxhash::FxHashMap;

#[derive(Debug, Clone, Eq, PartialEq)]
enum Entry {
    Leaf(String),
    Branch(FxHashMap<String, Entry>),
}

impl Entry {
    fn add_entry(&mut self, name: String, branch: Entry) -> bool {
        if let Entry::Branch(map) = self {
            map.insert(name, branch);
            return true;
        }
        false
    }

    fn entry_mut(&mut self, name: &str) -> Option<&mut Entry> {
        if let Entry::Branch(map) = self {
            return map.get_mut(name);
        }
        None
    }
}

impl Default for Entry {
    fn default() -> Self {
        Self::Branch(Default::default())
    }
}

/// Represents a collection of environment variables.
#[derive(Debug)]
pub struct EnvironmentGlobals {
    root: Entry,
}

impl From<FxHashMap<String, String>> for EnvironmentGlobals {
    fn from(env: FxHashMap<String, String>) -> Self {
        let vars: Vec<(Vec<String>, String)> = env
            .into_iter()
            .map(|(k, v)| (k.split(".").map(|s| s.into()).collect(), v))
            .collect();

        let root: Entry = Default::default();
        let root = vars.into_iter().fold(root, |mut acc, doc| {
            let (keys, value) = doc;
            let len = keys.len();
            let mut it = keys.into_iter().enumerate();
            let (_, first) = it.next().unwrap();
            let mut current = if let Some(branch) = acc.entry_mut(&first) {
                branch
            } else {
                if len > 1 {
                    acc.add_entry(first.clone(), Default::default());
                    acc.entry_mut(&first).unwrap()
                } else {
                    acc.add_entry(first.clone(), Entry::Leaf(value.clone()));
                    &mut acc
                }
            };
            // Handle deep branches
            for (i, key) in it {
                if i < (len - 1) {
                    if let Entry::Branch(map) = current {
                        current = map.entry(key).or_default();
                    }
                } else {
                    current.add_entry(key, Entry::Leaf(value.clone()));
                }
            }
            acc
        });

        Self { root }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn env_globals_map() {
        let mut src: FxHashMap<String, String> = Default::default();
        src.insert("API".into(), "http://localhost:3000".into());
        src.insert("process.env.FOO".into(), "BAR".into());
        src.insert("process.env.BAR".into(), "QUX".into());
        src.insert("process.else.QUX".into(), "BAZ".into());

        let env = EnvironmentGlobals::from(src);
        if let Entry::Branch(map) = env.root {
            assert!(map.contains_key("process"));
            assert!(map.contains_key("API"));

            assert_eq!(
                Entry::Leaf("http://localhost:3000".into()),
                map.get("API").unwrap().clone()
            );
        }
    }
}
