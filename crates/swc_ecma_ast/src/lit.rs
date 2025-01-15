use std::{
    borrow::Cow,
    fmt::{self, Display, Formatter},
    hash::{Hash, Hasher},
};

use is_macro::Is;
use num_bigint::BigInt as BigIntValue;
use swc_atoms::{js_word, Atom};
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::jsx::JSXText;

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan, Is)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub enum Lit {
    #[tag("StringLiteral")]
    Str(Str),

    #[tag("BooleanLiteral")]
    Bool(Bool),

    #[tag("NullLiteral")]
    Null(Null),

    #[tag("NumericLiteral")]
    Num(Number),

    #[tag("BigIntLiteral")]
    BigInt(BigInt),

    #[tag("RegExpLiteral")]
    Regex(Regex),

    #[tag("JSXText")]
    JSXText(JSXText),
}

macro_rules! bridge_lit_from {
    ($bridge: ty, $src:ty) => {
        bridge_expr_from!(crate::Lit, $src);
        bridge_from!(Lit, $bridge, $src);
    };
}

bridge_expr_from!(Lit, Str);
bridge_expr_from!(Lit, Bool);
bridge_expr_from!(Lit, Number);
bridge_expr_from!(Lit, BigInt);
bridge_expr_from!(Lit, Regex);
bridge_expr_from!(Lit, Null);
bridge_expr_from!(Lit, JSXText);

bridge_lit_from!(Str, &'_ str);
bridge_lit_from!(Str, Atom);
bridge_lit_from!(Str, Cow<'_, str>);
bridge_lit_from!(Str, String);
bridge_lit_from!(Bool, bool);
bridge_lit_from!(Number, f64);
bridge_lit_from!(Number, usize);
bridge_lit_from!(BigInt, BigIntValue);

impl Lit {
    pub fn set_span(&mut self, span: Span) {
        match self {
            Lit::Str(s) => s.span = span,
            Lit::Bool(b) => b.span = span,
            Lit::Null(n) => n.span = span,
            Lit::Num(n) => n.span = span,
            Lit::BigInt(n) => n.span = span,
            Lit::Regex(n) => n.span = span,
            Lit::JSXText(n) => n.span = span,
        }
    }
}

#[ast_node("BigIntLiteral")]
#[derive(Eq, Hash)]
pub struct BigInt {
    pub span: Span,
    #[cfg_attr(any(feature = "rkyv-impl"), rkyv(with = EncodeBigInt))]
    pub value: Box<BigIntValue>,

    /// Use `None` value only for transformations to avoid recalculate
    /// characters in big integer
    pub raw: Option<Atom>,
}

impl EqIgnoreSpan for BigInt {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

#[cfg(feature = "rkyv-impl")]
#[derive(Debug, Clone, Copy)]
#[cfg_attr(feature = "rkyv-impl", derive(bytecheck::CheckBytes))]
#[cfg_attr(feature = "rkyv-impl", repr(C))]
pub struct EncodeBigInt;

#[cfg(feature = "rkyv-impl")]
impl rkyv::with::ArchiveWith<Box<BigIntValue>> for EncodeBigInt {
    type Archived = rkyv::Archived<String>;
    type Resolver = rkyv::Resolver<String>;

    fn resolve_with(
        field: &Box<BigIntValue>,
        resolver: Self::Resolver,
        out: rkyv::Place<Self::Archived>,
    ) {
        use rkyv::Archive;

        let s = field.to_string();
        s.resolve(resolver, out);
    }
}

#[cfg(feature = "rkyv-impl")]
impl<S> rkyv::with::SerializeWith<Box<BigIntValue>, S> for EncodeBigInt
where
    S: ?Sized + rancor::Fallible + rkyv::ser::Writer,
    S::Error: rancor::Source,
{
    fn serialize_with(
        field: &Box<BigIntValue>,
        serializer: &mut S,
    ) -> Result<Self::Resolver, S::Error> {
        let field = field.to_string();
        rkyv::string::ArchivedString::serialize_from_str(&field, serializer)
    }
}

#[cfg(feature = "rkyv-impl")]
impl<D> rkyv::with::DeserializeWith<rkyv::Archived<String>, Box<BigIntValue>, D> for EncodeBigInt
where
    D: ?Sized + rancor::Fallible,
{
    fn deserialize_with(
        field: &rkyv::Archived<String>,
        deserializer: &mut D,
    ) -> Result<Box<BigIntValue>, D::Error> {
        use rkyv::Deserialize;

        let s: String = field.deserialize(deserializer)?;

        Ok(Box::new(s.parse().unwrap()))
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for BigInt {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = Box::new(u.arbitrary::<usize>()?.into());
        let raw = Some(u.arbitrary::<String>()?.into());

        Ok(Self { span, value, raw })
    }
}

impl From<BigIntValue> for BigInt {
    #[inline]
    fn from(value: BigIntValue) -> Self {
        BigInt {
            span: DUMMY_SP,
            value: Box::new(value),
            raw: None,
        }
    }
}

/// A string literal.
#[ast_node("StringLiteral")]
#[derive(Eq, Hash)]
pub struct Str {
    pub span: Span,

    pub value: Atom,

    /// Use `None` value only for transformations to avoid recalculate escaped
    /// characters in strings
    pub raw: Option<Atom>,
}

impl Take for Str {
    fn dummy() -> Self {
        Str {
            span: DUMMY_SP,
            value: js_word!(""),
            raw: None,
        }
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Str {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = u.arbitrary::<String>()?.into();
        let raw = Some(u.arbitrary::<String>()?.into());

        Ok(Self { span, value, raw })
    }
}

impl Str {
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.value.is_empty()
    }

    pub fn from_tpl_raw(tpl_raw: &str) -> Atom {
        let mut buf = String::with_capacity(tpl_raw.len());

        let mut iter = tpl_raw.chars();

        while let Some(c) = iter.next() {
            match c {
                '\\' => {
                    if let Some(next) = iter.next() {
                        match next {
                            '`' | '$' | '\\' => {
                                buf.push(next);
                            }
                            'b' => {
                                buf.push('\u{0008}');
                            }
                            'f' => {
                                buf.push('\u{000C}');
                            }
                            'n' => {
                                buf.push('\n');
                            }
                            'r' => {
                                buf.push('\r');
                            }
                            't' => {
                                buf.push('\t');
                            }
                            'v' => {
                                buf.push('\u{000B}');
                            }
                            _ => {
                                buf.push('\\');
                                buf.push(next);
                            }
                        }
                    }
                }

                c => {
                    buf.push(c);
                }
            }
        }

        buf.into()
    }
}

impl EqIgnoreSpan for Str {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

impl From<Atom> for Str {
    #[inline]
    fn from(value: Atom) -> Self {
        Str {
            span: DUMMY_SP,
            value,
            raw: None,
        }
    }
}

bridge_from!(Str, Atom, &'_ str);
bridge_from!(Str, Atom, String);
bridge_from!(Str, Atom, Cow<'_, str>);

/// A boolean literal.
///
///
/// # Creation
///
/// If you are creating a boolean literal with a dummy span, please use
/// `true.into()` or `false.into()`, instead of creating this struct directly.
///
/// All of `Box<Expr>`, `Expr`, `Lit`, `Bool` implements `From<bool>`.
#[ast_node("BooleanLiteral")]
#[derive(Copy, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Bool {
    pub span: Span,
    pub value: bool,
}

impl Take for Bool {
    fn dummy() -> Self {
        Bool {
            span: DUMMY_SP,
            value: false,
        }
    }
}

impl From<bool> for Bool {
    #[inline]
    fn from(value: bool) -> Self {
        Bool {
            span: DUMMY_SP,
            value,
        }
    }
}

#[ast_node("NullLiteral")]
#[derive(Copy, Eq, Hash, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Null {
    pub span: Span,
}

impl Take for Null {
    fn dummy() -> Self {
        Null { span: DUMMY_SP }
    }
}

#[ast_node("RegExpLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Regex {
    pub span: Span,

    #[cfg_attr(feature = "serde-impl", serde(rename = "pattern"))]
    pub exp: Atom,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub flags: Atom,
}

impl Take for Regex {
    fn dummy() -> Self {
        Self {
            span: DUMMY_SP,
            exp: Default::default(),
            flags: Default::default(),
        }
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Regex {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let exp = u.arbitrary::<String>()?.into();
        let flags = "".into(); // TODO

        Ok(Self { span, exp, flags })
    }
}

/// A numeric literal.
///
///
/// # Creation
///
/// If you are creating a numeric literal with a dummy span, please use
/// `literal.into()`, instead of creating this struct directly.
///
/// All of `Box<Expr>`, `Expr`, `Lit`, `Number` implements `From<64>` and
/// `From<usize>`.

#[ast_node("NumericLiteral")]
pub struct Number {
    pub span: Span,
    /// **Note**: This should not be `NaN`. Use [crate::Ident] to represent NaN.
    ///
    /// If you store `NaN` in this field, a hash map will behave strangely.
    pub value: f64,

    /// Use `None` value only for transformations to avoid recalculate
    /// characters in number literal
    pub raw: Option<Atom>,
}

impl Eq for Number {}

impl EqIgnoreSpan for Number {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value && self.value.is_sign_positive() == other.value.is_sign_positive()
    }
}

#[allow(clippy::derived_hash_with_manual_eq)]
#[allow(clippy::transmute_float_to_int)]
impl Hash for Number {
    fn hash<H: Hasher>(&self, state: &mut H) {
        fn integer_decode(val: f64) -> (u64, i16, i8) {
            let bits: u64 = val.to_bits();
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
        self.raw.hash(state);
    }
}

impl Display for Number {
    fn fmt(&self, f: &mut Formatter<'_>) -> fmt::Result {
        if self.value.is_infinite() {
            if self.value.is_sign_positive() {
                Display::fmt("Infinity", f)
            } else {
                Display::fmt("-Infinity", f)
            }
        } else {
            Display::fmt(&self.value, f)
        }
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Number {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = u.arbitrary::<f64>()?;
        let raw = Some(u.arbitrary::<String>()?.into());

        Ok(Self { span, value, raw })
    }
}

impl From<f64> for Number {
    #[inline]
    fn from(value: f64) -> Self {
        Number {
            span: DUMMY_SP,
            value,
            raw: None,
        }
    }
}

impl From<usize> for Number {
    #[inline]
    fn from(value: usize) -> Self {
        Number {
            span: DUMMY_SP,
            value: value as _,
            raw: None,
        }
    }
}
