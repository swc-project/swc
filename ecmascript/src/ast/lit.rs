use swc_macros::ast_node;
pub use token::Number;

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
