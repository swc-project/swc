use std::path::{Path, PathBuf};
use swc_ecma_ast::EsVersion;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput};
use swc_estree_ast::flavor::Flavor;
use testing::NormalizedOutput;

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

        let module = parser.parse_module().unwrap();

        let json = flavor.with(|| serde_json::to_string_pretty(&module).unwrap());

        NormalizedOutput::from(json)
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
