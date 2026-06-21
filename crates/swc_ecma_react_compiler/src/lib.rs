// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

mod apply_renames;
mod convert_ast;
mod convert_ast_reverse;
mod convert_scope;
pub mod diagnostics;
pub mod fast_check;
mod prefilter;
mod preserved_ast;
mod source_type;

#[cfg(test)]
mod tests;

use apply_renames::{apply_renames, build_rename_plan};
use convert_ast::convert_program;
use convert_ast_reverse::convert_program_to_swc;
use diagnostics::{compile_result_to_diagnostics, DiagnosticMessage};
use prefilter::{has_react_like_functions, has_resource_management_declarations};
use react_compiler::entrypoint::compile_result::LoggerEvent;
// Re-exported so integrations needn't depend on the upstream `react_compiler` crate.
pub use react_compiler::entrypoint::plugin_options::{
    CompilerTarget, DynamicGatingConfig, GatingConfig, PluginOptions,
};
use react_compiler_hir::environment_config::EnvironmentConfig;
pub use source_type::SourceType;
use swc_common::comments::SingleThreadedComments;
use swc_ecma_ast::Program;

use crate::{convert_ast::ConvertResult, convert_scope::SemanticBuilder};

/// [`PluginOptions`] with the compiler's standard defaults.
///
/// Override fields with struct-update syntax:
/// `PluginOptions { ..default_plugin_options() }`.
#[must_use]
pub fn default_plugin_options() -> PluginOptions {
    PluginOptions {
        should_compile: true,
        enable_reanimated: false,
        is_dev: false,
        filename: None,
        compilation_mode: "infer".to_string(),
        panic_threshold: "none".to_string(),
        target: CompilerTarget::Version("19".to_string()),
        gating: None,
        dynamic_gating: None,
        no_emit: false,
        output_mode: None,
        eslint_suppression_rules: None,
        flow_suppressions: true,
        ignore_use_no_forget: false,
        custom_opt_out_directives: None,
        environment: EnvironmentConfig::default(),
        source_code: None,
        profiling: false,
        debug: false,
    }
}

pub struct TransformResult {
    /// Compiled, ready-to-codegen SWC AST; `None` if the compiler made no
    /// changes.
    pub program: Option<Program>,
    pub diagnostics: Vec<DiagnosticMessage>,
    pub events: Vec<LoggerEvent>,
}

pub struct LintResult {
    pub diagnostics: Vec<DiagnosticMessage>,
}

/// Transform a pre-parsed program. `program` is `None` when nothing was
/// compiled.
#[must_use]
pub fn transform(
    program: &Program,
    source_type: SourceType,
    source_text: &str,
    comments: Option<&SingleThreadedComments>,
    options: PluginOptions,
) -> TransformResult {
    if !matches!(options.compilation_mode.as_str(), "all" | "annotation")
        && !has_react_like_functions(program)
    {
        return TransformResult {
            program: None,
            diagnostics: vec![],
            events: vec![],
        };
    }

    if has_resource_management_declarations(program) {
        return TransformResult {
            program: None,
            diagnostics: vec![],
            events: vec![],
        };
    }

    let source_type = source_type.with_module(matches!(program, Program::Module(_)));
    let scope_info = SemanticBuilder::with_source_type(source_type).build(program);
    let ConvertResult {
        file,
        preserved_ast,
    } = convert_program(program, source_text, comments);
    let emit_success_error_diagnostics = options.no_emit;
    let result =
        react_compiler::entrypoint::program::compile_program(file, scope_info.clone(), options);

    let diagnostics = compile_result_to_diagnostics(&result, emit_success_error_diagnostics);
    let (file, events, renames) = match result {
        react_compiler::entrypoint::compile_result::CompileResult::Success {
            ast,
            events,
            renames,
            ..
        } => (ast, events, renames),
        react_compiler::entrypoint::compile_result::CompileResult::Error { events, .. } => {
            (None, events, Vec::new())
        }
    };

    let rename_plan = build_rename_plan(&scope_info, &renames);
    let program = file.map(|file: react_compiler_ast::File| {
        let mut compiled = convert_program_to_swc(&file, preserved_ast);
        apply_renames(&mut compiled, &rename_plan);
        compiled
    });

    TransformResult {
        program,
        diagnostics,
        events,
    }
}

/// Convenience wrapper: parses source text, then transforms.
#[cfg(test)]
pub(crate) fn transform_source(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
    options: PluginOptions,
) -> TransformResult {
    match parse_source_for_tests(source_text, syntax) {
        Ok((program, comments, source_type)) => {
            transform(&program, source_type, source_text, Some(&comments), options)
        }
        Err(diagnostic) => TransformResult {
            program: None,
            diagnostics: vec![diagnostic],
            events: vec![],
        },
    }
}

/// Lint a pre-parsed program; like [`transform`] but only collects diagnostics.
///
/// Comments are required for React Compiler's Flow and `ESLint` suppression
/// detection. Pass the same [`SingleThreadedComments`] used while parsing
/// `program`.
#[must_use]
pub fn lint(
    program: &Program,
    source_type: SourceType,
    source_text: &str,
    comments: Option<&SingleThreadedComments>,
    options: PluginOptions,
) -> LintResult {
    let mut opts = options;
    opts.no_emit = true;
    let result = transform(program, source_type, source_text, comments, opts);
    LintResult {
        diagnostics: result.diagnostics,
    }
}

/// Convenience wrapper: parses source text, then lints.
#[cfg(test)]
pub(crate) fn lint_source(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
    options: PluginOptions,
) -> LintResult {
    match parse_source_for_tests(source_text, syntax) {
        Ok((program, comments, source_type)) => {
            lint(&program, source_type, source_text, Some(&comments), options)
        }
        Err(diagnostic) => LintResult {
            diagnostics: vec![diagnostic],
        },
    }
}

#[cfg(test)]
fn parse_source_for_tests(
    source_text: &str,
    syntax: swc_ecma_parser::Syntax,
) -> Result<(Program, SingleThreadedComments, SourceType), DiagnosticMessage> {
    let cm = std::sync::Arc::new(swc_common::SourceMap::default());
    let fm = cm.new_source_file(
        std::sync::Arc::new(swc_common::FileName::Anon),
        source_text.to_string(),
    );
    let comments = SingleThreadedComments::default();
    let mut errors = Vec::new();
    let is_typescript = syntax.typescript();
    match swc_ecma_parser::parse_file_as_program(
        &fm,
        syntax,
        swc_ecma_ast::EsVersion::latest(),
        Some(&comments),
        &mut errors,
    ) {
        Ok(program) => {
            let source_type = SourceType::from_program(&program).with_typescript(is_typescript);
            Ok((program, comments, source_type))
        }
        Err(error) => Err(DiagnosticMessage {
            severity: diagnostics::Severity::Error,
            message: format!("[ReactCompiler] Parse error: {error:?}"),
            span: None,
        }),
    }
}
