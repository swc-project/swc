//! Tests ported from https://github.com/thysultan/stylis.js
//!
//! License is MIT, which is original license at the time of copying.
//! Original test authors have copyright for their work.
#![deny(warnings)]
#![allow(clippy::needless_update)]

use std::path::PathBuf;

use swc_common::{errors::HANDLER, sync::Lrc, SourceFile};
use swc_css_ast::Stylesheet;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodegenConfig, Emit,
};
use swc_css_compat::{
    compiler::{Compiler, Config},
    feature::Features,
    nesting::nesting,
};
use swc_css_parser::{parse_file, parser::ParserConfig};
use swc_css_visit::VisitMutWith;
use testing::NormalizedOutput;

fn parse_stylesheet(fm: &Lrc<SourceFile>) -> Stylesheet {
    let mut errors = vec![];
    let ss: Stylesheet = parse_file(
        fm,
        ParserConfig {
            allow_wrong_line_comments: true,
            ..Default::default()
        },
        &mut errors,
    )
    .unwrap();
    for err in errors {
        HANDLER.with(|handler| {
            err.to_diagnostics(handler).emit();
        });
    }

    ss
}

fn print_stylesheet(ss: &Stylesheet) -> String {
    let mut s = String::new();
    {
        let mut wr = BasicCssWriter::new(&mut s, None, BasicCssWriterConfig::default());
        let mut gen = swc_css_codegen::CodeGenerator::new(&mut wr, CodegenConfig { minify: false });

        gen.emit(&ss).unwrap();
    }

    s
}

fn test_nesting(input: PathBuf, suffix: Option<&str>) {
    let parent = input.parent().unwrap();
    let output = match suffix {
        Some(suffix) => parent.join("output.".to_owned() + suffix + ".css"),
        _ => parent.join("output.css"),
    };

    testing::run_test(false, |cm, _| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut ss = parse_stylesheet(&fm);

        ss.visit_mut_with(&mut nesting());

        let s = print_stylesheet(&ss);

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/nesting/**/input.css")]
fn test_nesting_without_env(input: PathBuf) {
    test_nesting(input, None)
}

#[testing::fixture("tests/custom-media-query/**/*.css", exclude("expect.css"))]
fn test_custom_media_query(input: PathBuf) {
    let output = input.with_extension("expect.css");

    testing::run_test(false, |cm, _| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut ss = parse_stylesheet(&fm);

        ss.visit_mut_with(&mut Compiler::new(Config {
            process: Features::CUSTOM_MEDIA,
        }));

        let s = print_stylesheet(&ss);

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/media-query-ranges/**/*.css", exclude("expect.css"))]
fn test_media_query_ranges(input: PathBuf) {
    let output = input.with_extension("expect.css");

    testing::run_test(false, |cm, _| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut ss = parse_stylesheet(&fm);

        ss.visit_mut_with(&mut Compiler::new(Config {
            process: Features::MEDIA_QUERY_RANGES,
        }));

        let s = print_stylesheet(&ss);

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/color-hex-alpha/**/*.css", exclude("expect.css"))]
fn test_color_hex_alpha(input: PathBuf) {
    let output = input.with_extension("expect.css");

    testing::run_test(false, |cm, _| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut ss = parse_stylesheet(&fm);

        ss.visit_mut_with(&mut Compiler::new(Config {
            process: Features::COLOR_HEX_ALPHA,
        }));

        let s = print_stylesheet(&ss);

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/color-legacy/**/*.css", exclude("expect.css"))]
fn test_color_space_separated_function_notation(input: PathBuf) {
    let output = input.with_extension("expect.css");

    testing::run_test(false, |cm, _| {
        //
        let fm = cm.load_file(&input).unwrap();
        let mut ss = parse_stylesheet(&fm);

        ss.visit_mut_with(&mut Compiler::new(Config {
            process: Features::COLOR_SPACE_SEPARATED_PARAMETERS
                | Features::COLOR_FLOAT_VALUES_IN_PARAMETERS
                | Features::COLOR_ALPHA_PARAMETER,
        }));

        let s = print_stylesheet(&ss);

        NormalizedOutput::from(s).compare_to_file(&output).unwrap();

        Ok(())
    })
    .unwrap();
}
