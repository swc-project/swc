use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};

use anyhow::Context;
use serde_json::{Number, Value};
use swc::SwcComments;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, EsConfig, Parser, StringInput, Syntax};
use swc_estree_ast::flavor::Flavor;
use swc_estree_compat::babelify::Babelify;
use testing::{assert_eq, json::diff_json_value, DebugUsingDisplay, NormalizedOutput};

fn assert_flavor(flavor: Flavor, input: &Path, output_json_path: &Path) {
    testing::run_test(false, |cm, _handler| {
        let fm = cm.load_file(input).unwrap();

        let lexer = Lexer::new(
            Syntax::Es(EsConfig {
                ..Default::default()
            }),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let program = parser.parse_program().unwrap();

        let ctx = swc_estree_compat::babelify::Context {
            fm: fm.clone(),
            cm,
            comments: SwcComments::default(),
        };
        let mut actual = flavor.with(|| {
            let program = program.babelify(&ctx).program;
            serde_json::to_value(&program).unwrap()
        });
        let actual_str = serde_json::to_string_pretty(&actual).unwrap();

        println!("----- swc output -----\n{}", actual_str);
        let output = {
            let mut cmd = Command::new("node");
            cmd.arg("-e")
                .arg(include_str!("../scripts/test-acorn.js"))
                .arg(&*fm.src)
                .stderr(Stdio::inherit());
            cmd.output().unwrap()
        };

        let expected =
            String::from_utf8(output.stdout).expect("./acorn.js generated non-utf8 output");

        // We don't care about these cases
        if expected.trim().is_empty() {
            return Ok(());
        }

        {
            let mut expected = serde_json::from_str::<Value>(&expected)
                .with_context(|| format!("acorn.js generated invalid json:\n {}", expected))
                .unwrap();

            println!(
                "----- Expected output -----\n{}",
                serde_json::to_string_pretty(&expected).unwrap()
            );

            // We don't try to match fully.
            actual["end"] = Value::Null;
            expected["end"] = Value::Null;

            actual["range"] = Value::Null;
            expected["range"] = Value::Null;

            diff_json_value(&mut actual, &mut expected, &mut |key, value| {
                if let Value::Object(v) = &mut *value {
                    if let Some("FunctionExpression") = v.get("type").and_then(|v| v.as_str()) {
                        v["range"] = Value::Null;
                        v["start"] = Value::Null;
                        v["end"] = Value::Null;
                    }
                }

                match key {
                    "expression" => {
                        // Normalize false to null
                        if let Value::Bool(false) = value {
                            *value = Value::Null
                        }
                    }

                    "raw" => {
                        // Remove `'` and `"` from raw strings.
                        if let Value::String(s) = value {
                            if (s.starts_with('\'') && s.ends_with('\''))
                                || (s.starts_with('"') && s.ends_with('"'))
                            {
                                *s = s[1..s.len() - 1].to_string();
                            } else if s.starts_with('/') {
                                // We don't need raw value of regex at the moment.
                                *value = Value::Null;
                            }
                        }
                    }

                    "value" => {
                        // Normalize numbers
                        if let Value::Number(n) = value {
                            *n = Number::from_f64(n.as_f64().unwrap()).unwrap();
                        }
                    }

                    // We don't try to match fully.
                    "column" | "line" => {
                        if let Value::Number(..) = value {
                            *value = Value::Null;
                        }
                    }

                    _ => {}
                }
            });

            let actual = serde_json::to_string_pretty(&actual).unwrap();
            let expected = serde_json::to_string_pretty(&expected).unwrap();

            assert_eq!(DebugUsingDisplay(&actual), DebugUsingDisplay(&expected));
        }

        NormalizedOutput::from(actual_str)
            .compare_to_file(output_json_path)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/flavor/acorn/**/input.js")]
fn acorn(input: PathBuf) {
    let output = input.parent().unwrap().join("output.json");

    assert_flavor(
        Flavor::Acorn {
            extra_comments: false,
        },
        &input,
        &output,
    );
}
