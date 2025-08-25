#![deny(clippy::all)]
#![deny(unused)]
#![allow(clippy::match_like_matches_macro)]

pub use self::{
    const_modules::const_modules,
    debug::{debug_assert_valid, AssertValid},
    inline_globals::{inline_globals, inline_globals2, GlobalExprMap},
    json_parse::json_parse,
    simplify::simplifier,
};

mod const_modules;
mod debug;
mod inline_globals;
mod json_parse;
pub mod simplify;
