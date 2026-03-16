use std::{any::Any, collections::HashSet, panic::AssertUnwindSafe, time::Instant};

use swc_common::{comments::Comment, Span, DUMMY_SP};
use swc_ecma_ast::{
    op, ArrowExpr, AssignExpr, BindingIdent, BlockStmt, BlockStmtOrExpr, Callee, Decl, DefaultDecl,
    Expr, FnDecl, Function, Ident, ModuleItem, Param, Pat, Program, Stmt,
};
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

use crate::{
    entrypoint::{gating::find_dynamic_gating, imports, suppression},
    error::{CompilerError, CompilerErrorDetail, ErrorCategory, ErrorSeverity},
    inference, optimization,
    options::{
        CompilationMode, CompilerOutputMode, CompilerReactTarget, LoggerEvent,
        PanicThresholdOptions, ParsedPluginOptions,
    },
    reactive_scopes::{self, CodegenFunction},
    ssa, transform,
    transform::ReactFunctionType,
    utils::{collect_block_directives, collect_directives, is_component_name, is_hook_name},
    validation,
};

const OPT_IN_DIRECTIVES: &[&str] = &["use forget", "use memo"];
const OPT_OUT_DIRECTIVES: &[&str] = &["use no forget", "use no memo"];

/// Program-level pass context for React Compiler.
#[derive(Clone)]
pub struct CompilerPass {
    pub opts: ParsedPluginOptions,
    pub filename: Option<String>,
    pub comments: Vec<Comment>,
    pub code: Option<String>,
}

/// Compile summary and emitted diagnostics/events.
#[derive(Debug, Default, Clone)]
pub struct CompileReport {
    pub compiled_functions: usize,
    pub skipped_functions: usize,
    pub inserted_imports: usize,
    pub events: Vec<LoggerEvent>,
    pub diagnostics: Vec<CompilerErrorDetail>,
    pub changed: bool,
}

pub fn compile_program(
    program: &mut Program,
    pass: &CompilerPass,
) -> Result<CompileReport, CompilerError> {
    let program_start = Instant::now();
    let mut report = CompileReport::default();

    if let Some(filename) = pass.filename.as_deref() {
        if !pass.opts.should_include_file(filename) {
            report.events.push(LoggerEvent::CompileSkip {
                fn_loc: None,
                reason: "Skipped because file is excluded by `sources` filters.".into(),
                loc: None,
            });
            return Ok(report);
        }
    } else if pass.opts.sources.is_some() {
        return Err(CompilerError::invalid_config(
            "Expected a filename but found none.",
            "When the `sources` option is specified, React Compiler requires filename context.",
        ));
    }

    if imports::has_memo_cache_function_import(program, pass.opts.target.runtime_module().as_ref())
    {
        report.events.push(LoggerEvent::CompileSkip {
            fn_loc: None,
            reason: "Skipped because compiler runtime import already exists in this file."
                .to_string(),
            loc: None,
        });
        return Ok(report);
    }

    imports::validate_restricted_imports(
        program,
        &pass.opts.environment.validate_blocklisted_imports,
    )?;

    let suppression_rules = if pass
        .opts
        .environment
        .validate_exhaustive_memoization_dependencies
        && pass.opts.environment.validate_hooks_usage
    {
        None
    } else {
        Some(
            pass.opts
                .eslint_suppression_rules
                .clone()
                .unwrap_or_else(suppression::default_eslint_suppression_rules),
        )
    };
    let program_suppressions = suppression::find_program_suppressions(
        &pass.comments,
        suppression_rules.as_deref(),
        pass.opts.flow_suppressions,
    );

    let module_scope_opt_out = {
        let directives = top_level_directives(program);
        find_directive_disabling_memoization(&directives, &pass.opts.custom_opt_out_directives)
            .is_some()
    };

    let output_mode = pass.opts.effective_output_mode();
    let mut compiler = ProgramCompiler {
        opts: &pass.opts,
        output_mode,
        module_scope_opt_out,
        function_depth: 0,
        class_depth: 0,
        program_suppressions,
        consumed_next_line_suppressions: HashSet::new(),
        report,
        queued_outlined: Vec::new(),
        used_external_imports: Vec::new(),
        fatal_error: None,
    };

    program.visit_mut_with(&mut compiler);

    if let Some(err) = compiler.fatal_error {
        return Err(err);
    }

    let mut report = compiler.report;
    let used_external_imports = compiler.used_external_imports;
    let mut queued_outlined = compiler.queued_outlined;

    if !module_scope_opt_out
        && report.compiled_functions > 0
        && output_mode != CompilerOutputMode::Lint
    {
        if imports::add_memo_cache_import(program, pass.opts.target.runtime_module().as_ref()) {
            report.inserted_imports += 1;
            report.changed = true;
        }

        let mut seen = HashSet::new();
        for external in used_external_imports {
            let key = (
                external.source.to_string(),
                external.import_specifier_name.to_string(),
            );
            if !seen.insert(key) {
                continue;
            }

            if imports::add_external_import(program, &external) {
                report.inserted_imports += 1;
                report.changed = true;
            }
        }
    }

    if !module_scope_opt_out && output_mode != CompilerOutputMode::Lint {
        let inserted = insert_queued_outlined(program, &mut queued_outlined);
        if inserted > 0 {
            report.changed = true;
        }
    }

    report.events.push(LoggerEvent::Timing {
        measurement: format!(
            "compile_program_ms={:.3}",
            program_start.elapsed().as_secs_f64() * 1000.0
        ),
    });

    if let Some(logger) = pass.opts.logger.as_ref() {
        for event in &report.events {
            logger.log_event(pass.filename.as_deref(), event);
        }
    }

    Ok(report)
}

/// Compiles one function through the staged pipeline.
pub fn compile_fn(
    function: &Function,
    id: Option<&Ident>,
    fn_type: ReactFunctionType,
    output_mode: CompilerOutputMode,
    opts: &ParsedPluginOptions,
) -> Result<CodegenFunction, CompilerError> {
    let mut hir = crate::hir::lower(function, id, fn_type)?;

    optimization::prune_maybe_throws(&mut hir);
    validation::validate_context_variable_lvalues(&hir)?;
    validation::validate_use_memo(&hir)?;

    ssa::enter_ssa(&mut hir);
    ssa::eliminate_redundant_phi(&mut hir);

    optimization::constant_propagation(&mut hir);
    inference::infer_types(&mut hir);

    if opts.environment.validate_hooks_usage {
        validation::validate_hooks_usage(&hir)?;
    }
    if opts.environment.validate_no_capitalized_calls.is_some() {
        validation::validate_no_capitalized_calls(&hir)?;
    }

    optimization::optimize_props_method_calls(&mut hir);
    inference::analyse_functions(&mut hir);
    inference::infer_mutation_aliasing_effects(&mut hir);

    if output_mode == CompilerOutputMode::Ssr {
        optimization::optimize_for_ssr(&mut hir);
    }

    optimization::dead_code_elimination(&mut hir);
    optimization::prune_maybe_throws(&mut hir);

    inference::infer_mutation_aliasing_ranges(&mut hir);
    validation::validate_locals_not_reassigned_after_render(&hir)?;

    if opts.environment.validate_ref_access_during_render {
        validation::validate_no_ref_access_in_render(&hir)?;
    }
    if opts.environment.validate_no_set_state_in_render {
        validation::validate_no_set_state_in_render(&hir)?;
    }
    if opts.environment.validate_no_derived_computations_in_effects {
        validation::validate_no_derived_computations_in_effects(&hir)?;
    }
    if opts.environment.validate_no_set_state_in_effects {
        validation::validate_no_set_state_in_effects(&hir)?;
    }
    if opts.environment.validate_no_jsx_in_try_statements {
        validation::validate_no_jsx_in_try_statement(&hir)?;
    }

    inference::infer_reactive_places(&mut hir);

    if opts
        .environment
        .validate_exhaustive_memoization_dependencies
        || opts
            .environment
            .validate_exhaustive_effect_dependencies
            .is_enabled()
    {
        validation::validate_exhaustive_dependencies(&hir)?;
    }

    if opts.environment.enable_jsx_outlining {
        optimization::outline_jsx(&mut hir);
    }
    if opts.environment.enable_name_anonymous_functions {
        transform::name_anonymous_functions();
    }
    if opts.environment.enable_function_outlining {
        optimization::outline_functions(&mut hir);
    }

    let reactive = reactive_scopes::build_reactive_function(&hir);

    if opts
        .environment
        .enable_preserve_existing_memoization_guarantees
        || opts
            .environment
            .validate_preserve_existing_memoization_guarantees
    {
        validation::validate_preserved_manual_memoization(&hir)?;
    }
    if opts.environment.validate_static_components {
        validation::validate_static_components(&hir)?;
    }
    if opts.environment.validate_source_locations {
        validation::validate_source_locations(&hir)?;
    }

    Ok(reactive_scopes::codegen_function(reactive))
}

/// Returns the runtime import module used by compiler output.
pub fn get_react_compiler_runtime_module(target: &CompilerReactTarget) -> String {
    target.runtime_module().to_string()
}

pub fn try_find_directive_enabling_memoization(
    directives: &[String],
    opts: &ParsedPluginOptions,
) -> Result<Option<String>, CompilerError> {
    if let Some(directive) = directives
        .iter()
        .find(|value| OPT_IN_DIRECTIVES.iter().any(|item| item == &value.as_str()))
    {
        return Ok(Some(directive.clone()));
    }

    if find_dynamic_gating(directives, opts)?.is_some() {
        if let Some(dynamic) = directives
            .iter()
            .find(|value| value.starts_with("use memo if("))
        {
            return Ok(Some(dynamic.clone()));
        }
    }

    Ok(None)
}

pub fn find_directive_disabling_memoization(
    directives: &[String],
    custom_opt_out_directives: &Option<Vec<String>>,
) -> Option<String> {
    if let Some(custom) = custom_opt_out_directives {
        return directives
            .iter()
            .find(|value| custom.iter().any(|item| item == *value))
            .cloned();
    }

    directives
        .iter()
        .find(|value| {
            OPT_OUT_DIRECTIVES
                .iter()
                .any(|item| item == &value.as_str())
        })
        .cloned()
}

fn should_panic(threshold: &PanicThresholdOptions, err: &CompilerError) -> bool {
    match threshold {
        PanicThresholdOptions::AllErrors => err.has_any_errors(),
        PanicThresholdOptions::CriticalErrors => err.has_critical_errors(),
        PanicThresholdOptions::None => false,
    }
}

struct ProgramCompiler<'a> {
    opts: &'a ParsedPluginOptions,
    output_mode: CompilerOutputMode,
    module_scope_opt_out: bool,
    function_depth: u32,
    class_depth: u32,
    program_suppressions: Vec<suppression::SuppressionRange>,
    consumed_next_line_suppressions: HashSet<usize>,
    report: CompileReport,
    queued_outlined: Vec<QueuedOutlinedFunction>,
    used_external_imports: Vec<crate::options::ExternalFunction>,
    fatal_error: Option<CompilerError>,
}

#[derive(Clone)]
struct QueuedOutlinedFunction {
    function: CodegenFunction,
}

impl ProgramCompiler<'_> {
    fn suppressions_for_span(&mut self, span: Span) -> Vec<suppression::SuppressionRange> {
        let mut matched = Vec::new();

        for (index, suppression_range) in self.program_suppressions.iter().enumerate() {
            let is_next_line = suppression::is_next_line_suppression(suppression_range);
            if is_next_line && self.consumed_next_line_suppressions.contains(&index) {
                continue;
            }

            let hits = suppression::filter_suppressions_that_affect_range(
                std::slice::from_ref(suppression_range),
                span,
            );
            if hits.is_empty() {
                continue;
            }

            matched.push(suppression_range.clone());
            if is_next_line {
                self.consumed_next_line_suppressions.insert(index);
            }
        }

        matched
    }

    fn compile_named_function(
        &mut self,
        name: Option<&Ident>,
        function: &mut Function,
        is_declaration: bool,
        is_top_level: bool,
        fn_loc: Span,
        fn_type_hint: Option<ReactFunctionType>,
    ) {
        if self.fatal_error.is_some() || function.body.is_none() {
            return;
        }
        let original_function = function.clone();

        let suppression_ranges = self.suppressions_for_span(function.span);
        if !suppression_ranges.is_empty() {
            let err = suppression::suppressions_to_compiler_error(&suppression_ranges);
            self.record_error(err, Some(fn_loc));
            return;
        }

        let directives = collect_block_directives(function.body.as_ref().expect("checked above"));

        let opt_in = match try_find_directive_enabling_memoization(&directives, self.opts) {
            Ok(value) => value,
            Err(err) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        let opt_out =
            find_directive_disabling_memoization(&directives, &self.opts.custom_opt_out_directives);

        let dynamic_gating = match find_dynamic_gating(&directives, self.opts) {
            Ok(value) => value,
            Err(err) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        let syntax_type = if is_declaration {
            name.and_then(|ident| syntax_function_type(ident.sym.as_ref()))
        } else {
            None
        };

        let body = function.body.as_ref().expect("checked above");
        let function_params = function
            .params
            .iter()
            .map(|param| param.pat.clone())
            .collect::<Vec<_>>();
        let inferred_type = fn_type_hint.or_else(|| {
            name.and_then(|ident| infer_function_type(ident.sym.as_ref(), &function_params, body))
        });

        let selected_type = match self.opts.compilation_mode {
            CompilationMode::Annotation => {
                if opt_in.is_some() {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
            CompilationMode::Infer => inferred_type,
            CompilationMode::Syntax => syntax_type,
            CompilationMode::All => {
                if is_top_level {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
        };

        let Some(fn_type) = selected_type else {
            return;
        };

        if opt_out.is_some() && !self.opts.ignore_use_no_forget {
            self.report.skipped_functions += 1;
            self.report.events.push(LoggerEvent::CompileSkip {
                fn_loc: Some(fn_loc),
                reason: format!(
                    "Skipped due to '{}' directive.",
                    opt_out.as_deref().unwrap_or("use no memo")
                ),
                loc: Some(fn_loc),
            });
            return;
        }

        let compile_start = Instant::now();
        let compiled = std::panic::catch_unwind(AssertUnwindSafe(|| {
            compile_fn(function, name, fn_type, self.output_mode, self.opts)
        }));
        self.report.events.push(LoggerEvent::Timing {
            measurement: format!(
                "compile_function_ms={:.3}",
                compile_start.elapsed().as_secs_f64() * 1000.0
            ),
        });
        let codegen = match compiled {
            Ok(Ok(codegen)) => codegen,
            Ok(Err(err)) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
            Err(payload) => {
                let message = panic_payload_to_string(payload);
                self.report
                    .events
                    .push(LoggerEvent::CompileUnexpectedThrow {
                        fn_loc: Some(fn_loc),
                        data: message.clone(),
                    });
                let mut err = CompilerError::new();
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::Pipeline,
                    "React Compiler pipeline unexpectedly panicked",
                );
                detail.description = Some(message);
                detail.loc = Some(fn_loc);
                err.push(detail);
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        self.report.compiled_functions += 1;
        self.report.events.push(LoggerEvent::CompileSuccess {
            fn_loc: Some(fn_loc),
            fn_name: name.map(|ident| ident.sym.to_string()),
            memo_slots: codegen.memo_slots_used,
            memo_blocks: codegen.memo_blocks,
            memo_values: codegen.memo_values,
            pruned_memo_blocks: codegen.pruned_memo_blocks,
            pruned_memo_values: codegen.pruned_memo_values,
        });

        for outlined in &codegen.outlined {
            self.queued_outlined.push(QueuedOutlinedFunction {
                function: outlined.function.clone(),
            });
        }

        if self.module_scope_opt_out {
            return;
        }

        if self.output_mode == CompilerOutputMode::Lint {
            return;
        }

        if self.opts.compilation_mode == CompilationMode::Annotation && opt_in.is_none() {
            return;
        }

        if let Some(gating) = dynamic_gating.or_else(|| self.opts.gating.clone()) {
            apply_gated_codegen_to_function(function, &original_function, &codegen, &gating);
            self.used_external_imports.push(gating);
        } else {
            apply_codegen_to_function(function, &codegen);
        }
        self.report.changed = true;
    }

    fn compile_arrow(
        &mut self,
        name: Option<&Ident>,
        arrow: &mut ArrowExpr,
        is_top_level: bool,
        fn_loc: Span,
        fn_type_hint: Option<ReactFunctionType>,
    ) {
        if self.fatal_error.is_some() {
            return;
        }

        let block = match &*arrow.body {
            BlockStmtOrExpr::BlockStmt(block) => block,
            BlockStmtOrExpr::Expr(_) => {
                // We compile concise-body arrows by wrapping into a block.
                let expr = match *arrow.body.clone() {
                    BlockStmtOrExpr::Expr(expr) => expr,
                    BlockStmtOrExpr::BlockStmt(_) => unreachable!(),
                };
                arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                    span: arrow.span,
                    ctxt: arrow.ctxt,
                    stmts: vec![swc_ecma_ast::Stmt::Return(swc_ecma_ast::ReturnStmt {
                        span: arrow.span,
                        arg: Some(expr),
                    })],
                }));

                match &*arrow.body {
                    BlockStmtOrExpr::BlockStmt(block) => block,
                    BlockStmtOrExpr::Expr(_) => unreachable!(),
                }
            }
        };
        let original_block = block.clone();

        let suppression_ranges = self.suppressions_for_span(arrow.span);
        if !suppression_ranges.is_empty() {
            let err = suppression::suppressions_to_compiler_error(&suppression_ranges);
            self.record_error(err, Some(fn_loc));
            return;
        }

        let directives = collect_block_directives(block);
        let opt_in = match try_find_directive_enabling_memoization(&directives, self.opts) {
            Ok(value) => value,
            Err(err) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        let opt_out =
            find_directive_disabling_memoization(&directives, &self.opts.custom_opt_out_directives);

        let dynamic_gating = match find_dynamic_gating(&directives, self.opts) {
            Ok(value) => value,
            Err(err) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        let inferred_type = fn_type_hint.or_else(|| {
            name.and_then(|ident| infer_function_type(ident.sym.as_ref(), &arrow.params, block))
        });

        let selected_type = match self.opts.compilation_mode {
            CompilationMode::Annotation => {
                if opt_in.is_some() {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
            CompilationMode::Infer => inferred_type,
            CompilationMode::Syntax => None,
            CompilationMode::All => {
                if is_top_level {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
        };

        let Some(fn_type) = selected_type else {
            return;
        };

        if opt_out.is_some() && !self.opts.ignore_use_no_forget {
            self.report.skipped_functions += 1;
            self.report.events.push(LoggerEvent::CompileSkip {
                fn_loc: Some(fn_loc),
                reason: format!(
                    "Skipped due to '{}' directive.",
                    opt_out.as_deref().unwrap_or("use no memo")
                ),
                loc: Some(fn_loc),
            });
            return;
        }

        let synthetic = Function {
            params: arrow
                .params
                .iter()
                .cloned()
                .map(|pat| Param {
                    span: DUMMY_SP,
                    decorators: Vec::new(),
                    pat,
                })
                .collect(),
            decorators: Vec::new(),
            span: arrow.span,
            ctxt: arrow.ctxt,
            body: Some(block.clone()),
            is_generator: arrow.is_generator,
            is_async: arrow.is_async,
            type_params: arrow.type_params.clone(),
            return_type: arrow.return_type.clone(),
        };

        let compile_start = Instant::now();
        let compiled = std::panic::catch_unwind(AssertUnwindSafe(|| {
            compile_fn(&synthetic, name, fn_type, self.output_mode, self.opts)
        }));
        self.report.events.push(LoggerEvent::Timing {
            measurement: format!(
                "compile_function_ms={:.3}",
                compile_start.elapsed().as_secs_f64() * 1000.0
            ),
        });
        let codegen = match compiled {
            Ok(Ok(codegen)) => codegen,
            Ok(Err(err)) => {
                self.record_error(err, Some(fn_loc));
                return;
            }
            Err(payload) => {
                let message = panic_payload_to_string(payload);
                self.report
                    .events
                    .push(LoggerEvent::CompileUnexpectedThrow {
                        fn_loc: Some(fn_loc),
                        data: message.clone(),
                    });
                let mut err = CompilerError::new();
                let mut detail = CompilerErrorDetail::error(
                    ErrorCategory::Pipeline,
                    "React Compiler pipeline unexpectedly panicked",
                );
                detail.description = Some(message);
                detail.loc = Some(fn_loc);
                err.push(detail);
                self.record_error(err, Some(fn_loc));
                return;
            }
        };

        self.report.compiled_functions += 1;
        self.report.events.push(LoggerEvent::CompileSuccess {
            fn_loc: Some(fn_loc),
            fn_name: name.map(|ident| ident.sym.to_string()),
            memo_slots: codegen.memo_slots_used,
            memo_blocks: codegen.memo_blocks,
            memo_values: codegen.memo_values,
            pruned_memo_blocks: codegen.pruned_memo_blocks,
            pruned_memo_values: codegen.pruned_memo_values,
        });

        for outlined in &codegen.outlined {
            self.queued_outlined.push(QueuedOutlinedFunction {
                function: outlined.function.clone(),
            });
        }

        if self.module_scope_opt_out {
            return;
        }

        if self.output_mode == CompilerOutputMode::Lint {
            return;
        }

        if self.opts.compilation_mode == CompilationMode::Annotation && opt_in.is_none() {
            return;
        }

        if let Some(gating) = dynamic_gating.or_else(|| self.opts.gating.clone()) {
            apply_gated_codegen_to_arrow(arrow, &original_block, &codegen, &gating);
            self.used_external_imports.push(gating);
        } else {
            apply_codegen_to_arrow(arrow, &codegen);
        }
        self.report.changed = true;
    }

    fn record_error(&mut self, err: CompilerError, fn_loc: Option<Span>) {
        for detail in &err.details {
            if detail.category == ErrorCategory::Pipeline {
                self.report.events.push(LoggerEvent::PipelineError {
                    fn_loc,
                    data: detail
                        .description
                        .clone()
                        .unwrap_or_else(|| detail.reason.clone()),
                });
            }

            if detail.severity == ErrorSeverity::Error {
                self.report.events.push(LoggerEvent::CompileError {
                    fn_loc,
                    detail: detail.reason.clone(),
                });
            } else {
                self.report.events.push(LoggerEvent::CompileDiagnostic {
                    fn_loc,
                    detail: detail.reason.clone(),
                });
            }
            self.report.diagnostics.push(detail.clone());
        }

        if should_panic(&self.opts.panic_threshold, &err) {
            self.fatal_error = Some(err);
        }
    }
}

impl VisitMut for ProgramCompiler<'_> {
    fn visit_mut_class(&mut self, class: &mut swc_ecma_ast::Class) {
        self.class_depth += 1;
        class.visit_mut_children_with(self);
        self.class_depth -= 1;
    }

    fn visit_mut_fn_decl(&mut self, decl: &mut FnDecl) {
        let is_top_level = self.function_depth == 0 && self.class_depth == 0;
        self.compile_named_function(
            Some(&decl.ident),
            &mut decl.function,
            true,
            is_top_level,
            decl.ident.span,
            None,
        );

        self.function_depth += 1;
        decl.function.visit_mut_children_with(self);
        self.function_depth -= 1;
    }

    fn visit_mut_var_declarator(&mut self, declarator: &mut swc_ecma_ast::VarDeclarator) {
        let name = match &declarator.name {
            Pat::Ident(BindingIdent { id, .. }) => Some(id.clone()),
            _ => None,
        };
        let is_top_level = self.function_depth == 0 && self.class_depth == 0;

        if let Some(init) = declarator.init.as_mut() {
            match &mut **init {
                Expr::Fn(fn_expr) => {
                    let compile_name = fn_expr.ident.as_ref().or(name.as_ref());
                    let fn_span = fn_expr.function.span;
                    self.compile_named_function(
                        compile_name,
                        &mut fn_expr.function,
                        false,
                        is_top_level,
                        fn_span,
                        None,
                    );

                    self.function_depth += 1;
                    fn_expr.function.visit_mut_children_with(self);
                    self.function_depth -= 1;
                    return;
                }
                Expr::Arrow(arrow) => {
                    self.compile_arrow(name.as_ref(), arrow, is_top_level, arrow.span, None);

                    self.function_depth += 1;
                    arrow.body.visit_mut_with(self);
                    self.function_depth -= 1;
                    return;
                }
                _ => {}
            }
        }

        declarator.visit_mut_children_with(self);
    }

    fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
        let is_top_level = self.function_depth == 0 && self.class_depth == 0;
        let name = if assign.op == op!("=") {
            assign.left.as_ident().map(|binding| binding.id.clone())
        } else {
            None
        };

        match &mut *assign.right {
            Expr::Fn(fn_expr) => {
                let compile_name = fn_expr.ident.as_ref().or(name.as_ref());
                let fn_span = fn_expr.function.span;
                self.compile_named_function(
                    compile_name,
                    &mut fn_expr.function,
                    false,
                    is_top_level,
                    fn_span,
                    None,
                );

                self.function_depth += 1;
                fn_expr.function.visit_mut_children_with(self);
                self.function_depth -= 1;
            }
            Expr::Arrow(arrow) => {
                self.compile_arrow(name.as_ref(), arrow, is_top_level, arrow.span, None);

                self.function_depth += 1;
                arrow.body.visit_mut_with(self);
                self.function_depth -= 1;
            }
            _ => assign.visit_mut_children_with(self),
        }
    }

    fn visit_mut_call_expr(&mut self, call: &mut swc_ecma_ast::CallExpr) {
        if is_forward_ref_or_memo_callee(&call.callee) {
            let is_top_level = self.function_depth == 0 && self.class_depth == 0;
            if let Some(first_arg) = call.args.get_mut(0) {
                match &mut *first_arg.expr {
                    Expr::Fn(fn_expr) => {
                        let fn_span = fn_expr.function.span;
                        self.compile_named_function(
                            fn_expr.ident.as_ref(),
                            &mut fn_expr.function,
                            false,
                            is_top_level,
                            fn_span,
                            Some(ReactFunctionType::Component),
                        );
                    }
                    Expr::Arrow(arrow) => {
                        self.compile_arrow(
                            None,
                            arrow,
                            is_top_level,
                            arrow.span,
                            Some(ReactFunctionType::Component),
                        );
                    }
                    _ => {}
                }
            }
        }

        call.visit_mut_children_with(self);
    }

    fn visit_mut_export_default_decl(&mut self, decl: &mut swc_ecma_ast::ExportDefaultDecl) {
        if let DefaultDecl::Fn(fn_expr) = &mut decl.decl {
            let is_top_level = self.function_depth == 0 && self.class_depth == 0;
            self.compile_named_function(
                fn_expr.ident.as_ref(),
                &mut fn_expr.function,
                true,
                is_top_level,
                decl.span,
                None,
            );

            self.function_depth += 1;
            fn_expr.function.visit_mut_children_with(self);
            self.function_depth -= 1;
            return;
        }

        decl.visit_mut_children_with(self);
    }

    fn visit_mut_export_default_expr(&mut self, expr: &mut swc_ecma_ast::ExportDefaultExpr) {
        let is_top_level = self.function_depth == 0 && self.class_depth == 0;

        match &mut *expr.expr {
            Expr::Fn(fn_expr) => {
                self.compile_named_function(
                    fn_expr.ident.as_ref(),
                    &mut fn_expr.function,
                    false,
                    is_top_level,
                    expr.span,
                    None,
                );

                self.function_depth += 1;
                fn_expr.function.visit_mut_children_with(self);
                self.function_depth -= 1;
            }
            Expr::Arrow(arrow) => {
                self.compile_arrow(None, arrow, is_top_level, expr.span, None);

                self.function_depth += 1;
                arrow.body.visit_mut_with(self);
                self.function_depth -= 1;
            }
            _ => expr.visit_mut_children_with(self),
        }
    }
}

fn panic_payload_to_string(payload: Box<dyn Any + Send>) -> String {
    let payload = payload.as_ref();
    if let Some(message) = payload.downcast_ref::<&str>() {
        return (*message).to_string();
    }
    if let Some(message) = payload.downcast_ref::<String>() {
        return message.clone();
    }
    "React Compiler pipeline panic without message".to_string()
}

fn insert_queued_outlined(program: &mut Program, queue: &mut Vec<QueuedOutlinedFunction>) -> usize {
    if queue.is_empty() {
        return 0;
    }

    let mut known_names = collect_top_level_names(program);
    let mut inserted = 0;
    let queued = std::mem::take(queue);

    for (index, outlined) in queued.into_iter().enumerate() {
        let mut id = outlined.function.id.unwrap_or_else(|| {
            Ident::new_no_ctxt(format!("_react_compiler_outlined_{index}").into(), DUMMY_SP)
        });

        if known_names.contains(id.sym.as_ref()) {
            let base = id.sym.to_string();
            let mut counter = 1usize;
            loop {
                let candidate = format!("{base}_{counter}");
                if !known_names.contains(candidate.as_str()) {
                    id = Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
                    break;
                }
                counter += 1;
            }
        }

        known_names.insert(id.sym.to_string());

        let function = Function {
            params: outlined
                .function
                .params
                .into_iter()
                .map(|pat| Param {
                    span: DUMMY_SP,
                    decorators: Vec::new(),
                    pat,
                })
                .collect(),
            decorators: Vec::new(),
            span: DUMMY_SP,
            ctxt: Default::default(),
            body: Some(outlined.function.body),
            is_generator: outlined.function.is_generator,
            is_async: outlined.function.is_async,
            type_params: None,
            return_type: None,
        };
        let decl = Stmt::Decl(Decl::Fn(FnDecl {
            ident: id,
            declare: false,
            function: Box::new(function),
        }));

        match program {
            Program::Module(module) => {
                module.body.push(ModuleItem::Stmt(decl));
            }
            Program::Script(script) => {
                script.body.push(decl);
            }
        }

        inserted += 1;
    }

    inserted
}

fn collect_top_level_names(program: &Program) -> HashSet<String> {
    fn add_pat_name(names: &mut HashSet<String>, pat: &Pat) {
        if let Pat::Ident(binding) = pat {
            names.insert(binding.id.sym.to_string());
        }
    }

    let mut names = HashSet::new();

    match program {
        Program::Module(module) => {
            for item in &module.body {
                match item {
                    ModuleItem::Stmt(Stmt::Decl(decl)) => match decl {
                        Decl::Fn(fn_decl) => {
                            names.insert(fn_decl.ident.sym.to_string());
                        }
                        Decl::Var(var_decl) => {
                            for declarator in &var_decl.decls {
                                add_pat_name(&mut names, &declarator.name);
                            }
                        }
                        Decl::Class(class_decl) => {
                            names.insert(class_decl.ident.sym.to_string());
                        }
                        _ => {}
                    },
                    ModuleItem::ModuleDecl(_) => {}
                    ModuleItem::Stmt(_) => {}
                }
            }
        }
        Program::Script(script) => {
            for stmt in &script.body {
                if let Stmt::Decl(decl) = stmt {
                    match decl {
                        Decl::Fn(fn_decl) => {
                            names.insert(fn_decl.ident.sym.to_string());
                        }
                        Decl::Var(var_decl) => {
                            for declarator in &var_decl.decls {
                                add_pat_name(&mut names, &declarator.name);
                            }
                        }
                        Decl::Class(class_decl) => {
                            names.insert(class_decl.ident.sym.to_string());
                        }
                        _ => {}
                    }
                }
            }
        }
    }

    names
}

fn apply_codegen_to_function(function: &mut Function, codegen: &CodegenFunction) {
    function.params = codegen
        .params
        .iter()
        .cloned()
        .map(|pat| Param {
            span: DUMMY_SP,
            decorators: Vec::new(),
            pat,
        })
        .collect();
    function.body = Some(codegen.body.clone());
    function.is_async = codegen.is_async;
    function.is_generator = codegen.is_generator;
}

fn apply_codegen_to_arrow(arrow: &mut ArrowExpr, codegen: &CodegenFunction) {
    arrow.params = codegen.params.clone();
    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(codegen.body.clone()));
    arrow.is_async = codegen.is_async;
    arrow.is_generator = codegen.is_generator;
}

fn apply_gated_codegen_to_function(
    function: &mut Function,
    original_function: &Function,
    codegen: &CodegenFunction,
    gating: &crate::options::ExternalFunction,
) {
    function.params = codegen
        .params
        .iter()
        .cloned()
        .map(|pat| Param {
            span: DUMMY_SP,
            decorators: Vec::new(),
            pat,
        })
        .collect();
    function.body = Some(build_gated_body(
        codegen.body.clone(),
        original_function.body.clone().unwrap_or_default(),
        gating,
    ));
    function.is_async = codegen.is_async;
    function.is_generator = codegen.is_generator;
}

fn apply_gated_codegen_to_arrow(
    arrow: &mut ArrowExpr,
    original_block: &BlockStmt,
    codegen: &CodegenFunction,
    gating: &crate::options::ExternalFunction,
) {
    arrow.params = codegen.params.clone();
    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(build_gated_body(
        codegen.body.clone(),
        original_block.clone(),
        gating,
    )));
    arrow.is_async = codegen.is_async;
    arrow.is_generator = codegen.is_generator;
}

fn build_gated_body(
    compiled_body: BlockStmt,
    fallback_body: BlockStmt,
    gating: &crate::options::ExternalFunction,
) -> BlockStmt {
    BlockStmt {
        span: DUMMY_SP,
        ctxt: Default::default(),
        stmts: vec![Stmt::If(swc_ecma_ast::IfStmt {
            span: DUMMY_SP,
            test: Box::new(Expr::Call(swc_ecma_ast::CallExpr {
                span: DUMMY_SP,
                ctxt: Default::default(),
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                    gating.import_specifier_name.clone(),
                    DUMMY_SP,
                )))),
                args: Vec::new(),
                type_args: None,
            })),
            cons: Box::new(Stmt::Block(compiled_body)),
            alt: Some(Box::new(Stmt::Block(fallback_body))),
        })],
    }
}

fn syntax_function_type(name: &str) -> Option<ReactFunctionType> {
    if is_component_name(name) {
        Some(ReactFunctionType::Component)
    } else if is_hook_name(name) {
        Some(ReactFunctionType::Hook)
    } else {
        None
    }
}

fn infer_function_type(name: &str, params: &[Pat], body: &BlockStmt) -> Option<ReactFunctionType> {
    if is_component_name(name) {
        if calls_hooks_or_creates_jsx(body)
            && is_valid_component_params(params)
            && !returns_non_node(body)
        {
            return Some(ReactFunctionType::Component);
        }
        return None;
    }

    if is_hook_name(name) {
        if calls_hooks_or_creates_jsx(body) {
            return Some(ReactFunctionType::Hook);
        }
        return None;
    }

    None
}

fn is_valid_component_params(params: &[Pat]) -> bool {
    if params.is_empty() {
        return true;
    }

    if params.len() > 2 {
        return false;
    }

    if matches!(params.first(), Some(Pat::Rest(_))) {
        return false;
    }

    if !is_valid_props_annotation(params.first()) {
        return false;
    }

    if params.len() == 2 {
        return matches!(
            params.get(1),
            Some(Pat::Ident(binding))
                if binding.id.sym.contains("ref") || binding.id.sym.contains("Ref")
        );
    }

    true
}

fn is_valid_props_annotation(first: Option<&Pat>) -> bool {
    let type_ann = first.and_then(pattern_type_annotation);
    let Some(type_ann) = type_ann else {
        return true;
    };

    !matches!(
        &*type_ann.type_ann,
        swc_ecma_ast::TsType::TsArrayType(_)
            | swc_ecma_ast::TsType::TsFnOrConstructorType(_)
            | swc_ecma_ast::TsType::TsLitType(_)
            | swc_ecma_ast::TsType::TsTupleType(_)
            | swc_ecma_ast::TsType::TsKeywordType(swc_ecma_ast::TsKeywordType {
                kind: swc_ecma_ast::TsKeywordTypeKind::TsBigIntKeyword
                    | swc_ecma_ast::TsKeywordTypeKind::TsBooleanKeyword
                    | swc_ecma_ast::TsKeywordTypeKind::TsNeverKeyword
                    | swc_ecma_ast::TsKeywordTypeKind::TsNumberKeyword
                    | swc_ecma_ast::TsKeywordTypeKind::TsStringKeyword
                    | swc_ecma_ast::TsKeywordTypeKind::TsSymbolKeyword,
                ..
            })
    )
}

fn pattern_type_annotation(pat: &Pat) -> Option<&swc_ecma_ast::TsTypeAnn> {
    match pat {
        Pat::Ident(binding) => binding.type_ann.as_deref(),
        Pat::Array(array) => array.type_ann.as_deref(),
        Pat::Rest(rest) => rest.type_ann.as_deref(),
        Pat::Object(object) => object.type_ann.as_deref(),
        Pat::Assign(assign) => pattern_type_annotation(&assign.left),
        _ => None,
    }
}

fn returns_non_node(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct ReturnFinder {
        found_non_node: bool,
    }

    impl Visit for ReturnFinder {
        fn visit_arrow_expr(&mut self, _node: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_fn_decl(&mut self, _node: &FnDecl) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _node: &Function) {
            // Skip nested functions.
        }

        fn visit_return_stmt(&mut self, return_stmt: &swc_ecma_ast::ReturnStmt) {
            if self.found_non_node {
                return;
            }

            if is_non_node_expr(return_stmt.arg.as_deref()) {
                self.found_non_node = true;
            }
        }
    }

    let mut finder = ReturnFinder::default();
    body.visit_with(&mut finder);
    finder.found_non_node
}

fn is_non_node_expr(expr: Option<&Expr>) -> bool {
    let Some(expr) = expr else {
        return true;
    };

    matches!(
        expr,
        Expr::Object(_)
            | Expr::Arrow(_)
            | Expr::Fn(_)
            | Expr::Lit(swc_ecma_ast::Lit::BigInt(_))
            | Expr::Class(_)
            | Expr::New(_)
    )
}

fn calls_hooks_or_creates_jsx(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _node: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_fn_decl(&mut self, _node: &FnDecl) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _node: &Function) {
            // Skip nested functions.
        }

        fn visit_expr(&mut self, expr: &Expr) {
            if self.found {
                return;
            }

            if matches!(
                expr,
                Expr::JSXElement(..)
                    | Expr::JSXFragment(..)
                    | Expr::JSXMember(..)
                    | Expr::JSXNamespacedName(..)
                    | Expr::JSXEmpty(..)
            ) {
                self.found = true;
                return;
            }

            if let Expr::Call(call) = expr {
                if is_hook_callee(&call.callee) {
                    self.found = true;
                    return;
                }
            }

            expr.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);
    finder.found
}

fn is_hook_callee(callee: &Callee) -> bool {
    let Callee::Expr(expr) = callee else {
        return false;
    };

    if let Expr::Ident(ident) = &**expr {
        return is_hook_name(ident.sym.as_ref());
    }

    if let Expr::Member(member) = &**expr {
        let Expr::Ident(object) = &*member.obj else {
            return false;
        };

        let property = match &member.prop {
            swc_ecma_ast::MemberProp::Ident(ident_name) => ident_name,
            _ => return false,
        };

        return is_component_name(object.sym.as_ref()) && is_hook_name(property.sym.as_ref());
    }

    false
}

fn is_forward_ref_or_memo_callee(callee: &Callee) -> bool {
    let Callee::Expr(expr) = callee else {
        return false;
    };

    is_react_api(expr, "forwardRef") || is_react_api(expr, "memo")
}

fn is_react_api(expr: &Expr, function_name: &str) -> bool {
    if let Expr::Ident(ident) = expr {
        return ident.sym == function_name;
    }

    if let Expr::Member(member) = expr {
        if let Expr::Ident(object) = &*member.obj {
            if object.sym == "React" {
                if let swc_ecma_ast::MemberProp::Ident(property) = &member.prop {
                    return property.sym == function_name;
                }
            }
        }
    }

    false
}

fn top_level_directives(program: &Program) -> Vec<String> {
    match program {
        Program::Module(module) => {
            let mut stmts = Vec::new();
            for item in &module.body {
                let ModuleItem::Stmt(stmt) = item else {
                    break;
                };
                stmts.push(stmt.clone());
            }
            collect_directives(&stmts)
        }
        Program::Script(script) => collect_directives(&script.body),
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{
        comments::{Comment, CommentKind},
        BytePos, FileName, Span,
    };
    use swc_ecma_ast::EsVersion;
    use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
    use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};

    use super::*;

    fn parse_program(code: &str) -> Program {
        let cm = swc_common::sync::Lrc::new(swc_common::SourceMap::default());
        let fm = cm.new_source_file(
            FileName::Custom("fixture.tsx".into()).into(),
            code.to_string(),
        );

        Program::Module(
            parse_file_as_module(
                &fm,
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    ..Default::default()
                }),
                EsVersion::latest(),
                None,
                &mut vec![],
            )
            .unwrap(),
        )
    }

    fn print_program(program: &Program) -> String {
        let cm = swc_common::sync::Lrc::new(swc_common::SourceMap::default());
        let mut out = Vec::new();
        {
            let writer = JsWriter::new(cm.clone(), "\n", &mut out, None);
            let mut emitter = Emitter {
                cfg: Default::default(),
                comments: None,
                cm,
                wr: writer,
            };
            emitter.emit_program(program).unwrap();
        }
        String::from_utf8(out).unwrap()
    }

    fn line_comment(start: u32, end: u32, text: &str) -> Comment {
        Comment {
            kind: CommentKind::Line,
            span: Span::new(BytePos(start), BytePos(end)),
            text: text.into(),
        }
    }

    #[test]
    fn inserts_runtime_import_for_compiled_component() {
        let mut program =
            parse_program("function Component(props) {\n  return <div>{props.value}</div>;\n}\n");

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Component.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        let output = print_program(&program);

        assert!(report.compiled_functions > 0);
        assert!(output.contains("react/compiler-runtime"));
    }

    #[test]
    fn respects_module_opt_out_directive() {
        let mut program = parse_program(
            "\"use no memo\";\nfunction Component(props) {\n  return \
             <div>{props.value}</div>;\n}\n",
        );

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Component.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        let output = print_program(&program);
        assert!(report.compiled_functions > 0);
        assert!(!output.contains("react/compiler-runtime"));
    }

    #[test]
    fn suppression_comment_only_skips_affected_function() {
        let mut program = parse_program(
            "function ComponentA() {\n  return <div>A</div>;\n}\nfunction ComponentB() {\n  \
             return <div>B</div>;\n}\n",
        );

        let (first_span, second_span) = match &program {
            Program::Module(module) => {
                let first = match &module.body[0] {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Fn(decl))) => decl.function.span,
                    _ => panic!("first statement should be a function declaration"),
                };
                let second = match &module.body[1] {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Fn(decl))) => decl.function.span,
                    _ => panic!("second statement should be a function declaration"),
                };
                (first, second)
            }
            Program::Script(_) => panic!("expected module"),
        };

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Component.tsx".into()),
                comments: vec![line_comment(
                    first_span.lo.0 + 1,
                    first_span.lo.0 + 20,
                    " eslint-disable-next-line react-hooks/rules-of-hooks ",
                )],
                code: None,
            },
        )
        .unwrap();

        let output = print_program(&program);
        assert!(report.compiled_functions >= 1);
        assert!(!report.diagnostics.is_empty());
        assert!(report
            .diagnostics
            .iter()
            .any(|detail| detail.category == ErrorCategory::Suppression));
        assert!(output.contains("react/compiler-runtime"));
        assert!(second_span.lo > first_span.lo);
    }

    #[test]
    fn skips_when_runtime_import_already_exists() {
        let mut program = parse_program(
            "import { c as _c } from \"react/compiler-runtime\";\nfunction Component() {\n  \
             return <div />;\n}\n",
        );

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Component.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        assert_eq!(report.compiled_functions, 0);
        assert!(report
            .events
            .iter()
            .any(|event| matches!(event, LoggerEvent::CompileSkip { .. })));
    }

    #[test]
    fn records_timing_events() {
        let mut program =
            parse_program("function Component(props) {\n  return <div>{props.value}</div>;\n}\n");

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Component.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        assert!(report
            .events
            .iter()
            .any(|event| matches!(event, LoggerEvent::Timing { .. })));
    }

    #[test]
    fn appends_outlined_functions() {
        let mut program = parse_program("function Component() { return <div />; }\n");
        let mut queue = vec![QueuedOutlinedFunction {
            function: CodegenFunction {
                id: None,
                params: Vec::new(),
                body: BlockStmt {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    stmts: Vec::new(),
                },
                is_async: false,
                is_generator: false,
                memo_slots_used: 0,
                memo_blocks: 0,
                memo_values: 0,
                pruned_memo_blocks: 0,
                pruned_memo_values: 0,
                outlined: Vec::new(),
            },
        }];

        let inserted = insert_queued_outlined(&mut program, &mut queue);
        let output = print_program(&program);

        assert_eq!(inserted, 1);
        assert!(queue.is_empty());
        assert!(output.contains("function _react_compiler_outlined_0()"));
    }

    #[test]
    fn compiles_react_memo_callback_component() {
        let mut program = parse_program(
            "const Memo = React.memo((props) => {\n  return <div>{props.value}</div>;\n});\n",
        );

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/Memo.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        let output = print_program(&program);
        assert!(report.compiled_functions > 0);
        assert!(output.contains("React.memo"));
        assert!(output.contains("react/compiler-runtime"));
        assert!(output.contains("_c("));
    }

    #[test]
    fn applies_gating_to_compiled_function() {
        let mut program =
            parse_program("function Component(props) {\n  return <div>{props.value}</div>;\n}\n");
        let mut opts = crate::options::default_options();
        opts.gating = Some(crate::options::ExternalFunction {
            source: "feature-flags".into(),
            import_specifier_name: "isForgetEnabled".into(),
        });

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts,
                filename: Some("src/Component.tsx".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();

        let output = print_program(&program);
        assert!(report.compiled_functions > 0);
        assert!(output.contains("from \"feature-flags\""));
        assert!(output.contains("if (isForgetEnabled())"));
    }

    #[test]
    fn parses_opt_in_directive() {
        let opts = crate::options::default_options();
        let directives = vec!["use memo".to_string()];

        assert_eq!(
            try_find_directive_enabling_memoization(&directives, &opts)
                .unwrap()
                .as_deref(),
            Some("use memo")
        );
    }

    #[test]
    fn runtime_module_matches_target() {
        assert_eq!(
            get_react_compiler_runtime_module(&CompilerReactTarget::React19),
            "react/compiler-runtime"
        );
        assert_eq!(
            get_react_compiler_runtime_module(&CompilerReactTarget::React17),
            "react-compiler-runtime"
        );
    }
}
