//! Helper for transforming environment variables to AST nodes.
use fxhash::FxHashMap;

/// Represents a collection of environment variables.
#[derive(Debug)]
pub struct EnvironmentGlobals {
    map: FxHashMap<Vec<String>, String>,
}

impl From<FxHashMap<String, String>> for EnvironmentGlobals {
    fn from(env: FxHashMap<String, String>) -> Self {
        let map: FxHashMap<Vec<String>, String> = env
            .into_iter()
            .map(|(k, v)| {
                (k.split(".").map(|s| s.into()).collect(), v)
            })
            .collect();

        Self { map }
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

        let dest = EnvironmentGlobals::from(src);
        println!("{:#?}", dest);
    }
}
