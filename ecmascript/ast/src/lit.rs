use std::fmt::{self, Display, Formatter};
use swc_macros::ast_node;

#[ast_node]
pub enum Lit {
    Str {
        value: String,
        /// This includes line escape.
        has_escape: bool,
    },
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
pub struct Number(pub f64);

impl Display for Number {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        if self.0.is_infinite() {
            if self.0.is_sign_positive() {
                Display::fmt("Infinity", f)
            } else {
                Display::fmt("-Infinity", f)
            }
        } else {
            Display::fmt(&self.0, f)
        }
    }
}
