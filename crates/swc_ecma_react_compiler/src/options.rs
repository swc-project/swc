use std::{borrow::Cow, sync::Arc};

use swc_atoms::Atom;
use swc_common::Span;

use crate::error::{CompilerError, CompilerErrorDetail, ErrorCategory};

/// Structured compiler event stream.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum LoggerEvent {
    CompileError {
        fn_loc: Option<Span>,
        detail: String,
    },
    CompileDiagnostic {
        fn_loc: Option<Span>,
        detail: String,
    },
    CompileSuccess {
        fn_loc: Option<Span>,
        fn_name: Option<String>,
        memo_slots: u32,
        memo_blocks: u32,
        memo_values: u32,
        pruned_memo_blocks: u32,
        pruned_memo_values: u32,
    },
    CompileSkip {
        fn_loc: Option<Span>,
        reason: String,
        loc: Option<Span>,
    },
    CompileUnexpectedThrow {
        fn_loc: Option<Span>,
        data: String,
    },
    PipelineError {
        fn_loc: Option<Span>,
        data: String,
    },
    Timing {
        measurement: String,
    },
}

/// Logger hook for compile events.
pub trait Logger: Send + Sync {
    fn log_event(&self, filename: Option<&str>, event: &LoggerEvent);
}

/// Panic threshold for compile failures.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum PanicThresholdOptions {
    AllErrors,
    CriticalErrors,
    None,
}

impl Default for PanicThresholdOptions {
    fn default() -> Self {
        Self::None
    }
}

/// Function selection strategy.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CompilationMode {
    Infer,
    Syntax,
    Annotation,
    All,
}

impl Default for CompilationMode {
    fn default() -> Self {
        Self::Infer
    }
}

/// Output mode of the compiler.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
pub enum CompilerOutputMode {
    Ssr,
    Client,
    Lint,
}

/// Runtime target for emitted compiler runtime API calls.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum CompilerReactTarget {
    React17,
    React18,
    React19,
    DoNotUseMetaInternal { runtime_module: Atom },
}

impl Default for CompilerReactTarget {
    fn default() -> Self {
        Self::React19
    }
}

impl CompilerReactTarget {
    pub fn runtime_module(&self) -> Cow<'_, str> {
        match self {
            Self::React19 => Cow::Borrowed("react/compiler-runtime"),
            Self::React17 | Self::React18 => Cow::Borrowed("react-compiler-runtime"),
            Self::DoNotUseMetaInternal { runtime_module } => Cow::Borrowed(runtime_module),
        }
    }
}

/// Imported function descriptor.
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct ExternalFunction {
    pub source: Atom,
    pub import_specifier_name: Atom,
}

/// Dynamic gating options (`use memo if(...)`).
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct DynamicGatingOptions {
    pub source: Atom,
}

/// Environment behavior flags.
#[derive(Debug, Clone, PartialEq, Eq)]
pub struct EnvironmentConfig {
    pub validate_blocklisted_imports: Vec<Atom>,
    pub validate_hooks_usage: bool,
    pub validate_no_capitalized_calls: bool,
    pub validate_ref_access_during_render: bool,
    pub validate_no_set_state_in_render: bool,
    pub validate_no_derived_computations_in_effects: bool,
    pub validate_no_set_state_in_effects: bool,
    pub validate_no_jsx_in_try_statements: bool,
    pub validate_exhaustive_memoization_dependencies: bool,
    pub validate_exhaustive_effect_dependencies: bool,
    pub validate_preserve_existing_memoization_guarantees: bool,
    pub enable_preserve_existing_memoization_guarantees: bool,
    pub validate_static_components: bool,
    pub validate_source_locations: bool,
    pub enable_name_anonymous_functions: bool,
    pub enable_jsx_outlining: bool,
    pub enable_function_outlining: bool,
}

impl Default for EnvironmentConfig {
    fn default() -> Self {
        Self {
            validate_blocklisted_imports: Vec::new(),
            validate_hooks_usage: true,
            validate_no_capitalized_calls: true,
            validate_ref_access_during_render: true,
            validate_no_set_state_in_render: true,
            validate_no_derived_computations_in_effects: true,
            validate_no_set_state_in_effects: true,
            validate_no_jsx_in_try_statements: true,
            validate_exhaustive_memoization_dependencies: false,
            validate_exhaustive_effect_dependencies: false,
            validate_preserve_existing_memoization_guarantees: false,
            enable_preserve_existing_memoization_guarantees: false,
            validate_static_components: false,
            validate_source_locations: false,
            enable_name_anonymous_functions: true,
            enable_jsx_outlining: true,
            enable_function_outlining: true,
        }
    }
}

/// User-facing plugin options.
#[derive(Default, Clone)]
pub struct PluginOptions {
    pub environment: Option<EnvironmentConfig>,
    pub logger: Option<Arc<dyn Logger>>,
    pub gating: Option<ExternalFunction>,
    pub dynamic_gating: Option<DynamicGatingOptions>,
    pub panic_threshold: Option<PanicThresholdOptions>,
    pub no_emit: Option<bool>,
    pub output_mode: Option<CompilerOutputMode>,
    pub compilation_mode: Option<CompilationMode>,
    pub eslint_suppression_rules: Option<Vec<String>>,
    pub flow_suppressions: Option<bool>,
    pub ignore_use_no_forget: Option<bool>,
    pub custom_opt_out_directives: Option<Vec<String>>,
    pub sources: Option<Vec<String>>,
    pub enable_reanimated_check: Option<bool>,
    pub target: Option<CompilerReactTarget>,
}

/// Fully parsed plugin options with defaults applied.
#[derive(Clone)]
pub struct ParsedPluginOptions {
    pub environment: EnvironmentConfig,
    pub logger: Option<Arc<dyn Logger>>,
    pub gating: Option<ExternalFunction>,
    pub dynamic_gating: Option<DynamicGatingOptions>,
    pub panic_threshold: PanicThresholdOptions,
    pub no_emit: bool,
    pub output_mode: Option<CompilerOutputMode>,
    pub compilation_mode: CompilationMode,
    pub eslint_suppression_rules: Option<Vec<String>>,
    pub flow_suppressions: bool,
    pub ignore_use_no_forget: bool,
    pub custom_opt_out_directives: Option<Vec<String>>,
    pub sources: Option<Vec<String>>,
    pub enable_reanimated_check: bool,
    pub target: CompilerReactTarget,
}

impl ParsedPluginOptions {
    pub fn effective_output_mode(&self) -> CompilerOutputMode {
        if let Some(mode) = self.output_mode {
            mode
        } else if self.no_emit {
            CompilerOutputMode::Lint
        } else {
            CompilerOutputMode::Client
        }
    }

    pub fn should_include_file(&self, filename: &str) -> bool {
        if let Some(sources) = &self.sources {
            if sources.is_empty() {
                return true;
            }

            return sources.iter().any(|prefix| filename.contains(prefix));
        }

        !filename.contains("node_modules")
    }
}

/// Returns default parsed options.
pub fn default_options() -> ParsedPluginOptions {
    ParsedPluginOptions {
        compilation_mode: CompilationMode::Infer,
        panic_threshold: PanicThresholdOptions::None,
        environment: EnvironmentConfig::default(),
        logger: None,
        gating: None,
        no_emit: false,
        output_mode: None,
        dynamic_gating: None,
        eslint_suppression_rules: None,
        flow_suppressions: true,
        ignore_use_no_forget: false,
        sources: None,
        enable_reanimated_check: true,
        custom_opt_out_directives: None,
        target: CompilerReactTarget::React19,
    }
}

/// Parses options and applies defaults.
pub fn parse_plugin_options(options: PluginOptions) -> Result<ParsedPluginOptions, CompilerError> {
    let mut parsed = default_options();

    if let Some(environment) = options.environment {
        parsed.environment = environment;
    }
    if let Some(logger) = options.logger {
        parsed.logger = Some(logger);
    }
    if let Some(gating) = options.gating {
        if gating.source.is_empty() || gating.import_specifier_name.is_empty() {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Config,
                "Could not parse gating config. Update React Compiler config to fix the error",
            );
            detail.description =
                Some("`gating.source` and `gating.importSpecifierName` are required".into());
            return Err(CompilerError::with_detail(detail));
        }
        parsed.gating = Some(gating);
    }
    if let Some(dynamic_gating) = options.dynamic_gating {
        if dynamic_gating.source.is_empty() {
            return Err(CompilerError::invalid_config(
                "Could not parse dynamic gating. Update React Compiler config to fix the error",
                "`dynamicGating.source` must be a non-empty string",
            ));
        }
        parsed.dynamic_gating = Some(dynamic_gating);
    }
    if let Some(panic_threshold) = options.panic_threshold {
        parsed.panic_threshold = panic_threshold;
    }
    if let Some(no_emit) = options.no_emit {
        parsed.no_emit = no_emit;
    }
    if let Some(output_mode) = options.output_mode {
        parsed.output_mode = Some(output_mode);
    }
    if let Some(compilation_mode) = options.compilation_mode {
        parsed.compilation_mode = compilation_mode;
    }
    if let Some(rules) = options.eslint_suppression_rules {
        parsed.eslint_suppression_rules = Some(rules);
    }
    if let Some(flow_suppressions) = options.flow_suppressions {
        parsed.flow_suppressions = flow_suppressions;
    }
    if let Some(ignore_use_no_forget) = options.ignore_use_no_forget {
        parsed.ignore_use_no_forget = ignore_use_no_forget;
    }
    if let Some(custom_opt_out_directives) = options.custom_opt_out_directives {
        if custom_opt_out_directives
            .iter()
            .any(|value| value.is_empty())
        {
            return Err(CompilerError::invalid_config(
                "Could not parse custom opt out directives. Update React Compiler config to fix \
                 the error",
                "custom opt-out directives cannot contain empty values",
            ));
        }
        parsed.custom_opt_out_directives = Some(custom_opt_out_directives);
    }
    if let Some(sources) = options.sources {
        if sources.iter().any(|value| value.is_empty()) {
            return Err(CompilerError::invalid_config(
                "Expected every source filter to be non-empty",
                "Remove empty string entries from `sources` option",
            ));
        }
        parsed.sources = Some(sources);
    }
    if let Some(enable_reanimated_check) = options.enable_reanimated_check {
        parsed.enable_reanimated_check = enable_reanimated_check;
    }
    if let Some(target) = options.target {
        parsed.target = target;
    }

    Ok(parsed)
}

#[cfg(test)]
mod tests {
    use swc_atoms::Atom;

    use super::*;

    #[test]
    fn defaults_match_expected() {
        let options = parse_plugin_options(PluginOptions::default()).unwrap();

        assert_eq!(options.compilation_mode, CompilationMode::Infer);
        assert_eq!(options.panic_threshold, PanicThresholdOptions::None);
        assert_eq!(options.target, CompilerReactTarget::React19);
        assert_eq!(options.effective_output_mode(), CompilerOutputMode::Client);
        assert!(options.should_include_file("/project/src/app.tsx"));
        assert!(!options.should_include_file("/project/node_modules/react/index.js"));
    }

    #[test]
    fn target_runtime_resolution() {
        assert_eq!(
            CompilerReactTarget::React19.runtime_module(),
            Cow::Borrowed("react/compiler-runtime")
        );
        assert_eq!(
            CompilerReactTarget::React18.runtime_module(),
            Cow::Borrowed("react-compiler-runtime")
        );
        assert_eq!(
            CompilerReactTarget::DoNotUseMetaInternal {
                runtime_module: Atom::new("my-runtime"),
            }
            .runtime_module(),
            Cow::Borrowed("my-runtime")
        );
    }

    #[test]
    fn invalid_dynamic_gating_source_errors() {
        let result = parse_plugin_options(PluginOptions {
            dynamic_gating: Some(DynamicGatingOptions {
                source: Atom::new(""),
            }),
            ..Default::default()
        });

        assert!(result.is_err());
        assert!(result.err().is_some_and(|err| err.has_any_errors()));
    }
}
