use crate::rules::no_use_before_define::NoUseBeforeDefineConfig;
#[cfg(feature = "non_critical_lints")]
use crate::rules::non_critical_lints::no_console::NoConsoleConfig;
#[cfg(feature = "non_critical_lints")]
use crate::rules::non_critical_lints::prefer_regex_literals::PreferRegexLiteralsConfig;
use serde::{Deserialize, Serialize};
use std::fmt::Debug;

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

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct RuleConfig<T: Debug + Clone + Serialize + Default>(
    #[serde(default)] LintRuleReaction,
    #[serde(default)] T,
);

impl<T: Debug + Clone + Serialize + Default> RuleConfig<T> {
    pub(crate) fn get_rule_reaction(&self) -> &LintRuleReaction {
        &self.0
    }

    pub(crate) fn get_rule_config(&self) -> &T {
        &self.1
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[non_exhaustive]
#[serde(rename_all = "camelCase")]
pub struct LintConfig {
    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub no_console: RuleConfig<NoConsoleConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub prefer_regex_literals: RuleConfig<PreferRegexLiteralsConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub no_alert: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub no_debugger: RuleConfig<()>,

    #[serde(default)]
    pub no_use_before_define: RuleConfig<NoUseBeforeDefineConfig>,
}
