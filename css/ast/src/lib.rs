//! AST definitions for CSS.
pub use self::at_rule::*;
pub use self::base::*;
pub use self::property::*;
pub use self::selector::*;
pub use self::style_rule::*;
pub use self::token::*;
pub use self::unit::*;
pub use self::value::*;
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
