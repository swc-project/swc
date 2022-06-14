use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions {
    #[serde(default)]
    pub collapse_whitespaces: Option<CollapseWhitespaces>,
    /// Prevent to remove empty attributes, by default we only remove attributes
    /// that are safe to remove (for example - empty a `style` attribute),
    /// but in edge cases it can be unsafe because some libraries can
    /// interact with DOM like with strings (i.e. don't use DOM API) and in this
    /// case strings will be different, which can break the work of
    /// libraries
    #[serde(default = "true_by_default")]
    pub remove_empty_attributes: bool,
    #[serde(default = "true_by_default")]
    pub collapse_boolean_attributes: bool,
    #[serde(default = "true_by_default")]
    pub minify_css: bool,
}

/// Implement default using serde.
impl Default for MinifyOptions {
    fn default() -> Self {
        serde_json::from_value(serde_json::Value::Object(Default::default())).unwrap()
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(rename_all = "kebab-case")]
pub enum CollapseWhitespaces {
    All,
    Smart,
    Conservative,
}

const fn true_by_default() -> bool {
    true
}
