use std::{env, path::PathBuf, process::Command};
use swc_common::{input::SourceFileInput, sync::Lrc, FileName, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_plugin_runner::apply_js_plugin;

fn example_dir(crate_name: &str) -> PathBuf {
    env::current_dir()
        .unwrap()
        .parent()
        .unwrap()
        .join("examples")
        .join(crate_name)
}

fn build(crate_name: &str) {
    let status = Command::new("cargo")
        .arg("build")
        .arg("-p")
        .arg(crate_name)
        .current_dir(example_dir(crate_name))
        .arg("--target")
        .arg("wasm32-wasi")
        .status()
        .expect("failed to run cargo build");

    assert!(status.success());
}

fn parse(cm: Lrc<SourceMap>, src: &str) -> Program {
    let fm = cm.new_source_file(FileName::Anon, src.to_string());

    let lexer = Lexer::new(
        Default::default(),
        EsVersion::latest(),
        SourceFileInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);

    parser.parse_program().unwrap()
}

#[test]
fn drop_console() {
    build("drop_console");

    let project_dir = example_dir("drop_console");

    testing::run_test(false, |cm, _handler| {
        let program = parse(cm.clone(), "console.log(1)");

        let program = apply_js_plugin(
            &program,
            "{}",
            &project_dir
                .join("target")
                .join("wasm32-wasi")
                .join("debug")
                .join("drop_console.wasm"),
        )
        .expect("failed to apply js plugin");

        let program = program.expect_module();
        assert_eq!(program.body, vec![]);

        Ok(())
    })
    .unwrap();
}
