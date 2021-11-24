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

fn assert_flavor(flavor: Flavor, input: &Path, output: &Path) {
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
        let json = flavor.with(|| {
            let program = program.babelify(&ctx).program;
            serde_json::to_string_pretty(&program).unwrap()
        });

        println!("----- swc output -----\n{}", json);
        {
            let mut cmd = Command::new("node");
            cmd.arg("-e")
                .arg(include_str!("../scripts/test-acorn.js"))
                .arg(&*fm.src)
                .stderr(Stdio::inherit());
            let output = cmd.output().unwrap();

            let output =
                String::from_utf8(output.stdout).expect("./acorn.js generated non-utf8 output");

            assert_eq!(DebugUsingDisplay(&json), DebugUsingDisplay(&output));
        }

        NormalizedOutput::from(json.clone())
            .compare_to_file(&output)
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
