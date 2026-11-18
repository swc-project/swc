#![cfg(feature = "flow")]

use std::{
    collections::{BTreeMap, BTreeSet},
    fs::{self, File},
    io::Read,
    path::{Path, PathBuf},
};

use serde::Deserialize;
use swc::{
    config::{Config, IsModule, JscConfig, Options, TransformConfig},
    Compiler,
};
use swc_common::{errors::Handler, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{parse_file_as_program, EsSyntax, FlowSyntax, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms::react::{Options as ReactOptions, Runtime as ReactRuntime};
use testing::Tester;

pub(crate) fn compile_and_reparse_flow_file(
    compiler: &Compiler,
    cm: Lrc<SourceMap>,
    handler: &Handler,
    path: &Path,
    label: &str,
    flow_syntax: FlowSyntax,
) -> Result<(), ()> {
    let fm = cm
        .load_file(path)
        .unwrap_or_else(|err| panic!("failed to load {}: {err}", path.display()));

    let output = match compiler.process_js_file(fm, handler, &flow_strip_options(flow_syntax)) {
        Ok(v) => v,
        Err(err) => panic!("failed to compile {label}: {err:?}"),
    };

    if handler.has_errors() {
        return Err(());
    }

    assert!(
        !output.code.contains("__flow_"),
        "flow synthetic symbols leaked in emitted output for {label}",
    );

    let output_fm = cm.new_source_file(FileName::Anon.into(), output.code);
    let mut recovered_errors = Vec::new();
    let reparse_result = parse_file_as_program(
        &output_fm,
        Syntax::Es(es_reparse_syntax(flow_syntax.jsx)),
        EsVersion::latest(),
        None,
        &mut recovered_errors,
    );

    if let Err(err) = reparse_result {
        err.into_diagnostic(handler).emit();
        for recovered in recovered_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    if !recovered_errors.is_empty() {
        for recovered in recovered_errors {
            recovered.into_diagnostic(handler).emit();
        }
        return Err(());
    }

    Ok(())
}

pub(crate) fn es_reparse_syntax(jsx: bool) -> EsSyntax {
    EsSyntax {
        jsx,
        decorators: true,
        decorators_before_export: true,
        export_default_from: true,
        import_attributes: true,
        allow_super_outside_method: true,
        auto_accessors: true,
        explicit_resource_management: true,
        ..Default::default()
    }
}

fn flow_strip_options(flow_syntax: FlowSyntax) -> Options {
    Options {
        swcrc: false,
        config: Config {
            is_module: Some(IsModule::Unknown),
            jsc: JscConfig {
                syntax: Some(Syntax::Flow(flow_syntax)),
                transform: Some(TransformConfig {
                    react: ReactOptions {
                        runtime: Some(ReactRuntime::Preserve),
                        throw_if_namespace: Some(false),
                        ..Default::default()
                    },
                    ..Default::default()
                })
                .into(),
                external_helpers: true.into(),
                ..Default::default()
            },
            ..Default::default()
        },
        ..Default::default()
    }
}

#[testing::fixture("../swc_ecma_parser/tests/flow/**/*.js")]
fn flow_strip_correctness(input: PathBuf) {
    let is_jsx = input.extension().is_some_and(|ext| ext == "jsx");
    let config_path = input.parent().unwrap().join("config.json");
    let flow_syntax = load_flow_syntax(config_path, is_jsx);

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());
            let fm = cm.load_file(&input).expect("failed to load flow fixture");

            let output = match compiler.process_js_file(
                fm,
                &handler,
                &Options {
                    swcrc: false,
                    config: Config {
                        jsc: JscConfig {
                            syntax: Some(Syntax::Flow(flow_syntax)),
                            external_helpers: true.into(),
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                    ..Default::default()
                },
            ) {
                Ok(v) => v,
                Err(err) => panic!("failed to compile {}: {err:?}", input.display()),
            };

            if handler.has_errors() {
                return Err(());
            }

            assert!(
                !output.code.contains("__flow_"),
                "flow synthetic symbols leaked in emitted output for {}",
                input.display()
            );

            let output_fm = cm.new_source_file(FileName::Anon.into(), output.code);
            let mut recovered_errors = vec![];

            match parse_file_as_program(
                &output_fm,
                Syntax::Es(EsSyntax {
                    jsx: flow_syntax.jsx,
                    decorators: true,
                    decorators_before_export: true,
                    export_default_from: true,
                    import_attributes: true,
                    allow_super_outside_method: true,
                    auto_accessors: true,
                    explicit_resource_management: true,
                    ..Default::default()
                }),
                EsVersion::latest(),
                None,
                &mut recovered_errors,
            ) {
                Ok(_) => {}
                Err(err) => {
                    err.into_diagnostic(&handler).emit();

                    for recovered in recovered_errors {
                        recovered.into_diagnostic(&handler).emit();
                    }

                    return Err(());
                }
            }

            if !recovered_errors.is_empty() {
                for recovered in recovered_errors {
                    recovered.into_diagnostic(&handler).emit();
                }

                return Err(());
            }

            Ok(())
        })
        .unwrap();
}

#[test]
fn issue_12045_component_arrow_supports_react_native_mock_access() {
    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());
            let fm = cm.new_source_file(
                FileName::Custom("issue-12045.js".into()).into(),
                "const MyComponent: component(ref?: mixed, ...props: mixed) = ({ ref, ...rest }) \
                 => null;",
            );
            let output = compiler
                .process_js_file(
                    fm,
                    &handler,
                    &Options {
                        swcrc: false,
                        config: Config {
                            jsc: JscConfig {
                                syntax: Some(Syntax::Flow(FlowSyntax {
                                    components: true,
                                    ..Default::default()
                                })),
                                target: Some(EsVersion::Es2022),
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                )
                .expect("failed to compile Flow component arrow");

            assert!(
                output
                    .code
                    .contains("const MyComponent = function MyComponent("),
                "expected a named component function, got: {}",
                output.code
            );

            let runtime = format!(
                "{}\nconst RealComponent = MyComponent;\nconst constructor = \
                 RealComponent.prototype.constructor;\nconsole.log(constructor === MyComponent);",
                output.code
            );
            let stdout = exec_node_js(&runtime, JsExecOptions::default())
                .expect("React Native mock prototype access should execute");
            assert_eq!(stdout.trim(), "true");

            Ok(())
        })
        .unwrap();
}

fn load_flow_syntax(config_path: PathBuf, is_jsx: bool) -> FlowSyntax {
    let mut flow_syntax = FlowSyntax {
        jsx: is_jsx,
        ..Default::default()
    };

    let mut config = String::new();
    if File::open(config_path)
        .ok()
        .and_then(|mut file| file.read_to_string(&mut config).ok())
        .is_some()
    {
        if let Ok(mut parsed) = serde_json::from_str::<FlowSyntax>(&config) {
            parsed.jsx |= is_jsx;
            flow_syntax = parsed;
        }
    }

    flow_syntax
}

#[derive(Debug, Default, Deserialize)]
#[serde(default)]
struct HermesOptions {
    enums: Option<bool>,
    types: Option<bool>,
    esproposal_decorators: Option<bool>,
    components: Option<bool>,
    pattern_matching: Option<bool>,
}

fn hermes_fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("../swc_ecma_parser/tests/flow-hermes")
}

fn corpus_root() -> PathBuf {
    hermes_fixture_root().join("corpus")
}

fn read_expected_errors() -> BTreeMap<String, bool> {
    let path = hermes_fixture_root().join("expected-errors.txt");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut map = BTreeMap::new();
    for (idx, raw_line) in content.lines().enumerate() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }

        let (rel, value) = line.split_once('\t').unwrap_or_else(|| {
            panic!(
                "invalid expected-errors line {} in {}: {}",
                idx + 1,
                path.display(),
                line
            )
        });

        let expected = match value {
            "true" => true,
            "false" => false,
            _ => panic!(
                "invalid expected-errors boolean on line {} in {}: {}",
                idx + 1,
                path.display(),
                value
            ),
        };

        let old = map.insert(rel.to_string(), expected);
        assert!(old.is_none(), "duplicate expected-errors entry: {rel}");
    }

    map
}

fn read_known_fail_strip() -> BTreeSet<String> {
    let path = hermes_fixture_root().join("known-fail-strip.txt");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut set = BTreeSet::new();
    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }
        assert!(
            set.insert(line.to_string()),
            "duplicate strip known-fail: {line}"
        );
    }
    set
}

fn read_options_for(js_path: &Path) -> HermesOptions {
    let option_path = js_path.with_extension("options.json");
    if !option_path.exists() {
        return HermesOptions::default();
    }

    let content = fs::read_to_string(&option_path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", option_path.display()));
    serde_json::from_str(&content)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", option_path.display()))
}

fn build_flow_syntax(rel: &str, options: &HermesOptions) -> FlowSyntax {
    let enums = options
        .enums
        .unwrap_or_else(|| rel.starts_with("enums/") && rel != "enums/declare-enum-option-off.js");

    FlowSyntax {
        jsx: true,
        all: false,
        require_directive: matches!(options.types, Some(false)),
        enums,
        decorators: options.esproposal_decorators.unwrap_or(false),
        components: options
            .components
            .unwrap_or_else(|| rel.starts_with("components/") || rel.starts_with("hook_syntax/")),
        pattern_matching: options
            .pattern_matching
            .unwrap_or_else(|| rel.starts_with("match/")),
    }
}

#[test]
fn flow_strip_hermes() {
    let expected_errors = read_expected_errors();
    let strip_known_fail = read_known_fail_strip();

    let invalid_strip_known_fail = strip_known_fail
        .iter()
        .filter(|rel| expected_errors.get(*rel) != Some(&false))
        .cloned()
        .collect::<Vec<_>>();
    assert!(
        invalid_strip_known_fail.is_empty(),
        "strip known-fail entries must be expected-errors=false:\n{}",
        invalid_strip_known_fail.join("\n")
    );

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());
            let mut stale_strip_known_fail = Vec::new();

            for (rel, expected_has_error) in &expected_errors {
                if *expected_has_error {
                    continue;
                }

                let js_path = corpus_root().join(rel);
                let options = read_options_for(&js_path);
                let flow_syntax = build_flow_syntax(rel, &options);
                let result = compile_and_reparse_flow_file(
                    &compiler,
                    cm.clone(),
                    &handler,
                    &js_path,
                    rel,
                    flow_syntax,
                );
                let reparse_ok = result.is_ok();
                if strip_known_fail.contains(rel) {
                    if reparse_ok {
                        stale_strip_known_fail.push(rel.clone());
                    }
                    continue;
                }

                if result.is_err() {
                    return Err(());
                }
            }

            assert!(
                stale_strip_known_fail.is_empty(),
                "strip known-fail entries now pass and should be removed:\n{}",
                stale_strip_known_fail.join("\n")
            );

            Ok(())
        })
        .unwrap();
}

#[derive(Debug, Deserialize)]
struct ProjectMetadata {
    name: String,
    corpus: String,
    manifest: String,
    parser: ProjectParserOptions,
    counts: ProjectCounts,
}

#[derive(Debug, Deserialize)]
struct ProjectParserOptions {
    jsx: bool,
    require_directive: bool,
    enums: bool,
    decorators: bool,
    components: bool,
    pattern_matching: bool,
}

#[derive(Debug, Deserialize)]
struct ProjectCounts {
    files: usize,
}

impl ProjectParserOptions {
    fn flow_syntax(&self) -> FlowSyntax {
        FlowSyntax {
            jsx: self.jsx,
            all: false,
            require_directive: self.require_directive,
            enums: self.enums,
            decorators: self.decorators,
            components: self.components,
            pattern_matching: self.pattern_matching,
        }
    }
}

fn projects_fixture_root() -> PathBuf {
    Path::new(env!("CARGO_MANIFEST_DIR")).join("tests/flow-projects")
}

fn project_roots() -> Vec<PathBuf> {
    let mut roots = fs::read_dir(projects_fixture_root())
        .unwrap_or_else(|err| panic!("failed to read flow project fixtures: {err}"))
        .map(|entry| entry.unwrap().path())
        .filter(|path| path.is_dir())
        .collect::<Vec<_>>();
    roots.sort();
    roots
}

fn read_metadata(project_root: &Path) -> ProjectMetadata {
    let path = project_root.join("metadata.json");
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));
    serde_json::from_str(&content)
        .unwrap_or_else(|err| panic!("failed to parse {}: {err}", path.display()))
}

fn read_manifest(project_root: &Path, metadata: &ProjectMetadata) -> Vec<String> {
    let path = project_root.join(&metadata.manifest);
    let content = fs::read_to_string(&path)
        .unwrap_or_else(|err| panic!("failed to read {}: {err}", path.display()));

    let mut files = Vec::new();
    for raw_line in content.lines() {
        let line = raw_line.trim();
        if line.is_empty() {
            continue;
        }
        files.push(line.to_string());
    }

    files
}

#[test]
fn flow_strip_projects() {
    let project_roots = project_roots();
    assert!(
        !project_roots.is_empty(),
        "expected at least one flow project corpus under {}",
        projects_fixture_root().display()
    );

    Tester::new()
        .print_errors(|cm, handler| {
            let compiler = Compiler::new(cm.clone());

            for project_root in &project_roots {
                let metadata = read_metadata(project_root);
                let manifest = read_manifest(project_root, &metadata);

                assert_eq!(
                    manifest.len(),
                    metadata.counts.files,
                    "manifest count mismatch for {}",
                    metadata.name
                );

                for rel in manifest {
                    let file_path = project_root.join(&metadata.corpus).join(&rel);
                    assert!(
                        file_path.exists(),
                        "missing corpus file: {}",
                        file_path.display()
                    );

                    let label = format!("{}:{rel}", metadata.name);
                    compile_and_reparse_flow_file(
                        &compiler,
                        cm.clone(),
                        &handler,
                        &file_path,
                        &label,
                        metadata.parser.flow_syntax(),
                    )?;
                }
            }

            Ok(())
        })
        .unwrap();
}
