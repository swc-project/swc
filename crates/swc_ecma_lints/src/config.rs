#[cfg(feature = "non_critical_lints")]
#[path = ""]
mod non_critical_lints {
    use crate::rules::non_critical_lints::no_console::NoConsoleConfig;
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
        #[serde(default)]
        pub no_console: RuleConfig<NoConsoleConfig>,

        #[serde(default)]
        pub no_alert: RuleConfig<()>,

        #[serde(default)]
        pub no_debugger: RuleConfig<()>,
    }
}

#[cfg(not(feature = "non_critical_lints"))]
mod non_critical_lints {
    pub struct LintConfig {}
}

pub use non_critical_lints::*;
