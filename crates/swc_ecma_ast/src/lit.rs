use std::{
    borrow::Cow,
    fmt::{self, Display, Formatter},
    hash::{Hash, Hasher},
    mem,
};

use num_bigint::BigInt as BigIntValue;
use swc_atoms::{js_word, JsWord};
use swc_common::{ast_node, util::take::Take, EqIgnoreSpan, Span, DUMMY_SP};

use crate::jsx::JSXText;

#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
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
bridge_lit_from!(Str, JsWord);
bridge_lit_from!(Str, Cow<'_, str>);
bridge_lit_from!(Str, String);
bridge_lit_from!(Bool, bool);
bridge_lit_from!(Number, f64);
bridge_lit_from!(Number, usize);
bridge_lit_from!(BigInt, BigIntValue);

#[ast_node("BigIntLiteral")]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct BigInt {
    pub span: Span,
    #[cfg_attr(feature = "rkyv", with(EncodeBigInt))]
    pub value: BigIntValue,
}

#[cfg(feature = "rkyv")]
#[derive(Debug, Clone, Copy)]
pub struct EncodeBigInt;

#[cfg(feature = "rkyv")]
impl rkyv::with::ArchiveWith<BigIntValue> for EncodeBigInt {
    type Archived = rkyv::Archived<String>;
    type Resolver = rkyv::Resolver<String>;

    unsafe fn resolve_with(
        field: &BigIntValue,
        pos: usize,
        resolver: Self::Resolver,
        out: *mut Self::Archived,
    ) {
        use rkyv::Archive;

        let s = field.to_string();
        s.resolve(pos, resolver, out);
    }
}

#[cfg(feature = "rkyv")]
impl<S> rkyv::with::SerializeWith<BigIntValue, S> for EncodeBigInt
where
    S: ?Sized + rkyv::ser::Serializer,
{
    fn serialize_with(field: &BigIntValue, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        let field = field.to_string();
        rkyv::string::ArchivedString::serialize_from_str(&field, serializer)
    }
}

#[cfg(feature = "rkyv")]
impl<D> rkyv::with::DeserializeWith<rkyv::Archived<String>, BigIntValue, D> for EncodeBigInt
where
    D: ?Sized + rkyv::Fallible,
{
    fn deserialize_with(
        field: &rkyv::Archived<String>,
        deserializer: &mut D,
    ) -> Result<BigIntValue, D::Error> {
        use rkyv::Deserialize;

        let s: String = field.deserialize(deserializer)?;

        Ok(s.parse().unwrap())
    }
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for BigInt {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let span = u.arbitrary()?;
        let value = u.arbitrary::<usize>()?.into();

        Ok(Self { span, value })
    }
}

/// A string literal.
#[ast_node("StringLiteral")]
#[derive(Eq, Hash)]
pub struct Str {
    pub span: Span,

    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub value: JsWord,

    /// Use `None` value only for transformations to avoid recalculate escaped
    /// characters in strings
    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub raw: Option<JsWord>,
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
}

impl EqIgnoreSpan for Str {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        self.value == other.value
    }
}

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

    #[serde(rename = "pattern")]
    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub exp: JsWord,

    #[serde(default)]
    #[cfg_attr(feature = "rkyv", with(crate::EncodeJsWord))]
    pub flags: JsWord,
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
#[derive(Copy, EqIgnoreSpan)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
pub struct Number {
    pub span: Span,
    /// **Note**: This should not be `NaN`. Use [crate::Ident] to represent NaN.
    ///
    /// If you store `NaN` in this field, a hash map will behave strangely.
    #[use_eq]
    pub value: f64,
}

impl Eq for Number {}

#[allow(clippy::derive_hash_xor_eq)]
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

impl From<JsWord> for Str {
    #[inline]
    fn from(value: JsWord) -> Self {
        Str {
            span: DUMMY_SP,
            value,
            raw: None,
        }
    }
}

bridge_from!(Str, JsWord, &'_ str);
bridge_from!(Str, JsWord, String);
bridge_from!(Str, JsWord, Cow<'_, str>);

impl From<bool> for Bool {
    #[inline]
    fn from(value: bool) -> Self {
        Bool {
            span: DUMMY_SP,
            value,
        }
    }
}

impl From<f64> for Number {
    #[inline]
    fn from(value: f64) -> Self {
        Number {
            span: DUMMY_SP,
            value,
        }
    }
}

impl From<usize> for Number {
    #[inline]
    fn from(value: usize) -> Self {
        Number {
            span: DUMMY_SP,
            value: value as _,
        }
    }
}

impl From<BigIntValue> for BigInt {
    #[inline]
    fn from(value: BigIntValue) -> Self {
        BigInt {
            span: DUMMY_SP,
            value,
        }
    }
}
