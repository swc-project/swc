use ansi_term::Color;
use once_cell::sync::Lazy;
use serde::Deserialize;
use std::env;
use std::fmt;
use std::fmt::Debug;
use std::fmt::Display;
use std::fmt::Formatter;
use std::fs::read_to_string;
use std::panic::catch_unwind;
use std::path::Path;
use std::path::PathBuf;
use std::process::Command;
use swc_common::comments::SingleThreadedComments;
use swc_common::sync::Lrc;
use swc_common::FileName;
use swc_common::SourceMap;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_minifier::optimize;
use swc_ecma_minifier::option::terser::TerserCompressorOptions;
use swc_ecma_minifier::option::CompressOptions;
use swc_ecma_minifier::option::MangleOptions;
use swc_ecma_minifier::option::MinifyOptions;
use swc_ecma_parser::lexer::input::SourceFileInput;
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::Parser;
use swc_ecma_transforms::fixer;
use swc_ecma_transforms::hygiene;
use swc_ecma_transforms::resolver;
use swc_ecma_visit::FoldWith;
use testing::assert_eq;
use testing::NormalizedOutput;

fn is_ignored(path: &Path) -> bool {
    static IGNORED: Lazy<Vec<String>> = Lazy::new(|| {
        let lines = read_to_string("tests/ignored.txt").unwrap();
        lines
            .lines()
            .filter(|v| !v.trim().is_empty())
            .map(|v| v.to_string())
            .collect()
    });

    static GOLDEN: Lazy<Vec<String>> = Lazy::new(|| {
        let lines = read_to_string("tests/golden.txt").unwrap();
        lines
            .lines()
            .filter(|v| !v.trim().is_empty())
            .map(|v| v.to_string())
            .collect()
    });

    let s = path.to_string_lossy();

    if IGNORED.iter().any(|ignored| s.contains(&**ignored)) {
        return true;
    }

    if let Ok(one) = env::var("GOLDEN_ONLY").or_else(|_| env::var("CI")) {
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

fn parse_compressor_config(s: &str) -> (bool, CompressOptions) {
    let c: TerserCompressorOptions =
        serde_json::from_str(s).expect("failed to deserialize value into a compressor config");

    (c.module, c.into())
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
    let (_module, config) = parse_compressor_config(&config);

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

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");
        let comments = SingleThreadedComments::default();

        eprintln!("---- {} -----\n{}", Color::Green.paint("Input"), fm.src);

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
            .map(|module| module.fold_with(&mut resolver()));

        // Ignore parser errors.
        //
        // This is typically related to strict mode caused by module context.
        let program = match program {
            Ok(v) => v,
            _ => return Ok(()),
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
        )
        .fold_with(&mut hygiene())
        .fold_with(&mut fixer(None));
        let output = print(cm.clone(), &[output]);

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
            let expected = expected.fold_with(&mut fixer(None));
            print(cm.clone(), &[expected])
        };

        if output == expected {
            return Ok(());
        }

        eprintln!(
            "---- {} -----\n{}",
            Color::Green.paint("Expected"),
            expected
        );

        if let Ok(expected_stdout) = read_to_string(dir.join("expected.stdout")) {
            eprintln!(
                "---- {} -----\n{}",
                Color::Green.paint("Expected stdout"),
                expected_stdout
            );

            // We should compare stdout instead.
            let output = Command::new("node")
                .arg("-e")
                .arg(&output)
                .output()
                .expect("failed to execute output of minifier");

            if !output.status.success() {
                panic!(
                    "failed to execute output of minifier:\n{}\n{}",
                    String::from_utf8_lossy(&output.stdout),
                    String::from_utf8_lossy(&output.stderr)
                )
            }

            let actual = String::from_utf8_lossy(&output.stdout);
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

        assert_eq!(DebugUsingDisplay(&output), DebugUsingDisplay(&expected));

        Ok(())
    })
    .unwrap()
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N]) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
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

#[derive(PartialEq, Eq)]
struct DebugUsingDisplay<'a>(&'a str);

impl<'a> Debug for DebugUsingDisplay<'a> {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        Display::fmt(self.0, f)
    }
}
