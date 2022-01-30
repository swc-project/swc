use crate::{DashedIdent, Ident, SimpleBlock, Str, Tokens};
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

    #[tag("Percent")]
    Percent(Percent),

    #[tag("Ratio")]
    Ratio(Ratio),

    #[tag("HashValue")]
    Hash(HashValue),

    #[tag("Ident")]
    Ident(Ident),

    #[tag("DashedIdent")]
    DashedIdent(DashedIdent),

    #[tag("String")]
    Str(Str),

    #[tag("Function")]
    Function(Function),

    #[tag("BinValue")]
    Bin(BinValue),

    #[tag("Delimiter")]
    Delimiter(Delimiter),

    #[tag("Tokens")]
    Tokens(Tokens),

    #[tag("AtTextValue")]
    AtText(AtTextValue),

    #[tag("Url")]
    Url(Url),
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum DelimiterValue {
    /// `,`
    Comma,
    /// `/`
    Solidus,
}

#[ast_node("Delimiter")]
pub struct Delimiter {
    pub span: Span,
    pub value: DelimiterValue,
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

#[ast_node("Percent")]
pub struct Percent {
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

#[ast_node("Url")]
pub struct Url {
    pub span: Span,
    pub name: Ident,
    pub value: Option<UrlValue>,
    pub modifiers: Option<Vec<UrlModifier>>,
}

#[ast_node]
pub enum UrlValue {
    #[tag("Str")]
    Str(Str),
    #[tag("UrlValueRaw")]
    Raw(UrlValueRaw),
}

#[ast_node("UrlValueRaw")]
pub struct UrlValueRaw {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node]
pub enum UrlModifier {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Function")]
    Function(Function),
}
