use serde_json::Value;
use std::{
    path::{Path, PathBuf},
    process::{Command, Stdio},
};
use swc::SwcComments;
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_estree_ast::flavor::Flavor;
use swc_estree_compat::babelify::Babelify;
use testing::{assert_eq, DebugUsingDisplay, NormalizedOutput};

fn assert_flavor(flavor: Flavor, input: &Path, output_json_path: &Path) {
    testing::run_test(false, |cm, _handler| {
        let fm = cm.load_file(input).unwrap();

        let lexer = Lexer::new(
            Default::default(),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let program = parser.parse_program().unwrap();

        let ctx = swc_estree_compat::babelify::Context {
            fm: fm.clone(),
            cm: cm.clone(),
            comments: SwcComments::default(),
        };
        let mut actual = flavor.with(|| {
            let program = program.babelify(&ctx).program;
            serde_json::to_value(&program).unwrap()
        });
        let actual_str = serde_json::to_string_pretty(&actual).unwrap();

        println!("----- swc output -----\n{}", actual);
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

        {
            let mut expected =
                serde_json::from_str::<Value>(&expected).expect("acorn.js generated invalid json");

            diff_value(&mut actual, &mut expected);

            let actual = serde_json::to_string_pretty(&actual).unwrap();
            let expected = serde_json::to_string_pretty(&expected).unwrap();

            assert_eq!(DebugUsingDisplay(&actual), DebugUsingDisplay(&expected));
        }

        NormalizedOutput::from(actual_str.clone())
            .compare_to_file(&output_json_path)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/flavor/acorn/**/input.js")]
fn acorn(input: PathBuf) {
    let output = input.parent().unwrap().join("output.json");

    assert_flavor(Flavor::Acorn, &input, &output);
}

/// Returns `true` if `actual` and `expected` are equal.
fn diff_value(a: &mut Value, b: &mut Value) -> bool {
    if *a == *b {
        return true;
    }

    match (a, b) {
        (Value::Object(a), Value::Object(b)) => {
            a.retain(|key, a_v| {
                if let Some(b_v) = b.get_mut(key) {
                    if diff_value(a_v, b_v) {
                        return false;
                    }
                }

                true
            });
        }

        (Value::Array(a), Value::Array(b)) => {
            if a.len() == b.len() {
                for (a_v, b_v) in a.iter_mut().zip(b.iter_mut()) {
                    diff_value(a_v, b_v);
                }
            }
        }

        _ => {}
    }

    false
}
