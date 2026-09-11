#![deny(warnings)]

extern crate swc_malloc;

use std::{
    env,
    fmt::Debug,
    fs::read_to_string,
    panic::catch_unwind,
    path::{Path, PathBuf},
    time::Instant,
};

use ansi_term::Color;
use anyhow::Error;
use once_cell::sync::Lazy;
use serde::Deserialize;
use swc_common::{
    comments::{Comments, SingleThreadedComments},
    errors::{Handler, HANDLER},
    input::SourceFileInput,
    sync::Lrc,
    util::take::Take,
    EqIgnoreSpan, FileName, Mark, SourceFile, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::{
    optimize,
    option::{
        terser::TerserCompressorOptions, CompressOptions, ExtraOptions, MangleOptions,
        MinifyOptions, TopLevelOptions,
    },
};
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, Syntax};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{
    fixer::{fixer, paren_remover},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};
use testing::{assert_eq, unignore_fixture, DebugUsingDisplay, NormalizedOutput};

fn load_txt(filename: &str) -> Vec<String> {
    let lines = read_to_string(filename).unwrap();
    lines
        .lines()
        .filter(|v| !v.trim().is_empty())
        .map(|v| v.to_string())
        .collect()
}

fn is_ignored(path: &Path) -> bool {
    static IGNORED: Lazy<Vec<String>> = Lazy::new(|| {
        load_txt("tests/TODO.txt")
            .into_iter()
            .chain(load_txt("tests/postponed.txt"))
            .collect()
    });

    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| load_txt("tests/passing.txt"));

    let s = path.to_string_lossy().replace('-', "_").replace('\\', "/");

    if IGNORED.iter().any(|ignored| s.contains(&**ignored)) {
        return true;
    }

    if env::var("SKIP_GOLDEN").unwrap_or_default() == "1"
        && GOLDEN.iter().any(|ignored| s.contains(&**ignored))
    {
        return true;
    }

    if let Ok(one) = env::var("GOLDEN_ONLY") {
        if one == "1" && GOLDEN.iter().all(|golden| !s.contains(&**golden)) {
            return true;
        }
    }

    false
}

#[derive(Debug, Default, Clone, Deserialize)]
struct TopLevelOnly {
    #[serde(default, alias = "toplevel")]
    top_level: bool,
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
enum TestMangleOptions {
    Bool(bool),
    Normal(MangleOptions),
}

impl TestMangleOptions {
    fn parse(s: &str) -> Self {
        let top_level = serde_json::from_str::<TopLevelOnly>(s).unwrap_or_default();

        let mut data = serde_json::from_str::<Self>(s).expect("failed to deserialize mangle.json");

        if let TestMangleOptions::Normal(v) = &mut data {
            v.top_level = Some(top_level.top_level);
        }

        data
    }
}

#[derive(Debug, Clone, Deserialize)]
struct TestOptions {
    #[serde(default)]
    defaults: bool,

    #[serde(default)]
    passes: usize,
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let opts: TestOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");
    let mut c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    c.defaults = opts.defaults;
    c.pristine_globals = Some(true);
    c.passes = opts.passes;

    (c.module, c.into_config(cm))
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &Path,
    config: &str,
    comments: Option<&dyn Comments>,
    mangle: Option<TestMangleOptions>,
    skip_hygiene: bool,
) -> Option<Program> {
    let fm = cm.load_file(input).expect("failed to load input.js");
    run_with_source(cm, handler, fm, config, comments, mangle, skip_hygiene)
}

/// Use the same parser and optimizer for fixture files and re-minified output.
fn run_with_source(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    fm: Lrc<SourceFile>,
    config: &str,
    comments: Option<&dyn Comments>,
    mangle: Option<TestMangleOptions>,
    skip_hygiene: bool,
) -> Option<Program> {
    HANDLER.set(handler, || {
        let disable_hygiene = mangle.is_some() || skip_hygiene;

        let (module, mut config) = parse_compressor_config(cm.clone(), config);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

        if env::var("SWC_RUN").unwrap_or_default() == "1" {
            let stdout = stdout_of(&fm.src, module);
            match stdout {
                Ok(stdout) => {
                    eprintln!(
                        "---- {} -----\n{}",
                        Color::Green.paint("Stdout (expected)"),
                        stdout
                    );
                }
                Err(err) => {
                    eprintln!(
                        "---- {} -----\n{:?}",
                        Color::Green.paint("Error (of original source code)"),
                        err
                    );
                }
            }
        }

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let minification_start = Instant::now();

        let lexer = Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            Default::default(),
            SourceFileInput::from(&*fm),
            Some(&comments),
        );

        let mut parser = Parser::new_from(lexer);
        let program = parser
            .parse_program()
            .map_err(|err| {
                err.into_diagnostic(handler).emit();
            })
            .map(|mut program| {
                program.visit_mut_with(&mut paren_remover(Some(&comments)));
                program.visit_mut_with(&mut resolver(unresolved_mark, top_level_mark, false));

                program
            });

        // Ignore parser errors.
        //
        // This is typically related to strict mode caused by module context.
        let program = match program {
            Ok(v) => v,
            _ => return None,
        };

        if config.top_level.is_none() {
            if program.is_module() {
                config.top_level = Some(TopLevelOptions { functions: true });
            } else {
                config.top_level = Some(TopLevelOptions { functions: false });
            }
        }

        let optimization_start = Instant::now();
        let mut output = optimize(
            program,
            cm,
            Some(&comments),
            None,
            &MinifyOptions {
                compress: Some(config),
                mangle: mangle.and_then(|v| match v {
                    TestMangleOptions::Bool(v) => {
                        if v {
                            Some(MangleOptions {
                                top_level: Some(false),
                                ..Default::default()
                            })
                        } else {
                            None
                        }
                    }
                    TestMangleOptions::Normal(v) => Some(v),
                }),
                ..Default::default()
            },
            &ExtraOptions {
                unresolved_mark,
                top_level_mark,
                mangle_name_cache: None,
            },
        );
        let end = Instant::now();
        tracing::info!("optimize({}) took {:?}", fm.name, end - optimization_start);

        if !disable_hygiene {
            output.visit_mut_with(&mut hygiene())
        }

        let output = output.apply(&mut fixer(None));

        let end = Instant::now();
        tracing::info!("process({}) took {:?}", fm.name, end - minification_start);

        Some(output)
    })
}

fn stdout_of(code: &str, module: bool) -> Result<String, Error> {
    exec_node_js(
        &format!(
            "
    {}
    {}",
            include_str!("./terser_exec_base.js"),
            code
        ),
        JsExecOptions {
            cache: true,
            module,
            ..Default::default()
        },
    )
}

fn find_config(dir: &Path) -> String {
    let mut cur = Some(dir);
    while let Some(dir) = cur {
        let config = dir.join("config.json");
        if config.exists() {
            let config = read_to_string(&config).expect("failed to read config.json");

            return config;
        }

        cur = dir.parent();
    }

    panic!("failed to find config file for {}", dir.display())
}

fn read_mangle_config(dir: &Path) -> Option<TestMangleOptions> {
    let mangle = read_to_string(dir.join("mangle.json")).ok();
    if let Some(mangle) = &mangle {
        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Mangle config"),
            mangle
        );
    }

    mangle.map(|s| serde_json::from_str(&s).expect("failed to deserialize mangle.json"))
}

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/pass-1/**/input.js")]
#[testing::fixture("tests/pass-default/**/input.js")]
fn custom_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let mangle = read_mangle_config(dir);

        let output = run(
            cm.clone(),
            &handler,
            &input,
            &config,
            Some(&comments),
            mangle,
            false,
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let is_module = output_module.is_module();
        let output = print(cm, &[output_module], Some(&comments), false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        if let Ok(expected_stdout) = read_to_string(dir.join("expected.stdout")) {
            let actual =
                stdout_of(&output, is_module).expect("failed to execute the optimized code");
            assert_eq!(
                DebugUsingDisplay(&actual),
                DebugUsingDisplay(&expected_stdout)
            );
        }

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

/// Check Script completion values without wrapping the fixture in a function.
/// Expected values include the primitive type and distinguish NaN and negative
/// zero. Check the original and two minifications independently: a retained
/// block can protect one invocation while exposing a regression in the next
/// one.
#[testing::fixture("tests/fixture/**/expected.completion")]
fn script_completion(expected: PathBuf) {
    check_script_fixture(expected, ScriptExpectation::Completion);
}

/// Opt in to independent execution checks before and after two minifications.
/// The regular fixture test continues to check the first output snapshot.
#[testing::fixture("tests/fixture/**/expected.repeat-stdout")]
fn script_repeated_stdout(expected: PathBuf) {
    check_script_fixture(expected, ScriptExpectation::Stdout);
}

#[derive(Clone, Copy)]
enum ScriptExpectation {
    Completion,
    Stdout,
}

fn check_script_fixture(expected: PathBuf, expectation: ScriptExpectation) {
    let dir = expected.parent().unwrap();
    let input = dir.join("input.js");
    let config = find_config(dir);
    let mangle = read_mangle_config(dir);
    let expected = read_to_string(expected).expect("failed to read expected Script result");
    let mut source = read_to_string(&input).expect("failed to read input.js");

    testing::run_test2(false, |cm, handler| {
        for round in 0..=2 {
            if round != 0 {
                let comments = SingleThreadedComments::default();
                let fm = cm.new_source_file(
                    FileName::Custom(format!("{} (round {round})", input.display())).into(),
                    source,
                );
                let output = run_with_source(
                    cm.clone(),
                    &handler,
                    fm,
                    &config,
                    Some(&comments),
                    mangle.clone(),
                    false,
                )
                .expect("failed to optimize Script fixture");
                assert!(output.is_script(), "Script fixtures must parse as Scripts");
                source = print(cm.clone(), &[output], Some(&comments), true, true);
            }

            eprintln!("---- Script round {round} -----\n{source}");
            let actual = match expectation {
                ScriptExpectation::Completion => script_completion_of(&source),
                ScriptExpectation::Stdout => exec_node_js(
                    &source,
                    JsExecOptions {
                        cache: false,
                        ..Default::default()
                    },
                ),
            }
            .expect("failed to execute Script fixture");
            assert_eq!(
                DebugUsingDisplay(&actual),
                DebugUsingDisplay(&expected),
                "Script round {round}: {}",
                input.display()
            );
        }

        Ok(())
    })
    .unwrap()
}

fn script_completion_of(source: &str) -> Result<String, Error> {
    let source = serde_json::to_string(source).expect("failed to serialize Script source");
    exec_node_js(
        &format!(
            r#"
const value = require('node:vm').runInNewContext({source});
const type = value === null ? 'null' : typeof value;
let result;
switch (type) {{
    case 'undefined':
    case 'null':
        result = {{ type }};
        break;
    case 'number':
        result = {{ type, value: Object.is(value, -0) ? '-0' : String(value) }};
        break;
    case 'bigint':
        result = {{ type, value: String(value) }};
        break;
    case 'boolean':
    case 'string':
        result = {{ type, value }};
        break;
    default:
        throw new Error('Unsupported Script completion type: ' + type);
}}
console.log(JSON.stringify(result));
"#
        ),
        JsExecOptions {
            cache: false,
            ..Default::default()
        },
    )
}

#[derive(Default)]
struct NonFiniteLiteralValidator {
    nan_count: usize,
    positive_infinity_count: usize,
    negative_infinity_count: usize,
    non_finite_ident_count: usize,
    non_finite_raw_count: usize,
}

impl Visit for NonFiniteLiteralValidator {
    fn visit_ident(&mut self, ident: &Ident) {
        if matches!(&*ident.sym, "NaN" | "Infinity") {
            self.non_finite_ident_count += 1;
        }
    }

    fn visit_number(&mut self, number: &Number) {
        if number.value.is_nan() {
            self.nan_count += 1;
        } else if number.value == f64::INFINITY {
            self.positive_infinity_count += 1;
        } else if number.value == f64::NEG_INFINITY {
            self.negative_infinity_count += 1;
        }

        if !number.value.is_finite() && number.raw.is_some() {
            self.non_finite_raw_count += 1;
        }
    }
}

#[testing::fixture("tests/fixture/non-finite-number-literals/input.js")]
fn non_finite_number_literals_are_canonical(input: PathBuf) {
    let config = find_config(input.parent().unwrap());

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();
        let output = run(cm, &handler, &input, &config, Some(&comments), None, false)
            .expect("failed to optimize fixture");
        let mut validator = NonFiniteLiteralValidator::default();
        output.visit_with(&mut validator);

        assert_eq!(validator.non_finite_ident_count, 0);
        assert_eq!(validator.nan_count, 5);
        assert_eq!(validator.positive_infinity_count, 3);
        assert_eq!(validator.negative_infinity_count, 3);
        assert_eq!(validator.non_finite_raw_count, 0);

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/projects/files/*.js")]
fn projects(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let output = run(
            cm.clone(),
            &handler,
            &input,
            &config,
            Some(&comments),
            None,
            false,
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module], Some(&comments), false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        let minified = {
            let output = run(
                cm.clone(),
                &handler,
                &input,
                r#"{ "defaults": true, "toplevel": true, "passes": 3 }"#,
                Some(&comments),
                Some(TestMangleOptions::Normal(MangleOptions {
                    top_level: Some(true),
                    ..Default::default()
                })),
                false,
            );
            let output_module = match output {
                Some(v) => v,
                None => return Ok(()),
            };

            print(cm, &[output_module], Some(&comments), true, true)
        };

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Size"),
            minified.len()
        );

        NormalizedOutput::from(output)
            .compare_to_file(
                dir.parent()
                    .unwrap()
                    .join("output")
                    .join(input.file_name().unwrap()),
            )
            .unwrap();

        Ok(())
    })
    .unwrap()
}

/// antd and typescript test is way too slow
#[testing::fixture("benches/full/*.js", exclude("typescript", "antd"))]
fn projects_bench(input: PathBuf) {
    let dir = input
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .parent()
        .unwrap()
        .join("tests")
        .join("benches-full");

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let output = run(
            cm.clone(),
            &handler,
            &input,
            r#"{ "defaults": true, "toplevel": false, "passes": 3 }"#,
            Some(&comments),
            None,
            false,
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm, &[output_module], Some(&comments), false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join(input.file_name().unwrap()))
            .unwrap();

        Ok(())
    })
    .unwrap();
}

/// Tests ported from terser.
#[testing::fixture("tests/terser/compress/**/input.js")]
fn fixture(input: PathBuf) {
    if is_ignored(&input) {
        return;
    }

    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let mangle = dir.join("mangle.json");
        let mangle = read_to_string(mangle).ok();
        if let Some(mangle) = &mangle {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Mangle config"),
                mangle
            );
        }

        let comments = SingleThreadedComments::default();

        let mangle: Option<TestMangleOptions> = mangle.map(|s| TestMangleOptions::parse(&s));

        let output = run(
            cm.clone(),
            &handler,
            &input,
            &config,
            Some(&comments),
            mangle,
            false,
        );
        let output_program = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(
            cm.clone(),
            std::slice::from_ref(&output_program),
            Some(&comments),
            false,
            false,
        );

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        let expected = {
            let expected = read_to_string(dir.join("output.js")).unwrap();
            let fm = cm.new_source_file(FileName::Custom("expected.js".into()).into(), expected);
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let expected = parser.parse_program().map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })?;
            let mut expected = expected.apply(&mut fixer(None));
            expected = drop_span(expected);

            match &mut expected {
                Program::Module(m) => {
                    m.body
                        .retain(|s| !matches!(s, ModuleItem::Stmt(Stmt::Empty(..))));
                }
                Program::Script(s) => s.body.retain(|s| !matches!(s, Stmt::Empty(..))),
            }

            let mut normalized_expected = expected.clone();
            normalized_expected.visit_mut_with(&mut DropParens);

            let mut actual = output_program.clone();
            actual.visit_mut_with(&mut DropParens);

            if actual.eq_ignore_span(&normalized_expected)
                || drop_span(actual.clone()) == normalized_expected
            {
                return Ok(());
            }

            if print(cm.clone(), &[actual], Some(&comments), false, false)
                == print(
                    cm.clone(),
                    &[normalized_expected],
                    Some(&comments),
                    false,
                    false,
                )
            {
                return Ok(());
            }

            print(cm.clone(), &[expected], Some(&comments), false, false)
        };
        {
            // Check output.teraer.js
            let identical = (|| -> Option<()> {
                let expected = {
                    let expected = read_to_string(dir.join("output.terser.js")).ok()?;
                    let fm = cm.new_source_file(FileName::Anon.into(), expected);
                    let lexer = Lexer::new(
                        Default::default(),
                        Default::default(),
                        SourceFileInput::from(&*fm),
                        None,
                    );
                    let mut parser = Parser::new_from(lexer);
                    let expected = parser
                        .parse_program()
                        .map_err(|err| {
                            err.into_diagnostic(&handler).emit();
                        })
                        .ok()?;
                    let mut expected = expected.apply(fixer(None));
                    expected = drop_span(expected);
                    match &mut expected {
                        Program::Module(m) => {
                            m.body
                                .retain(|s| !matches!(s, ModuleItem::Stmt(Stmt::Empty(..))));
                        }
                        Program::Script(s) => s.body.retain(|s| !matches!(s, Stmt::Empty(..))),
                    }

                    let mut normalized_expected = expected.clone();
                    normalized_expected.visit_mut_with(&mut DropParens);

                    let mut actual = output_program.clone();
                    actual.visit_mut_with(&mut DropParens);

                    if actual.eq_ignore_span(&normalized_expected)
                        || drop_span(actual.clone()) == normalized_expected
                    {
                        return Some(());
                    }

                    if print(cm.clone(), &[actual], Some(&comments), false, false)
                        == print(
                            cm.clone(),
                            &[normalized_expected],
                            Some(&comments),
                            false,
                            false,
                        )
                    {
                        return Some(());
                    }

                    print(cm.clone(), &[expected], Some(&comments), false, false)
                };

                if output == expected {
                    return Some(());
                }

                None
            })()
            .is_some();
            if identical {
                let s = read_to_string(dir.join("output.terser.js"))
                    .expect("failed to read output.terser.js");
                std::fs::write(dir.join("output.js"), s.as_bytes())
                    .expect("failed to update output.js");
            }
        }

        if output == expected {
            return Ok(());
        }

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected
        );

        println!("{}", input.display());

        if let Ok(expected_stdout) = read_to_string(dir.join("expected.stdout")) {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Expected stdout"),
                expected_stdout
            );

            let actual = stdout_of(&output, output_program.is_module())
                .expect("failed to execute the optimized code");
            assert_eq!(
                DebugUsingDisplay(&actual),
                DebugUsingDisplay(&expected_stdout)
            );
            if expected.trim().is_empty() {
                return Ok(());
            }
        }

        let output_str = print(
            cm,
            &[drop_span(output_program)],
            Some(&comments),
            false,
            false,
        );

        if env::var("UPDATE").map(|s| s == "1").unwrap_or(false) {
            let _ = catch_unwind(|| {
                NormalizedOutput::from(output_str.clone())
                    .compare_to_file(dir.join("output.js"))
                    .unwrap();
            });
        }

        assert_eq!(DebugUsingDisplay(&output_str), DebugUsingDisplay(&expected));

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(
    cm: Lrc<SourceMap>,
    nodes: &[N],
    comments: Option<&dyn Comments>,
    minify: bool,
    skip_semi: bool,
) -> String {
    let mut buf = Vec::new();

    {
        let mut wr: Box<dyn WriteJs> = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None));
        if minify || skip_semi {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm,
            comments,
            wr,
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}

#[testing::fixture("tests/full/**/input.js")]
fn full(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    let comments = SingleThreadedComments::default();

    testing::run_test2(false, |cm, handler| {
        let output = run(
            cm.clone(),
            &handler,
            &input,
            &config,
            Some(&comments),
            Some(TestMangleOptions::Normal(MangleOptions {
                top_level: Some(true),
                ..Default::default()
            })),
            false,
        );
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm, &[output_module], Some(&comments), true, true);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap();
    unignore_fixture(&input);
}

struct DropParens;

impl VisitMut for DropParens {
    fn visit_mut_expr(&mut self, e: &mut Expr) {
        e.visit_mut_children_with(self);

        if let Expr::Paren(p) = e {
            *e = *p.expr.take();
        }
    }
}
