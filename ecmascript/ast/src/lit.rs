use crate::jsx::JSXText;
use std::fmt::{self, Display, Formatter};
use swc_atoms::JsWord;
use swc_common::{ast_node, Span};

#[ast_node]
pub enum Lit {
    Str(Str),

    Bool(Bool),

    Null(Null),

    Num(Number),

    Regex(Regex),

    JSXText(JSXText),
}

#[ast_node("StringLiteral")]
pub struct Str {
    #[serde(default)]
    pub span: Span,

    pub value: JsWord,

    /// This includes line escape.
    #[serde(default)]
    pub has_escape: bool,
}
impl Str {
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }
}

#[ast_node("BooleanLiteral")]
#[derive(Copy)]
pub struct Bool {
    #[serde(default)]
    pub span: Span,
    pub value: bool,
}

#[ast_node("NullLiteral")]
#[derive(Copy)]
pub struct Null {
    #[serde(default)]
    pub span: Span,
}

#[ast_node("RegExpLiteral")]
pub struct Regex {
    #[serde(default)]
    pub span: Span,

    #[serde(rename = "pattern")]
    pub exp: Str,

    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub flags: Option<RegexFlags>,
}

pub type RegexFlags = Str;

#[ast_node("NumericLiteral")]
#[derive(Copy)]
pub struct Number {
    #[serde(default)]
    pub span: Span,
    pub value: f64,
}

impl Display for Number {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if self.value.is_infinite() {
            if self.value.is_sign_positive() {
                Display::fmt("Infinity", f)
            } else {
                Display::fmt("-Infinity", f)
            }
        } else {
            Display::fmt(&self.value, f)
        }
    }
}
