use std::path::Path;
use swc_common::FileName;
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax};
use swc_plugin_runner::{apply_js_plugin, resolve};
use testing::run_test2;

#[test]
fn test_resolve_1() {
    let path = resolve("internal-test").expect("failed to resolve");
    println!("{}", path.display());

    assert_js_plugin(
        &path,
        "{ \"printError\": false, \"usePrivateIdent\": false }",
        "console.log('Foo')",
        "console.log('Foo')",
    );

    panic!("todo")
}

fn assert_js_plugin(plugin_path: &Path, config: &str, input: &str, expected: &str) {
    run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let fm = cm.new_source_file(FileName::Anon, input.to_string());

        let lexer = Lexer::new(
            Syntax::default(),
            EsVersion::latest(),
            StringInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let m = parser.parse_module().map(Program::Module).map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })?;

        let res = apply_js_plugin(&m, plugin_path, config).expect("should success");

        panic!("{:?}", res)
    })
    .unwrap();
}
