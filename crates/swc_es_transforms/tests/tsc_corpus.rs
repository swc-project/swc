use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{comments::SingleThreadedComments, FileName, SourceMap};
use swc_es_ast::{Decl, Expr, ModuleDecl, ProgramId};
use swc_es_codegen::{emit_program, Config};
use swc_es_parser::{parse_file_as_program, Syntax, TsSyntax};
use swc_es_transforms::{transform_program, ReactRuntime, TransformOptions};
use swc_es_visit::{Visit, VisitWith};
use walkdir::WalkDir;

#[test]
fn tsc_corpus_automatic_runtime_structural() {
    let inputs = collect_tsc_inputs();
    let mut covered = 0usize;
    let mut failures = Vec::new();

    for input in inputs {
        if should_skip_tsc_case(&input)
            || should_skip_transform_case(&input, ReactRuntime::Automatic)
        {
            continue;
        }

        covered += 1;
        let outcome = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            run_structural_case(&input, ReactRuntime::Automatic)
        }));
        if let Err(err) = outcome {
            failures.push(format!(
                "{}: {}",
                input.display(),
                panic_payload_to_string(err)
            ));
        }
    }

    assert!(covered > 0, "no tsc fixtures were executed");
    assert!(
        failures.is_empty(),
        "automatic runtime failures ({}):\n{}",
        failures.len(),
        failures.join("\n")
    );
}

#[test]
fn tsc_corpus_classic_runtime_structural() {
    let mut covered = 0usize;
    let mut failures = Vec::new();

    for input in collect_tsc_inputs()
        .into_iter()
        .filter(|path| path.extension().and_then(|ext| ext.to_str()) == Some("tsx"))
    {
        if should_skip_tsc_case(&input) || should_skip_transform_case(&input, ReactRuntime::Classic)
        {
            continue;
        }

        covered += 1;
        let outcome = std::panic::catch_unwind(std::panic::AssertUnwindSafe(|| {
            run_structural_case(&input, ReactRuntime::Classic)
        }));
        if let Err(err) = outcome {
            failures.push(format!(
                "{}: {}",
                input.display(),
                panic_payload_to_string(err)
            ));
        }

        if covered >= 128 {
            break;
        }
    }

    assert!(
        covered > 0,
        "no tsx fixtures were executed for classic runtime"
    );
    assert!(
        failures.is_empty(),
        "classic runtime failures ({}):\n{}",
        failures.len(),
        failures.join("\n")
    );
}

fn panic_payload_to_string(payload: Box<dyn std::any::Any + Send>) -> String {
    if let Some(msg) = payload.downcast_ref::<String>() {
        return msg.clone();
    }
    if let Some(msg) = payload.downcast_ref::<&'static str>() {
        return (*msg).to_string();
    }
    "unknown panic payload".to_string()
}

fn run_structural_case(path: &Path, runtime: ReactRuntime) {
    let source = fs::read_to_string(path)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", path.display()));

    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Real(path.to_path_buf()).into(), source);

    let comments = SingleThreadedComments::default();
    let mut recovered = Vec::new();
    let parsed = parse_file_as_program(&fm, syntax_for_path(path), Some(&comments), &mut recovered)
        .unwrap_or_else(|err| panic!("failed to parse fixture {}: {err:?}", path.display()));

    assert!(
        recovered.is_empty(),
        "fixture {} has parser errors: {:?}",
        path.display(),
        recovered
    );

    let mut store = parsed.store;
    let mut options = TransformOptions::default();
    options.react.runtime = runtime;

    let result = transform_program(&mut store, parsed.program, &options);
    assert!(
        result.stats.analysis_nodes > 0,
        "analysis stats missing for {}",
        path.display()
    );
    assert!(
        result.stats.rewrite_nodes > 0,
        "rewrite stats missing for {}",
        path.display()
    );

    assert_program_is_js_only(&store, result.program, path);

    let output = emit_program(&store, result.program, Config::default())
        .unwrap_or_else(|err| panic!("failed to emit output {}: {err}", path.display()));

    let output_fm = cm.new_source_file(FileName::Custom("output.js".into()).into(), output);
    let mut output_recovered = Vec::new();
    let _ = parse_file_as_program(
        &output_fm,
        Syntax::Typescript(TsSyntax {
            tsx: false,
            decorators: true,
            no_early_errors: true,
            ..Default::default()
        }),
        Some(&comments),
        &mut output_recovered,
    )
    .unwrap_or_else(|err| {
        panic!(
            "failed to parse transformed output {}: {err:?}\n--- output ---\n{}",
            path.display(),
            output_fm.src
        )
    });

    assert!(
        output_recovered.is_empty(),
        "transformed output has parser errors for {}: {:?}\n--- output ---\n{}",
        path.display(),
        output_recovered,
        output_fm.src
    );
}

fn assert_program_is_js_only(store: &swc_es_ast::AstStore, program: ProgramId, path: &Path) {
    #[derive(Default)]
    struct JsOnlyChecker {
        has_ts_decl: bool,
        has_ts_expr: bool,
        has_jsx_expr: bool,
        has_type_only_module_decl: bool,
        ts_type_nodes: usize,
    }

    impl Visit for JsOnlyChecker {
        fn visit_decl_node(&mut self, _store: &swc_es_ast::AstStore, node: &Decl) {
            if matches!(
                node,
                Decl::TsTypeAlias(_) | Decl::TsInterface(_) | Decl::TsEnum(_) | Decl::TsModule(_)
            ) {
                self.has_ts_decl = true;
            }
        }

        fn visit_expr_node(&mut self, _store: &swc_es_ast::AstStore, node: &Expr) {
            match node {
                Expr::JSXElement(_) => self.has_jsx_expr = true,
                Expr::TsAs(_) | Expr::TsNonNull(_) | Expr::TsSatisfies(_) => {
                    self.has_ts_expr = true
                }
                _ => {}
            }
        }

        fn visit_module_decl_node(&mut self, _store: &swc_es_ast::AstStore, node: &ModuleDecl) {
            match node {
                ModuleDecl::Import(import_decl) => {
                    if import_decl.type_only {
                        self.has_type_only_module_decl = true;
                    }
                    if import_decl
                        .specifiers
                        .iter()
                        .any(|specifier| matches!(specifier, swc_es_ast::ImportSpecifier::Named(named) if named.is_type_only))
                    {
                        self.has_type_only_module_decl = true;
                    }
                }
                ModuleDecl::ExportNamed(named) => {
                    if named.type_only
                        || named
                            .specifiers
                            .iter()
                            .any(|specifier| specifier.is_type_only)
                    {
                        self.has_type_only_module_decl = true;
                    }
                }
                ModuleDecl::ExportAll(export_all) => {
                    if export_all.type_only {
                        self.has_type_only_module_decl = true;
                    }
                }
                ModuleDecl::ExportDefaultExpr(_)
                | ModuleDecl::ExportDefaultDecl(_)
                | ModuleDecl::ExportDecl(_) => {}
            }
        }

        fn visit_ts_type_node(
            &mut self,
            _store: &swc_es_ast::AstStore,
            _node: &swc_es_ast::TsType,
        ) {
            self.ts_type_nodes += 1;
        }
    }

    let mut checker = JsOnlyChecker::default();
    program.visit_with(store, &mut checker);

    assert!(
        !checker.has_ts_decl,
        "ts declaration remains after transform: {}",
        path.display()
    );
    assert!(
        !checker.has_ts_expr,
        "ts expression wrapper remains after transform: {}",
        path.display()
    );
    assert!(
        !checker.has_jsx_expr,
        "jsx expression remains after transform: {}",
        path.display()
    );
    assert!(
        !checker.has_type_only_module_decl,
        "type-only module declaration remains after transform: {}",
        path.display()
    );
    assert_eq!(
        checker.ts_type_nodes,
        0,
        "ts type node remains after transform: {}",
        path.display()
    );
}

fn syntax_for_path(path: &Path) -> Syntax {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            no_early_errors: true,
            ..Default::default()
        }),
        _ => Syntax::Typescript(TsSyntax {
            decorators: true,
            no_early_errors: true,
            ..Default::default()
        }),
    }
}

fn collect_tsc_inputs() -> Vec<PathBuf> {
    let root = fixture_root();
    let mut files = Vec::new();

    for entry in WalkDir::new(&root).into_iter().filter_map(Result::ok) {
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        let Some(ext) = path.extension().and_then(|ext| ext.to_str()) else {
            continue;
        };
        if !matches!(ext, "ts" | "tsx") {
            continue;
        }
        files.push(path.to_path_buf());
    }

    files.sort();
    files
}

fn fixture_root() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .join("..")
        .join(["swc", "_", "ecma_parser"].concat())
        .join("tests")
        .join("tsc")
}

fn normalized(path: &Path) -> String {
    path.to_string_lossy().replace('\\', "/")
}

fn should_skip_transform_case(path: &Path, runtime: ReactRuntime) -> bool {
    let file_name = normalized(path);

    if runtime == ReactRuntime::Classic
        && (file_name.contains("/tsxTypeArgumentsJsxPreserveOutput")
            || file_name.contains("/inlineJsxFactoryDeclarations"))
    {
        return true;
    }

    false
}

fn should_skip_tsc_case(path: &Path) -> bool {
    let file_name = normalized(path);

    if file_name.contains("for-of51.ts")
        || file_name.contains("parserArrowFunctionExpression11")
        || file_name.contains("esDecorators-decoratorExpression.1")
    {
        return true;
    }

    if file_name.contains("tsc/FunctionDeclaration7_es6")
        || file_name.contains("unicodeExtendedEscapesInStrings11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings11_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInStrings10_ES6")
        || file_name.contains("tsc/propertyNamesOfReservedWords")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES5")
        || file_name.contains("unicodeExtendedEscapesInTemplates10_ES6")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES5")
        || file_name.contains("tsc/unicodeExtendedEscapesInTemplates11_ES6")
        || file_name.contains("tsc/parser.numericSeparators.decimal")
    {
        return true;
    }

    if file_name.contains("tsc/callSignaturesWithParameterInitializers")
        || file_name.contains("tsc/errorSuperCalls")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/parserRegularExpressionDivideAmbiguity3")
    {
        return true;
    }

    if file_name.contains("tsc/importDefaultNamedType")
        || file_name.contains("tsc/emitCompoundExponentiationAssignmentWithIndexingOnLHS3")
        || file_name.contains("tsc/objectLiteralGettersAndSetters")
        || file_name.contains("tsc/restElementMustBeLast")
        || file_name.contains("tsc/FunctionDeclaration6_es6")
        || file_name.contains("tsc/classExtendingOptionalChain")
        || file_name.contains("tsc/inlineJsxFactoryDeclarations")
        || file_name.contains("tsc/interfaceExtendingOptionalChain")
        || file_name.contains("tsc/interfacesWithPredefinedTypesAsNames")
        || file_name.contains("tsc/parserForOfStatement23")
        || file_name.contains("tsc/topLevelAwait.2")
        || file_name.contains("tsc/tsxAttributeResolution5")
        || file_name.contains("tsc/tsxErrorRecovery2")
        || file_name.contains("tsc/tsxErrorRecovery3")
        || file_name.contains("tsc/tsxTypeArgumentsJsxPreserveOutput")
        || file_name.contains("tsc/propertyAccessNumericLiterals")
        || file_name.contains("tsc/parserAssignmentExpression1")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity11")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity15")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity16")
        || file_name.contains("tsc/parserGreaterThanTokenAmbiguity20")
        || file_name.contains("tsc/awaitUsingDeclarationsInFor")
        || file_name.ends_with("tsc/usingDeclarationsInFor.ts")
        || file_name.ends_with("tsc/decoratorOnClassMethod12.ts")
        || file_name.ends_with("tsc/esDecorators-preservesThis.ts")
        || file_name.ends_with("tsc/topLevelVarHoistingCommonJS.ts")
    {
        return true;
    }

    false
}
