#![feature(box_patterns)]
#![deny(clippy::all)]
#![allow(clippy::match_like_matches_macro)]
#![allow(clippy::needless_update)]

use swc_atoms::{js_word, JsWord};
use swc_css_ast::*;
use swc_css_visit::VisitMutWith;

use self::{compressor::compressor, options::MinifyOptions};

mod compressor;
pub mod options;
pub(crate) mod util;

pub fn minify(stylesheet: &mut Stylesheet, _options: MinifyOptions) {
    stylesheet.visit_mut_with(&mut compressor());
}

#[inline]
fn is_css_wide_keyword(ident: &JsWord) -> bool {
    matches_eq_ignore_ascii_case!(
        ident,
        // CSS Values and Units Level 3: https://drafts.csswg.org/css-values-3/#common-keywords
        js_word!("initial"),
        js_word!("inherit"),
        js_word!("unset"),
        js_word!("default"),
        // CSS Cascading and Inheritance Level 5: https://drafts.csswg.org/css-cascade-5/#defaulting-keywords
        js_word!("revert"),
        js_word!("revert-layer")
    )
}
