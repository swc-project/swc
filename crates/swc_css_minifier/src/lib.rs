#![feature(box_patterns)]
#![deny(clippy::all)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::needless_update)]

use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::{compress::at_rule::compress_at_rule, compressor::compressor, options::MinifyOptions};

mod compress;
mod compressor;
mod escape;
pub mod options;

pub fn minify(stylesheet: &mut Stylesheet, _options: MinifyOptions) {
    stylesheet.visit_mut_with(&mut compressor());
    stylesheet.visit_mut_with(&mut compress_at_rule());
}

#[inline]
fn is_css_wide_keywords(ident: &str) -> bool {
    match &*ident.to_ascii_lowercase() {
        "none"
        // CSS Values and Units Level 3: https://drafts.csswg.org/css-values-3/#common-keywords
        | "initial"
        | "inherit"
        | "unset"
        | "default"
        // CSS Cascading and Inheritance Level 5: https://drafts.csswg.org/css-cascade-5/#defaulting-keywords
        | "revert"
        | "revert-layer" => true,
        _ => false
    }
}
