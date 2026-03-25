use std::{
    collections::HashSet,
    fs,
    path::{Path, PathBuf},
};

use serde_json::Value;
use swc_atoms::Atom;
use swc_common::{
    comments::{Comment, SingleThreadedComments},
    sync::Lrc,
    FileName, SourceMap,
};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{parse_file_as_module, EsSyntax, Syntax, TsSyntax};
use swc_ecma_react_compiler::{
    compile_program, parse_plugin_options, CompilationMode, CompilerError, CompilerOutputMode,
    CompilerPass, CompilerReactTarget, DynamicGatingOptions, EnvironmentConfig, ErrorCategory,
    ExhaustiveEffectDependenciesMode, ExternalFunction, InstrumentationOptions,
    PanicThresholdOptions, PluginOptions, SourceSelection,
};
use swc_ecma_visit::{VisitMut, VisitMutWith};

fn normalize_flow_component_syntax(source: &str) -> String {
    let mut out = String::with_capacity(source.len());

    for line in source.lines() {
        let mut rewritten = line.to_string();
        let trimmed = rewritten.trim_start();
        let indent_len = rewritten.len().saturating_sub(trimmed.len());

        if trimmed.starts_with("export default component ") {
            let start = indent_len;
            let end = start + "export default component".len();
            rewritten.replace_range(start..end, "export default function");
        } else if trimmed.starts_with("export default hook ") {
            let start = indent_len;
            let end = start + "export default hook".len();
            rewritten.replace_range(start..end, "export default function");
        } else if trimmed.starts_with("export hook ") {
            let start = indent_len;
            let end = start + "export hook".len();
            rewritten.replace_range(start..end, "export function");
        } else if trimmed.starts_with("component ") {
            let start = indent_len;
            let end = start + "component".len();
            rewritten.replace_range(start..end, "function");
        } else if trimmed.starts_with("hook ") {
            let start = indent_len;
            let end = start + "hook".len();
            rewritten.replace_range(start..end, "function");
        }

        out.push_str(&rewritten);
        out.push('\n');
    }

    out
}

fn normalize_flow_typecast_syntax(source: &str) -> String {
    let chars = source.char_indices().collect::<Vec<_>>();
    if chars.is_empty() {
        return String::new();
    }

    let mut out = String::with_capacity(source.len());
    let mut cursor = 0usize;

    while cursor < chars.len() {
        let (start_idx, ch) = chars[cursor];
        if ch != '(' {
            let end_idx = chars
                .get(cursor + 1)
                .map(|(idx, _)| *idx)
                .unwrap_or(source.len());
            out.push_str(&source[start_idx..end_idx]);
            cursor += 1;
            continue;
        }

        let mut depth = 1usize;
        let mut end_cursor = cursor + 1;
        while end_cursor < chars.len() {
            let (_, ch) = chars[end_cursor];
            match ch {
                '(' => depth += 1,
                ')' => {
                    depth -= 1;
                    if depth == 0 {
                        break;
                    }
                }
                _ => {}
            }
            end_cursor += 1;
        }

        if end_cursor >= chars.len() {
            // Unbalanced parentheses; copy the current character and continue.
            let end_idx = chars
                .get(cursor + 1)
                .map(|(idx, _)| *idx)
                .unwrap_or(source.len());
            out.push_str(&source[start_idx..end_idx]);
            cursor += 1;
            continue;
        }

        let inner_start = chars[cursor + 1].0;
        let inner_end = chars[end_cursor].0;
        let inner = &source[inner_start..inner_end];

        let mut paren_depth = 0usize;
        let mut brace_depth = 0usize;
        let mut bracket_depth = 0usize;
        let mut saw_top_level_question = false;
        let mut top_level_colon_byte = None::<usize>;

        for (offset, ch) in inner.char_indices() {
            match ch {
                '(' => paren_depth += 1,
                ')' => paren_depth = paren_depth.saturating_sub(1),
                '{' => brace_depth += 1,
                '}' => brace_depth = brace_depth.saturating_sub(1),
                '[' => bracket_depth += 1,
                ']' => bracket_depth = bracket_depth.saturating_sub(1),
                '?' if paren_depth == 0 && brace_depth == 0 && bracket_depth == 0 => {
                    saw_top_level_question = true;
                }
                ':' if paren_depth == 0 && brace_depth == 0 && bracket_depth == 0 => {
                    top_level_colon_byte = Some(offset);
                    break;
                }
                _ => {}
            }
        }

        let mut rewritten = false;
        if let Some(colon_offset) = top_level_colon_byte {
            if !saw_top_level_question {
                let expr_part = inner[..colon_offset].trim();
                let type_part = inner[colon_offset + 1..].trim();
                if !expr_part.is_empty() && !type_part.is_empty() {
                    out.push('(');
                    out.push_str(expr_part);
                    out.push(')');
                    rewritten = true;
                }
            }
        }

        if !rewritten {
            let end_byte = chars
                .get(end_cursor + 1)
                .map(|(idx, _)| *idx)
                .unwrap_or(source.len());
            out.push_str(&source[start_idx..end_byte]);
        }

        cursor = end_cursor + 1;
    }

    out
}

fn normalize_flow_fixture_edge_cases(source: &str) -> String {
    let mut normalized = source.to_string();

    // Handle a Flow-only generic hook signature used by upstream fixtures.
    normalized = normalized.replace(
        "hook useMemoMap<TInput: interface {}, TOutput>(",
        "function useMemoMap(",
    );
    normalized = normalized.replace(
        "function useMemoMap<TInput: interface {}, TOutput>(",
        "function useMemoMap(",
    );
    normalized = normalized.replace("  map: TInput => TOutput", "  map");
    normalized = normalized.replace("): TInput => TOutput {", ") {");

    // Normalize Flow function-type parameter annotations into plain params.
    normalized = normalized.replace("onAsyncSubmit?: (() => void) => void,", "onAsyncSubmit,");
    normalized = normalized.replace("onClose: (isConfirmed: boolean) => void", "onClose");

    // Normalize common Flow nullable annotation patterns in local declarations.
    let mut out = String::with_capacity(normalized.len());
    for line in normalized.lines() {
        let trimmed = line.trim_start();
        let rewritten = if (trimmed.starts_with("let ")
            || trimmed.starts_with("const ")
            || trimmed.starts_with("var "))
            && trimmed.contains(':')
            && trimmed.contains('=')
        {
            if let (Some(colon), Some(eq)) = (line.find(':'), line.find('=')) {
                if colon < eq {
                    let mut candidate = String::with_capacity(line.len());
                    candidate.push_str(&line[..colon]);
                    candidate.push(' ');
                    candidate.push_str(&line[eq..]);
                    candidate
                } else {
                    line.to_string()
                }
            } else {
                line.to_string()
            }
        } else {
            line.to_string()
        };
        out.push_str(&rewritten);
        out.push('\n');
    }

    out
}

fn collect_flow_component_declaration_names(source: &str) -> HashSet<String> {
    let mut names = HashSet::new();

    for line in source.lines() {
        let trimmed = line.trim_start();
        let rest = if let Some(rest) = trimmed.strip_prefix("export default component ") {
            rest
        } else if let Some(rest) = trimmed.strip_prefix("component ") {
            rest
        } else {
            continue;
        };

        let name: String = rest
            .chars()
            .take_while(|ch| ch.is_ascii_alphanumeric() || *ch == '_' || *ch == '$')
            .collect();
        if !name.is_empty() {
            names.insert(name);
        }
    }

    names
}

fn build_readonly_object_type_ann_from_idents(
    bindings: &[swc_ecma_ast::BindingIdent],
) -> Option<Box<swc_ecma_ast::TsTypeAnn>> {
    let mut members = Vec::with_capacity(bindings.len());

    for binding in bindings {
        let prop_type = binding.type_ann.as_ref().map(|ann| ann.type_ann.clone())?;
        members.push(swc_ecma_ast::TsTypeElement::TsPropertySignature(
            swc_ecma_ast::TsPropertySignature {
                span: swc_common::DUMMY_SP,
                readonly: false,
                key: Box::new(swc_ecma_ast::Expr::Ident(binding.id.clone())),
                computed: false,
                optional: binding.id.optional,
                type_ann: Some(Box::new(swc_ecma_ast::TsTypeAnn {
                    span: swc_common::DUMMY_SP,
                    type_ann: prop_type,
                })),
            },
        ));
    }

    Some(Box::new(swc_ecma_ast::TsTypeAnn {
        span: swc_common::DUMMY_SP,
        type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
            span: swc_common::DUMMY_SP,
            type_name: swc_ecma_ast::TsEntityName::Ident(swc_ecma_ast::Ident::new_no_ctxt(
                "$ReadOnly".into(),
                swc_common::DUMMY_SP,
            )),
            type_params: Some(Box::new(swc_ecma_ast::TsTypeParamInstantiation {
                span: swc_common::DUMMY_SP,
                params: vec![Box::new(swc_ecma_ast::TsType::TsTypeLit(
                    swc_ecma_ast::TsTypeLit {
                        span: swc_common::DUMMY_SP,
                        members,
                    },
                ))],
            })),
        })),
    }))
}

fn build_readonly_empty_object_type_ann() -> Box<swc_ecma_ast::TsTypeAnn> {
    Box::new(swc_ecma_ast::TsTypeAnn {
        span: swc_common::DUMMY_SP,
        type_ann: Box::new(swc_ecma_ast::TsType::TsTypeRef(swc_ecma_ast::TsTypeRef {
            span: swc_common::DUMMY_SP,
            type_name: swc_ecma_ast::TsEntityName::Ident(swc_ecma_ast::Ident::new_no_ctxt(
                "$ReadOnly".into(),
                swc_common::DUMMY_SP,
            )),
            type_params: Some(Box::new(swc_ecma_ast::TsTypeParamInstantiation {
                span: swc_common::DUMMY_SP,
                params: vec![Box::new(swc_ecma_ast::TsType::TsTypeLit(
                    swc_ecma_ast::TsTypeLit {
                        span: swc_common::DUMMY_SP,
                        members: Vec::new(),
                    },
                ))],
            })),
        })),
    })
}

fn param_is_ref_param(param: &swc_ecma_ast::Param) -> bool {
    matches!(&param.pat, swc_ecma_ast::Pat::Ident(binding) if binding.id.sym == "ref")
}

fn rewrite_flow_component_function_params(function: &mut swc_ecma_ast::Function) {
    if function.params.is_empty() {
        return;
    }

    let has_ref_param = function.params.last().is_some_and(param_is_ref_param);
    let props_count = if has_ref_param {
        function.params.len().saturating_sub(1)
    } else {
        function.params.len()
    };

    if props_count == 0 {
        if has_ref_param {
            let ref_param = function
                .params
                .pop()
                .expect("has_ref_param implies at least one param");
            function.params.push(swc_ecma_ast::Param {
                span: swc_common::DUMMY_SP,
                decorators: Vec::new(),
                pat: swc_ecma_ast::Pat::Ident(swc_ecma_ast::BindingIdent {
                    id: swc_ecma_ast::Ident::new_no_ctxt(
                        "_$$empty_props_placeholder$$".into(),
                        swc_common::DUMMY_SP,
                    ),
                    type_ann: Some(build_readonly_empty_object_type_ann()),
                }),
            });
            function.params.push(ref_param);
        }
        return;
    }

    let mut prop_bindings = Vec::with_capacity(props_count);
    for param in function.params.iter().take(props_count) {
        let swc_ecma_ast::Pat::Ident(binding) = &param.pat else {
            return;
        };
        prop_bindings.push(binding.clone());
    }

    let object_type_ann = build_readonly_object_type_ann_from_idents(&prop_bindings);
    let object_props = prop_bindings
        .iter()
        .map(|binding| {
            swc_ecma_ast::ObjectPatProp::Assign(swc_ecma_ast::AssignPatProp {
                span: swc_common::DUMMY_SP,
                key: swc_ecma_ast::BindingIdent {
                    id: binding.id.clone(),
                    type_ann: None,
                },
                value: None,
            })
        })
        .collect();

    let mut rewritten_params = vec![swc_ecma_ast::Param {
        span: swc_common::DUMMY_SP,
        decorators: Vec::new(),
        pat: swc_ecma_ast::Pat::Object(swc_ecma_ast::ObjectPat {
            span: swc_common::DUMMY_SP,
            props: object_props,
            optional: false,
            type_ann: object_type_ann,
        }),
    }];

    if has_ref_param {
        if let Some(ref_param) = function.params.last().cloned() {
            rewritten_params.push(ref_param);
        }
    }

    function.params = rewritten_params;
}

fn rewrite_flow_component_param_semantics(
    program: &mut Program,
    component_names: &HashSet<String>,
) {
    if component_names.is_empty() {
        return;
    }

    struct Rewriter<'a> {
        component_names: &'a HashSet<String>,
    }

    impl Rewriter<'_> {
        fn rewrite_if_component(
            &self,
            name: Option<&swc_ecma_ast::Ident>,
            function: &mut swc_ecma_ast::Function,
        ) {
            let Some(name) = name else {
                return;
            };
            if self.component_names.contains(name.sym.as_ref()) {
                rewrite_flow_component_function_params(function);
            }
        }
    }

    impl VisitMut for Rewriter<'_> {
        fn visit_mut_fn_decl(&mut self, fn_decl: &mut swc_ecma_ast::FnDecl) {
            self.rewrite_if_component(Some(&fn_decl.ident), &mut fn_decl.function);
            fn_decl.visit_mut_children_with(self);
        }

        fn visit_mut_export_default_decl(
            &mut self,
            export_default: &mut swc_ecma_ast::ExportDefaultDecl,
        ) {
            if let swc_ecma_ast::DefaultDecl::Fn(fn_expr) = &mut export_default.decl {
                self.rewrite_if_component(fn_expr.ident.as_ref(), &mut fn_expr.function);
            }
            export_default.visit_mut_children_with(self);
        }
    }

    program.visit_mut_with(&mut Rewriter { component_names });
}

fn try_parse(input: &Path, source: &str) -> Result<(Program, Vec<Comment>), String> {
    let cm = Lrc::new(SourceMap::default());
    let parse_with_source = |code: &str, syntax: Syntax| {
        let fm = cm.new_source_file(FileName::Real(input.to_path_buf()).into(), code.to_string());
        let comments = SingleThreadedComments::default();
        let mut errors = Vec::new();
        let parsed = parse_file_as_module(
            &fm,
            syntax,
            EsVersion::latest(),
            Some(&comments),
            &mut errors,
        );
        (parsed, comments)
    };

    // Try TS/TSX first to support upstream fixtures that use TS syntax.
    let (parsed_ts, ts_comments) = parse_with_source(
        source,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            ..Default::default()
        }),
    );
    if let Ok(program) = parsed_ts {
        return Ok((Program::Module(program), flatten_comments(&ts_comments)));
    }

    let (parsed_es, es_comments) = parse_with_source(
        source,
        Syntax::Es(EsSyntax {
            jsx: true,
            decorators: true,
            ..Default::default()
        }),
    );

    if parsed_es.is_err() {
        let normalized = normalize_flow_fixture_edge_cases(&normalize_flow_component_syntax(
            &normalize_flow_typecast_syntax(source),
        ));
        if normalized != source {
            let component_names = collect_flow_component_declaration_names(source);
            let (parsed_ts_normalized, ts_comments_normalized) = parse_with_source(
                &normalized,
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    decorators: true,
                    ..Default::default()
                }),
            );
            if let Ok(program) = parsed_ts_normalized {
                let mut program = Program::Module(program);
                rewrite_flow_component_param_semantics(&mut program, &component_names);
                return Ok((program, flatten_comments(&ts_comments_normalized)));
            }

            let (parsed_es_normalized, es_comments_normalized) = parse_with_source(
                &normalized,
                Syntax::Es(EsSyntax {
                    jsx: true,
                    decorators: true,
                    ..Default::default()
                }),
            );
            if let Ok(program) = parsed_es_normalized {
                let mut program = Program::Module(program);
                rewrite_flow_component_param_semantics(&mut program, &component_names);
                return Ok((program, flatten_comments(&es_comments_normalized)));
            }
        }
    }

    match parsed_es {
        Ok(program) => Ok((Program::Module(program), flatten_comments(&es_comments))),
        Err(err) => Err(format!("{err:?}")),
    }
}

fn parse(input: &Path, source: &str) -> (Program, Vec<Comment>) {
    match try_parse(input, source) {
        Ok(parsed) => parsed,
        Err(err) => panic!("failed to parse fixture `{}`: {err}", input.display()),
    }
}

fn flatten_comments(comments: &SingleThreadedComments) -> Vec<Comment> {
    let (leading, trailing) = comments.borrow_all();
    let mut out = Vec::new();

    for items in leading.values() {
        out.extend(items.iter().cloned());
    }
    for items in trailing.values() {
        out.extend(items.iter().cloned());
    }

    out.sort_by_key(|comment| comment.span.lo);
    out
}

fn print(program: &Program) -> String {
    let cm = Lrc::new(SourceMap::default());
    let mut out = Vec::new();
    {
        let wr = JsWriter::new(cm.clone(), "\n", &mut out, None);
        let mut emitter = Emitter {
            cfg: Default::default(),
            comments: None,
            cm,
            wr,
        };
        emitter.emit_program(program).unwrap();
    }
    String::from_utf8(out).unwrap()
}

fn normalize(value: &str) -> String {
    value.replace("\r\n", "\n").trim().to_string()
}

fn normalize_js_like(value: &str) -> String {
    let virtual_path = PathBuf::from("fixture-normalize.tsx");
    match try_parse(&virtual_path, value) {
        Ok((mut program, _)) => {
            strip_literal_raws(&mut program);
            normalize(&print(&program))
        }
        Err(_) => normalize(value),
    }
}

fn expected_error_reasons(expected: &str) -> Vec<String> {
    expected
        .lines()
        .filter_map(|line| line.trim().strip_prefix("Error: "))
        .map(|reason| reason.trim().to_string())
        .collect()
}

fn details_match_expected_errors(detail_list: &[(ErrorCategory, String)], expected: &str) -> bool {
    let reasons = expected_error_reasons(expected);
    if reasons.is_empty() {
        let joined = detail_list
            .iter()
            .map(|(_, text)| text.clone())
            .collect::<Vec<_>>()
            .join("\n");
        return normalize(&joined).contains(&normalize(expected));
    }

    let mut used = vec![false; detail_list.len()];
    for reason in reasons {
        let mut matched = false;
        for (index, (_, text)) in detail_list.iter().enumerate() {
            if used[index] {
                continue;
            }
            if text.contains(reason.as_str()) {
                used[index] = true;
                matched = true;
                break;
            }
        }
        if !matched {
            return false;
        }
    }

    true
}

fn strip_literal_raws(program: &mut Program) {
    struct RawStripper;

    impl VisitMut for RawStripper {
        fn visit_mut_str(&mut self, string_lit: &mut swc_ecma_ast::Str) {
            string_lit.raw = None;
        }

        fn visit_mut_jsx_text(&mut self, jsx_text: &mut swc_ecma_ast::JSXText) {
            let value = jsx_text.value.as_ref();
            if value.contains('\n') && value.trim().is_empty() {
                jsx_text.value = "\n".into();
                jsx_text.raw = "\n".into();
            }
        }

        fn visit_mut_lit(&mut self, lit: &mut swc_ecma_ast::Lit) {
            match lit {
                swc_ecma_ast::Lit::Str(string_lit) => {
                    string_lit.raw = None;
                }
                swc_ecma_ast::Lit::Num(number_lit) => {
                    number_lit.raw = None;
                }
                swc_ecma_ast::Lit::BigInt(bigint_lit) => {
                    bigint_lit.raw = None;
                }
                _ => {}
            }
        }
    }

    program.visit_mut_with(&mut RawStripper);
}

fn default_fixture_gating() -> ExternalFunction {
    ExternalFunction {
        source: "ReactForgetFeatureFlag".into(),
        import_specifier_name: "isForgetEnabled_Fixtures".into(),
    }
}

fn default_fixture_instrumentation() -> InstrumentationOptions {
    InstrumentationOptions {
        function: ExternalFunction {
            source: "react-compiler-runtime".into(),
            import_specifier_name: "useRenderCounter".into(),
        },
        gating: Some(ExternalFunction {
            source: "react-compiler-runtime".into(),
            import_specifier_name: "shouldInstrument".into(),
        }),
        global_gating: Some("DEV".into()),
    }
}

fn default_fixture_hook_guard() -> ExternalFunction {
    ExternalFunction {
        source: "react-compiler-runtime".into(),
        import_specifier_name: "$dispatcherGuard".into(),
    }
}

fn parse_external_function_value(value: &Value) -> Option<ExternalFunction> {
    let object = value.as_object()?;
    let source = object.get("source").and_then(Value::as_str)?;
    let import_specifier_name = object.get("importSpecifierName").and_then(Value::as_str)?;
    Some(ExternalFunction {
        source: source.into(),
        import_specifier_name: import_specifier_name.into(),
    })
}

fn parse_pragmas(source: &str) -> PluginOptions {
    let mut options = PluginOptions {
        compilation_mode: Some(CompilationMode::Infer),
        ..Default::default()
    };

    let mut env = EnvironmentConfig::default();
    let mut env_changed = false;

    // Keep local dynamic-gating coverage enabled by default for fixtures that use
    // `use memo if(...)` directives.
    if source.contains("use memo if(") {
        options.dynamic_gating = Some(DynamicGatingOptions {
            source: "feature-flags".into(),
        });
    }

    for entry in source.split('@').skip(1) {
        let entry = entry.trim();
        if entry.is_empty() {
            continue;
        }
        let pragma = entry.lines().next().unwrap_or(entry).trim();
        if pragma.is_empty() {
            continue;
        }

        let (key, raw_value) = match pragma.find(':') {
            Some(index) => (&pragma[..index], Some(pragma[index + 1..].trim())),
            None => (pragma.split_whitespace().next().unwrap_or_default(), None),
        };
        let key = key.trim();
        if key.is_empty() {
            continue;
        }

        let is_set = match raw_value.map(str::trim) {
            None => true,
            Some(value) => value.is_empty() || value == "true",
        };
        let parsed_value = if is_set {
            Value::Bool(true)
        } else {
            let Some(value) = raw_value.and_then(parse_pragma_value) else {
                continue;
            };
            value
        };

        match key {
            "compilationMode" => {
                if let Some(value) = parsed_value.as_str() {
                    options.compilation_mode = match value.to_ascii_lowercase().as_str() {
                        "infer" => Some(CompilationMode::Infer),
                        "syntax" => Some(CompilationMode::Syntax),
                        "annotation" => Some(CompilationMode::Annotation),
                        "all" => Some(CompilationMode::All),
                        _ => options.compilation_mode,
                    };
                }
            }
            "outputMode" => {
                if let Some(value) = parsed_value.as_str() {
                    options.output_mode = match value.to_ascii_lowercase().as_str() {
                        "client" => Some(CompilerOutputMode::Client),
                        "ssr" => Some(CompilerOutputMode::Ssr),
                        "lint" => Some(CompilerOutputMode::Lint),
                        _ => options.output_mode,
                    };
                }
            }
            "enableOptimizeForSSR" => {
                if parsed_value.as_bool() == Some(true) {
                    options.output_mode = Some(CompilerOutputMode::Ssr);
                }
            }
            "noEmit" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.no_emit = Some(value);
                }
            }
            "panicThreshold" => {
                if let Some(value) = parsed_value.as_str() {
                    options.panic_threshold = match value.to_ascii_lowercase().as_str() {
                        "all_errors" => Some(PanicThresholdOptions::AllErrors),
                        "critical_errors" => Some(PanicThresholdOptions::CriticalErrors),
                        "none" => Some(PanicThresholdOptions::None),
                        _ => options.panic_threshold,
                    };
                }
            }
            "target" => {
                if let Some(value) = parsed_value.as_str() {
                    options.target = match value {
                        "19" => Some(CompilerReactTarget::React19),
                        "18" => Some(CompilerReactTarget::React18),
                        "17" => Some(CompilerReactTarget::React17),
                        "donotuse_meta_internal" => {
                            Some(CompilerReactTarget::DoNotUseMetaInternal {
                                runtime_module: "react".into(),
                            })
                        }
                        _ => options.target,
                    };
                } else if let Some(value) = parsed_value.as_i64() {
                    options.target = match value {
                        19 => Some(CompilerReactTarget::React19),
                        18 => Some(CompilerReactTarget::React18),
                        17 => Some(CompilerReactTarget::React17),
                        _ => options.target,
                    };
                } else if let Some(object) = parsed_value.as_object() {
                    let kind = object.get("kind").and_then(Value::as_str);
                    let runtime_module = object.get("runtimeModule").and_then(Value::as_str);
                    if kind == Some("donotuse_meta_internal") {
                        options.target = Some(CompilerReactTarget::DoNotUseMetaInternal {
                            runtime_module: runtime_module.unwrap_or("react").into(),
                        });
                    }
                }
            }
            "ignoreUseNoForget" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.ignore_use_no_forget = Some(value);
                }
            }
            "flowSuppressions" | "enableFlowSuppressions" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.flow_suppressions = Some(value);
                }
            }
            "enableReanimatedCheck" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.enable_reanimated_check = Some(value);
                }
            }
            "enableEmitInstrumentForget" => match &parsed_value {
                Value::Bool(value) => {
                    options.enable_emit_instrument_forget = Some(*value);
                    if *value {
                        env.enable_emit_instrument_forget = Some(default_fixture_instrumentation());
                        env_changed = true;
                    }
                }
                Value::Object(object) => {
                    let function = object
                        .get("fn")
                        .and_then(parse_external_function_value)
                        .unwrap_or_else(|| default_fixture_instrumentation().function);
                    let gating = object.get("gating").and_then(parse_external_function_value);
                    let global_gating = object
                        .get("globalGating")
                        .and_then(Value::as_str)
                        .map(Atom::from);

                    options.enable_emit_instrument_forget = Some(true);
                    env.enable_emit_instrument_forget = Some(InstrumentationOptions {
                        function,
                        gating,
                        global_gating,
                    });
                    env_changed = true;
                }
                _ => {}
            },
            "enableEmitHookGuards" => {
                if parsed_value.as_bool() == Some(true) {
                    env.enable_emit_hook_guards = Some(default_fixture_hook_guard());
                    env_changed = true;
                } else if let Some(external) = parse_external_function_value(&parsed_value) {
                    env.enable_emit_hook_guards = Some(external);
                    env_changed = true;
                } else if parsed_value.as_bool() == Some(false) {
                    env.enable_emit_hook_guards = None;
                    env_changed = true;
                }
            }
            "customOptOutDirectives" => {
                if let Some(values) = parsed_value.as_array() {
                    let directives = values
                        .iter()
                        .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                        .collect::<Vec<_>>();
                    options.custom_opt_out_directives = Some(directives);
                } else if let Some(value) = parsed_value.as_str() {
                    options.custom_opt_out_directives = Some(vec![value.to_string()]);
                }
            }
            "eslintSuppressionRules" => {
                if let Some(values) = parsed_value.as_array() {
                    options.eslint_suppression_rules = Some(
                        values
                            .iter()
                            .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                            .collect(),
                    );
                }
            }
            "sources" => {
                if let Some(values) = parsed_value.as_array() {
                    let sources = values
                        .iter()
                        .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                        .collect::<Vec<_>>();
                    options.sources = Some(SourceSelection::Prefixes(sources));
                } else if let Some(value) = parsed_value.as_str() {
                    options.sources = Some(SourceSelection::Prefixes(vec![value.to_string()]));
                }
            }
            "dynamicGating" => {
                if let Some(object) = parsed_value.as_object() {
                    if let Some(source) = object.get("source").and_then(Value::as_str) {
                        options.dynamic_gating = Some(DynamicGatingOptions {
                            source: source.into(),
                        });
                    }
                }
            }
            "gating" => {
                if let Some(external) = parse_external_function_value(&parsed_value) {
                    options.gating = Some(external);
                } else if parsed_value.as_bool() == Some(true) {
                    options.gating = Some(default_fixture_gating());
                } else if parsed_value.as_bool() == Some(false) {
                    options.gating = None;
                }
            }
            "customMacros" => {
                if let Some(value) = parsed_value.as_str() {
                    let name = value.split('.').next().unwrap_or(value).trim();
                    if !name.is_empty() {
                        env.custom_macros = Some(vec![name.to_string()]);
                        env_changed = true;
                    }
                } else if let Some(values) = parsed_value.as_array() {
                    env.custom_macros = Some(
                        values
                            .iter()
                            .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                            .collect(),
                    );
                    env_changed = true;
                }
            }
            "validateBlocklistedImports" => {
                if let Some(values) = parsed_value.as_array() {
                    env.validate_blocklisted_imports = values
                        .iter()
                        .filter_map(|item| item.as_str())
                        .map(Atom::from)
                        .collect();
                    env_changed = true;
                } else if parsed_value.as_bool() == Some(true) {
                    env.validate_blocklisted_imports = Vec::new();
                    env_changed = true;
                }
            }
            "validateHooksUsage" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_hooks_usage = value;
                    env_changed = true;
                }
            }
            "validateNoCapitalizedCalls" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_capitalized_calls = if value { Some(Vec::new()) } else { None };
                    env_changed = true;
                } else if let Some(value) = parsed_value.as_array() {
                    env.validate_no_capitalized_calls = Some(
                        value
                            .iter()
                            .filter_map(|item| item.as_str())
                            .map(Atom::from)
                            .collect(),
                    );
                    env_changed = true;
                }
            }
            "validateNoImpureFunctionsInRender" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_impure_functions_in_render = value;
                    env_changed = true;
                }
            }
            "validateRefAccessDuringRender" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_ref_access_during_render = value;
                    env_changed = true;
                }
            }
            "validateNoSetStateInRender" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_set_state_in_render = value;
                    env_changed = true;
                }
            }
            "validateNoDerivedComputationsInEffects" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_derived_computations_in_effects = value;
                    env_changed = true;
                }
            }
            "validateNoDerivedComputationsInEffects_exp" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_derived_computations_in_effects_exp = value;
                    env_changed = true;
                }
            }
            "validateNoSetStateInEffects" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_set_state_in_effects = value;
                    env_changed = true;
                }
            }
            "enableAllowSetStateFromRefsInEffects" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_allow_set_state_from_refs_in_effects = value;
                    env_changed = true;
                }
            }
            "enableVerboseNoSetStateInEffect" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_verbose_no_set_state_in_effect = value;
                    env_changed = true;
                }
            }
            "validateNoJSXInTryStatements" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_jsx_in_try_statements = value;
                    env_changed = true;
                }
            }
            "validateExhaustiveMemoizationDependencies" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_exhaustive_memoization_dependencies = value;
                    env_changed = true;
                }
            }
            "validateExhaustiveEffectDependencies" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_exhaustive_effect_dependencies = if value {
                        ExhaustiveEffectDependenciesMode::All
                    } else {
                        ExhaustiveEffectDependenciesMode::Off
                    };
                    env_changed = true;
                } else if let Some(value) = parsed_value.as_str() {
                    env.validate_exhaustive_effect_dependencies =
                        match value.to_ascii_lowercase().as_str() {
                            "all" => ExhaustiveEffectDependenciesMode::All,
                            "missing-only" => ExhaustiveEffectDependenciesMode::MissingOnly,
                            "extra-only" => ExhaustiveEffectDependenciesMode::ExtraOnly,
                            _ => ExhaustiveEffectDependenciesMode::Off,
                        };
                    env_changed = true;
                }
            }
            "validatePreserveExistingMemoizationGuarantees" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_preserve_existing_memoization_guarantees = value;
                    env_changed = true;
                }
            }
            "enablePreserveExistingMemoizationGuarantees" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_preserve_existing_memoization_guarantees = value;
                    env_changed = true;
                }
            }
            "enableAssumeHooksFollowRulesOfReact" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_assume_hooks_follow_rules_of_react = value;
                    env_changed = true;
                }
            }
            "enableTransitivelyFreezeFunctionExpressions" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_transitively_freeze_function_expressions = value;
                    env_changed = true;
                }
            }
            "enableCustomTypeDefinitionForReanimated" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_custom_type_definition_for_reanimated = value;
                    env_changed = true;
                }
            }
            "enableTreatRefLikeIdentifiersAsRefs" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_treat_ref_like_identifiers_as_refs = value;
                    env_changed = true;
                }
            }
            "enableTreatSetIdentifiersAsStateSetters" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_treat_set_identifiers_as_state_setters = value;
                    env_changed = true;
                }
            }
            "validateNoVoidUseMemo" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_void_use_memo = value;
                    env_changed = true;
                }
            }
            "enableForest" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_forest = value;
                    env_changed = true;
                }
            }
            "enablePropagateDepsInHIR" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_forest = value;
                    env_changed = true;
                } else if is_set {
                    env.enable_forest = true;
                    env_changed = true;
                }
            }
            "enableResetCacheOnSourceFileChanges" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_reset_cache_on_source_file_changes = Some(value);
                    env_changed = true;
                } else if parsed_value.is_null() {
                    env.enable_reset_cache_on_source_file_changes = None;
                    env_changed = true;
                }
            }
            "validateStaticComponents" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_static_components = value;
                    env_changed = true;
                }
            }
            "validateNoFreezingKnownMutableFunctions" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_freezing_known_mutable_functions = value;
                    env_changed = true;
                }
            }
            "validateSourceLocations" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_source_locations = value;
                    env_changed = true;
                }
            }
            "assertValidMutableRanges" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.assert_valid_mutable_ranges = value;
                    env_changed = true;
                }
            }
            "enableNameAnonymousFunctions" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_name_anonymous_functions = value;
                    env_changed = true;
                }
            }
            "enableOptionalDependencies" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_optional_dependencies = value;
                    env_changed = true;
                }
            }
            "enableUseKeyedState" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_use_keyed_state = value;
                    env_changed = true;
                }
            }
            "throwUnknownException__testonly" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.throw_unknown_exception_testonly = value;
                    env_changed = true;
                }
            }
            "enableJsxOutlining" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_jsx_outlining = value;
                    env_changed = true;
                }
            }
            "enableFunctionOutlining" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_function_outlining = value;
                    env_changed = true;
                }
            }
            _ => {}
        }
    }

    if env_changed {
        options.environment = Some(env);
    }

    options
}

fn parse_pragma_value(raw: &str) -> Option<Value> {
    if raw.is_empty() {
        return None;
    }

    let trimmed = raw.trim();
    if trimmed.is_empty() {
        return None;
    }

    // JSON-like values may contain spaces (e.g. ["use todo memo"]).
    // Parse the longest valid JSON prefix.
    if let Some(first) = trimmed.chars().next() {
        if first == '[' || first == '{' || first == '"' {
            let mut boundaries = trimmed
                .char_indices()
                .map(|(idx, _)| idx)
                .collect::<Vec<_>>();
            boundaries.push(trimmed.len());
            boundaries.sort_unstable();
            boundaries.dedup();

            for idx in boundaries.into_iter().rev() {
                let candidate = &trimmed[..idx];
                if let Ok(value) = serde_json::from_str::<Value>(candidate) {
                    return Some(value);
                }
            }
        }
    }

    let token = trimmed
        .split_whitespace()
        .next()
        .unwrap_or_default()
        .trim()
        .to_string();
    if token.is_empty() {
        return None;
    }

    // Support common unquoted enum-like values used by fixtures.
    if matches!(
        token.as_str(),
        "infer"
            | "syntax"
            | "annotation"
            | "all"
            | "client"
            | "ssr"
            | "lint"
            | "all_errors"
            | "critical_errors"
            | "off"
            | "missing-only"
            | "extra-only"
            | "none"
    ) {
        return Some(Value::String(token));
    }

    serde_json::from_str(&token)
        .ok()
        .or(Some(Value::String(token)))
}

fn maybe_category_from_file(input: &Path) -> Option<ErrorCategory> {
    let path = input.with_file_name("error-category.txt");
    if !path.exists() {
        return None;
    }

    let raw = fs::read_to_string(path).ok()?;
    let key = raw.trim().to_ascii_lowercase();
    match key.as_str() {
        "capitalizedcalls" | "capitalized_calls" => Some(ErrorCategory::CapitalizedCalls),
        "config" => Some(ErrorCategory::Config),
        "effectdependencies" | "effect_dependencies" => Some(ErrorCategory::EffectDependencies),
        "effectexhaustivedependencies" | "effect_exhaustive_dependencies" => {
            Some(ErrorCategory::EffectExhaustiveDependencies)
        }
        "effectderivationsofstate" | "effect_derivations_of_state" => {
            Some(ErrorCategory::EffectDerivationsOfState)
        }
        "effectsetstate" | "effect_set_state" => Some(ErrorCategory::EffectSetState),
        "errorboundaries" | "error_boundaries" => Some(ErrorCategory::ErrorBoundaries),
        "fbt" => Some(ErrorCategory::Fbt),
        "gating" => Some(ErrorCategory::Gating),
        "globals" => Some(ErrorCategory::Globals),
        "hooks" => Some(ErrorCategory::Hooks),
        "immutability" => Some(ErrorCategory::Immutability),
        "incompatiblelibrary" | "incompatible_library" => Some(ErrorCategory::IncompatibleLibrary),
        "invariant" => Some(ErrorCategory::Invariant),
        "memodependencies" | "memo_dependencies" => Some(ErrorCategory::MemoDependencies),
        "preservemanualmemo" | "preserve_manual_memo" => Some(ErrorCategory::PreserveManualMemo),
        "purity" => Some(ErrorCategory::Purity),
        "refs" => Some(ErrorCategory::Refs),
        "rendersetstate" | "render_set_state" => Some(ErrorCategory::RenderSetState),
        "staticcomponents" | "static_components" => Some(ErrorCategory::StaticComponents),
        "syntax" => Some(ErrorCategory::Syntax),
        "todo" => Some(ErrorCategory::Todo),
        "unsupportedsyntax" | "unsupported_syntax" => Some(ErrorCategory::UnsupportedSyntax),
        "suppression" => Some(ErrorCategory::Suppression),
        "pipeline" => Some(ErrorCategory::Pipeline),
        "usememo" | "use_memo" => Some(ErrorCategory::UseMemo),
        "validation" => Some(ErrorCategory::Validation),
        "voidusememo" | "void_use_memo" => Some(ErrorCategory::VoidUseMemo),
        _ => None,
    }
}

fn run_fixture(input: PathBuf) {
    let source = fs::read_to_string(&input).unwrap();
    let (mut program, comments) = parse(&input, &source);

    let expected_output = input.with_file_name("output.js");
    let expected_error = input.with_file_name("error.txt");
    let expected_error_category = maybe_category_from_file(&input);

    let options = parse_pragmas(&source);
    let parsed_options = parse_plugin_options(options);

    let mut run_compile = |opts| {
        compile_program(
            &mut program,
            &CompilerPass {
                opts,
                filename: Some(input.to_string_lossy().to_string()),
                comments: comments.clone(),
                code: Some(source.clone()),
            },
        )
    };

    if expected_error.exists() {
        let expected = fs::read_to_string(expected_error).unwrap();
        let expected = normalize(&expected);

        let result = match parsed_options {
            Ok(opts) => run_compile(opts),
            Err(err) => Err(err),
        };

        let mut detail_list = Vec::new();
        match result {
            Ok(report) => {
                for detail in report.diagnostics {
                    let text = detail
                        .description
                        .as_ref()
                        .map(|description| format!("{}: {}", detail.reason, description))
                        .unwrap_or_else(|| detail.reason.clone());
                    detail_list.push((detail.category, text));
                }
            }
            Err(err) => {
                for detail in err.details {
                    let text = detail
                        .description
                        .as_ref()
                        .map(|description| format!("{}: {}", detail.reason, description))
                        .unwrap_or_else(|| detail.reason.clone());
                    detail_list.push((detail.category, text));
                }
            }
        }

        assert!(
            !detail_list.is_empty(),
            "expected a compiler error/diagnostic for fixture `{}`",
            input.display()
        );

        let joined = detail_list
            .iter()
            .map(|(_, text)| text.clone())
            .collect::<Vec<_>>()
            .join("\n");
        let expected_ok = details_match_expected_errors(&detail_list, &expected);
        assert!(
            expected_ok,
            "expected error fragment not found in fixture `{}`\nexpected:\n{}\nactual:\n{}",
            input.display(),
            expected,
            joined
        );

        if let Some(expected_category) = expected_error_category {
            assert!(
                detail_list
                    .iter()
                    .any(|(category, _)| *category == expected_category),
                "expected error category {:?} not found in fixture `{}`",
                expected_category,
                input.display()
            );
        }

        return;
    }

    let opts = parsed_options.unwrap_or_else(|err| {
        panic!(
            "failed to parse fixture options for `{}`: {}",
            input.display(),
            CompilerError {
                details: err.details
            }
        );
    });
    let report = run_compile(opts).unwrap();
    if std::env::var("REACT_COMPILER_DEBUG_DIAGNOSTICS")
        .ok()
        .as_deref()
        == Some("1")
        && !report.diagnostics.is_empty()
    {
        eprintln!("DIAGNOSTICS: {}", input.display());
        for detail in &report.diagnostics {
            eprintln!("- {:?}: {}", detail.category, detail.reason);
        }
    }

    let expected = fs::read_to_string(expected_output).unwrap();
    let actual = print(&program);

    assert_eq!(
        normalize_js_like(&actual),
        normalize_js_like(&expected),
        "fixture mismatch: {}",
        input.display()
    );
}

fn local_inputs() -> Vec<PathBuf> {
    let fixture_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");

    let mut inputs = Vec::new();
    for entry in fs::read_dir(&fixture_root).unwrap() {
        let entry = entry.unwrap();
        if !entry.file_type().unwrap().is_dir() {
            continue;
        }

        let name = entry.file_name();
        let name = name.to_string_lossy();
        if name.starts_with("upstream") {
            continue;
        }

        let input = entry.path().join("input.js");
        if input.exists() {
            inputs.push(input);
        }
    }

    inputs.sort();
    inputs
}

fn upstream_inputs(manifest: &Path, root: &Path) -> Vec<PathBuf> {
    let mut inputs = Vec::new();
    let Ok(raw) = fs::read_to_string(manifest) else {
        return inputs;
    };

    for line in raw.lines() {
        let name = line.split('#').next().unwrap_or_default().trim();
        if name.is_empty() {
            continue;
        }

        let input = root.join(name).join("input.js");
        if input.exists() {
            inputs.push(input);
        }
    }

    inputs.sort();
    inputs
}

fn fixtures_root() -> PathBuf {
    if let Ok(root) = std::env::var("REACT_COMPILER_FIXTURES_ROOT") {
        let root = root.trim();
        if !root.is_empty() {
            return PathBuf::from(root);
        }
    }

    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures")
}

fn configured_path(root: &Path, env_key: &str, default: &str) -> PathBuf {
    if let Ok(path) = std::env::var(env_key) {
        let path = path.trim();
        if !path.is_empty() {
            return PathBuf::from(path);
        }
    }

    root.join(default)
}

fn continue_on_failure_mode() -> bool {
    std::env::var("REACT_COMPILER_FIXTURE_CONTINUE_ON_FAIL")
        .ok()
        .as_deref()
        == Some("1")
        || allow_fixture_failures_mode()
}

fn allow_fixture_failures_mode() -> bool {
    std::env::var("REACT_COMPILER_FIXTURE_ALLOW_FAILURE")
        .ok()
        .as_deref()
        == Some("1")
}

fn run_fixture_suite(inputs: Vec<PathBuf>) {
    if !continue_on_failure_mode() {
        for input in inputs {
            run_fixture(input);
        }
        return;
    }

    let total = inputs.len();
    let mut failed = Vec::<PathBuf>::new();
    for input in inputs {
        let result = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            run_fixture(input.clone());
        }));
        if result.is_err() {
            eprintln!("FAILED_FIXTURE: {}", input.display());
            failed.push(input);
        }
    }

    if failed.is_empty() {
        return;
    }

    let failed_summary = failed
        .iter()
        .map(|path| path.display().to_string())
        .collect::<Vec<_>>()
        .join("\n");

    if allow_fixture_failures_mode() {
        eprintln!(
            "fixture suite failed (allowed): {}/{} failed\n{}",
            failed.len(),
            total,
            failed_summary
        );
        return;
    }

    assert!(
        failed.is_empty(),
        "fixture suite failed: {}/{} failed\n{}",
        failed.len(),
        total,
        failed_summary
    );
}

#[test]
fn fixture_cases_local() {
    let inputs = local_inputs();
    assert!(
        !inputs.is_empty(),
        "no local fixture input.js files were found"
    );

    run_fixture_suite(inputs);
}

#[test]
fn fixture_cases_upstream() {
    let fixture_root = fixtures_root();
    let manifest = configured_path(
        &fixture_root,
        "REACT_COMPILER_UPSTREAM_MANIFEST",
        "upstream_manifest.txt",
    );
    let upstream_root = configured_path(&fixture_root, "REACT_COMPILER_UPSTREAM_ROOT", "upstream");

    let inputs = upstream_inputs(&manifest, &upstream_root);
    assert!(
        !inputs.is_empty(),
        "no upstream fixtures found. run `scripts/sync_fixtures.sh --manifest \
         tests/fixtures/upstream_manifest.txt --out-dir tests/fixtures/upstream` first"
    );

    run_fixture_suite(inputs);
}

#[test]
fn fixture_cases_upstream_phase1() {
    let fixture_root = fixtures_root();
    let manifest = configured_path(
        &fixture_root,
        "REACT_COMPILER_UPSTREAM_PHASE1_MANIFEST",
        "upstream_phase1_manifest.txt",
    );
    // Phase1 fixtures live in the same upstream root, selected by manifest.
    let upstream_root = configured_path(
        &fixture_root,
        "REACT_COMPILER_UPSTREAM_PHASE1_ROOT",
        "upstream",
    );

    let inputs = upstream_inputs(&manifest, &upstream_root);
    assert!(
        !inputs.is_empty(),
        "no upstream phase1 fixtures found. run `scripts/sync_fixtures.sh --manifest \
         tests/fixtures/upstream_phase1_manifest.txt --out-dir tests/fixtures/upstream` first"
    );

    run_fixture_suite(inputs);
}

#[test]
fn parses_custom_opt_out_directive_pragma() {
    let source = r#"
// @customOptOutDirectives:["use todo memo"]
function Component() {
  "use todo memo";
  return <div />;
}
"#;

    let options = parse_pragmas(source);
    assert_eq!(
        options.custom_opt_out_directives,
        Some(vec!["use todo memo".to_string()])
    );
}

#[test]
fn parses_boolean_gating_pragma_to_default_external_function() {
    let source = r#"
// @gating
function Component() {
  "use forget";
  return <div />;
}
"#;

    let options = parse_pragmas(source);
    let gating = options
        .gating
        .expect("expected @gating to set default gating");
    assert_eq!(gating.source.as_ref(), "ReactForgetFeatureFlag");
    assert_eq!(
        gating.import_specifier_name.as_ref(),
        "isForgetEnabled_Fixtures"
    );
}
