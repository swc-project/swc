use std::{mem::take, path::PathBuf};
use swc_common::{FileName, Span};
use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::{VisitMut, VisitMutWith};
use testing::{assert_eq, NormalizedOutput};

#[testing::fixture("tests/fixture/**/input.css")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output_file = dir.join("output.css");
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                parse_values: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        NormalizedOutput::from(css_str)
            .compare_to_file(output_file)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("../swc_css_parser/tests/fixture/**/input.css")]
fn parse_again(input: PathBuf) {
    eprintln!("{}", input.display());

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).unwrap();

        eprintln!("==== ==== Input ==== ====\n{}\n", fm.src);

        let mut errors = vec![];
        let mut stylesheet: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                parse_values: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();

        for err in take(&mut errors) {
            err.to_diagnostics(&handler).emit();
        }

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(&mut css_str, BasicCssWriterConfig { indent: "\t" });
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });

            gen.emit(&stylesheet).unwrap();
        }

        eprintln!("==== ==== Codegen ==== ====\n{}\n", css_str);

        let new_fm = cm.new_source_file(FileName::Anon, css_str);
        let mut parsed: Stylesheet = parse_file(
            &new_fm,
            ParserConfig {
                parse_values: true,
                ..Default::default()
            },
            &mut errors,
        )
        .map_err(|err| {
            err.to_diagnostics(&handler).emit();
        })?;

        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        stylesheet.visit_mut_with(&mut DropSpan);
        parsed.visit_mut_with(&mut DropSpan);

        assert_eq!(stylesheet, parsed);

        Ok(())
    })
    .unwrap();
}

struct DropSpan;

impl VisitMut for DropSpan {
    fn visit_mut_span(&mut self, n: &mut Span) {
        *n = Default::default()
    }
}
