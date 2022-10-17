use std::path::PathBuf;

use common::{document_dom_visualizer, document_span_visualizer};
use swc_html_parser::parser::ParserConfig;

use crate::common::document_test;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/iframe_srcdoc/**/*.html")]
fn pass_iframe_srcdoc(input: PathBuf) {
    document_test(
        input,
        ParserConfig {
            iframe_srcdoc: true,
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/iframe_srcdoc/**/*.html")]
fn span_visualizer(input: PathBuf) {
    document_span_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
        false,
    )
}

#[testing::fixture("tests/iframe_srcdoc/**/*.html")]
fn dom_visualizer(input: PathBuf) {
    document_dom_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}
