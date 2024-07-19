use std::path::PathBuf;

use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_minifier::minify;
use swc_css_parser::parse_file;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.css")]
fn minify_fixtures(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.min.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let mut errors = Vec::new();
        let res: Result<Stylesheet, _> = parse_file(&fm, None, Default::default(), &mut errors);

        for err in errors {
            err.to_diagnostics(handler).emit();
        }

        if handler.has_errors() {
            return Err(());
        }

        let mut ss = res.unwrap();

        // Apply transforms
        minify(&mut ss, Default::default());

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, None, BasicCssWriterConfig::default());
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: true });

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(css_str)
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}
