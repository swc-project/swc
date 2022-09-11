#![deny(clippy::all)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::needless_update)]

use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::{
    compress::{at_rule::compress_at_rule, transform_function::compress_transform_function},
    compressor::compressor,
    options::MinifyOptions,
};

mod compress;
mod compressor;
pub mod options;

pub fn minify(stylesheet: &mut Stylesheet, _options: MinifyOptions) {
    stylesheet.visit_mut_with(&mut compressor());
    stylesheet.visit_mut_with(&mut compress_transform_function());
    stylesheet.visit_mut_with(&mut compress_at_rule());
}
