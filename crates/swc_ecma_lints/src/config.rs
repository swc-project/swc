use std::fmt::Debug;

use serde::{Deserialize, Serialize};

#[cfg(feature = "non_critical_lints")]
use crate::rules::non_critical_lints::{
    dot_notation::DotNotationConfig, no_console::NoConsoleConfig,
    no_use_before_define::NoUseBeforeDefineConfig,
    prefer_regex_literals::PreferRegexLiteralsConfig, quotes::QuotesConfig,
};

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

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub no_use_before_define: RuleConfig<NoUseBeforeDefineConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub dot_notation: RuleConfig<DotNotationConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub quotes: RuleConfig<QuotesConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub no_empty_pattern: RuleConfig<()>,
}
