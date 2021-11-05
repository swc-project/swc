use std::path::Path;
use swc_common::{errors::HANDLER, FileName};
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

    assert_js_plugin(
        &path,
        "{ \"printError\": true, \"usePrivateIdent\": false }",
        "console.log('Foo')",
        "console.log('Foo')",
    );

    // TODO
}

fn assert_js_plugin(plugin_path: &Path, config: &str, input: &str, expected: &str) {
    run_test2(false, |cm, handler| {
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

        let _res = HANDLER.set(&handler, || {
            apply_js_plugin("internal-test", plugin_path, config, &m).expect("should success")
        });

        // TODO: Compare res and expected

        println!("Worked");

        Ok(())
    })
    .unwrap();
}
