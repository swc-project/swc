use ansi_term::Color;
use anyhow::bail;
use anyhow::Context;
use anyhow::Error;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::env;
use std::fmt::Debug;
use std::fs::read_to_string;
use std::panic::catch_unwind;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use swc_common::comments::SingleThreadedComments;
use swc_common::errors::Handler;
use swc_common::sync::Lrc;
use swc_common::EqIgnoreSpan;
use swc_common::FileName;
use swc_common::Mark;
use swc_common::SourceMap;
use swc_ecma_ast::*;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_minifier::optimize;
use swc_ecma_minifier::option::terser::TerserCompressorOptions;
use swc_ecma_minifier::option::CompressOptions;
use swc_ecma_minifier::option::ExtraOptions;
use swc_ecma_minifier::option::MangleOptions;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_transforms::fixer;
use swc_ecma_transforms::hygiene;
use swc_ecma_transforms::resolver_with_mark;
use swc_ecma_utils::drop_span;
use swc_ecma_visit::FoldWith;
use testing::assert_eq;
use testing::DebugUsingDisplay;
use testing::NormalizedOutput;

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
        load_txt("tests/ignored.txt")
            .into_iter()
            .chain(load_txt("tests/postponed.txt"))
            .collect()
    });

    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| load_txt("tests/golden.txt"));

    let s = path.to_string_lossy().replace("-", "_").replace("\\", "/");

    if IGNORED.iter().any(|ignored| s.contains(&**ignored)) {
        return true;
    }

    if env::var("SKIP_GOLDEN").unwrap_or_default() == "1" {
        if GOLDEN.iter().any(|ignored| s.contains(&**ignored)) {
            return true;
        }
    }

    if let Ok(one) = env::var("GOLDEN_ONLY") {
        if one == "1" {
            if GOLDEN.iter().all(|golden| !s.contains(&**golden)) {
                return true;
            }
        }
    }

    false
}

#[derive(Debug, Clone, Deserialize)]
#[serde(deny_unknown_fields)]
#[serde(untagged)]
enum TestMangleOptions {
    Bool(bool),
    Normal(MangleOptions),
}

fn parse_compressor_config(cm: Lrc<SourceMap>, s: &str) -> (bool, CompressOptions) {
    let c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    (c.module, c.into_config(cm))
}

fn run(
    cm: Lrc<SourceMap>,
    handler: &Handler,
    input: &Path,
    config: &str,
    mangle: Option<TestMangleOptions>,
) -> Option<Module> {
    let (_module, config) = parse_compressor_config(cm.clone(), &config);

    let fm = cm.load_file(&input).expect("failed to load input.js");
    let comments = SingleThreadedComments::default();

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
                    Color::Green.paint("Error (of orignal source code)"),
                    err
                );
            }
        }
    }

    let top_level_mark = Mark::fresh(Mark::root());

    let lexer = Lexer::new(
        Default::default(),
        Default::default(),
        SourceFileInput::from(&*fm),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);
    let program = parser
        .parse_module()
        .map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)));

    // Ignore parser errors.
    //
    // This is typically related to strict mode caused by module context.
    let program = match program {
        Ok(v) => v,
        _ => return None,
    };

    let output = optimize(
        program,
        Some(&comments),
        None,
        &MinifyOptions {
            compress: Some(config),
            mangle: mangle.and_then(|v| match v {
                TestMangleOptions::Bool(v) => {
                    if v {
                        Some(Default::default())
                    } else {
                        None
                    }
                }
                TestMangleOptions::Normal(v) => Some(v),
            }),
            ..Default::default()
        },
        &ExtraOptions { top_level_mark },
    )
    .fold_with(&mut hygiene())
    .fold_with(&mut fixer(None));

    Some(output)
}

fn stdout_of(code: &str) -> Result<String, Error> {
    let actual_output = Command::new("node")
        .arg("-e")
        .arg(&code)
        .output()
        .context("failed to execute output of minifier")?;

    if !actual_output.status.success() {
        bail!(
            "failed to execute:\n{}\n{}",
            String::from_utf8_lossy(&actual_output.stdout),
            String::from_utf8_lossy(&actual_output.stderr)
        )
    }

    Ok(String::from_utf8_lossy(&actual_output.stdout).to_string())
}

#[testing::fixture("compress/fixture/**/input.js")]
fn base_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let output = run(cm.clone(), &handler, &input, &config, None);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ouput"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(dir.join("output.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

#[testing::fixture("projects/files/*.js")]
fn projects(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let output = run(cm.clone(), &handler, &input, &config, None);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let minified_output = print(cm.clone(), &[output_module.clone()], true);

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ouput"), output);

        println!("{}", input.display());

        NormalizedOutput::from(output)
            .compare_to_file(input.with_extension("min.js"))
            .unwrap();

        Ok(())
    })
    .unwrap()
}

/// Tests used to prevent regressions.
#[testing::fixture("compress/exec/**/input.js")]
fn base_exec(input: PathBuf) {
    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let input_src = read_to_string(&input).expect("failed to read input.js as a string");

        let output = run(cm.clone(), &handler, &input, &config, None);
        let output = output.expect("Parsing in base test should not fail");
        let output = print(cm.clone(), &[output], false);

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Optimized code"),
            output
        );

        println!("{}", input.display());

        let expected_output = stdout_of(&input_src).unwrap();
        let actual_output = stdout_of(&output).expect("failed to execute the optimized code");
        assert_ne!(actual_output, "");

        assert_eq!(
            DebugUsingDisplay(&actual_output),
            DebugUsingDisplay(&*expected_output)
        );

        Ok(())
    })
    .unwrap()
}

/// Tests ported from terser.
#[testing::fixture("terser/compress/**/input.js")]
fn fixture(input: PathBuf) {
    if is_ignored(&input) {
        return;
    }

    let dir = input.parent().unwrap();
    let config = dir.join("config.json");
    let config = read_to_string(&config).expect("failed to read config.json");
    eprintln!("---- {} -----\n{}", Color::Green.paint("Config"), config);

    testing::run_test2(false, |cm, handler| {
        let mangle = dir.join("mangle.json");
        let mangle = read_to_string(&mangle).ok();
        if let Some(mangle) = &mangle {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Mangle config"),
                mangle
            );
        }

        let mangle: Option<TestMangleOptions> =
            mangle.map(|s| serde_json::from_str(&s).expect("failed to deserialize mangle.json"));

        let output = run(cm.clone(), &handler, &input, &config, mangle);
        let output_module = match output {
            Some(v) => v,
            None => return Ok(()),
        };

        let output = print(cm.clone(), &[output_module.clone()], false);

        eprintln!("---- {} -----\n{}", Color::Green.paint("Ouput"), output);

        let expected = {
            let expected = read_to_string(&dir.join("output.js")).unwrap();
            let fm = cm.new_source_file(FileName::Anon, expected);
            let lexer = Lexer::new(
                Default::default(),
                Default::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let mut parser = Parser::new_from(lexer);
            let expected = parser.parse_module().map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })?;
            let mut expected = expected.fold_with(&mut fixer(None));
            expected = drop_span(expected);

            if output_module.eq_ignore_span(&expected)
                || drop_span(output_module.clone()) == expected
            {
                return Ok(());
            }

            expected.body.retain(|s| match s {
                ModuleItem::Stmt(Stmt::Empty(..)) => false,
                _ => true,
            });
            print(cm.clone(), &[expected], false)
        };

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

        if env::var("UPDATE").map(|s| s == "1").unwrap_or(false) {
            let output = output.clone();
            let _ = catch_unwind(|| {
                NormalizedOutput::from(output)
                    .compare_to_file(dir.join("output.js"))
                    .unwrap();
            });
        }

        let output_str = print(cm.clone(), &[drop_span(output_module.clone())], false);

        assert_eq!(DebugUsingDisplay(&output_str), DebugUsingDisplay(&expected));

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
