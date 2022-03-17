use std::fmt::Debug;

use serde::{Deserialize, Serialize};

#[cfg(feature = "non_critical_lints")]
use crate::rules::non_critical_lints::{
    dot_notation::DotNotationConfig, eqeqeq::EqeqeqConfig, no_bitwise::NoBitwiseConfig,
    no_console::NoConsoleConfig, no_empty_function::NoEmptyFunctionConfig,
    no_restricted_syntax::NoRestrictedSyntaxConfig, no_use_before_define::NoUseBeforeDefineConfig,
    prefer_regex_literals::PreferRegexLiteralsConfig, quotes::QuotesConfig, radix::RadixConfig,
    yoda::YodaConfig,
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

#[derive(Debug, Clone, Copy, Serialize, Deserialize)]
#[serde(untagged)]
enum LintRuleLevel {
    Str(LintRuleReaction),
    Number(u8),
}

impl Default for LintRuleLevel {
    fn default() -> Self {
        Self::Str(LintRuleReaction::Off)
    }
}

impl From<LintRuleLevel> for LintRuleReaction {
    fn from(level: LintRuleLevel) -> Self {
        match level {
            LintRuleLevel::Str(level) => level,
            LintRuleLevel::Number(level) => match level {
                1 => LintRuleReaction::Warning,
                2 => LintRuleReaction::Error,
                _ => LintRuleReaction::Off,
            },
        }
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct RuleConfig<T: Debug + Clone + Serialize + Default>(
    #[serde(default)] LintRuleLevel,
    #[serde(default)] T,
);

impl<T: Debug + Clone + Serialize + Default> RuleConfig<T> {
    pub(crate) fn get_rule_reaction(&self) -> LintRuleReaction {
        self.0.into()
    }

    pub(crate) fn get_rule_config(&self) -> &T {
        &self.1
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[non_exhaustive]
#[serde(rename_all = "kebab-case")]
pub struct LintConfig {
    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noConsole")]
    pub no_console: RuleConfig<NoConsoleConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "preferRegexLiterals")]
    pub prefer_regex_literals: RuleConfig<PreferRegexLiteralsConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noAlert")]
    pub no_alert: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noDebugger")]
    pub no_debugger: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noUseBeforeDefine")]
    pub no_use_before_define: RuleConfig<NoUseBeforeDefineConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "dotNotation")]
    pub dot_notation: RuleConfig<DotNotationConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub quotes: RuleConfig<QuotesConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noEmptyFunction")]
    pub no_empty_function: RuleConfig<NoEmptyFunctionConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noEmptyPattern")]
    pub no_empty_pattern: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub eqeqeq: RuleConfig<EqeqeqConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noLoopFunc")]
    pub no_loop_func: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noNew")]
    pub no_new: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noRestrictedSyntax")]
    pub no_restricted_syntax: RuleConfig<NoRestrictedSyntaxConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub radix: RuleConfig<RadixConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noBitwise")]
    pub no_bitwise: RuleConfig<NoBitwiseConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "defaultParamLast")]
    pub default_param_last: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default)]
    pub yoda: RuleConfig<YodaConfig>,
}
