use std::path::{Path, PathBuf};

use serde::{Deserialize, de::DeserializeOwned};

use crate::CompilerAssumptions;

mod env;
mod plugins;
mod presets;
pub use env::{BabelEnvOptions, BabelModule};
pub use plugins::BabelPlugins;
pub use presets::BabelPresets;

/// Babel options
///
/// <https://babel.dev/docs/options#plugin-and-preset-options>
#[derive(Debug, Default, Clone, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct BabelOptions {
    // Primary options
    pub cwd: Option<PathBuf>,

    // Config Loading options

    // Plugin and Preset options
    #[serde(default)]
    pub plugins: BabelPlugins,

    #[serde(default)]
    pub presets: BabelPresets,

    // Misc options
    pub source_type: Option<String>,

    #[serde(default)]
    pub assumptions: CompilerAssumptions,

    // Test options
    pub throws: Option<String>,

    #[serde(rename = "BABEL_8_BREAKING")]
    pub babel_8_breaking: Option<bool>,

    /// Babel test helper for running tests on specific operating systems
    pub os: Option<Vec<TestOs>>,

    // Parser options for babel-parser
    #[serde(default)]
    pub allow_return_outside_function: bool,

    #[serde(default)]
    pub allow_await_outside_function: bool,

    #[serde(default)]
    pub allow_undeclared_exports: bool,

    #[serde(default = "default_as_true")]
    pub external_helpers: bool,
}

/// <https://babeljs.io/docs/options#pluginpreset-entries>
#[derive(Debug, Deserialize)]
struct PluginPresetEntries(Vec<PluginPresetEntry>);

/// <https://babeljs.io/docs/options#pluginpreset-entries>
#[derive(Debug, Deserialize, Clone)]
#[serde(untagged)]
enum PluginPresetEntry {
    String(String),
    Vec1([String; 1]),
    Tuple(String, serde_json::Value),
    Triple(String, serde_json::Value, #[expect(unused)] String),
}

impl PluginPresetEntry {
    fn name(&self) -> &str {
        match self {
            Self::String(s) | Self::Tuple(s, _) | Self::Triple(s, _, _) => s,
            Self::Vec1(s) => &s[0],
        }
    }

    fn value<T: DeserializeOwned + Default>(self) -> Result<T, String> {
        match self {
            Self::String(_) | Self::Vec1(_) => Ok(T::default()),
            Self::Tuple(name, v) | Self::Triple(name, v, _) => {
                serde_json::from_value::<T>(v).map_err(|err| format!("{name}: {err}"))
            }
        }
    }
}

#[derive(Debug, Clone, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum TestOs {
    Linux,
    Win32,
    Windows,
    Darwin,
}

impl TestOs {
    pub fn is_windows(&self) -> bool {
        matches!(self, Self::Win32 | Self::Windows)
    }
}

fn default_as_true() -> bool {
    true
}

impl BabelOptions {
    /// Read options.json and merge them with options.json from ancestors directories.
    /// # Panics
    pub fn from_test_path(path: &Path) -> Self {
        let mut babel_options: Option<Self> = None;
        let mut plugins_json = None;
        let mut presets_json = None;

        for path in path.ancestors().take(3) {
            let file = path.join("options.json");
            if !file.exists() {
                continue;
            }

            let content = std::fs::read_to_string(&file).unwrap();
            let mut new_value = serde_json::from_str::<serde_json::Value>(&content).unwrap();

            let new_plugins = new_value.as_object_mut().unwrap().remove("plugins");
            if plugins_json.is_none() {
                plugins_json = new_plugins;
            }

            let new_presets = new_value.as_object_mut().unwrap().remove("presets");
            if presets_json.is_none() {
                presets_json = new_presets;
            }

            let new_options: Self = serde_json::from_value::<BabelOptions>(new_value)
                .unwrap_or_else(|err| panic!("{err:?}\n{}\n{content}", file.display()));

            if let Some(existing_options) = babel_options.as_mut() {
                if existing_options.source_type.is_none()
                    && let Some(source_type) = new_options.source_type
                {
                    existing_options.source_type = Some(source_type);
                }
                if existing_options.throws.is_none()
                    && let Some(throws) = new_options.throws
                {
                    existing_options.throws = Some(throws);
                }
            } else {
                babel_options = Some(new_options);
            }
        }

        let mut options = babel_options.unwrap_or_default();
        if let Some(plugins_json) = plugins_json {
            options.plugins = serde_json::from_value::<BabelPlugins>(plugins_json)
                .unwrap_or_else(|err| panic!("{err:?}\n{}", path.display()));
        }
        if let Some(presets_json) = presets_json {
            options.presets = serde_json::from_value::<BabelPresets>(presets_json)
                .unwrap_or_else(|err| panic!("{err:?}\n{}", path.display()));
        }
        options
    }

    pub fn is_jsx(&self) -> bool {
        self.plugins.syntax_jsx
            || self.presets.jsx.is_some()
            || self.plugins.react_jsx.is_some()
            || self.plugins.react_jsx_dev.is_some()
    }

    pub fn is_typescript(&self) -> bool {
        self.plugins.syntax_typescript.is_some()
    }

    pub fn is_typescript_definition(&self) -> bool {
        self.plugins.syntax_typescript.is_some_and(|o| o.dts)
    }

    pub fn is_module(&self) -> bool {
        self.source_type.as_ref().is_some_and(|s| s.as_str() == "module")
    }

    pub fn is_unambiguous(&self) -> bool {
        self.source_type.as_ref().is_some_and(|s| s.as_str() == "unambiguous")
    }
}
