use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::compress::{
    angle::compress_angle, easing_function::compress_easing_function, empty::compress_empty,
    keyframes::compress_keyframes, time::compress_time,
    angle::compress_angle, empty::compress_empty, keyframes::compress_keyframes, selector::compress_selector,
    time::compress_time,
};

mod compress;

pub fn minify(stylesheet: &mut Stylesheet) {
    stylesheet.visit_mut_with(&mut compress_empty());
    stylesheet.visit_mut_with(&mut compress_selector());
    stylesheet.visit_mut_with(&mut compress_keyframes());
    stylesheet.visit_mut_with(&mut compress_easing_function());
    stylesheet.visit_mut_with(&mut compress_time());
    stylesheet.visit_mut_with(&mut compress_angle());
}
