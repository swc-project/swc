use crate::{Num, Str, Text, Tokens, Unit};
use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

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

    #[tag("BinValue")]
    Bin(BinValue),

    #[tag("ArrayValue")]
    Array(ArrayValue),

    #[tag("SpaceValues")]
    Space(SpaceValues),

    #[tag("CommaValues")]
    Comma(CommaValues),

    #[tag("BraceValue")]
    Brace(BraceValue),

    #[tag("Tokens")]
    Lazy(Tokens),

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

    pub value: Option<Box<Value>>,
}

#[ast_node("ArrayValue")]
pub struct ArrayValue {
    /// Includes `[` and `]`.
    pub span: Span,

    /// Comma separated list of values.
    pub values: Vec<Value>,
}

#[ast_node("HashValue")]
pub struct HashValue {
    /// Includes `#`
    pub span: Span,
    /// Does **not** include `#`
    pub value: JsWord,
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

/// Values starting with `{` and ending with `}`.
#[ast_node("BraceValue")]
pub struct BraceValue {
    pub span: Span,
    pub value: Box<Value>,
}

#[ast_node("AtTextValue")]
pub struct AtTextValue {
    pub span: Span,
    /// Includes `@`.
    pub name: Text,
    pub block: Option<BraceValue>,
}

#[ast_node("UrlValue")]
pub struct UrlValue {
    pub span: Span,

    pub url: JsWord,
}
