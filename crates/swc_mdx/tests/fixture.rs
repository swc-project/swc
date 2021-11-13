use std::path::PathBuf;
use swc_ecma_parser::StringInput;
use swc_mdx::parser::Parser;

#[testing::fixture("tests/fixture/**/input.mdx")]
fn fixture(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();
        let mut parser = Parser::new(StringInput::from(&*fm));

        let res = parser.parse();

        res.unwrap();

        Ok(())
    })
    .unwrap();
}
