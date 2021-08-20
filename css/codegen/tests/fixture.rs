use std::path::PathBuf;
use swc_common::FileName;
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

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let stylesheet: Stylesheet = parse_file(&fm, ParserConfig { parse_values: true }).unwrap();

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        eprintln!("==== ==== Codegen ==== ====\n{}\n", css_str);

        let new_fm = cm.new_source_file(FileName::Anon, css_str);
        let parsed: Stylesheet = parse_file(&new_fm, ParserConfig { parse_values: true }).unwrap();

        assert_eq!(stylesheet, parsed);

        Ok(())
    })
    .unwrap();
}
