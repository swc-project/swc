#![deny(clippy::all)]
#![allow(clippy::match_like_matches_macro)]

use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::{
    compress::{
        alpha_value::compress_alpha_value, angle::compress_angle, at_rule::compress_at_rule,
        color::compress_color, easing_function::compress_easing_function,
        frequency::compress_frequency, keyframes::compress_keyframes, length::compress_length,
        selector::compress_selector,
    },
    compressor::compressor,
    options::MinifyOptions,
};

mod compress;
mod compressor;
pub mod options;

pub fn minify(stylesheet: &mut Stylesheet, _options: MinifyOptions) {
    stylesheet.visit_mut_with(&mut compressor());
    stylesheet.visit_mut_with(&mut compress_color());
    stylesheet.visit_mut_with(&mut compress_alpha_value());
    stylesheet.visit_mut_with(&mut compress_length());
    stylesheet.visit_mut_with(&mut compress_angle());
    stylesheet.visit_mut_with(&mut compress_frequency());
    stylesheet.visit_mut_with(&mut compress_easing_function());
    stylesheet.visit_mut_with(&mut compress_selector());
    stylesheet.visit_mut_with(&mut compress_keyframes());
    stylesheet.visit_mut_with(&mut compress_at_rule());
}
