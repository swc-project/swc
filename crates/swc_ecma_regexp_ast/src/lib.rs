use bitflags::bitflags;
use is_macro::Is;
use swc_atoms::Atom;
use swc_common::{ast_node, EqIgnoreSpan, Span};

mod display;

/// The root of the `PatternParser` result.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Pattern {
    pub span: Span,
    pub body: Disjunction,
}

/// Pile of [`Alternative`]s separated by `|`.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Disjunction {
    pub span: Span,
    pub body: Vec<Alternative>,
}

/// Single unit of `|` separated alternatives.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Alternative {
    pub span: Span,
    pub body: Vec<Term>,
}

/// Single unit of [`Alternative`], containing various kinds.
#[ast_node(no_unknown)]
#[derive(Eq, Hash, EqIgnoreSpan, Is)]
pub enum Term {
    // Assertion
    // QuantifiableAssertion
    #[tag("BoundaryAssertion")]
    BoundaryAssertion(Box<BoundaryAssertion>),

    #[tag("LookAroundAssertion")]
    LookAroundAssertion(Box<LookAroundAssertion>),

    #[tag("Quantifier")]
    Quantifier(Box<Quantifier>),

    // Atom
    // ExtendedAtom
    #[tag("Character")]
    Character(Box<Character>),

    #[tag("CharacterClassEscape")]
    Dot(Dot),

    #[tag("CharacterClassEscape")]
    CharacterClassEscape(Box<CharacterClassEscape>),

    #[tag("UnicodePropertyEscape")]
    UnicodePropertyEscape(Box<UnicodePropertyEscape>),

    #[tag("ClassStringDisjunction")]
    CharacterClass(Box<CharacterClass>),

    #[tag("ClassStringDisjunction")]
    CapturingGroup(Box<CapturingGroup>),

    #[tag("ClassStringDisjunction")]
    IgnoreGroup(Box<IgnoreGroup>),

    #[tag("ClassStringDisjunction")]
    IndexedReference(Box<IndexedReference>),

    #[tag("ClassStringDisjunction")]
    NamedReference(Box<NamedReference>),
}

/// Simple form of assertion.
/// e.g. `^`, `$`, `\b`, `\B`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct BoundaryAssertion {
    pub span: Span,
    #[use_eq]
    pub kind: BoundaryAssertionKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum BoundaryAssertionKind {
    Start = 0,
    End = 1,
    Boundary = 2,
    NegativeBoundary = 3,
}

/// Lookaround assertion.
/// e.g. `(?=...)`, `(?!...)`, `(?<=...)`, `(?<!...)`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct LookAroundAssertion {
    pub span: Span,
    #[use_eq]
    pub kind: LookAroundAssertionKind,
    pub body: Disjunction,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum LookAroundAssertionKind {
    Lookahead = 0,
    NegativeLookahead = 1,
    Lookbehind = 2,
    NegativeLookbehind = 3,
}

/// Quantifier holding a [`Term`] and its repetition count.
/// e.g. `a*`, `b+`, `c?`, `d{3}`, `e{4,}`, `f{5,6}`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Quantifier {
    pub span: Span,
    pub min: u64,
    /// `None` means no upper bound.
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub max: Option<u64>,
    pub greedy: bool,
    pub body: Term,
}

/// Single character.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Character {
    /// This will be invalid position when `UnicodeMode` is disabled and `value`
    /// is a surrogate pair.
    pub span: Span,
    #[use_eq]
    pub kind: CharacterKind,
    /// Unicode code point or UTF-16 code unit.
    pub value: u32,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum CharacterKind {
    ControlLetter = 0,
    HexadecimalEscape = 1,
    Identifier = 2,
    Null = 3,
    // To distinguish leading 0 cases like `\00` and `\000`
    Octal1 = 4,
    Octal2 = 5,
    Octal3 = 6,
    SingleEscape = 7,
    Symbol = 8,
    UnicodeEscape = 9,
}

/// Character class.
/// e.g. `\d`, `\D`, `\s`, `\S`, `\w`, `\W`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CharacterClassEscape {
    pub span: Span,
    #[use_eq]
    pub kind: CharacterClassEscapeKind,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum CharacterClassEscapeKind {
    D = 0,
    NegativeD = 1,
    S = 2,
    NegativeS = 3,
    W = 4,
    NegativeW = 5,
}

/// Unicode property.
/// e.g. `\p{ASCII}`, `\P{ASCII}`, `\p{sc=Hiragana}`, `\P{sc=Hiragana}`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct UnicodePropertyEscape {
    pub span: Span,
    pub negative: bool,
    /// `true` if `UnicodeSetsMode` and `name` matches unicode property of
    /// strings.
    pub strings: bool,
    pub name: Atom,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub value: Option<Atom>,
}

/// The `.`.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Dot {
    pub span: Span,
}

/// Character class wrapped by `[]`.
/// e.g. `[a-z]`, `[^A-Z]`, `[abc]`, `[a&&b&&c]`, `[[a-z]--x--y]`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CharacterClass {
    pub span: Span,
    pub negative: bool,
    /// `true` if:
    /// - `body` contains [`UnicodePropertyEscape`], nested [`CharacterClass`]
    ///   or [`ClassStringDisjunction`] which `strings` is `true`
    /// - and matches each logic depends on `kind`
    pub strings: bool,
    #[use_eq]
    pub kind: CharacterClassContentsKind,
    pub body: Vec<CharacterClassContents>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::swc_common::Encode, ::swc_common::Decode)
)]
pub enum CharacterClassContentsKind {
    Union = 0,
    /// `UnicodeSetsMode` only.
    Intersection = 1,
    /// `UnicodeSetsMode` only.
    Subtraction = 2,
}

#[ast_node(no_unknown)]
#[derive(Eq, Hash, EqIgnoreSpan, Is)]
pub enum CharacterClassContents {
    #[tag("CharacterClassRange")]
    CharacterClassRange(Box<CharacterClassRange>),

    #[tag("CharacterClassEscape")]
    CharacterClassEscape(Box<CharacterClassEscape>),

    #[tag("UnicodePropertyEscape")]
    UnicodePropertyEscape(Box<UnicodePropertyEscape>),

    #[tag("Character")]
    Character(Box<Character>),

    /// `UnicodeSetsMode` only
    #[tag("NestedCharacterClass")]
    NestedCharacterClass(Box<CharacterClass>),

    /// `UnicodeSetsMode` only
    #[tag("ClassStringDisjunction")]
    ClassStringDisjunction(Box<ClassStringDisjunction>),
}

/// `-` separated range of characters.
/// e.g. `a-z`, `A-Z`, `0-9`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CharacterClassRange {
    pub span: Span,
    pub min: Character,
    pub max: Character,
}

/// `|` separated string of characters wrapped by `\q{}`.
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ClassStringDisjunction {
    pub span: Span,
    /// `true` if body is empty or contains [`ClassString`] which `strings` is
    /// `true`.
    pub strings: bool,
    pub body: Vec<ClassString>,
}

/// Single unit of [`ClassStringDisjunction`].
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct ClassString {
    pub span: Span,
    /// `true` if body is empty or contain 2 more characters.
    pub strings: bool,
    pub body: Vec<Character>,
}

/// Named or unnamed capturing group.
/// e.g. `(...)`, `(?<name>...)`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct CapturingGroup {
    pub span: Span,
    /// Group name to be referenced by [`NamedReference`].
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub name: Option<Atom>,
    pub body: Disjunction,
}

/// Pseudo-group for ignoring.
/// e.g. `(?:...)`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct IgnoreGroup {
    pub span: Span,
    #[cfg_attr(
        feature = "encoding-impl",
        encoding(with = "cbor4ii::core::types::Maybe")
    )]
    pub modifiers: Option<Modifiers>,
    pub body: Disjunction,
}

/// Modifiers in [`IgnoreGroup`].
/// e.g. `i` in `(?i:...)`, `-s` in `(?-s:...)`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct Modifiers {
    pub span: Span,
    #[use_eq]
    pub enabling: Modifier,
    #[use_eq]
    pub disabling: Modifier,
}

bitflags! {
    /// Each part of modifier in [`Modifiers`].
    #[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
    pub struct Modifier: u8 {
        /// Ignore case flag
        const I = 1 << 0;
        /// Multiline flag
        const M = 1 << 1;
        /// DotAll flag
        const S = 1 << 2;
    }
}

/// Backreference by index.
/// e.g. `\1`, `\2`, `\3`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct IndexedReference {
    pub span: Span,
    pub index: u32,
}

/// Backreference by name.
/// e.g. `\k<name>`
#[ast_node]
#[derive(Eq, Hash, EqIgnoreSpan)]
pub struct NamedReference {
    pub span: Span,
    pub name: Atom,
}

#[cfg(feature = "encoding-impl")]
impl cbor4ii::core::enc::Encode for Modifier {
    fn encode<W: cbor4ii::core::enc::Write>(
        &self,
        writer: &mut W,
    ) -> Result<(), cbor4ii::core::enc::Error<W::Error>> {
        self.bits().encode(writer)
    }
}

#[cfg(feature = "encoding-impl")]
impl<'de> cbor4ii::core::dec::Decode<'de> for Modifier {
    fn decode<R: cbor4ii::core::dec::Read<'de>>(
        reader: &mut R,
    ) -> Result<Self, cbor4ii::core::dec::Error<R::Error>> {
        let n = u8::decode(reader)?;
        Modifier::from_bits(n).ok_or_else(|| cbor4ii::core::dec::Error::Mismatch {
            name: &"Modifier",
            found: 0,
        })
    }
}

#[cfg(target_pointer_width = "64")]
#[test]
fn size_asserts() {
    use std::mem::size_of;

    assert!(size_of::<Term>() == 16);
    assert!(size_of::<CharacterClassContents>() == 16);
}
