use string_enum::StringEnum;
use swc_atoms::JsWord;
use swc_common::{ast_node, EqIgnoreSpan, Span};

use crate::{SimpleBlock, TokenAndSpan};

#[ast_node]
pub enum Value {
    #[tag("SimpleBlock")]
    SimpleBlock(SimpleBlock),

    #[tag("Dimension")]
    Dimension(Dimension),

    #[tag("Number")]
    Number(Number),

    #[tag("Percentage")]
    Percentage(Percentage),

    #[tag("Ratio")]
    Ratio(Ratio),

    #[tag("Color")]
    Color(Color),

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

    #[tag("Url")]
    Url(Url),

    #[tag("Urange")]
    Urange(Urange),

    #[tag("PreservedToken")]
    PreservedToken(TokenAndSpan),
}

#[ast_node("Ident")]
pub struct Ident {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("CustomIdent")]
pub struct CustomIdent {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[ast_node("DashedIdent")]
pub struct DashedIdent {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

/// Quoted string.
#[ast_node("String")]
pub struct Str {
    pub span: Span,
    pub value: JsWord,
    pub raw: JsWord,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, EqIgnoreSpan)]
pub enum DelimiterValue {
    /// `,`
    Comma,
    /// `/`
    Solidus,
    /// `;`
    Semicolon,
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

#[ast_node]
pub enum Color {
    // TODO more
    #[tag("HexColor")]
    HexColor(HexColor),
}

#[ast_node("HexColor")]
pub struct HexColor {
    /// Includes `#`
    pub span: Span,
    /// Does **not** include `#`
    pub value: JsWord,
    /// Does **not** include `#`
    pub raw: JsWord,
}

#[ast_node]
pub enum Dimension {
    #[tag("Length")]
    Length(Length),

    #[tag("Angle")]
    Angle(Angle),

    #[tag("Time")]
    Time(Time),

    #[tag("Frequency")]
    Frequency(Frequency),

    #[tag("Resolution")]
    Resolution(Resolution),

    #[tag("Flex")]
    Flex(Flex),

    #[tag("UnknownDimension")]
    UnknownDimension(UnknownDimension),
}

#[ast_node("Length")]
pub struct Length {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Angle")]
pub struct Angle {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Time")]
pub struct Time {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Frequency")]
pub struct Frequency {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Resolution")]
pub struct Resolution {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Flex")]
pub struct Flex {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("UnknownDimension")]
pub struct UnknownDimension {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Percentage")]
pub struct Percentage {
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
    pub before: JsWord,
    pub after: JsWord,
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

#[ast_node("Urange")]
pub struct Urange {
    pub span: Span,
    pub value: JsWord,
}
