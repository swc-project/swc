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
    sync::Lrc,
    util::take::Take,
    EqIgnoreSpan, FileName, Mark, SourceMap,
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
use swc_ecma_parser::{
    lexer::{input::SourceFileInput, Lexer},
    EsSyntax, Parser, Syntax,
};
use swc_ecma_testing::{exec_node_js, JsExecOptions};
use swc_ecma_transforms_base::{
    fixer::{fixer, paren_remover},
    hygiene::hygiene,
    resolver,
};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::{VisitMut, VisitMutWith};
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
    c.const_to_let = Some(false);
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
    HANDLER.set(handler, || {
        let disable_hygiene = mangle.is_some() || skip_hygiene;

        let (_module, mut config) = parse_compressor_config(cm.clone(), config);

        let fm = cm.load_file(input).expect("failed to load input.js");

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

        if env::var("SWC_RUN").unwrap_or_default() == "1" {
            let stdout = stdout_of(&fm.src);
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
        tracing::info!(
            "optimize({}) took {:?}",
            input.display(),
            end - optimization_start
        );

        if !disable_hygiene {
            output.visit_mut_with(&mut hygiene())
        }

        let output = output.apply(&mut fixer(None));

        let end = Instant::now();
        tracing::info!(
            "process({}) took {:?}",
            input.display(),
            end - minification_start
        );

        Some(output)
    })
}

fn stdout_of(code: &str) -> Result<String, Error> {
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
            module: false,
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

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/pass-1/**/input.js")]
#[testing::fixture("tests/pass-default/**/input.js")]
fn custom_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = find_config(dir);
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let comments = SingleThreadedComments::default();

        let mangle = dir.join("mangle.json");
        let mangle = read_to_string(mangle).ok();
        if let Some(mangle) = &mangle {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Mangle config"),
                mangle
            );
        }
        let mangle: Option<TestMangleOptions> =
            mangle.map(|s| serde_json::from_str(&s).expect("failed to deserialize mangle.json"));

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

        let output = print(cm, &[output_module], Some(&comments), false, false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Output"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
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
            &[output_program.clone()],
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

            let actual = stdout_of(&output).expect("failed to execute the optimized code");
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
