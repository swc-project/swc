pub use self::{inline_globals::InlineGlobals, json_parse::JsonParse, simplify::simplifier};

mod inline_globals;
mod json_parse;
pub mod minify;
pub mod simplify;
