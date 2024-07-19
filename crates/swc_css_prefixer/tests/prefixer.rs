//! Tests ported from https://github.com/thysultan/stylis.js
//!
//! License is MIT, which is original license at the time of copying.
//! Original test authors have copyright for their work.
#![deny(warnings)]
#![allow(clippy::needless_update)]

use std::path::PathBuf;

use preset_env_base::query::{Query, Targets};
use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodegenConfig, Emit,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_prefixer::{options::Options, prefixer};
use swc_css_visit::VisitMutWith;
use testing::NormalizedOutput;

fn prefix(input: PathBuf, options: Options, suffix: Option<&str>) {
    let parent = input.parent().unwrap();
    let output = match suffix {
        Some(suffix) => parent.join("output.".to_owned() + suffix + ".css"),
        _ => parent.join("output.css"),
    };

    testing::run_test2(false, |cm, handler| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut errors = Vec::new();
        let mut ss: Stylesheet = parse_file(
            &fm,
            None,
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

        ss.visit_mut_with(&mut prefixer(options));

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

#[testing::fixture("tests/fixture/**/input.css")]
fn test_without_env(input: PathBuf) {
    prefix(input, Options::default(), None)
}

#[testing::fixture("tests/fixture/**/input.css")]
fn test_with_env(input: PathBuf) {
    prefix(
        input,
        Options {
            env: Some(Targets::Query(Query::Single(String::from(
                "defaults, not IE 11",
            )))),
        },
        Some("defaults-not-ie-11"),
    )
}
