#![deny(warnings)]
#![allow(clippy::if_same_then_else)]
#![allow(clippy::needless_update)]
#![allow(clippy::redundant_clone)]
#![allow(clippy::while_let_on_iterator)]

use std::path::PathBuf;

use common::{document_dom_visualizer, document_span_visualizer};
use swc_html_parser::parser::ParserConfig;

use crate::common::document_test;

#[path = "common/mod.rs"]
mod common;

#[testing::fixture("tests/fixture/**/*.html")]
fn pass(input: PathBuf) {
    document_test(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/fixture/**/*.html")]
fn span_visualizer(input: PathBuf) {
    document_span_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

#[testing::fixture("tests/fixture/**/*.html")]
fn dom_visualizer(input: PathBuf) {
    document_dom_visualizer(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}
