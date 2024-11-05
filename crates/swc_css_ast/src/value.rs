use std::{
    hash::{Hash, Hasher},
    mem,
};

use is_macro::Is;
use string_enum::StringEnum;
use swc_atoms::Atom;
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span};

use crate::Function;

#[ast_node("Ident")]
#[derive(Eq, PartialOrd, Ord, Hash)]
pub struct Ident {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for Ident {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl PartialEq<str> for Ident {
    #[inline]
    fn eq(&self, other: &str) -> bool {
        &*self.value == other
    }
}

impl Take for Ident {
    #[inline]
    fn dummy() -> Self {
        Self {
            span: Default::default(),
            value: Default::default(),
            raw: Default::default(),
        }
    }
}

#[ast_node("CustomIdent")]
#[derive(Eq, Hash)]
pub struct CustomIdent {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for CustomIdent {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

#[ast_node("DashedIdent")]
#[derive(Eq, Hash)]
pub struct DashedIdent {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for DashedIdent {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl PartialEq<str> for DashedIdent {
    #[inline]
    fn eq(&self, other: &str) -> bool {
        &*self.value == other
    }
}

#[ast_node("CustomPropertyName")]
#[derive(Eq, Hash)]
pub struct CustomPropertyName {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for CustomPropertyName {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

/// Quoted string.
#[ast_node("String")]
#[derive(Eq, Hash)]
pub struct Str {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for Str {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
pub enum DelimiterValue {
    /// `,`
    Comma,
    /// `/`
    Solidus,
    /// `;`
    Semicolon,
}

#[ast_node("Delimiter")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Delimiter {
    pub span: Span,
    pub value: DelimiterValue,
}

// TODO small AST improve for `CurrentColorOrSystemColor` and
// `NamedColorOrTransparent`
#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum Color {
    #[tag("AbsoluteColorBase")]
    AbsoluteColorBase(AbsoluteColorBase),
    #[tag("Ident")]
    CurrentColorOrSystemColor(Ident),
    // <device-cmyk()> only
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AbsoluteColorBase {
    #[tag("HexColor")]
    HexColor(HexColor),
    #[tag("Ident")]
    NamedColorOrTransparent(Ident),
    #[tag("Function")]
    Function(Function),
}

#[ast_node("HexColor")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct HexColor {
    /// Includes `#`
    pub span: Span,
    /// Does **not** include `#`
    pub value: Atom,
    /// Does **not** include `#`
    pub raw: Option<Atom>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AlphaValue {
    #[tag("Number")]
    Number(Number),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum Hue {
    #[tag("Number")]
    Number(Number),
    #[tag("Angle")]
    Angle(Angle),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum CmykComponent {
    #[tag("Number")]
    Number(Number),
    #[tag("Percentage")]
    Percentage(Percentage),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Length {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Angle")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Angle {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Time")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Time {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Frequency")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Frequency {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Resolution")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Resolution {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Flex")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Flex {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("UnknownDimension")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct UnknownDimension {
    pub span: Span,
    pub value: Number,
    pub unit: Ident,
}

#[ast_node("Percentage")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Percentage {
    pub span: Span,
    pub value: Number,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum LengthPercentage {
    #[tag("Length")]
    Length(Length),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum FrequencyPercentage {
    #[tag("Frequency")]
    Frequency(Frequency),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum AnglePercentage {
    #[tag("Angle")]
    Angle(Angle),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum TimePercentage {
    #[tag("Time")]
    Time(Time),
    #[tag("Percentage")]
    Percentage(Percentage),
}

#[ast_node("Integer")]
#[derive(Eq, Hash)]
pub struct Integer {
    pub span: Span,
    pub value: i64,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for Integer {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

#[ast_node("Number")]
pub struct Number {
    pub span: Span,
    pub value: f64,
    pub raw: Option<Atom>,
}

impl Eq for Number {}

#[allow(clippy::derived_hash_with_manual_eq)]
#[allow(clippy::transmute_float_to_int)]
impl Hash for Number {
    fn hash<H: Hasher>(&self, state: &mut H) {
        fn integer_decode(val: f64) -> (u64, i16, i8) {
            let bits: u64 = unsafe { mem::transmute(val) };
            let sign: i8 = if bits >> 63 == 0 { 1 } else { -1 };
            let mut exponent: i16 = ((bits >> 52) & 0x7ff) as i16;
            let mantissa = if exponent == 0 {
                (bits & 0xfffffffffffff) << 1
            } else {
                (bits & 0xfffffffffffff) | 0x10000000000000
            };

            exponent -= 1023 + 52;
            (mantissa, exponent, sign)
        }

        self.span.hash(state);
        integer_decode(self.value).hash(state);
    }
}

impl EqIgnoreSpan for Number {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

#[ast_node("Ratio")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Ratio {
    pub span: Span,
    pub left: Number,
    pub right: Option<Number>,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "rkyv", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv", repr(u32))]
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
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Url {
    pub span: Span,
    pub name: Ident,
    pub value: Option<Box<UrlValue>>,
    pub modifiers: Option<Vec<UrlModifier>>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum UrlValue {
    #[tag("Str")]
    Str(Str),
    #[tag("UrlValueRaw")]
    Raw(UrlValueRaw),
}

#[ast_node("UrlValueRaw")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct UrlValueRaw {
    pub span: Span,

    pub value: Atom,
    pub raw: Option<Atom>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum UrlModifier {
    #[tag("Ident")]
    Ident(Ident),
    #[tag("Function")]
    Function(Function),
}

#[ast_node("UnicodeRange")]
#[derive(Eq, Hash)]
pub struct UnicodeRange {
    pub span: Span,

    pub start: Atom,

    pub end: Option<Atom>,
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for UnicodeRange {
    #[inline]
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.start == other.start && self.end == other.end
    }
}

#[ast_node("CalcSum")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CalcSum {
    pub span: Span,
    pub expressions: Vec<CalcProductOrOperator>,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum CalcProductOrOperator {
    #[tag("CalcProduct")]
    Product(CalcProduct),
    #[tag("CalcOperator")]
    Operator(CalcOperator),
}

#[ast_node("CalcProduct")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CalcProduct {
    pub span: Span,
    pub expressions: Vec<CalcValueOrOperator>,
}

#[ast_node("CalcOperator")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CalcOperator {
    pub span: Span,
    pub value: CalcOperatorType,
}

#[derive(StringEnum, Clone, Copy, Eq, PartialEq, PartialOrd, Ord, Hash, Is, EqIgnoreSpan)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(
    feature = "rkyv",
    rkyv(serialize_bounds(__S: rkyv::ser::Writer + rkyv::ser::Allocator,
        __S::Error: rkyv::rancor::Source))
)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(u32))]
pub enum CalcOperatorType {
    /// `+`
    Add,
    /// `-`
    Sub,
    /// `*`
    Mul,
    /// `/`
    Div,
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum CalcValueOrOperator {
    #[tag("CalcValue")]
    Value(CalcValue),
    #[tag("CalcOperator")]
    Operator(CalcOperator),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum CalcValue {
    #[tag("Number")]
    Number(Number),
    #[tag("Dimension")]
    Dimension(Dimension),
    #[tag("Percentage")]
    Percentage(Percentage),
    #[tag("Ident")]
    Constant(Ident),
    #[tag("CalcSum")]
    Sum(CalcSum),
    #[tag("Function")]
    Function(Function),
}

#[ast_node]
#[derive(Eq, Hash, Is, EqIgnoreSpan)]
pub enum FamilyName {
    #[tag("Str")]
    Str(Str),
    #[tag("SequenceOfCustomIdents")]
    SequenceOfCustomIdents(SequenceOfCustomIdents),
}

#[ast_node("SequenceOfCustomIdents")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct SequenceOfCustomIdents {
    pub span: Span,
    pub value: Vec<CustomIdent>,
}
