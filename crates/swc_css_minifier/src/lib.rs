use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::compress::{
    angle::compress_angle, empty_qualified_rule::compress_empty_qualified_rule,
    keyframes::compress_keyframes, time::compress_time,
};

mod compress;

pub fn minify(stylesheet: &mut Stylesheet) {
    stylesheet.visit_mut_with(&mut compress_keyframes());
    stylesheet.visit_mut_with(&mut compress_empty_qualified_rule());
    stylesheet.visit_mut_with(&mut compress_time());
    stylesheet.visit_mut_with(&mut compress_angle());
}
