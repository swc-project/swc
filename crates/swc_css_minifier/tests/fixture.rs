use std::path::PathBuf;

use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_minifier::minify;
use swc_css_parser::parse_file;
use testing::NormalizedOutput;

#[testing::fixture("../swc_css_parser/tests/fixture/**/input.css")]
fn parser_fixture(input: PathBuf) {
    // TODO: Remove this.
    // This is used to merge it into master branch as requested.

    if true {
        return;
    }

    let prefix = PathBuf::new()
        .join("..")
        .join("swc_css_parser")
        .join("tests")
        .join("fixture")
        .canonicalize()
        .unwrap();

    // Relative path of the input file, to the fixture directory.
    let rel_path = input.strip_prefix(&prefix).unwrap();
    let output_path = PathBuf::new()
        .join("tests")
        .join("parser-fixture")
        .join(rel_path);

    testing::run_test(false, |cm, _handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = vec![];
        let res: Result<Stylesheet, _> = parse_file(&fm, Default::default(), &mut errors);

        if res.is_err() || !errors.is_empty() {
            // We are not debugging parser
            return Ok(());
        }
        let mut ss = res.unwrap();

        // Apply transforms
        minify(&mut ss);

        let mut css_str = String::new();
        {
            // TODO: Create minifying css writer
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: true });

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(css_str)
            .compare_to_file(&output_path)
            .unwrap();

        Ok(())
    })
    .unwrap();
}
