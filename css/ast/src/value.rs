use crate::{Num, Str, Text, Tokens, Unit};
use swc_common::{ast_node, Span};

#[ast_node]
pub enum LazyValues {
    /// This variant means we didn't parsed token yet.
    #[tag("Tokens")]
    Tokens(Tokens),

    #[tag("Values")]
    Parsed(Values),
}

#[ast_node("Values")]
pub struct Values {
    pub span: Span,
    pub values: Vec<Value>,
}

#[ast_node]
pub enum Value {
    #[tag("ParenValue")]
    Paren(ParenValue),

    #[tag("UnitValue")]
    Unit(UnitValue),

    #[tag("Number")]
    Number(Num),

    #[tag("PercentValue")]
    Percent(PercentValue),

    #[tag("HashValue")]
    Hash(HashValue),

    #[tag("Text")]
    Text(Text),

    #[tag("String")]
    Str(Str),

    #[tag("FnValue")]
    Fn(FnValue),
}

#[ast_node("FnValue")]
pub struct FnValue {
    /// Span starting from the `lo` of identifer and to the end of `)`.
    pub span: Span,

    pub name: Text,

    pub args: Vec<Value>,
}

#[ast_node("ParenValue")]
pub struct ParenValue {
    /// Includes `(` and `)`.
    pub span: Span,

    pub value: Box<Value>,
}

#[ast_node("HashValue")]
pub struct HashValue {
    /// Includes `#`
    pub span: Span,
    /// Does **not** include `#`
    pub value: Text,
}

#[ast_node("UnitValue")]
pub struct UnitValue {
    pub span: Span,
    pub value: Num,
    pub unit: Unit,
}

#[ast_node("PercentValue")]
pub struct PercentValue {
    pub span: Span,
    pub value: Num,
}
