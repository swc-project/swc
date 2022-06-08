use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
#[serde(deny_unknown_fields)]
pub struct MinifyOptions {
    pub collapse_whitespaces: CollapseWhitespacesMode,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(rename_all = "lowercase")]
pub enum CollapseWhitespacesMode {
    All,
    AllExceptInline,
    Conservative,
}

impl Default for CollapseWhitespacesMode {
    fn default() -> Self {
        Self::Conservative
    }
}
