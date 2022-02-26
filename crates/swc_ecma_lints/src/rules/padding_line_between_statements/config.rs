use std::fmt;

use serde::{
    de::{Deserialize, Deserializer, MapAccess, Visitor},
    Serialize,
};
use swc_common::collections::AHashMap;

#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash, Serialize, serde::Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum StatementType {
    #[serde(alias = "*")]
    Any,
    Return,
    Throw,
    Break,
    Case,
    Default,
    Continue,
    Debugger,
    Export,
    Import,

    // Variable
    // All cases of Const, Let and Var
    Variable,
    // All multiline cases of Const, Let and Var
    MultilineVariable,
    // All singleline cases of Const, Let and Var
    SinglelineVariable,

    // Const
    Const,
    MultilineConst,
    SinglelineConst,

    // Let
    Let,
    MultilineLet,
    SinglelineLet,

    // Var
    Var,
    MultilineVar,
    SinglelineVar,

    // Block like
    #[serde(alias = "blockLike")]
    BlockLike,
    MultilineBlockLike,
    SinglelineBlockLike,

    // If
    If,
    MultilineIf,
    SinglelineIf,

    // Function
    Function,
    MultilineFunction,
    SinglelineFunction,

    // Try
    Try,
    MultilineTry,
    SinglelineTry,

    // While
    While,
    MultilineWhile,
    SinglelineWhile,

    // Do while cycle
    #[serde(alias = "do")]
    DoWhile,
    #[serde(alias = "multiline-do")]
    MultilineDoWhile,
    #[serde(alias = "singleline-do")]
    SinglelineDoWhile,

    // Switch
    Switch,
    MultilineSwitch,
    SinglelineSwitch,

    // With
    With,
    MultilineWith,
    SinglelineWith,

    // Class
    Class,
    MultilineClass,
    SinglelineClass,

    // For
    For,
    MultilineFor,
    SinglelineFor,

    // Expression
    Expression,
    MultilineExpression,
    SinglelineExpression,
}

const SINGLELINE_BLOCK_LIKE: &[StatementType] = &[
    StatementType::SinglelineIf,
    StatementType::SinglelineFunction,
    StatementType::SinglelineTry,
    StatementType::SinglelineWhile,
    StatementType::SinglelineDoWhile,
    StatementType::SinglelineSwitch,
    StatementType::SinglelineWith,
    StatementType::SinglelineClass,
    StatementType::SinglelineFor,
];

const MULTILINE_BLOCK_LIKE: &[StatementType] = &[
    StatementType::MultilineIf,
    StatementType::MultilineFunction,
    StatementType::MultilineTry,
    StatementType::MultilineWhile,
    StatementType::MultilineDoWhile,
    StatementType::MultilineSwitch,
    StatementType::MultilineWith,
    StatementType::MultilineClass,
    StatementType::MultilineFor,
];

const SINGLELINE_VAR: &[StatementType] = &[
    StatementType::SinglelineVar,
    StatementType::SinglelineConst,
    StatementType::SinglelineLet,
];

const MULTILINE_VAR: &[StatementType] = &[
    StatementType::MultilineConst,
    StatementType::MultilineLet,
    StatementType::MultilineVar,
];

impl StatementType {
    pub fn variants(&self) -> Vec<Self> {
        use StatementType::*;

        match self {
            // "block-like" is block like statements. This matches statements that the last token is
            // the closing brace of blocks; e.g. { }, if (a) { }, and while (a) {}. Also matches
            // immediately invoked function expression statements.
            BlockLike => {
                let mut variants: Vec<StatementType> =
                    Vec::with_capacity(MULTILINE_BLOCK_LIKE.len() + SINGLELINE_BLOCK_LIKE.len());

                variants.extend(MULTILINE_BLOCK_LIKE);
                variants.extend(SINGLELINE_BLOCK_LIKE);

                variants
            }
            MultilineBlockLike => Vec::from(MULTILINE_BLOCK_LIKE),
            SinglelineBlockLike => Vec::from(SINGLELINE_BLOCK_LIKE),

            // Variables
            Variable => {
                let mut variants: Vec<StatementType> =
                    Vec::with_capacity(SINGLELINE_VAR.len() + MULTILINE_VAR.len());

                variants.extend(SINGLELINE_VAR);
                variants.extend(MULTILINE_VAR);

                variants
            }
            SinglelineVariable => Vec::from(SINGLELINE_VAR),
            MultilineVariable => Vec::from(MULTILINE_VAR),
            Var => vec![MultilineVar, SinglelineVar],
            Const => vec![MultilineConst, SinglelineConst],
            Let => vec![MultilineLet, SinglelineLet],

            Expression => vec![MultilineExpression, SinglelineExpression],
            If => vec![MultilineIf, SinglelineIf],
            Function => vec![MultilineFunction, SinglelineFunction],
            Try => vec![MultilineTry, SinglelineTry],
            While => vec![MultilineWhile, SinglelineWhile],
            DoWhile => vec![MultilineDoWhile, SinglelineDoWhile],
            Switch => vec![MultilineSwitch, SinglelineSwitch],
            With => vec![MultilineWith, SinglelineWith],
            Class => vec![MultilineClass, SinglelineClass],
            For => vec![MultilineFor, SinglelineFor],
            _ => vec![*self],
        }
    }

    pub fn is_block_like(&self) -> bool {
        use StatementType::*;

        matches!(
            self,
            If | Function | Try | While | DoWhile | Switch | With | Class | For
        )
    }

    pub fn can_be_multiline(&self) -> bool {
        use StatementType::*;

        self.is_block_like() || matches!(self, Expression | Var | Const | Let)
    }
}

#[derive(Debug, Clone, Copy, Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum LineBreakType {
    Any,
    Never,
    Always,
}

#[derive(Debug, Clone, Copy, Serialize, serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct PaddingLineRule {
    blank_line: LineBreakType,
    prev: StatementType,
    next: StatementType,
}

pub type GroupedRules = AHashMap<(StatementType, StatementType), LineBreakType>;

#[derive(Debug, Default, Clone, Serialize)]
pub struct PaddingLineBetweenStatementsConfig {
    pub rules: GroupedRules,
}

// Using custom deserializer to group rules once on lint run
impl<'de> Deserialize<'de> for PaddingLineBetweenStatementsConfig {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        struct PaddingLineBetweenStatementsConfigVisitor;

        impl<'de> Visitor<'de> for PaddingLineBetweenStatementsConfigVisitor {
            type Value = PaddingLineBetweenStatementsConfig;

            fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
                formatter.write_str("struct PaddingLineBetweenStatementsConfig")
            }

            fn visit_map<V>(
                self,
                mut map: V,
            ) -> Result<PaddingLineBetweenStatementsConfig, V::Error>
            where
                V: MapAccess<'de>,
            {
                let mut config: PaddingLineBetweenStatementsConfig = Default::default();

                while let Some(key) = map.next_key::<&'de str>()? {
                    if key == "rules" {
                        let rules = map.next_value::<Vec<PaddingLineRule>>()?;

                        rules.into_iter().for_each(|rule| {
                            let prev_variants = rule.prev.variants();
                            let next_variants = rule.next.variants();

                            prev_variants.into_iter().for_each(|prev| {
                                next_variants.iter().for_each(|next| {
                                    config.rules.insert((prev, *next), rule.blank_line);
                                });
                            });
                        });
                    }
                }

                Ok(config)
            }
        }

        deserializer.deserialize_struct(
            "PaddingLineBetweenStatementsConfig",
            &["rules"],
            PaddingLineBetweenStatementsConfigVisitor,
        )
    }
}
