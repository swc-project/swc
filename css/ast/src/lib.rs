//! AST definitions for CSS.
pub use self::{
    at_rule::*, base::*, property::*, selector::*, style_rule::*, token::*, unit::*, value::*,
};
use is_macro::Is;
use swc_common::{ast_node, Span};

mod at_rule;
mod base;
mod property;
mod selector;
mod style_rule;
mod token;
mod unit;
mod value;

#[ast_node("Stylesheet")]
pub struct Stylesheet {
    pub span: Span,
    pub rules: Vec<Rule>,
}

#[ast_node]
#[derive(Is)]
pub enum Rule {
    #[tag("StyleRule")]
    Style(StyleRule),

    #[tag("*")]
    AtRule(AtRule),
}

#[ast_node]
pub struct Invalid {
    pub span: Span,
}
