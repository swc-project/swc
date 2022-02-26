use std::fmt::Debug;

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
pub struct RulesConfig {}

#[derive(Debug, Clone, Default, Serialize, Deserialize)]
pub struct LintConfig {
    #[serde(default)]
    pub rules: RulesConfig,
}
