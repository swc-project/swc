use std::fmt::Debug;

use serde::{Deserialize, Serialize};
use swc_config::merge::Merge;

#[cfg(feature = "non_critical_lints")]
use crate::rules::non_critical_lints::{
    dot_notation::DotNotationConfig, eqeqeq::EqeqeqConfig, no_bitwise::NoBitwiseConfig,
    no_console::NoConsoleConfig, no_empty_function::NoEmptyFunctionConfig,
    no_param_reassign::NoParamReassignConfig, no_restricted_syntax::NoRestrictedSyntaxConfig,
    no_use_before_define::NoUseBeforeDefineConfig,
    prefer_regex_literals::PreferRegexLiteralsConfig, quotes::QuotesConfig, radix::RadixConfig,
    symbol_description::SymbolDescriptionConfig, use_is_nan::UseIsNanConfig,
    valid_typeof::ValidTypeofConfig, yoda::YodaConfig,
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
    Unspecified,
}

impl Default for LintRuleLevel {
    fn default() -> Self {
        Self::Unspecified
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
            LintRuleLevel::Unspecified => LintRuleReaction::Off,
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

impl<T> Merge for RuleConfig<T>
where
    T: Debug + Clone + Serialize + Default,
{
    fn merge(&mut self, other: Self) {
        if let LintRuleLevel::Unspecified = self.0 {
            self.0 = other.0;
            self.1 = other.1;
        }
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize, Merge)]
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

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noNewSymbol")]
    pub no_new_symbol: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "useIsNan")]
    pub use_isnan: RuleConfig<UseIsNanConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "validTypeof")]
    pub valid_typeof: RuleConfig<ValidTypeofConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noParamReassign")]
    pub no_param_reassign: RuleConfig<NoParamReassignConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "symbolDescription")]
    pub symbol_description: RuleConfig<SymbolDescriptionConfig>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noObjCalls")]
    pub no_obj_calls: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noVar")]
    pub no_var: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noThrowLiteral")]
    pub no_throw_literal: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "preferConst")]
    pub prefer_const: RuleConfig<()>,

    #[cfg(feature = "non_critical_lints")]
    #[serde(default, alias = "noCompareNegZero")]
    pub no_compare_neg_zero: RuleConfig<()>,
}
