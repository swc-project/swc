use swc_common::SyntaxContext;
use swc_ecma_ast::Program;
use swc_ecma_lints::{
    config::LintConfig,
    rule::Rule,
    rules::{self, LintParams},
};

use super::{
    state::{CompilationUnit, PipelineContextData},
    Pipeline,
};

/// Lint configuration for the pre-syntax checkpoint.
pub(super) struct LintOptions {
    pub(super) config: LintConfig,
}

/// Lint rules constructed from the AST before an early runtime plugin runs.
pub(super) struct PreparedLint {
    rules: Vec<Box<dyn Rule>>,
}

impl Pipeline<'_> {
    /// Constructs lint rules before an early plugin can replace the program.
    pub(super) fn prepare_lint(
        &self,
        unit: &CompilationUnit,
        context: &PipelineContextData,
        options: Option<LintOptions>,
    ) -> Option<PreparedLint> {
        let options = options?;
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(context.unresolved_mark);
        let top_level_ctxt = SyntaxContext::empty().apply_mark(context.top_level_mark);
        let rules = rules::all(LintParams {
            program: &unit.program,
            lint_config: &options.config,
            top_level_ctxt,
            unresolved_ctxt,
            es_version: context.target,
            source_map: self.compiler.cm.clone(),
        });

        Some(PreparedLint { rules })
    }

    /// Runs lint at the pre-syntax checkpoint.
    pub(super) fn run_lint(&self, unit: &CompilationUnit, lint: Option<PreparedLint>) {
        let Some(mut lint) = lint else {
            return;
        };

        match &unit.program {
            Program::Module(program) => lint.rules.lint_module(program),
            Program::Script(program) => lint.rules.lint_script(program),
        }
    }
}
