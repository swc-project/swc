use std::fmt::Debug;

use serde::{Deserialize, Serialize};

use crate::rules::{
    at_rule_no_unknown::AtRuleNoUnknownConfig,
    no_invalid_position_at_import_rule::NoInvalidPositionAtImportRuleConfig,
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
    #[inline]
    pub(crate) fn get_rule_reaction(&self) -> LintRuleReaction {
        self.0.into()
    }

    #[allow(unused)]
    pub(crate) fn get_rule_config(&self) -> &T {
        &self.1
    }

    pub(crate) fn is_enabled(&self) -> bool {
        !matches!(self.get_rule_reaction(), LintRuleReaction::Off)
    }
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[non_exhaustive]
#[serde(rename_all = "kebab-case")]
pub struct RulesConfig {
    #[serde(default, alias = "blockNoEmpty")]
    pub block_no_empty: RuleConfig<()>,

    #[serde(default, alias = "atRuleNoUnknown")]
    pub at_rule_no_unknown: RuleConfig<AtRuleNoUnknownConfig>,

    #[serde(default, alias = "noEmptySource")]
    pub no_empty_source: RuleConfig<()>,

    #[serde(default, alias = "declarationNoImportant")]
    pub declaration_no_important: RuleConfig<()>,

    #[serde(default, alias = "keyframeDeclarationNoImportant")]
    pub keyframe_declaration_no_important: RuleConfig<()>,

    #[serde(default, alias = "noInvalidPositionAtImportRule")]
    pub no_invalid_position_at_import_rule: RuleConfig<NoInvalidPositionAtImportRuleConfig>,
}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct LintConfig {
    #[serde(default)]
    pub rules: RulesConfig,
}
