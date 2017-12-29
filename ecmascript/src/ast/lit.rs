use swc_macros::ast_node;

#[ast_node]
pub enum Lit {
    Str(String),
    Bool(bool),
    Null,
    Num(Num),
    Regex(Regex),
}

#[ast_node]
pub enum Num {
    Dec(usize),
    /// bool field is true if it starts with '0o' and false if it starts with
    /// '0O'.
    LegacyOct(bool, usize),
}

#[ast_node]
pub struct Regex {
    pub exp: String,
    #[fold = "regex_flags"]
    pub flags: RegexFlags,
}

pub type RegexFlags = ::swc_atoms::JsWord;
