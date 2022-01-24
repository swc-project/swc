use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LintRuleReaction {
    Off,
    Warning,
    Error,
}

impl Default for LintRuleReaction {
    fn default() -> Self {
        Self::Off
    }
}

#[derive(Debug, Clone, Default, Copy, Serialize, Deserialize)]
#[non_exhaustive]
#[serde(rename_all = "camelCase")]
pub struct LintConfig {
    pub no_console: LintRuleReaction,
}
