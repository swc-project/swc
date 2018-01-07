use std::fmt::{self, Display, Formatter};
use swc_macros::ast_node;

#[ast_node]
pub enum Lit {
    Str(String),
    Bool(bool),
    Null,
    Num(Number),
    Regex(Regex),
}

#[ast_node]
pub struct Regex {
    pub exp: String,
    #[fold = "regex_flags"]
    pub flags: RegexFlags,
}

pub type RegexFlags = ::swc_atoms::JsWord;
#[ast_node]
pub enum Number {
    Infinity,
    Float(f64),
    Decimal(i64),
    ImplicitOctal(i64),
}
impl Display for Number {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        match *self {
            Number::Infinity => Display::fmt(&"Infinity", f),
            Number::Float(ref fl) => Display::fmt(fl, f),
            Number::Decimal(ref dec) => Display::fmt(dec, f),
            Number::ImplicitOctal(ref v) => Display::fmt(v, f),
        }
    }
}
