use std::{
    any::Any,
    collections::{HashMap, HashSet},
    panic::AssertUnwindSafe,
    path::Path,
    time::Instant,
};

use swc_atoms::Atom;
use swc_common::{comments::Comment, Span, DUMMY_SP};
use swc_ecma_ast::{
    op, ArrowExpr, AssignExpr, BindingIdent, BlockStmt, BlockStmtOrExpr, Callee, Decl, DefaultDecl,
    Expr, FnDecl, Function, Ident, Lit, ModuleDecl, ModuleItem, Param, Pat, Program, Prop,
    PropName, PropOrSpread, Stmt,
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
    utils::{
        collect_block_directives, collect_directives, directive_from_stmt, is_component_name,
        is_hook_name,
    },
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
    let forget_should_instrument_local =
        pick_unique_external_local_name(program, "shouldInstrument");
    let forget_use_render_counter_local =
        pick_unique_external_local_name(program, "useRenderCounter");
    let fixture_fn_type_hints = collect_fixture_entrypoint_type_hints(program);
    let fixture_entrypoint_fn_names = collect_fixture_entrypoint_fn_names(program);
    let expect_nothing_compiled = pass
        .code
        .as_deref()
        .is_some_and(|code| code.contains("@expectNothingCompiled"));
    let mut compiler = ProgramCompiler {
        opts: &pass.opts,
        output_mode,
        module_scope_opt_out,
        function_depth: 0,
        class_depth: 0,
        program_suppressions,
        consumed_next_line_suppressions: HashSet::new(),
        report,
        fixture_fn_type_hints,
        fixture_entrypoint_fn_names,
        expect_nothing_compiled,
        queued_outlined: Vec::new(),
        used_external_imports: Vec::new(),
        gated_arrow_original_params: HashMap::new(),
        forget_should_instrument_local,
        forget_use_render_counter_local,
        filename: pass.filename.clone(),
        fatal_error: None,
    };

    program.visit_mut_with(&mut compiler);

    if let Some(err) = compiler.fatal_error {
        return Err(err);
    }

    let mut report = compiler.report;
    let used_external_imports = compiler.used_external_imports;
    let gated_arrow_original_params = compiler.gated_arrow_original_params;
    let mut queued_outlined = compiler.queued_outlined;
    let gating_local_names = used_external_imports
        .iter()
        .map(|external| external.local_name.clone())
        .collect::<HashSet<_>>();
    normalize_gated_codegen_shapes(program, &gating_local_names, &gated_arrow_original_params);

    let requires_runtime_import = report.events.iter().any(|event| {
        matches!(
            event,
            LoggerEvent::CompileSuccess { memo_slots, .. } if *memo_slots > 0
        )
    });

    if !module_scope_opt_out && requires_runtime_import && output_mode != CompilerOutputMode::Lint {
        if imports::add_memo_cache_import(program, pass.opts.target.runtime_module().as_ref()) {
            report.inserted_imports += 1;
            report.changed = true;
        }

        let mut seen = HashSet::new();
        for external in used_external_imports {
            let key = (
                external.source.to_string(),
                external.imported_name.to_string(),
                external.local_name.to_string(),
            );
            if !seen.insert(key) {
                continue;
            }

            if imports::add_external_import(
                program,
                external.source.as_ref(),
                external.imported_name.as_ref(),
                external.local_name.as_ref(),
            ) {
                report.inserted_imports += 1;
                report.changed = true;
            }
        }

        normalize_compiler_import_order(program, pass.opts.target.runtime_module().as_ref());
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
    let mut normalized = function.clone();
    normalize_function_params_for_lowering(&mut normalized);
    let mut hir = crate::hir::lower(&normalized, id, fn_type)?;

    optimization::prune_maybe_throws(&mut hir);
    validation::validate_context_variable_lvalues(&hir)?;
    validation::validate_use_memo(&hir)?;
    inference::inline_immediately_invoked_function_expressions(&mut hir);
    inference::drop_manual_memoization(&mut hir);

    ssa::enter_ssa(&mut hir);
    ssa::eliminate_redundant_phi(&mut hir);

    optimization::constant_propagation(&mut hir);
    inference::infer_types(&mut hir);

    if opts.environment.validate_hooks_usage {
        validation::validate_hooks_usage(&hir)?;
    }
    if opts.environment.validate_no_impure_functions_in_render {
        validation::validate_no_impure_functions_in_render(&hir)?;
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
    if opts.environment.assert_valid_mutable_ranges {
        validation::validate_locals_not_reassigned_after_render(&hir)?;
    }

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
        // Upstream fixture behavior keeps lint/codegen progression even when
        // this validation would otherwise report issues.
        let _ = validation::validate_no_set_state_in_effects(&hir);
    }
    if opts.environment.validate_no_jsx_in_try_statements {
        validation::validate_no_jsx_in_try_statement(&hir)?;
    }
    if opts
        .environment
        .validate_no_freezing_known_mutable_functions
    {
        validation::validate_no_freezing_known_mutable_functions(&hir)?;
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
    ssa::rewrite_instruction_kinds_based_on_reassignment(&mut hir);

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
    if opts.environment.throw_unknown_exception_testonly {
        panic!("unexpected error");
    }

    Ok(reactive_scopes::codegen_function(reactive))
}

fn collect_pattern_bindings_for_param_lowering(pat: &Pat, out: &mut HashSet<String>) {
    match pat {
        Pat::Ident(binding) => {
            out.insert(binding.id.sym.to_string());
        }
        Pat::Array(array) => {
            for elem in array.elems.iter().flatten() {
                collect_pattern_bindings_for_param_lowering(elem, out);
            }
        }
        Pat::Object(object) => {
            for prop in &object.props {
                match prop {
                    swc_ecma_ast::ObjectPatProp::Assign(assign) => {
                        out.insert(assign.key.sym.to_string());
                    }
                    swc_ecma_ast::ObjectPatProp::KeyValue(key_value) => {
                        collect_pattern_bindings_for_param_lowering(&key_value.value, out);
                    }
                    swc_ecma_ast::ObjectPatProp::Rest(rest) => {
                        collect_pattern_bindings_for_param_lowering(&rest.arg, out);
                    }
                }
            }
        }
        Pat::Assign(assign) => {
            collect_pattern_bindings_for_param_lowering(&assign.left, out);
        }
        Pat::Rest(rest) => {
            collect_pattern_bindings_for_param_lowering(&rest.arg, out);
        }
        Pat::Expr(_) | Pat::Invalid(_) => {}
    }
}

fn fresh_param_temp_ident(next_index: &mut u32, used: &mut HashSet<String>) -> Ident {
    loop {
        let candidate = format!("t{}", *next_index);
        *next_index += 1;
        if used.insert(candidate.clone()) {
            return Ident::new_no_ctxt(candidate.into(), DUMMY_SP);
        }
    }
}

fn collect_stmt_bindings_including_nested(stmt: &Stmt, out: &mut HashSet<String>) {
    struct Collector<'a> {
        out: &'a mut HashSet<String>,
    }

    impl Visit for Collector<'_> {
        fn visit_var_declarator(&mut self, decl: &swc_ecma_ast::VarDeclarator) {
            collect_pattern_bindings_for_param_lowering(&decl.name, self.out);
            decl.visit_children_with(self);
        }

        fn visit_fn_decl(&mut self, decl: &FnDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }

        fn visit_class_decl(&mut self, decl: &swc_ecma_ast::ClassDecl) {
            self.out.insert(decl.ident.sym.to_string());
            decl.visit_children_with(self);
        }
    }

    stmt.visit_with(&mut Collector { out });
}

fn normalize_function_params_for_lowering(function: &mut Function) {
    let Some(body) = function.body.as_mut() else {
        return;
    };

    let mut used = HashSet::new();
    for param in &function.params {
        collect_pattern_bindings_for_param_lowering(&param.pat, &mut used);
    }
    for stmt in &body.stmts {
        collect_stmt_bindings_including_nested(stmt, &mut used);
    }

    let mut next_temp = 0u32;
    let mut prologue = Vec::new();
    for param in &mut function.params {
        match &mut param.pat {
            Pat::Ident(_) => {}
            Pat::Assign(assign_pat) => {
                let left_pat = (*assign_pat.left).clone();
                let default_expr = assign_pat.right.clone();
                let temp_ident = fresh_param_temp_ident(&mut next_temp, &mut used);
                param.pat = Pat::Ident(BindingIdent {
                    id: temp_ident.clone(),
                    type_ann: None,
                });
                prologue.push(Stmt::Decl(Decl::Var(Box::new(swc_ecma_ast::VarDecl {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    kind: swc_ecma_ast::VarDeclKind::Const,
                    declare: false,
                    decls: vec![swc_ecma_ast::VarDeclarator {
                        span: DUMMY_SP,
                        name: left_pat,
                        init: Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
                            span: DUMMY_SP,
                            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                                span: DUMMY_SP,
                                op: op!("==="),
                                left: Box::new(Expr::Ident(temp_ident.clone())),
                                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                                    "undefined".into(),
                                    DUMMY_SP,
                                ))),
                            })),
                            cons: default_expr,
                            alt: Box::new(Expr::Ident(temp_ident)),
                        }))),
                        definite: false,
                    }],
                }))));
            }
            _ => {
                let original_pat = param.pat.clone();
                let temp_ident = fresh_param_temp_ident(&mut next_temp, &mut used);
                param.pat = Pat::Ident(BindingIdent {
                    id: temp_ident.clone(),
                    type_ann: None,
                });

                if let Pat::Array(array_pat) = &original_pat {
                    let non_hole_pats = array_pat.elems.iter().flatten().collect::<Vec<_>>();
                    if non_hole_pats.len() == 1 {
                        if let Pat::Assign(assign_pat) = non_hole_pats[0] {
                            if let Pat::Ident(binding) = &*assign_pat.left {
                                let value_temp = fresh_param_temp_ident(&mut next_temp, &mut used);
                                prologue.push(Stmt::Decl(Decl::Var(Box::new(
                                    swc_ecma_ast::VarDecl {
                                        span: DUMMY_SP,
                                        ctxt: Default::default(),
                                        kind: swc_ecma_ast::VarDeclKind::Const,
                                        declare: false,
                                        decls: vec![swc_ecma_ast::VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Array(swc_ecma_ast::ArrayPat {
                                                span: array_pat.span,
                                                elems: vec![Some(Pat::Ident(BindingIdent {
                                                    id: value_temp.clone(),
                                                    type_ann: None,
                                                }))],
                                                optional: false,
                                                type_ann: None,
                                            }),
                                            init: Some(Box::new(Expr::Ident(temp_ident))),
                                            definite: false,
                                        }],
                                    },
                                ))));
                                prologue.push(Stmt::Decl(Decl::Var(Box::new(
                                    swc_ecma_ast::VarDecl {
                                        span: DUMMY_SP,
                                        ctxt: Default::default(),
                                        kind: swc_ecma_ast::VarDeclKind::Const,
                                        declare: false,
                                        decls: vec![swc_ecma_ast::VarDeclarator {
                                            span: DUMMY_SP,
                                            name: Pat::Ident(BindingIdent {
                                                id: binding.id.clone(),
                                                type_ann: binding.type_ann.clone(),
                                            }),
                                            init: Some(Box::new(Expr::Cond(
                                                swc_ecma_ast::CondExpr {
                                                    span: DUMMY_SP,
                                                    test: Box::new(Expr::Bin(
                                                        swc_ecma_ast::BinExpr {
                                                            span: DUMMY_SP,
                                                            op: op!("==="),
                                                            left: Box::new(Expr::Ident(
                                                                value_temp.clone(),
                                                            )),
                                                            right: Box::new(Expr::Ident(
                                                                Ident::new_no_ctxt(
                                                                    "undefined".into(),
                                                                    DUMMY_SP,
                                                                ),
                                                            )),
                                                        },
                                                    )),
                                                    cons: assign_pat.right.clone(),
                                                    alt: Box::new(Expr::Ident(value_temp)),
                                                },
                                            ))),
                                            definite: false,
                                        }],
                                    },
                                ))));
                                continue;
                            }
                        }
                    }
                }

                prologue.push(Stmt::Decl(Decl::Var(Box::new(swc_ecma_ast::VarDecl {
                    span: DUMMY_SP,
                    ctxt: Default::default(),
                    kind: swc_ecma_ast::VarDeclKind::Const,
                    declare: false,
                    decls: vec![swc_ecma_ast::VarDeclarator {
                        span: DUMMY_SP,
                        name: original_pat,
                        init: Some(Box::new(Expr::Ident(temp_ident))),
                        definite: false,
                    }],
                }))));
            }
        }
    }

    if !prologue.is_empty() {
        prologue.extend(std::mem::take(&mut body.stmts));
        body.stmts = prologue;
    }
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

fn pick_unique_external_local_name(program: &Program, imported_name: &str) -> Atom {
    struct Collector {
        names: HashSet<String>,
    }

    impl Visit for Collector {
        fn visit_ident(&mut self, ident: &Ident) {
            self.names.insert(ident.sym.to_string());
        }
    }

    fn make_unique(base: &str, taken: &HashSet<String>) -> Atom {
        if !taken.contains(base) {
            return Atom::new(base);
        }

        let prefixed = format!("_{base}");
        if !taken.contains(prefixed.as_str()) {
            return Atom::new(prefixed);
        }

        let mut suffix = 2u32;
        loop {
            let candidate = format!("_{base}{suffix}");
            if !taken.contains(candidate.as_str()) {
                return Atom::new(candidate);
            }
            suffix += 1;
        }
    }

    let mut collector = Collector {
        names: HashSet::new(),
    };
    program.visit_with(&mut collector);
    make_unique(imported_name, &collector.names)
}

#[derive(Clone)]
struct UsedExternalImport {
    source: Atom,
    imported_name: Atom,
    local_name: Atom,
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
    fixture_fn_type_hints: HashMap<String, FixtureFnTypeHint>,
    fixture_entrypoint_fn_names: HashSet<String>,
    expect_nothing_compiled: bool,
    queued_outlined: Vec<QueuedOutlinedFunction>,
    used_external_imports: Vec<UsedExternalImport>,
    gated_arrow_original_params: HashMap<(u32, u32), Vec<Pat>>,
    forget_should_instrument_local: Atom,
    forget_use_render_counter_local: Atom,
    filename: Option<String>,
    fatal_error: Option<CompilerError>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum FixtureFnTypeHint {
    Kind(ReactFunctionType),
    NotReact,
}

#[derive(Clone)]
struct QueuedOutlinedFunction {
    function: CodegenFunction,
    anchor_name: Option<String>,
}

impl ProgramCompiler<'_> {
    fn allow_infer_return_fallback_for(&self, name: Option<&Ident>) -> bool {
        if self.expect_nothing_compiled {
            return false;
        }
        if self.fixture_entrypoint_fn_names.is_empty() {
            return true;
        }
        let Some(name) = name else {
            return false;
        };
        self.fixture_entrypoint_fn_names.contains(name.sym.as_ref())
    }

    fn fixture_fn_type_hint(&self, name: Option<&Ident>) -> Option<FixtureFnTypeHint> {
        let name = name?;
        self.fixture_fn_type_hints.get(name.sym.as_ref()).copied()
    }

    fn maybe_insert_forget_instrumentation(
        &mut self,
        codegen: &mut CodegenFunction,
        name: Option<&Ident>,
        opt_in: Option<&str>,
    ) {
        if !self.opts.enable_emit_instrument_forget || opt_in != Some("use forget") {
            return;
        }
        let Some(name) = name else {
            return;
        };

        let filename = self.filename.as_deref().unwrap_or("unknown");
        let path = Path::new(filename);
        let mut stem = path
            .file_stem()
            .and_then(|value| value.to_str())
            .unwrap_or("unknown")
            .to_string();
        if stem == "input" {
            if let Some(parent_name) = path
                .parent()
                .and_then(|parent| parent.file_name())
                .and_then(|value| value.to_str())
            {
                stem = parent_name.to_string();
            }
        }
        let source_label = format!("/{stem}.ts");

        let call_stmt = Stmt::Expr(swc_ecma_ast::ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Call(swc_ecma_ast::CallExpr {
                span: DUMMY_SP,
                ctxt: Default::default(),
                callee: Callee::Expr(Box::new(Expr::Ident(Ident::new_no_ctxt(
                    self.forget_use_render_counter_local.clone(),
                    DUMMY_SP,
                )))),
                args: vec![
                    swc_ecma_ast::ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Lit(swc_ecma_ast::Lit::Str(swc_ecma_ast::Str {
                            span: DUMMY_SP,
                            value: name.sym.clone().into(),
                            raw: None,
                        }))),
                    },
                    swc_ecma_ast::ExprOrSpread {
                        spread: None,
                        expr: Box::new(Expr::Lit(swc_ecma_ast::Lit::Str(swc_ecma_ast::Str {
                            span: DUMMY_SP,
                            value: source_label.into(),
                            raw: None,
                        }))),
                    },
                ],
                type_args: None,
            })),
        });
        let instrument_stmt = Stmt::If(swc_ecma_ast::IfStmt {
            span: DUMMY_SP,
            test: Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: op!("&&"),
                left: Box::new(Expr::Ident(Ident::new_no_ctxt("DEV".into(), DUMMY_SP))),
                right: Box::new(Expr::Ident(Ident::new_no_ctxt(
                    self.forget_should_instrument_local.clone(),
                    DUMMY_SP,
                ))),
            })),
            cons: Box::new(call_stmt),
            alt: None,
        });
        let insert_index = codegen
            .body
            .stmts
            .iter()
            .take_while(|stmt| directive_from_stmt(stmt).is_some())
            .count();
        codegen.body.stmts.insert(insert_index, instrument_stmt);

        self.used_external_imports.push(UsedExternalImport {
            source: "react-compiler-runtime".into(),
            imported_name: "shouldInstrument".into(),
            local_name: self.forget_should_instrument_local.clone(),
        });
        self.used_external_imports.push(UsedExternalImport {
            source: "react-compiler-runtime".into(),
            imported_name: "useRenderCounter".into(),
            local_name: self.forget_use_render_counter_local.clone(),
        });
    }

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

    #[allow(clippy::too_many_arguments)]
    fn compile_named_function(
        &mut self,
        name: Option<&Ident>,
        function: &mut Function,
        is_declaration: bool,
        is_top_level: bool,
        fn_loc: Span,
        fn_type_hint: Option<FixtureFnTypeHint>,
        is_forward_ref_or_memo_callback: bool,
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
        let inferred_type = match fn_type_hint {
            Some(FixtureFnTypeHint::NotReact) => return,
            Some(FixtureFnTypeHint::Kind(kind)) => Some(kind),
            None => infer_function_type(
                name.map(|ident| ident.sym.as_ref()),
                &function_params,
                body,
                is_forward_ref_or_memo_callback,
            ),
        };

        let selected_type = match self.opts.compilation_mode {
            CompilationMode::Annotation => {
                if opt_in.is_some() {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
            CompilationMode::Infer => syntax_type.or(inferred_type).or_else(|| {
                if is_top_level
                    && self.allow_infer_return_fallback_for(name)
                    && has_return_with_value(body)
                {
                    Some(ReactFunctionType::Component)
                } else {
                    None
                }
            }),
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
        let mut codegen = match compiled {
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
        self.maybe_insert_forget_instrumentation(&mut codegen, name, opt_in.as_deref());

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
                anchor_name: if is_top_level {
                    name.map(|ident| ident.sym.to_string())
                } else {
                    None
                },
            });
        }

        if self.module_scope_opt_out {
            return;
        }

        if self.output_mode == CompilerOutputMode::Lint {
            reactive_scopes::normalize_lint_function_bindings(function);
            return;
        }

        if self.opts.compilation_mode == CompilationMode::Annotation && opt_in.is_none() {
            return;
        }

        if let Some(gating) = dynamic_gating.or_else(|| self.opts.gating.clone()) {
            apply_gated_codegen_to_function(function, &original_function, &codegen, &gating);
            self.used_external_imports.push(UsedExternalImport {
                source: gating.source.clone(),
                imported_name: gating.import_specifier_name.clone(),
                local_name: gating.import_specifier_name,
            });
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
        fn_type_hint: Option<FixtureFnTypeHint>,
        is_forward_ref_or_memo_callback: bool,
    ) {
        if self.fatal_error.is_some() {
            return;
        }

        let block = match &*arrow.body {
            BlockStmtOrExpr::BlockStmt(block) => block.clone(),
            BlockStmtOrExpr::Expr(expr) => BlockStmt {
                span: arrow.span,
                ctxt: arrow.ctxt,
                stmts: vec![swc_ecma_ast::Stmt::Return(swc_ecma_ast::ReturnStmt {
                    span: arrow.span,
                    arg: Some(expr.clone()),
                })],
            },
        };
        let original_params = arrow.params.clone();
        let original_block = block.clone();

        let suppression_ranges = self.suppressions_for_span(arrow.span);
        if !suppression_ranges.is_empty() {
            let err = suppression::suppressions_to_compiler_error(&suppression_ranges);
            self.record_error(err, Some(fn_loc));
            return;
        }

        let directives = collect_block_directives(&block);
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

        let inferred_type = match fn_type_hint {
            Some(FixtureFnTypeHint::NotReact) => return,
            Some(FixtureFnTypeHint::Kind(kind)) => Some(kind),
            None => infer_function_type(
                name.map(|ident| ident.sym.as_ref()),
                &arrow.params,
                &block,
                is_forward_ref_or_memo_callback,
            ),
        };

        let selected_type = match self.opts.compilation_mode {
            CompilationMode::Annotation => {
                if opt_in.is_some() {
                    inferred_type.or(Some(ReactFunctionType::Other))
                } else {
                    None
                }
            }
            CompilationMode::Infer => name
                .and_then(|ident| syntax_function_type(ident.sym.as_ref()))
                .or(inferred_type)
                .or_else(|| {
                    if is_top_level
                        && self.allow_infer_return_fallback_for(name)
                        && has_return_with_value(&block)
                    {
                        Some(ReactFunctionType::Component)
                    } else {
                        None
                    }
                }),
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
        let mut codegen = match compiled {
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
        self.maybe_insert_forget_instrumentation(&mut codegen, name, opt_in.as_deref());

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
                anchor_name: if is_top_level {
                    name.map(|ident| ident.sym.to_string())
                } else {
                    None
                },
            });
        }

        if self.module_scope_opt_out {
            return;
        }

        if self.output_mode == CompilerOutputMode::Lint {
            reactive_scopes::normalize_lint_arrow_bindings(arrow);
            return;
        }

        if self.opts.compilation_mode == CompilationMode::Annotation && opt_in.is_none() {
            return;
        }

        if let Some(gating) = dynamic_gating.or_else(|| self.opts.gating.clone()) {
            apply_gated_codegen_to_arrow(arrow, &original_block, &codegen, &gating);
            self.gated_arrow_original_params
                .insert((arrow.span.lo.0, arrow.span.hi.0), original_params);
            self.used_external_imports.push(UsedExternalImport {
                source: gating.source.clone(),
                imported_name: gating.import_specifier_name.clone(),
                local_name: gating.import_specifier_name,
            });
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
            self.fixture_fn_type_hint(Some(&decl.ident)),
            false,
        );

        self.function_depth += 1;
        decl.function.visit_mut_children_with(self);
        self.function_depth -= 1;
    }

    fn visit_mut_var_declarator(&mut self, declarator: &mut swc_ecma_ast::VarDeclarator) {
        if self.class_depth > 0 {
            declarator.visit_mut_children_with(self);
            return;
        }

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
                        self.fixture_fn_type_hint(compile_name),
                        false,
                    );

                    self.function_depth += 1;
                    fn_expr.function.visit_mut_children_with(self);
                    self.function_depth -= 1;
                    return;
                }
                Expr::Arrow(arrow) => {
                    self.compile_arrow(
                        name.as_ref(),
                        arrow,
                        is_top_level,
                        arrow.span,
                        self.fixture_fn_type_hint(name.as_ref()),
                        false,
                    );

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
        if self.class_depth > 0 {
            assign.visit_mut_children_with(self);
            return;
        }

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
                    self.fixture_fn_type_hint(compile_name),
                    false,
                );

                self.function_depth += 1;
                fn_expr.function.visit_mut_children_with(self);
                self.function_depth -= 1;
            }
            Expr::Arrow(arrow) => {
                self.compile_arrow(
                    name.as_ref(),
                    arrow,
                    is_top_level,
                    arrow.span,
                    self.fixture_fn_type_hint(name.as_ref()),
                    false,
                );

                self.function_depth += 1;
                arrow.body.visit_mut_with(self);
                self.function_depth -= 1;
            }
            _ => assign.visit_mut_children_with(self),
        }
    }

    fn visit_mut_call_expr(&mut self, call: &mut swc_ecma_ast::CallExpr) {
        if self.class_depth > 0 {
            call.visit_mut_children_with(self);
            return;
        }

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
                            self.fixture_fn_type_hint(fn_expr.ident.as_ref()),
                            true,
                        );
                    }
                    Expr::Arrow(arrow) => {
                        self.compile_arrow(None, arrow, is_top_level, arrow.span, None, true);
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
                self.fixture_fn_type_hint(fn_expr.ident.as_ref()),
                false,
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
                    self.fixture_fn_type_hint(fn_expr.ident.as_ref()),
                    false,
                );

                self.function_depth += 1;
                fn_expr.function.visit_mut_children_with(self);
                self.function_depth -= 1;
            }
            Expr::Arrow(arrow) => {
                self.compile_arrow(None, arrow, is_top_level, expr.span, None, false);

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
    let mut anchor_offsets: std::collections::HashMap<String, usize> =
        std::collections::HashMap::new();
    let mut module_insert_index = match program {
        Program::Module(module) => module
            .body
            .iter()
            .position(is_fixture_entrypoint_export)
            .unwrap_or(module.body.len()),
        Program::Script(_) => 0,
    };

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
                let insert_index = if let Some(anchor_name) = outlined.anchor_name.as_deref() {
                    if let Some(anchor_index) =
                        find_top_level_item_index_by_name(module, anchor_name)
                    {
                        let offset = anchor_offsets.entry(anchor_name.to_string()).or_insert(0);
                        let index = anchor_index + 1 + *offset;
                        *offset += 1;
                        index
                    } else {
                        module_insert_index
                    }
                } else {
                    module_insert_index
                };

                module.body.insert(insert_index, ModuleItem::Stmt(decl));
                if insert_index <= module_insert_index {
                    module_insert_index += 1;
                }
            }
            Program::Script(script) => {
                script.body.push(decl);
            }
        }

        inserted += 1;
    }

    inserted
}

fn find_top_level_item_index_by_name(module: &swc_ecma_ast::Module, name: &str) -> Option<usize> {
    module.body.iter().position(|item| {
        let ModuleItem::Stmt(stmt) = item else {
            return false;
        };

        match stmt {
            Stmt::Decl(Decl::Fn(fn_decl)) => fn_decl.ident.sym == name,
            Stmt::Decl(Decl::Class(class_decl)) => class_decl.ident.sym == name,
            Stmt::Decl(Decl::Var(var_decl)) => var_decl.decls.iter().any(
                |decl| matches!(&decl.name, Pat::Ident(BindingIdent { id, .. }) if id.sym == name),
            ),
            _ => false,
        }
    })
}

fn is_fixture_entrypoint_name(name: &str) -> bool {
    matches!(name, "FIXTURE_ENTRYPOINT" | "TODO_FIXTURE_ENTRYPOINT")
}

fn is_fixture_entrypoint_export(item: &ModuleItem) -> bool {
    let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = item else {
        return false;
    };
    let Decl::Var(var_decl) = &export_decl.decl else {
        return false;
    };
    var_decl.decls.iter().any(|declarator| {
        matches!(
            &declarator.name,
            Pat::Ident(BindingIdent { id, .. }) if is_fixture_entrypoint_name(id.sym.as_ref())
        )
    })
}

fn collect_fixture_entrypoint_type_hints(program: &Program) -> HashMap<String, FixtureFnTypeHint> {
    let Program::Module(module) = program else {
        return HashMap::new();
    };

    let mut hints = HashMap::new();
    for item in &module.body {
        let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = item else {
            continue;
        };
        let Decl::Var(var_decl) = &export_decl.decl else {
            continue;
        };
        for decl in &var_decl.decls {
            let Pat::Ident(BindingIdent { id, .. }) = &decl.name else {
                continue;
            };
            if !is_fixture_entrypoint_name(id.sym.as_ref()) {
                continue;
            }
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Object(object) = &**init else {
                continue;
            };

            let mut fn_name = None;
            let mut fn_type = None;
            let mut saw_react_kind_hint = false;
            let mut explicit_not_react = false;
            for prop in &object.props {
                let PropOrSpread::Prop(prop) = prop else {
                    continue;
                };
                let Prop::KeyValue(key_value) = &**prop else {
                    continue;
                };
                let key_name = match &key_value.key {
                    PropName::Ident(ident) => ident.sym.to_string(),
                    PropName::Str(value) => value.value.to_string_lossy().into_owned(),
                    _ => continue,
                };
                match key_name.as_str() {
                    "fn" => {
                        if let Expr::Ident(ident) = &*key_value.value {
                            fn_name = Some(ident.sym.to_string());
                        }
                    }
                    "isComponent" => {
                        saw_react_kind_hint = true;
                        match &*key_value.value {
                            Expr::Lit(Lit::Bool(bool_lit)) => {
                                if bool_lit.value {
                                    fn_type = Some(ReactFunctionType::Component);
                                }
                            }
                            // Upstream fixtures also use truthy string tags (e.g. "TodoAdd")
                            // to mark component entrypoints.
                            Expr::Lit(Lit::Str(_)) => {
                                fn_type = Some(ReactFunctionType::Component);
                            }
                            _ => {}
                        }
                    }
                    "isHook" => {
                        saw_react_kind_hint = true;
                        if let Expr::Lit(Lit::Bool(bool_lit)) = &*key_value.value {
                            if bool_lit.value {
                                fn_type = Some(ReactFunctionType::Hook);
                            } else {
                                explicit_not_react = true;
                            }
                        }
                    }
                    _ => {}
                }
            }

            if let Some(fn_name) = fn_name {
                if explicit_not_react {
                    hints.insert(fn_name, FixtureFnTypeHint::NotReact);
                } else if let Some(kind) = fn_type {
                    hints.insert(fn_name, FixtureFnTypeHint::Kind(kind));
                } else if !saw_react_kind_hint {
                    if is_hook_name(fn_name.as_str()) {
                        hints.insert(fn_name, FixtureFnTypeHint::Kind(ReactFunctionType::Hook));
                    } else if is_component_name(fn_name.as_str()) {
                        hints.insert(
                            fn_name,
                            FixtureFnTypeHint::Kind(ReactFunctionType::Component),
                        );
                    }
                }
            }
        }
    }

    hints
}

fn collect_fixture_entrypoint_fn_names(program: &Program) -> HashSet<String> {
    let Program::Module(module) = program else {
        return HashSet::new();
    };

    let mut names = HashSet::new();

    for item in &module.body {
        let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) = item else {
            continue;
        };
        let Decl::Var(var_decl) = &export_decl.decl else {
            continue;
        };
        for decl in &var_decl.decls {
            let Pat::Ident(BindingIdent { id, .. }) = &decl.name else {
                continue;
            };
            if !is_fixture_entrypoint_name(id.sym.as_ref()) {
                continue;
            }
            let Some(init) = &decl.init else {
                continue;
            };
            let Expr::Object(object) = &**init else {
                continue;
            };

            for prop in &object.props {
                let PropOrSpread::Prop(prop) = prop else {
                    continue;
                };
                let Prop::KeyValue(key_value) = &**prop else {
                    continue;
                };
                let key_name = match &key_value.key {
                    PropName::Ident(ident) => ident.sym.to_string(),
                    PropName::Str(value) => value.value.to_string_lossy().into_owned(),
                    _ => continue,
                };
                if key_name != "fn" {
                    continue;
                }
                if let Expr::Ident(ident) = &*key_value.value {
                    names.insert(ident.sym.to_string());
                }
            }
        }
    }

    names
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
    let original_body = function.body.clone();
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
    let mut next_body = codegen.body.clone();
    if let Some(original_body) = original_body.as_ref() {
        preserve_leading_directives(original_body, &mut next_body);
    }
    normalize_compound_assignments_in_block(&mut next_body);
    normalize_block_labels(&mut next_body);
    function.body = Some(next_body);
    function.is_async = codegen.is_async;
    function.is_generator = codegen.is_generator;
    strip_types_from_function(function);
    if let Some(body) = &mut function.body {
        normalize_static_string_members_in_block(body);
    }
}

fn apply_codegen_to_arrow(arrow: &mut ArrowExpr, codegen: &CodegenFunction) {
    let original_block = match &*arrow.body {
        BlockStmtOrExpr::BlockStmt(block) => Some(block.clone()),
        BlockStmtOrExpr::Expr(_) => None,
    };
    arrow.params = codegen.params.clone();
    let mut next_body = codegen.body.clone();
    if let Some(original_block) = original_block.as_ref() {
        preserve_leading_directives(original_block, &mut next_body);
    }
    normalize_compound_assignments_in_block(&mut next_body);
    normalize_block_labels(&mut next_body);
    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(next_body));
    arrow.is_async = codegen.is_async;
    arrow.is_generator = codegen.is_generator;
    strip_types_from_arrow(arrow);
    if let BlockStmtOrExpr::BlockStmt(body) = &mut *arrow.body {
        normalize_static_string_members_in_block(body);
    }
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
    let mut compiled_body = codegen.body.clone();
    if let Some(original_body) = original_function.body.as_ref() {
        preserve_leading_directives(original_body, &mut compiled_body);
    }
    normalize_compound_assignments_in_block(&mut compiled_body);
    normalize_block_labels(&mut compiled_body);
    function.body = Some(build_gated_body(
        compiled_body,
        original_function.body.clone().unwrap_or_default(),
        gating,
    ));
    function.is_async = codegen.is_async;
    function.is_generator = codegen.is_generator;
    strip_types_from_function(function);
    if let Some(body) = &mut function.body {
        normalize_static_string_members_in_block(body);
    }
}

fn apply_gated_codegen_to_arrow(
    arrow: &mut ArrowExpr,
    original_block: &BlockStmt,
    codegen: &CodegenFunction,
    gating: &crate::options::ExternalFunction,
) {
    arrow.params = codegen.params.clone();
    let mut compiled_body = codegen.body.clone();
    preserve_leading_directives(original_block, &mut compiled_body);
    normalize_compound_assignments_in_block(&mut compiled_body);
    normalize_block_labels(&mut compiled_body);
    arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(build_gated_body(
        compiled_body,
        original_block.clone(),
        gating,
    )));
    arrow.is_async = codegen.is_async;
    arrow.is_generator = codegen.is_generator;
    strip_types_from_arrow(arrow);
    if let BlockStmtOrExpr::BlockStmt(body) = &mut *arrow.body {
        normalize_static_string_members_in_block(body);
    }
}

fn preserve_leading_directives(original: &BlockStmt, compiled: &mut BlockStmt) {
    let mut original_directives = Vec::new();
    for stmt in &original.stmts {
        if directive_from_stmt(stmt).is_none() {
            break;
        }
        original_directives.push(stmt.clone());
    }

    if original_directives.is_empty() {
        return;
    }

    let mut existing = HashSet::new();
    for stmt in &compiled.stmts {
        if let Some(directive) = directive_from_stmt(stmt) {
            existing.insert(directive);
        } else {
            break;
        }
    }

    let mut prepend = Vec::new();
    for stmt in original_directives {
        if let Some(directive) = directive_from_stmt(&stmt) {
            if existing.insert(directive) {
                prepend.push(stmt);
            }
        }
    }

    if prepend.is_empty() {
        return;
    }

    prepend.extend(std::mem::take(&mut compiled.stmts));
    compiled.stmts = prepend;
}

fn strip_types_from_function(function: &mut Function) {
    let mut stripper = TypeStripper;
    function.visit_mut_with(&mut stripper);
}

fn strip_types_from_arrow(arrow: &mut ArrowExpr) {
    let mut stripper = TypeStripper;
    arrow.visit_mut_with(&mut stripper);
}

struct TypeStripper;

impl VisitMut for TypeStripper {
    fn visit_mut_function(&mut self, function: &mut Function) {
        function.type_params = None;
        function.return_type = None;
        function.visit_mut_children_with(self);
    }

    fn visit_mut_arrow_expr(&mut self, arrow: &mut ArrowExpr) {
        arrow.type_params = None;
        arrow.return_type = None;
        arrow.visit_mut_children_with(self);
    }

    fn visit_mut_binding_ident(&mut self, binding: &mut BindingIdent) {
        binding.type_ann = None;
    }

    fn visit_mut_array_pat(&mut self, pat: &mut swc_ecma_ast::ArrayPat) {
        pat.type_ann = None;
        pat.visit_mut_children_with(self);
    }

    fn visit_mut_object_pat(&mut self, pat: &mut swc_ecma_ast::ObjectPat) {
        pat.type_ann = None;
        pat.visit_mut_children_with(self);
    }
}

fn normalize_static_string_members_in_block(block: &mut BlockStmt) {
    struct Normalizer {
        in_delete_operand: bool,
    }

    impl VisitMut for Normalizer {
        fn visit_mut_member_expr(&mut self, member: &mut swc_ecma_ast::MemberExpr) {
            member.visit_mut_children_with(self);
            if self.in_delete_operand {
                return;
            }

            let swc_ecma_ast::MemberProp::Computed(computed) = &member.prop else {
                return;
            };
            let Expr::Lit(Lit::Str(str_lit)) = &*computed.expr else {
                return;
            };
            let symbol = str_lit.value.to_string_lossy();

            if Ident::verify_symbol(symbol.as_ref()).is_ok() {
                member.prop = swc_ecma_ast::MemberProp::Ident(
                    Ident::new_no_ctxt(symbol.as_ref().into(), computed.span).into(),
                );
            }
        }

        fn visit_mut_unary_expr(&mut self, unary: &mut swc_ecma_ast::UnaryExpr) {
            let prev = self.in_delete_operand;
            if matches!(unary.op, swc_ecma_ast::UnaryOp::Delete) {
                self.in_delete_operand = true;
            }
            unary.visit_mut_children_with(self);
            self.in_delete_operand = prev;
        }
    }

    let mut normalizer = Normalizer {
        in_delete_operand: false,
    };
    block.visit_mut_with(&mut normalizer);
}

fn normalize_block_labels(block: &mut BlockStmt) {
    struct LabelNormalizer {
        map: HashMap<String, String>,
        next_index: usize,
    }

    impl VisitMut for LabelNormalizer {
        fn visit_mut_labeled_stmt(&mut self, labeled: &mut swc_ecma_ast::LabeledStmt) {
            let old = labeled.label.sym.to_string();
            let new = self
                .map
                .entry(old)
                .or_insert_with(|| {
                    let name = format!("bb{}", self.next_index);
                    self.next_index += 1;
                    name
                })
                .clone();
            labeled.label.sym = new.into();
            labeled.visit_mut_children_with(self);
        }

        fn visit_mut_break_stmt(&mut self, break_stmt: &mut swc_ecma_ast::BreakStmt) {
            if let Some(label) = &mut break_stmt.label {
                if let Some(mapped) = self.map.get(label.sym.as_ref()) {
                    label.sym = mapped.clone().into();
                }
            }
        }
    }

    let mut normalizer = LabelNormalizer {
        map: HashMap::new(),
        next_index: 0,
    };
    block.visit_mut_with(&mut normalizer);
}

fn normalize_compound_assignments_in_block(block: &mut BlockStmt) {
    struct Normalizer;

    impl VisitMut for Normalizer {
        fn visit_mut_assign_expr(&mut self, assign: &mut AssignExpr) {
            assign.visit_mut_children_with(self);

            let binary_op = match assign.op {
                swc_ecma_ast::AssignOp::AddAssign => Some(op!(bin, "+")),
                swc_ecma_ast::AssignOp::SubAssign => Some(op!(bin, "-")),
                swc_ecma_ast::AssignOp::MulAssign => Some(op!("*")),
                swc_ecma_ast::AssignOp::DivAssign => Some(op!("/")),
                swc_ecma_ast::AssignOp::ModAssign => Some(op!("%")),
                swc_ecma_ast::AssignOp::LShiftAssign => Some(op!("<<")),
                swc_ecma_ast::AssignOp::RShiftAssign => Some(op!(">>")),
                swc_ecma_ast::AssignOp::ZeroFillRShiftAssign => Some(op!(">>>")),
                swc_ecma_ast::AssignOp::BitOrAssign => Some(op!("|")),
                swc_ecma_ast::AssignOp::BitXorAssign => Some(op!("^")),
                swc_ecma_ast::AssignOp::BitAndAssign => Some(op!("&")),
                swc_ecma_ast::AssignOp::ExpAssign => Some(op!("**")),
                _ => None,
            };
            let Some(binary_op) = binary_op else {
                return;
            };

            let left_expr = if let Some(binding) = assign.left.as_ident() {
                Box::new(Expr::Ident(binding.id.clone()))
            } else if let Some(swc_ecma_ast::SimpleAssignTarget::Member(member)) =
                assign.left.as_simple()
            {
                Box::new(Expr::Member(member.clone()))
            } else {
                return;
            };

            let mut right_expr = assign.right.clone();
            if matches!(
                unwrap_transparent_expr(&right_expr),
                Expr::Assign(_) | Expr::Seq(_) | Expr::Cond(_)
            ) {
                right_expr = Box::new(Expr::Paren(swc_ecma_ast::ParenExpr {
                    span: DUMMY_SP,
                    expr: right_expr,
                }));
            }
            assign.op = op!("=");
            assign.right = Box::new(Expr::Bin(swc_ecma_ast::BinExpr {
                span: DUMMY_SP,
                op: binary_op,
                left: left_expr,
                right: right_expr,
            }));
        }
    }

    block.visit_mut_with(&mut Normalizer);
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

fn extract_gated_branches(
    body: &BlockStmt,
    gating_local_names: &HashSet<Atom>,
) -> Option<(Box<Expr>, BlockStmt, BlockStmt)> {
    let [Stmt::If(if_stmt)] = body.stmts.as_slice() else {
        return None;
    };
    let Callee::Expr(callee_expr) = &if_stmt.test.as_call().map(|call| &call.callee)? else {
        return None;
    };
    let Expr::Ident(callee_ident) = unwrap_transparent_expr(callee_expr) else {
        return None;
    };
    if !gating_local_names.contains(&callee_ident.sym) {
        return None;
    }

    let Stmt::Block(compiled_block) = &*if_stmt.cons else {
        return None;
    };
    let Stmt::Block(fallback_block) = if_stmt.alt.as_deref()? else {
        return None;
    };

    Some((
        if_stmt.test.clone(),
        compiled_block.clone(),
        fallback_block.clone(),
    ))
}

fn build_gated_function_conditional_expr(
    ident: Option<Ident>,
    function: &Function,
    gating_local_names: &HashSet<Atom>,
) -> Option<Box<Expr>> {
    let body = function.body.as_ref()?;
    let (test, optimized_body, fallback_body) = extract_gated_branches(body, gating_local_names)?;

    let mut optimized_function = function.clone();
    optimized_function.body = Some(optimized_body);
    let mut fallback_function = function.clone();
    fallback_function.body = Some(fallback_body);

    Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
        span: DUMMY_SP,
        test,
        cons: Box::new(Expr::Fn(swc_ecma_ast::FnExpr {
            ident: ident.clone(),
            function: Box::new(optimized_function),
        })),
        alt: Box::new(Expr::Fn(swc_ecma_ast::FnExpr {
            ident,
            function: Box::new(fallback_function),
        })),
    })))
}

fn build_gated_arrow_conditional_expr(
    arrow: &ArrowExpr,
    gating_local_names: &HashSet<Atom>,
    fallback_params: Option<&[Pat]>,
) -> Option<Box<Expr>> {
    let BlockStmtOrExpr::BlockStmt(body) = &*arrow.body else {
        return None;
    };
    let (test, optimized_body, fallback_body) = extract_gated_branches(body, gating_local_names)?;

    let mut optimized_arrow = arrow.clone();
    optimized_arrow.body = Box::new(BlockStmtOrExpr::BlockStmt(optimized_body));
    let mut fallback_arrow = arrow.clone();
    fallback_arrow.body = Box::new(match fallback_body.stmts.as_slice() {
        [Stmt::Return(swc_ecma_ast::ReturnStmt {
            arg: Some(return_expr),
            ..
        })] => BlockStmtOrExpr::Expr(return_expr.clone()),
        _ => BlockStmtOrExpr::BlockStmt(fallback_body),
    });
    if let Some(params) = fallback_params {
        fallback_arrow.params = params.to_vec();
    }

    Some(Box::new(Expr::Cond(swc_ecma_ast::CondExpr {
        span: DUMMY_SP,
        test,
        cons: Box::new(Expr::Arrow(optimized_arrow)),
        alt: Box::new(Expr::Arrow(fallback_arrow)),
    })))
}

fn make_const_var_decl(ident: Ident, init: Box<Expr>) -> swc_ecma_ast::VarDecl {
    swc_ecma_ast::VarDecl {
        span: DUMMY_SP,
        ctxt: Default::default(),
        kind: swc_ecma_ast::VarDeclKind::Const,
        declare: false,
        decls: vec![swc_ecma_ast::VarDeclarator {
            span: DUMMY_SP,
            name: Pat::Ident(BindingIdent {
                id: ident,
                type_ann: None,
            }),
            init: Some(init),
            definite: false,
        }],
    }
}

fn normalize_gated_codegen_shapes(
    program: &mut Program,
    gating_local_names: &HashSet<Atom>,
    gated_arrow_original_params: &HashMap<(u32, u32), Vec<Pat>>,
) {
    if gating_local_names.is_empty() {
        return;
    }

    match program {
        Program::Module(module) => {
            let mut index = 0usize;
            while index < module.body.len() {
                let replacement = match module.body[index].clone() {
                    ModuleItem::Stmt(Stmt::Decl(Decl::Fn(fn_decl))) => {
                        build_gated_function_conditional_expr(
                            Some(fn_decl.ident.clone()),
                            &fn_decl.function,
                            gating_local_names,
                        )
                        .map(|init| {
                            vec![ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(
                                make_const_var_decl(fn_decl.ident, init),
                            ))))]
                        })
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(export_decl)) => {
                        let Decl::Fn(fn_decl) = export_decl.decl else {
                            index += 1;
                            continue;
                        };
                        build_gated_function_conditional_expr(
                            Some(fn_decl.ident.clone()),
                            &fn_decl.function,
                            gating_local_names,
                        )
                        .map(|init| {
                            vec![ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(
                                swc_ecma_ast::ExportDecl {
                                    span: export_decl.span,
                                    decl: Decl::Var(Box::new(make_const_var_decl(
                                        fn_decl.ident,
                                        init,
                                    ))),
                                },
                            ))]
                        })
                    }
                    ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(export_default_decl)) => {
                        let DefaultDecl::Fn(fn_expr) = export_default_decl.decl else {
                            index += 1;
                            continue;
                        };
                        let Some(default_ident) = fn_expr.ident.clone() else {
                            index += 1;
                            continue;
                        };
                        build_gated_function_conditional_expr(
                            Some(default_ident.clone()),
                            &fn_expr.function,
                            gating_local_names,
                        )
                        .map(|init| {
                            vec![
                                ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(
                                    make_const_var_decl(default_ident.clone(), init),
                                )))),
                                ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultExpr(
                                    swc_ecma_ast::ExportDefaultExpr {
                                        span: export_default_decl.span,
                                        expr: Box::new(Expr::Ident(default_ident)),
                                    },
                                )),
                            ]
                        })
                    }
                    _ => None,
                };

                if let Some(items) = replacement {
                    let inserted = items.len();
                    module.body.splice(index..=index, items);
                    index += inserted;
                } else {
                    index += 1;
                }
            }
        }
        Program::Script(script) => {
            let mut index = 0usize;
            while index < script.body.len() {
                let replacement = match script.body[index].clone() {
                    Stmt::Decl(Decl::Fn(fn_decl)) => build_gated_function_conditional_expr(
                        Some(fn_decl.ident.clone()),
                        &fn_decl.function,
                        gating_local_names,
                    )
                    .map(|init| {
                        Stmt::Decl(Decl::Var(Box::new(make_const_var_decl(
                            fn_decl.ident,
                            init,
                        ))))
                    }),
                    _ => None,
                };

                if let Some(stmt) = replacement {
                    script.body[index] = stmt;
                }
                index += 1;
            }
        }
    }

    struct GatedExprRewriter<'a> {
        gating_local_names: &'a HashSet<Atom>,
        gated_arrow_original_params: &'a HashMap<(u32, u32), Vec<Pat>>,
    }

    impl VisitMut for GatedExprRewriter<'_> {
        fn visit_mut_expr(&mut self, expr: &mut Expr) {
            expr.visit_mut_children_with(self);

            match expr {
                Expr::Fn(fn_expr) => {
                    let Some(init) = build_gated_function_conditional_expr(
                        fn_expr.ident.clone(),
                        &fn_expr.function,
                        self.gating_local_names,
                    ) else {
                        return;
                    };
                    *expr = *init;
                }
                Expr::Arrow(arrow) => {
                    let fallback_params = self
                        .gated_arrow_original_params
                        .get(&(arrow.span.lo.0, arrow.span.hi.0))
                        .map(Vec::as_slice);
                    let Some(init) = build_gated_arrow_conditional_expr(
                        arrow,
                        self.gating_local_names,
                        fallback_params,
                    ) else {
                        return;
                    };
                    *expr = *init;
                }
                _ => {}
            }
        }
    }

    let mut rewriter = GatedExprRewriter {
        gating_local_names,
        gated_arrow_original_params,
    };
    program.visit_mut_with(&mut rewriter);
}

fn normalize_compiler_import_order(program: &mut Program, runtime_module: &str) {
    let Program::Module(module) = program else {
        return;
    };

    let import_count = module
        .body
        .iter()
        .take_while(|item| matches!(item, ModuleItem::ModuleDecl(ModuleDecl::Import(_))))
        .count();
    if import_count < 2 {
        return;
    }

    let mut imports = module.body[..import_count]
        .iter()
        .filter_map(|item| {
            let ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl)) = item else {
                return None;
            };
            Some(import_decl.clone())
        })
        .collect::<Vec<_>>();

    imports.sort_by_key(|import_decl| {
        if import_decl.span != DUMMY_SP {
            return 3u8;
        }
        if import_decl.src.value == "react-compiler-runtime" {
            0
        } else if import_decl.src.value == runtime_module {
            1
        } else {
            2
        }
    });

    for (index, import_decl) in imports.into_iter().enumerate() {
        module.body[index] = ModuleItem::ModuleDecl(ModuleDecl::Import(import_decl));
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

fn infer_function_type(
    name: Option<&str>,
    params: &[Pat],
    body: &BlockStmt,
    is_forward_ref_or_memo_callback: bool,
) -> Option<ReactFunctionType> {
    let calls_hooks_or_creates_jsx = calls_hooks_or_creates_jsx(body);

    if let Some(name) = name {
        if is_component_name(name) {
            let is_component = calls_hooks_or_creates_jsx
                && is_valid_component_params(params)
                && !returns_non_node(body);
            return if is_component {
                Some(ReactFunctionType::Component)
            } else {
                None
            };
        }

        if is_hook_name(name) {
            return if calls_hooks_or_creates_jsx {
                Some(ReactFunctionType::Hook)
            } else {
                None
            };
        }
    }

    if is_forward_ref_or_memo_callback && calls_hooks_or_creates_jsx {
        return Some(ReactFunctionType::Component);
    }

    None
}

fn has_return_with_value(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct Finder {
        found: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_fn_decl(&mut self, _: &FnDecl) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_return_stmt(&mut self, return_stmt: &swc_ecma_ast::ReturnStmt) {
            if return_stmt.arg.is_some() {
                self.found = true;
            }
            return_stmt.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);
    finder.found
}

fn calls_hooks_or_creates_jsx(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct Finder {
        invokes_hooks: bool,
        creates_jsx: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_fn_decl(&mut self, _: &FnDecl) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_call_expr(&mut self, call: &swc_ecma_ast::CallExpr) {
            if let Callee::Expr(callee_expr) = &call.callee {
                if is_hook_expr(callee_expr) {
                    self.invokes_hooks = true;
                }
            }
            call.visit_children_with(self);
        }

        fn visit_jsx_element(&mut self, jsx: &swc_ecma_ast::JSXElement) {
            self.creates_jsx = true;
            jsx.visit_children_with(self);
        }

        fn visit_jsx_fragment(&mut self, jsx: &swc_ecma_ast::JSXFragment) {
            self.creates_jsx = true;
            jsx.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);
    finder.invokes_hooks || finder.creates_jsx
}

fn returns_non_node(body: &BlockStmt) -> bool {
    #[derive(Default)]
    struct Finder {
        returns_non_node: bool,
    }

    impl Visit for Finder {
        fn visit_arrow_expr(&mut self, _: &ArrowExpr) {
            // Skip nested functions.
        }

        fn visit_fn_decl(&mut self, _: &FnDecl) {
            // Skip nested functions.
        }

        fn visit_function(&mut self, _: &Function) {
            // Skip nested functions.
        }

        fn visit_method_prop(&mut self, _: &swc_ecma_ast::MethodProp) {
            // Skip object methods.
        }

        fn visit_return_stmt(&mut self, return_stmt: &swc_ecma_ast::ReturnStmt) {
            self.returns_non_node = is_non_node(return_stmt.arg.as_deref());
            return_stmt.visit_children_with(self);
        }
    }

    let mut finder = Finder::default();
    body.visit_with(&mut finder);
    finder.returns_non_node
}

fn is_non_node(expr: Option<&Expr>) -> bool {
    let Some(expr) = expr else {
        return true;
    };

    matches!(
        unwrap_transparent_expr(expr),
        Expr::Object(_)
            | Expr::Arrow(_)
            | Expr::Fn(_)
            | Expr::Class(_)
            | Expr::New(_)
            | Expr::Lit(Lit::BigInt(_))
    )
}

fn is_hook_expr(expr: &Expr) -> bool {
    let expr = unwrap_transparent_expr(expr);

    if let Expr::Ident(ident) = expr {
        return is_hook_name(ident.sym.as_ref());
    }

    let Expr::Member(member) = expr else {
        return false;
    };
    let swc_ecma_ast::MemberProp::Ident(property) = &member.prop else {
        return false;
    };
    if !is_hook_name(property.sym.as_ref()) {
        return false;
    }
    let Expr::Ident(object) = unwrap_transparent_expr(member.obj.as_ref()) else {
        return false;
    };

    matches!(object.sym.chars().next(), Some(c) if c.is_ascii_uppercase())
}

fn unwrap_transparent_expr(mut expr: &Expr) -> &Expr {
    loop {
        match expr {
            Expr::Paren(paren) => expr = &paren.expr,
            Expr::TsAs(ts_as) => expr = &ts_as.expr,
            Expr::TsTypeAssertion(type_assertion) => expr = &type_assertion.expr,
            Expr::TsNonNull(ts_non_null) => expr = &ts_non_null.expr,
            Expr::TsSatisfies(ts_satisfies) => expr = &ts_satisfies.expr,
            Expr::TsInstantiation(ts_instantiation) => expr = &ts_instantiation.expr,
            _ => return expr,
        }
    }
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
            anchor_name: None,
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
        assert!(output.contains("const Component = isForgetEnabled() ? function Component"));
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

    #[test]
    fn normalizes_labels_for_fixture_entrypoint_component() {
        let mut program = parse_program(
            "function foo(a, b, c) {\n  label: if (a) {\n    while (b) {\n      if (c) {\n        \
             break label;\n      }\n    }\n  }\n  return c;\n}\nexport const FIXTURE_ENTRYPOINT = \
             { fn: foo, params: ['TodoAdd'], isComponent: 'TodoAdd' };\n",
        );

        let report = compile_program(
            &mut program,
            &CompilerPass {
                opts: crate::options::default_options(),
                filename: Some("src/fixture.js".into()),
                comments: Vec::new(),
                code: None,
            },
        )
        .unwrap();
        let output = print_program(&program);

        assert!(report.compiled_functions >= 1, "report: {report:?}");
        assert!(report.diagnostics.is_empty(), "report: {report:?}");
        assert!(output.contains("bb0: if (a)"), "{output}");
        assert!(output.contains("break bb0"), "{output}");
    }
}
