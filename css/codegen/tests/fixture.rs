use std::path::PathBuf;
use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};

#[testing::fixture("../parser/tests/fixture/**/input.css")]
fn parse_again(input: PathBuf) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        let stylesheet: Stylesheet = parse_file(&fm, ParserConfig { parse_values: true }).unwrap();

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        let css_str = css_str;

        eprintln!("==== ==== CSS ==== ====\n{}\n", css_str);

        panic!();

        Ok(())
    })
    .unwrap();
}
