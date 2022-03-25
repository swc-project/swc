//! Tests ported from https://github.com/thysultan/stylis.js
//!
//! License is MIT, which is original license at the time of copying.
//! Original test authors have copyright for their work.
#![deny(warnings)]
#![allow(clippy::needless_update)]

use std::path::PathBuf;

use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_prefixer::prefixer;
use swc_css_visit::VisitMutWith;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.css")]
fn fixture(input: PathBuf) {
    let output = input.parent().unwrap().join("output.css");

    testing::run_test2(false, |cm, handler| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut errors = vec![];
        let mut ss: Stylesheet = parse_file(
            &fm,
            ParserConfig {
                allow_wrong_line_comments: true,
                ..Default::default()
            },
            &mut errors,
        )
        .unwrap();
        for err in errors {
            err.to_diagnostics(&handler).emit();
        }

        ss.visit_mut_with(&mut prefixer());

        let mut s = String::new();
        {
            let mut wr = BasicCssWriter::new(&mut s, None, BasicCssWriterConfig::default());
            let mut gen =
                swc_css_codegen::CodeGenerator::new(&mut wr, CodegenConfig { minify: false });

            gen.emit(&ss).unwrap();
        }

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}
