use crate::{Ident, Num, SimpleBlock, Str, Tokens};
use crate::{Ident, Str, Tokens};
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

#[ast_node]
pub enum Value {
    #[tag("SimpleBlock")]
    SimpleBlock(SimpleBlock),

    #[tag("UnitValue")]
    Unit(UnitValue),

    #[tag("Number")]
    Number(Number),

    #[tag("PercentValue")]
    Percent(PercentValue),

    #[tag("Ratio")]
    Ratio(Ratio),

    #[tag("HashValue")]
    Hash(HashValue),

    #[tag("Ident")]
    Ident(Ident),

    #[tag("String")]
    Str(Str),

    #[tag("Function")]
    Function(Function),

    #[tag("BinValue")]
    Bin(BinValue),

    #[tag("SpaceValues")]
    Space(SpaceValues),

    #[tag("CommaValues")]
    Comma(CommaValues),

    #[tag("Tokens")]
    Tokens(Tokens),

    #[tag("AtTextValue")]
    AtText(AtTextValue),

    #[tag("UrlValue")]
    Url(UrlValue),
}

/// List of values separated by a space.
#[ast_node("SpaceValues")]
#[derive(Default)]
pub struct SpaceValues {
    pub span: Span,
    pub values: Vec<Value>,
}

/// List of values separated by a space.
#[ast_node("CommaValues")]
#[derive(Default)]
pub struct CommaValues {
    pub span: Span,
    pub values: Vec<Value>,
}

#[ast_node("BinValue")]
pub struct BinValue {
    pub span: Span,

    pub op: BinOp,

    pub left: Box<Value>,

    pub right: Box<Value>,
}

#[ast_node("Function")]
pub struct Function {
    /// Span starting from the `lo` of identifier and to the end of `)`.
    pub span: Span,
    pub name: Ident,
    pub value: Vec<Value>,
}

#[ast_node("HashValue")]
pub struct HashValue {
    /// Includes `#`
    pub span: Span,
    /// Does **not** include `#`
    pub value: JsWord,
    /// Does **not** include `#`
    pub raw: JsWord,
}

#[ast_node]
pub struct Unit {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("UnitValue")]
pub struct UnitValue {
    pub span: Span,
    pub value: Number,
    pub unit: Unit,
}

#[ast_node("PercentValue")]
pub struct PercentValue {
    pub span: Span,
    pub value: Number,
}

#[ast_node("Number")]
pub struct Number {
    pub span: Span,
    pub value: f64,
    pub raw: JsWord,
}

#[ast_node("Ratio")]
pub struct Ratio {
    pub span: Span,
    pub left: Number,
    pub right: Option<Number>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum BinOp {
    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
}

#[ast_node("AtTextValue")]
pub struct AtTextValue {
    pub span: Span,
    /// Includes `@`.
    pub name: Ident,
    pub block: Option<SimpleBlock>,
}

#[ast_node("UrlValue")]
pub struct UrlValue {
    pub span: Span,
    pub url: JsWord,
    pub raw: JsWord,
}
