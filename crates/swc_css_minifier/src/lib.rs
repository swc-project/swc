#![deny(clippy::all)]

use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::compress::{
    alpha_value::compress_alpha_value, angle::compress_angle, at_rule::compress_at_rule,
    color::compress_color, declaration::compress_declaration,
    easing_function::compress_easing_function, empty::compress_empty,
    frequency::compress_frequency, keyframes::compress_keyframes, length::compress_length,
    selector::compress_selector, time::compress_time,
    transform_function::compress_transform_function, unicore_range::compress_unicode_range,
    url::compress_url,
};

mod compress;

pub fn minify(stylesheet: &mut Stylesheet) {
    stylesheet.visit_mut_with(&mut compress_empty());
    stylesheet.visit_mut_with(&mut compress_color());
    stylesheet.visit_mut_with(&mut compress_alpha_value());
    stylesheet.visit_mut_with(&mut compress_length());
    stylesheet.visit_mut_with(&mut compress_angle());
    stylesheet.visit_mut_with(&mut compress_time());
    stylesheet.visit_mut_with(&mut compress_frequency());
    stylesheet.visit_mut_with(&mut compress_url());
    stylesheet.visit_mut_with(&mut compress_unicode_range());
    stylesheet.visit_mut_with(&mut compress_easing_function());
    stylesheet.visit_mut_with(&mut compress_transform_function());
    stylesheet.visit_mut_with(&mut compress_declaration());
    stylesheet.visit_mut_with(&mut compress_selector());
    stylesheet.visit_mut_with(&mut compress_keyframes());
    stylesheet.visit_mut_with(&mut compress_at_rule());
}
