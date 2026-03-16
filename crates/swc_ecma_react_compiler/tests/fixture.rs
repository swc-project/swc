use std::{
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
    ExhaustiveEffectDependenciesMode, ExternalFunction, PanicThresholdOptions, PluginOptions,
    SourceSelection,
};
use swc_ecma_visit::{VisitMut, VisitMutWith};

fn strict_upstream_mode() -> bool {
    true
}

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

fn parse(input: &Path, source: &str) -> (Program, Vec<Comment>) {
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
        return (Program::Module(program), flatten_comments(&ts_comments));
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
        let normalized = normalize_flow_component_syntax(source);
        if normalized != source {
            let (parsed_ts_normalized, ts_comments_normalized) = parse_with_source(
                &normalized,
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    decorators: true,
                    ..Default::default()
                }),
            );
            if let Ok(program) = parsed_ts_normalized {
                return (
                    Program::Module(program),
                    flatten_comments(&ts_comments_normalized),
                );
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
                return (
                    Program::Module(program),
                    flatten_comments(&es_comments_normalized),
                );
            }
        }
    }

    let program = parsed_es.unwrap_or_else(|err| {
        let allow_upstream_oracle = std::env::var("RUN_UPSTREAM_FIXTURES").ok().as_deref()
            == Some("1")
            && !strict_upstream_mode();
        if allow_upstream_oracle {
            return swc_ecma_ast::Module::default();
        }

        panic!("failed to parse fixture `{}`: {err:?}", input.display());
    });

    (Program::Module(program), flatten_comments(&es_comments))
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
    let (mut program, _) = parse(&virtual_path, value);
    strip_literal_raws(&mut program);
    normalize(&print(&program))
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

fn parse_pragmas(source: &str) -> PluginOptions {
    let mut options = PluginOptions::default();
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

        let (key, raw_value) = match entry.find(':') {
            Some(index) => (
                entry[..index].trim(),
                Some(entry[index + 1..].trim().to_string()),
            ),
            None => {
                let key = entry.split_whitespace().next().unwrap_or_default().trim();
                (key, None)
            }
        };

        if key.is_empty() {
            continue;
        }

        let parsed_value = raw_value
            .as_deref()
            .and_then(parse_pragma_value)
            .unwrap_or(Value::Bool(true));

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
            "flowSuppressions" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.flow_suppressions = Some(value);
                }
            }
            "enableReanimatedCheck" => {
                if let Some(value) = parsed_value.as_bool() {
                    options.enable_reanimated_check = Some(value);
                }
            }
            "customOptOutDirectives" => {
                if let Some(values) = parsed_value.as_array() {
                    let directives = values
                        .iter()
                        .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                        .collect::<Vec<_>>();
                    options.custom_opt_out_directives = Some(directives);
                }
            }
            "sources" => {
                if let Some(values) = parsed_value.as_array() {
                    let sources = values
                        .iter()
                        .filter_map(|item| item.as_str().map(ToOwned::to_owned))
                        .collect::<Vec<_>>();
                    options.sources = Some(SourceSelection::Prefixes(sources));
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
                if let Some(object) = parsed_value.as_object() {
                    let source = object.get("source").and_then(Value::as_str);
                    let import_specifier_name =
                        object.get("importSpecifierName").and_then(Value::as_str);
                    if let (Some(source), Some(import_specifier_name)) =
                        (source, import_specifier_name)
                    {
                        options.gating = Some(ExternalFunction {
                            source: source.into(),
                            import_specifier_name: import_specifier_name.into(),
                        });
                    }
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
            "validateNoSetStateInEffects" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_no_set_state_in_effects = value;
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
            "validateStaticComponents" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_static_components = value;
                    env_changed = true;
                }
            }
            "validateSourceLocations" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.validate_source_locations = value;
                    env_changed = true;
                }
            }
            "enableNameAnonymousFunctions" => {
                if let Some(value) = parsed_value.as_bool() {
                    env.enable_name_anonymous_functions = value;
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
    let allow_upstream_oracle = std::env::var("RUN_UPSTREAM_FIXTURES").ok().as_deref() == Some("1")
        && input
            .components()
            .any(|part| part.as_os_str() == "upstream")
        && !strict_upstream_mode();
    let (mut program, comments) =
        match std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| parse(&input, &source))) {
            Ok(value) => value,
            Err(payload) => {
                if allow_upstream_oracle {
                    return;
                }
                std::panic::resume_unwind(payload);
            }
        };

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
            allow_upstream_oracle || !detail_list.is_empty(),
            "expected a compiler error/diagnostic for fixture `{}`",
            input.display()
        );
        if allow_upstream_oracle && detail_list.is_empty() {
            return;
        }

        let joined = detail_list
            .iter()
            .map(|(_, text)| text.clone())
            .collect::<Vec<_>>()
            .join("\n");
        if allow_upstream_oracle {
            let expected_ok = normalize(&joined).contains(&expected);
            let category_ok = expected_error_category.map_or(true, |expected_category| {
                detail_list
                    .iter()
                    .any(|(category, _)| *category == expected_category)
            });
            if !expected_ok || !category_ok {
                return;
            }
        }
        assert!(
            normalize(&joined).contains(&expected),
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
    let compiled = run_compile(opts);
    if allow_upstream_oracle && compiled.is_err() {
        return;
    }
    compiled.unwrap();

    let expected = fs::read_to_string(expected_output).unwrap();
    let actual = print(&program);
    if allow_upstream_oracle {
        let normalized = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            (normalize_js_like(&actual), normalize_js_like(&expected))
        }));
        match normalized {
            Ok((normalized_actual, normalized_expected)) => {
                if normalized_actual != normalized_expected {
                    return;
                }
            }
            Err(_) => return,
        }
    }

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

#[test]
fn fixture_cases_local() {
    let inputs = local_inputs();
    assert!(
        !inputs.is_empty(),
        "no local fixture input.js files were found"
    );

    for input in inputs {
        run_fixture(input);
    }
}

#[test]
fn fixture_cases_upstream() {
    if std::env::var("RUN_UPSTREAM_FIXTURES").ok().as_deref() != Some("1") {
        return;
    }

    let fixture_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");
    let manifest = fixture_root.join("upstream_manifest.txt");
    let upstream_root = fixture_root.join("upstream");

    let inputs = upstream_inputs(&manifest, &upstream_root);
    assert!(
        !inputs.is_empty(),
        "no upstream fixtures found. run `scripts/sync_fixtures.sh --manifest \
         tests/fixtures/upstream_manifest.txt --out-dir tests/fixtures/upstream` first"
    );

    for input in inputs {
        run_fixture(input);
    }
}

#[test]
fn fixture_cases_upstream_phase1() {
    if std::env::var("RUN_UPSTREAM_FIXTURES_PHASE1")
        .ok()
        .as_deref()
        != Some("1")
    {
        return;
    }

    let fixture_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("fixtures");
    let manifest = fixture_root.join("upstream_phase1_manifest.txt");
    let upstream_root = fixture_root.join("upstream_phase1");

    let inputs = upstream_inputs(&manifest, &upstream_root);
    assert!(
        !inputs.is_empty(),
        "no upstream phase1 fixtures found. run `scripts/sync_fixtures.sh --manifest \
         tests/fixtures/upstream_phase1_manifest.txt --out-dir tests/fixtures/upstream_phase1` \
         first"
    );

    for input in inputs {
        run_fixture(input);
    }
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
