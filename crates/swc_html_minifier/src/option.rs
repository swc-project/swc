use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions {
    #[serde(default)]
    pub collapse_whitespaces: Option<CollapseWhitespaces>,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(rename_all = "kebab-case")]
pub enum CollapseWhitespaces {
    All,
    AllExceptInline,
    Conservative,
}
