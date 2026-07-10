//! Shared domain types for the conformance runner.

use std::{fmt, path::PathBuf};

use clap::ValueEnum;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum TestFlag {
    OnlyStrict,
    NoStrict,
    Module,
    Raw,
    Async,
    Generated,
    CanBlockIsFalse,
    CanBlockIsTrue,
    NonDeterministic,
    ExplicitResourceManagement,
}

impl TestFlag {
    pub fn parse(value: &str) -> Option<Self> {
        Some(match value {
            "onlyStrict" => Self::OnlyStrict,
            "noStrict" => Self::NoStrict,
            "module" => Self::Module,
            "raw" => Self::Raw,
            "async" => Self::Async,
            "generated" => Self::Generated,
            "CanBlockIsFalse" => Self::CanBlockIsFalse,
            "CanBlockIsTrue" => Self::CanBlockIsTrue,
            "non-deterministic" => Self::NonDeterministic,
            "explicit-resource-management" => Self::ExplicitResourceManagement,
            _ => return None,
        })
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum NegativePhase {
    Parse,
    Early,
    Resolution,
    Runtime,
}

impl NegativePhase {
    pub fn parse(value: &str) -> Option<Self> {
        Some(match value {
            "parse" => Self::Parse,
            "early" => Self::Early,
            "resolution" => Self::Resolution,
            "runtime" => Self::Runtime,
            _ => return None,
        })
    }

    pub fn expects_parse_error(self) -> bool {
        matches!(self, Self::Parse | Self::Early)
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Negative {
    pub phase: NegativePhase,
    pub error_type: String,
}

#[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Metadata {
    pub esid: Option<String>,
    pub features: Vec<String>,
    pub includes: Vec<String>,
    pub flags: Vec<TestFlag>,
    pub negative: Option<Negative>,
}

impl Metadata {
    pub fn has_flag(&self, flag: TestFlag) -> bool {
        self.flags.contains(&flag)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ParseGoal {
    Script,
    Module,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Strictness {
    Sloppy,
    Strict,
    Inherent,
    Unmodified,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum HarnessMode {
    Standard,
    Raw,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
pub struct TestVariant {
    pub goal: ParseGoal,
    pub strictness: Strictness,
    pub harness: HarnessMode,
}

impl TestVariant {
    pub fn name(self) -> &'static str {
        match (self.goal, self.strictness, self.harness) {
            (ParseGoal::Module, _, HarnessMode::Raw) => "raw-module",
            (ParseGoal::Module, _, HarnessMode::Standard) => "module",
            (ParseGoal::Script, Strictness::Unmodified, HarnessMode::Raw) => "raw-script",
            (ParseGoal::Script, Strictness::Strict, HarnessMode::Standard) => "strict",
            (ParseGoal::Script, Strictness::Sloppy, HarnessMode::Standard) => "sloppy",
            (ParseGoal::Script, Strictness::Inherent, _) => "script",
            (ParseGoal::Script, Strictness::Unmodified, HarnessMode::Standard) => "script",
            (ParseGoal::Script, Strictness::Sloppy | Strictness::Strict, HarnessMode::Raw) => {
                "raw-script"
            }
        }
    }
}

#[derive(Debug, Clone)]
pub struct TestCase {
    pub path: PathBuf,
    pub code: String,
    pub metadata: Metadata,
}

impl TestCase {
    pub fn variants(&self) -> Vec<TestVariant> {
        let raw = self.metadata.has_flag(TestFlag::Raw);
        let harness = if raw {
            HarnessMode::Raw
        } else {
            HarnessMode::Standard
        };

        if self.metadata.has_flag(TestFlag::Module) {
            return vec![TestVariant {
                goal: ParseGoal::Module,
                strictness: Strictness::Inherent,
                harness,
            }];
        }

        if raw {
            return vec![TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Unmodified,
                harness,
            }];
        }

        if self.metadata.has_flag(TestFlag::OnlyStrict) {
            return vec![TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Strict,
                harness,
            }];
        }

        if self.metadata.has_flag(TestFlag::NoStrict) {
            return vec![TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Sloppy,
                harness,
            }];
        }

        vec![
            TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Sloppy,
                harness,
            },
            TestVariant {
                goal: ParseGoal::Script,
                strictness: Strictness::Strict,
                harness,
            },
        ]
    }
}

#[derive(
    Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, ValueEnum, Serialize, Deserialize,
)]
#[serde(rename_all = "kebab-case")]
pub enum Suite {
    Parser,
    Lexer,
    Codegen,
    SourceMap,
    Transforms,
    Minifier,
    Runtime,
}

impl fmt::Display for Suite {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Pipeline {
    Parse,
    Lex,
    Codegen,
    CodegenMinified,
    SourceMap,
    SourceMapMinified,
    TransformEs5,
    Compress,
    CompressMangle,
    RuntimeCodegen,
    RuntimeTransformEs5,
    RuntimeCompress,
    RuntimeCompressMangle,
}

impl Pipeline {
    pub const fn as_str(self) -> &'static str {
        match self {
            Self::Parse => "parse",
            Self::Lex => "lex",
            Self::Codegen => "codegen",
            Self::CodegenMinified => "codegen-minified",
            Self::SourceMap => "source-map",
            Self::SourceMapMinified => "source-map-minified",
            Self::TransformEs5 => "transform-es5",
            Self::Compress => "compress",
            Self::CompressMangle => "compress-mangle",
            Self::RuntimeCodegen => "runtime-codegen",
            Self::RuntimeTransformEs5 => "runtime-transform-es5",
            Self::RuntimeCompress => "runtime-compress",
            Self::RuntimeCompressMangle => "runtime-compress-mangle",
        }
    }
}

impl Suite {
    pub const NON_RUNTIME: [Self; 6] = [
        Self::Parser,
        Self::Lexer,
        Self::Codegen,
        Self::SourceMap,
        Self::Transforms,
        Self::Minifier,
    ];

    pub fn as_str(self) -> &'static str {
        match self {
            Self::Parser => "parser",
            Self::Lexer => "lexer",
            Self::Codegen => "codegen",
            Self::SourceMap => "source-map",
            Self::Transforms => "transforms",
            Self::Minifier => "minifier",
            Self::Runtime => "runtime",
        }
    }

    pub fn required_feature(self) -> &'static str {
        match self {
            Self::Parser => "suite-parser",
            Self::Lexer => "suite-lexer",
            Self::Codegen | Self::SourceMap => "suite-codegen",
            Self::Transforms => "suite-transforms",
            Self::Minifier => "suite-minifier",
            Self::Runtime => "suite-runtime",
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FailureKind {
    HarnessConfiguration,
    UnexpectedParseError,
    MissingParseError,
    AstSerialization,
    LexerMismatch,
    AstMismatch,
    OutputMismatch,
    SourceMapMismatch,
    TransformError,
    MinifierError,
    RuntimeError,
    RuntimeTimeout,
    UnsupportedFeature,
    UnsupportedHostCapability,
    Panic,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum SkipReason {
    UnsupportedHostCapability,
    PlatformConstraint,
    ResourceLimit,
    NonDeterministic,
    UpstreamIssue,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum FeatureSupport {
    Supported,
    Unsupported,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "kebab-case")]
pub enum Outcome {
    Passed,
    KnownFailed,
    Failed,
    UnexpectedPass,
    Skipped,
    Unsupported,
}

#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
pub struct Failure {
    pub suite: Suite,
    pub pipeline: Pipeline,
    pub path: PathBuf,
    pub variant: String,
    pub kind: FailureKind,
    pub fingerprint: String,
    pub summary: String,
    #[serde(default, skip_serializing)]
    pub detail: Option<String>,
}

impl Failure {
    pub fn from_diagnostic(
        suite: Suite,
        pipeline: Pipeline,
        path: PathBuf,
        variant: impl Into<String>,
        kind: FailureKind,
        diagnostic: impl Into<String>,
    ) -> Self {
        let diagnostic = diagnostic.into();
        let summary = crate::diagnostic::summary(&diagnostic);
        let fingerprint = crate::diagnostic::fingerprint(&diagnostic);
        let detail = (diagnostic != summary).then_some(diagnostic);
        Self {
            suite,
            pipeline,
            path,
            variant: variant.into(),
            kind,
            fingerprint,
            summary,
            detail,
        }
    }

    pub fn comparison_key(&self) -> (&PathBuf, Suite, Pipeline, &str, FailureKind, &str) {
        (
            &self.path,
            self.suite,
            self.pipeline,
            &self.variant,
            self.kind,
            &self.fingerprint,
        )
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn test_case(flags: Vec<TestFlag>) -> TestCase {
        TestCase {
            path: "case.js".into(),
            code: String::new(),
            metadata: Metadata {
                flags,
                ..Default::default()
            },
        }
    }

    #[test]
    fn creates_default_script_variants() {
        let variants = test_case(vec![]).variants();
        assert_eq!(variants.len(), 2);
        assert_eq!(variants[0].strictness, Strictness::Sloppy);
        assert_eq!(variants[1].strictness, Strictness::Strict);
    }

    #[test]
    fn module_is_inherently_strict() {
        let variants = test_case(vec![TestFlag::Module]).variants();
        assert_eq!(variants.len(), 1);
        assert_eq!(variants[0].goal, ParseGoal::Module);
        assert_eq!(variants[0].strictness, Strictness::Inherent);
    }

    #[test]
    fn raw_script_is_not_duplicated() {
        let variants = test_case(vec![TestFlag::Raw]).variants();
        assert_eq!(variants.len(), 1);
        assert_eq!(variants[0].harness, HarnessMode::Raw);
        assert_eq!(variants[0].strictness, Strictness::Unmodified);
    }

    #[test]
    fn strictness_flags_select_one_script_variant() {
        let strict = test_case(vec![TestFlag::OnlyStrict]).variants();
        assert_eq!(strict.len(), 1);
        assert_eq!(strict[0].strictness, Strictness::Strict);

        let sloppy = test_case(vec![TestFlag::NoStrict]).variants();
        assert_eq!(sloppy.len(), 1);
        assert_eq!(sloppy[0].strictness, Strictness::Sloppy);
    }

    #[test]
    fn raw_module_preserves_source_and_module_goal() {
        let variants = test_case(vec![TestFlag::Module, TestFlag::Raw]).variants();
        assert_eq!(variants.len(), 1);
        assert_eq!(variants[0].goal, ParseGoal::Module);
        assert_eq!(variants[0].strictness, Strictness::Inherent);
        assert_eq!(variants[0].harness, HarnessMode::Raw);
    }
}
