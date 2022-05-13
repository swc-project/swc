#[cfg(not(feature = "parking_lot"))]
use std::sync::Mutex;
use std::{
    borrow::Cow,
    cmp, fmt,
    hash::{Hash, Hasher},
    ops::{Add, Sub},
    path::PathBuf,
    sync::atomic::AtomicU32,
};

#[cfg(feature = "parking_lot")]
use parking_lot::Mutex;
use serde::{Deserialize, Serialize};
use url::Url;

pub use self::hygiene::{Mark, SyntaxContext};
use crate::{rustc_data_structures::stable_hasher::StableHasher, sync::Lrc};

mod analyze_source_file;
pub mod hygiene;

/// Spans represent a region of code, used for error reporting. Positions in
/// spans are *absolute* positions from the beginning of the `source_map`, not
/// positions relative to `SourceFile`s. Methods on the `SourceMap` can be used
/// to relate spans back to the original source.
/// You must be careful if the span crosses more than one file - you will not be
/// able to use many of the functions on spans in `source_map` and you cannot
/// assume that the length of the `span = hi - lo`; there may be space in the
/// `BytePos` range between files.
#[derive(Debug, Clone, Copy, Hash, PartialEq, Eq, Ord, PartialOrd, Serialize, Deserialize)]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct Span {
    #[serde(rename = "start")]
    #[cfg_attr(feature = "rkyv", omit_bounds)]
    pub lo: BytePos,
    #[serde(rename = "end")]
    #[cfg_attr(feature = "rkyv", omit_bounds)]
    pub hi: BytePos,
    /// Information about where the macro came from, if this piece of
    /// code was created by a macro expansion.
    #[cfg_attr(feature = "rkyv", omit_bounds)]
    pub ctxt: SyntaxContext,
}

#[cfg(feature = "arbitrary")]
#[cfg_attr(docsrs, doc(cfg(feature = "arbitrary")))]
impl<'a> arbitrary::Arbitrary<'a> for Span {
    fn arbitrary(u: &mut arbitrary::Unstructured<'_>) -> arbitrary::Result<Self> {
        let lo = u.arbitrary::<BytePos>()?;
        let hi = u.arbitrary::<BytePos>()?;

        Ok(Self::new(lo, hi, Default::default()))
    }
}

/// Dummy span, both position and length are zero, syntax context is zero as
/// well.
pub const DUMMY_SP: Span = Span {
    lo: BytePos::DUMMY,
    hi: BytePos::DUMMY,
    ctxt: SyntaxContext::empty(),
};

#[derive(Default)]
pub struct Globals {
    hygiene_data: Mutex<hygiene::HygieneData>,
    #[allow(unused)]
    dummy_cnt: AtomicU32,
}

const DUMMY_RESERVE: u32 = u32::MAX - 2_u32.pow(16);

impl Globals {
    pub fn new() -> Globals {
        Globals {
            hygiene_data: Mutex::new(hygiene::HygieneData::new()),
            dummy_cnt: AtomicU32::new(DUMMY_RESERVE),
        }
    }
}

better_scoped_tls::scoped_tls!(

    /// Storage for span hygiene data.
    ///
    /// This variable is used to manage identifiers or to identify nodes.
    /// Note that it's stored as a thread-local storage, but actually it's shared
    /// between threads.
    ///
    /// # Usages
    ///
    /// ## Span hygiene
    ///
    /// [Mark]s are stored in this variable.
    ///
    /// You can see the document how swc uses the span hygiene info at
    /// https://rustdoc.swc.rs/swc_ecma_transforms_base/resolver/fn.resolver_with_mark.html
    pub static GLOBALS: Globals
);

#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Debug, Eq, PartialEq, Clone, Ord, PartialOrd, Hash)]
pub enum FileName {
    Real(#[cfg_attr(feature = "rkyv", with(crate::source_map::EncodePathBuf))] PathBuf),
    /// A macro. This includes the full name of the macro, so that there are no
    /// clashes.
    Macros(String),
    /// call to `quote!`
    QuoteExpansion,
    /// Command line
    Anon,
    /// Hack in src/libsyntax/parse.rs
    MacroExpansion,
    ProcMacroSourceCode,
    Url(#[cfg_attr(feature = "rkyv", with(crate::source_map::EncodeUrl))] Url),
    Internal(String),
    /// Custom sources for explicit parser calls from plugins and drivers
    Custom(String),
}

/// A wrapper that attempts to convert a type to and from UTF-8.
///
/// Types like `OsString` and `PathBuf` aren't guaranteed to be encoded as
/// UTF-8, but they usually are anyway. Using this wrapper will archive them as
/// if they were regular `String`s.
///
/// There is built-in `AsString` supports PathBuf but it requires custom
/// serializer wrapper to handle conversion errors. This wrapper is simplified
/// version accepts errors
#[cfg(feature = "rkyv")]
#[derive(Debug, Clone, Copy)]
pub struct EncodePathBuf;

#[cfg(feature = "rkyv")]
impl rkyv::with::ArchiveWith<PathBuf> for EncodePathBuf {
    type Archived = rkyv::string::ArchivedString;
    type Resolver = rkyv::string::StringResolver;

    #[inline]
    unsafe fn resolve_with(
        field: &PathBuf,
        pos: usize,
        resolver: Self::Resolver,
        out: *mut Self::Archived,
    ) {
        // It's safe to unwrap here because if the OsString wasn't valid UTF-8 it would
        // have failed to serialize
        rkyv::string::ArchivedString::resolve_from_str(field.to_str().unwrap(), pos, resolver, out);
    }
}

#[cfg(feature = "rkyv")]
impl<S> rkyv::with::SerializeWith<PathBuf, S> for EncodePathBuf
where
    S: ?Sized + rkyv::ser::Serializer,
{
    #[inline]
    fn serialize_with(field: &PathBuf, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        let s = field.to_str().unwrap_or_default();
        rkyv::string::ArchivedString::serialize_from_str(s, serializer)
    }
}

#[cfg(feature = "rkyv")]
impl<D> rkyv::with::DeserializeWith<rkyv::string::ArchivedString, PathBuf, D> for EncodePathBuf
where
    D: ?Sized + rkyv::Fallible,
{
    #[inline]
    fn deserialize_with(
        field: &rkyv::string::ArchivedString,
        _: &mut D,
    ) -> Result<PathBuf, D::Error> {
        Ok(<PathBuf as std::str::FromStr>::from_str(field.as_str()).unwrap())
    }
}

/// A wrapper that attempts to convert a Url to and from String.
#[cfg(feature = "rkyv")]
#[derive(Debug, Clone, Copy)]
pub struct EncodeUrl;

#[cfg(feature = "rkyv")]
impl rkyv::with::ArchiveWith<Url> for EncodeUrl {
    type Archived = rkyv::string::ArchivedString;
    type Resolver = rkyv::string::StringResolver;

    #[inline]
    unsafe fn resolve_with(
        field: &Url,
        pos: usize,
        resolver: Self::Resolver,
        out: *mut Self::Archived,
    ) {
        rkyv::string::ArchivedString::resolve_from_str(field.as_str(), pos, resolver, out);
    }
}

#[cfg(feature = "rkyv")]
impl<S> rkyv::with::SerializeWith<Url, S> for EncodeUrl
where
    S: ?Sized + rkyv::ser::Serializer,
{
    #[inline]
    fn serialize_with(field: &Url, serializer: &mut S) -> Result<Self::Resolver, S::Error> {
        let field = field.as_str();
        rkyv::string::ArchivedString::serialize_from_str(field, serializer)
    }
}

#[cfg(feature = "rkyv")]
impl<D> rkyv::with::DeserializeWith<rkyv::Archived<String>, Url, D> for EncodeUrl
where
    D: ?Sized + rkyv::Fallible,
{
    #[inline]
    fn deserialize_with(field: &rkyv::string::ArchivedString, _: &mut D) -> Result<Url, D::Error> {
        Ok(Url::parse(field.as_str()).unwrap())
    }
}

impl std::fmt::Display for FileName {
    fn fmt(&self, fmt: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match *self {
            FileName::Real(ref path) => write!(fmt, "{}", path.display()),
            FileName::Macros(ref name) => write!(fmt, "<{} macros>", name),
            FileName::QuoteExpansion => write!(fmt, "<quote expansion>"),
            FileName::MacroExpansion => write!(fmt, "<macro expansion>"),
            FileName::Anon => write!(fmt, "<anon>"),
            FileName::ProcMacroSourceCode => write!(fmt, "<proc-macro source code>"),
            FileName::Url(ref u) => write!(fmt, "{}", u),
            FileName::Custom(ref s) | FileName::Internal(ref s) => write!(fmt, "<{}>", s),
        }
    }
}

impl From<PathBuf> for FileName {
    fn from(p: PathBuf) -> Self {
        assert!(!p.to_string_lossy().ends_with('>'));
        FileName::Real(p)
    }
}

impl From<Url> for FileName {
    fn from(url: Url) -> Self {
        FileName::Url(url)
    }
}

impl FileName {
    pub fn is_real(&self) -> bool {
        match *self {
            FileName::Real(_) => true,
            FileName::Macros(_)
            | FileName::Anon
            | FileName::MacroExpansion
            | FileName::ProcMacroSourceCode
            | FileName::Custom(_)
            | FileName::QuoteExpansion
            | FileName::Internal(_)
            | FileName::Url(_) => false,
        }
    }

    pub fn is_macros(&self) -> bool {
        match *self {
            FileName::Real(_)
            | FileName::Anon
            | FileName::MacroExpansion
            | FileName::ProcMacroSourceCode
            | FileName::Custom(_)
            | FileName::QuoteExpansion
            | FileName::Internal(_)
            | FileName::Url(_) => false,
            FileName::Macros(_) => true,
        }
    }
}

/// A collection of spans. Spans have two orthogonal attributes:
///
/// - they can be *primary spans*. In this case they are the locus of the error,
///   and would be rendered with `^^^`.
/// - they can have a *label*. In this case, the label is written next to the
///   mark in the snippet when we render.
#[derive(Clone, Debug, Default, Hash, PartialEq, Eq)]
#[cfg_attr(
    feature = "diagnostic-serde",
    derive(serde::Serialize, serde::Deserialize)
)]
#[cfg_attr(
    feature = "plugin-base",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct MultiSpan {
    primary_spans: Vec<Span>,
    span_labels: Vec<(Span, String)>,
}

extern "C" {
    fn __span_dummy_with_cmt_proxy() -> u32;
}

impl Span {
    #[inline]
    pub fn lo(self) -> BytePos {
        self.lo
    }

    #[inline]
    pub fn new(mut lo: BytePos, mut hi: BytePos, ctxt: SyntaxContext) -> Self {
        if lo > hi {
            std::mem::swap(&mut lo, &mut hi);
        }

        Span { lo, hi, ctxt }
    }

    #[inline]
    pub fn with_lo(&self, lo: BytePos) -> Span {
        Span::new(lo, self.hi, self.ctxt)
    }

    #[inline]
    pub fn hi(self) -> BytePos {
        self.hi
    }

    #[inline]
    pub fn with_hi(&self, hi: BytePos) -> Span {
        Span::new(self.lo, hi, self.ctxt)
    }

    #[inline]
    pub fn ctxt(self) -> SyntaxContext {
        self.ctxt
    }

    #[inline]
    pub fn with_ctxt(&self, ctxt: SyntaxContext) -> Span {
        Span::new(self.lo, self.hi, ctxt)
    }

    /// Returns `true` if this is a dummy span with any hygienic context.
    #[inline]
    pub fn is_dummy(self) -> bool {
        self.lo.0 == 0 && self.hi.0 == 0 || self.lo.0 >= DUMMY_RESERVE
    }

    /// Returns `true` if this is a dummy span with any hygienic context.
    #[inline]
    pub fn is_dummy_ignoring_cmt(self) -> bool {
        self.lo.0 == 0 && self.hi.0 == 0
    }

    /// Returns a new span representing an empty span at the beginning of this
    /// span
    #[inline]
    pub fn shrink_to_lo(self) -> Span {
        self.with_hi(self.lo)
    }

    /// Returns a new span representing an empty span at the end of this span
    #[inline]
    pub fn shrink_to_hi(self) -> Span {
        self.with_lo(self.hi)
    }

    /// Returns `self` if `self` is not the dummy span, and `other` otherwise.
    pub fn substitute_dummy(self, other: Span) -> Span {
        if self.is_dummy() {
            other
        } else {
            self
        }
    }

    /// Return true if `self` fully encloses `other`.
    pub fn contains(self, other: Span) -> bool {
        self.lo <= other.lo && other.hi <= self.hi
    }

    /// Return true if the spans are equal with regards to the source text.
    ///
    /// Use this instead of `==` when either span could be generated code,
    /// and you only care that they point to the same bytes of source text.
    pub fn source_equal(self, other: Span) -> bool {
        self.lo == other.lo && self.hi == other.hi
    }

    /// Returns `Some(span)`, where the start is trimmed by the end of `other`
    pub fn trim_start(self, other: Span) -> Option<Span> {
        if self.hi > other.hi {
            Some(self.with_lo(cmp::max(self.lo, other.hi)))
        } else {
            None
        }
    }

    /// Return a `Span` that would enclose both `self` and `end`.
    pub fn to(self, end: Span) -> Span {
        let span_data = self;
        let end_data = end;
        // FIXME(jseyfried): self.ctxt should always equal end.ctxt here (c.f. issue
        // #23480) Return the macro span on its own to avoid weird diagnostic
        // output. It is preferable to have an incomplete span than a completely
        // nonsensical one.
        if span_data.ctxt != end_data.ctxt {
            if span_data.ctxt == SyntaxContext::empty() {
                return end;
            } else if end_data.ctxt == SyntaxContext::empty() {
                return self;
            }
            // both span fall within a macro
            // FIXME(estebank) check if it is the *same* macro
        }
        Span::new(
            cmp::min(span_data.lo, end_data.lo),
            cmp::max(span_data.hi, end_data.hi),
            if span_data.ctxt == SyntaxContext::empty() {
                end_data.ctxt
            } else {
                span_data.ctxt
            },
        )
    }

    /// Return a `Span` between the end of `self` to the beginning of `end`.
    pub fn between(self, end: Span) -> Span {
        let span = self;
        Span::new(
            span.hi,
            end.lo,
            if end.ctxt == SyntaxContext::empty() {
                end.ctxt
            } else {
                span.ctxt
            },
        )
    }

    /// Return a `Span` between the beginning of `self` to the beginning of
    /// `end`.
    pub fn until(self, end: Span) -> Span {
        let span = self;
        Span::new(
            span.lo,
            end.lo,
            if end.ctxt == SyntaxContext::empty() {
                end.ctxt
            } else {
                span.ctxt
            },
        )
    }

    pub fn from_inner_byte_pos(self, start: usize, end: usize) -> Span {
        let span = self;
        Span::new(
            span.lo + BytePos::from_usize(start),
            span.lo + BytePos::from_usize(end),
            span.ctxt,
        )
    }

    #[inline]
    pub fn apply_mark(self, mark: Mark) -> Span {
        let span = self;
        span.with_ctxt(span.ctxt.apply_mark(mark))
    }

    #[inline]
    pub fn remove_mark(&mut self) -> Mark {
        let mut span = *self;
        let mark = span.ctxt.remove_mark();
        *self = Span::new(span.lo, span.hi, span.ctxt);
        mark
    }

    #[inline]
    pub fn adjust(&mut self, expansion: Mark) -> Option<Mark> {
        let mut span = *self;
        let mark = span.ctxt.adjust(expansion);
        *self = Span::new(span.lo, span.hi, span.ctxt);
        mark
    }

    #[inline]
    pub fn glob_adjust(
        &mut self,
        expansion: Mark,
        glob_ctxt: SyntaxContext,
    ) -> Option<Option<Mark>> {
        let mut span = *self;
        let mark = span.ctxt.glob_adjust(expansion, glob_ctxt);
        *self = Span::new(span.lo, span.hi, span.ctxt);
        mark
    }

    #[inline]
    pub fn reverse_glob_adjust(
        &mut self,
        expansion: Mark,
        glob_ctxt: SyntaxContext,
    ) -> Option<Option<Mark>> {
        let mut span = *self;
        let mark = span.ctxt.reverse_glob_adjust(expansion, glob_ctxt);
        *self = Span::new(span.lo, span.hi, span.ctxt);
        mark
    }

    /// Returns `true` if `self` is marked with `mark`.
    ///
    /// Panics if `mark` is not a valid mark.
    #[inline]
    pub fn has_mark(self, mark: Mark) -> bool {
        debug_assert_ne!(
            mark,
            Mark::root(),
            "Cannot check if a span contains a `ROOT` mark"
        );

        let mut ctxt = self.ctxt;

        loop {
            if ctxt == SyntaxContext::empty() {
                return false;
            }

            let m = ctxt.remove_mark();
            if m == mark {
                return true;
            }
            if m == Mark::root() {
                return false;
            }
        }
    }

    /// Dummy span, both position are extremely large numbers so they would be
    /// ignore by sourcemap, but can still have comments
    pub fn dummy_with_cmt() -> Self {
        #[cfg(all(feature = "plugin-mode", target_arch = "wasm32"))]
        {
            let lo = BytePos(unsafe { __span_dummy_with_cmt_proxy() });

            return Span {
                lo,
                hi: lo,
                ctxt: SyntaxContext::empty(),
            };
        }

        #[cfg(not(all(feature = "plugin-mode", target_arch = "wasm32")))]
        return GLOBALS.with(|globals| {
            let lo = BytePos(
                globals
                    .dummy_cnt
                    .fetch_add(1, std::sync::atomic::Ordering::SeqCst),
            );
            Span {
                lo,
                hi: lo,
                ctxt: SyntaxContext::empty(),
            }
        });
    }
}

#[derive(Clone, Debug)]
pub struct SpanLabel {
    /// The span we are going to include in the final snippet.
    pub span: Span,

    /// Is this a primary span? This is the "locus" of the message,
    /// and is indicated with a `^^^^` underline, versus `----`.
    pub is_primary: bool,

    /// What label should we attach to this span (if any)?
    pub label: Option<String>,
}

impl Default for Span {
    fn default() -> Self {
        DUMMY_SP
    }
}

impl MultiSpan {
    #[inline]
    pub fn new() -> MultiSpan {
        Self::default()
    }

    pub fn from_span(primary_span: Span) -> MultiSpan {
        MultiSpan {
            primary_spans: vec![primary_span],
            span_labels: vec![],
        }
    }

    pub fn from_spans(vec: Vec<Span>) -> MultiSpan {
        MultiSpan {
            primary_spans: vec,
            span_labels: vec![],
        }
    }

    pub fn push_span_label(&mut self, span: Span, label: String) {
        self.span_labels.push((span, label));
    }

    /// Selects the first primary span (if any)
    pub fn primary_span(&self) -> Option<Span> {
        self.primary_spans.first().cloned()
    }

    /// Returns all primary spans.
    pub fn primary_spans(&self) -> &[Span] {
        &self.primary_spans
    }

    /// Returns `true` if this contains only a dummy primary span with any
    /// hygienic context.
    pub fn is_dummy(&self) -> bool {
        let mut is_dummy = true;
        for span in &self.primary_spans {
            if !span.is_dummy() {
                is_dummy = false;
            }
        }
        is_dummy
    }

    /// Replaces all occurrences of one Span with another. Used to move Spans in
    /// areas that don't display well (like std macros). Returns true if
    /// replacements occurred.
    pub fn replace(&mut self, before: Span, after: Span) -> bool {
        let mut replacements_occurred = false;
        for primary_span in &mut self.primary_spans {
            if *primary_span == before {
                *primary_span = after;
                replacements_occurred = true;
            }
        }
        for span_label in &mut self.span_labels {
            if span_label.0 == before {
                span_label.0 = after;
                replacements_occurred = true;
            }
        }
        replacements_occurred
    }

    /// Returns the strings to highlight. We always ensure that there
    /// is an entry for each of the primary spans -- for each primary
    /// span P, if there is at least one label with span P, we return
    /// those labels (marked as primary). But otherwise we return
    /// `SpanLabel` instances with empty labels.
    pub fn span_labels(&self) -> Vec<SpanLabel> {
        let is_primary = |span| self.primary_spans.contains(&span);

        let mut span_labels = self
            .span_labels
            .iter()
            .map(|&(span, ref label)| SpanLabel {
                span,
                is_primary: is_primary(span),
                label: Some(label.clone()),
            })
            .collect::<Vec<_>>();

        for &span in &self.primary_spans {
            if !span_labels.iter().any(|sl| sl.span == span) {
                span_labels.push(SpanLabel {
                    span,
                    is_primary: true,
                    label: None,
                });
            }
        }

        span_labels
    }
}

impl From<Span> for MultiSpan {
    fn from(span: Span) -> MultiSpan {
        MultiSpan::from_span(span)
    }
}

impl From<Vec<Span>> for MultiSpan {
    fn from(spans: Vec<Span>) -> MultiSpan {
        MultiSpan::from_spans(spans)
    }
}

pub const NO_EXPANSION: SyntaxContext = SyntaxContext::empty();

/// Identifies an offset of a multi-byte character in a SourceFile
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub struct MultiByteChar {
    /// The absolute offset of the character in the SourceMap
    pub pos: BytePos,
    /// The number of bytes, >=2
    pub bytes: u8,
}

/// Identifies an offset of a non-narrow character in a SourceFile
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Copy, Clone, Eq, PartialEq, Debug)]
pub enum NonNarrowChar {
    /// Represents a zero-width character
    ZeroWidth(BytePos),
    /// Represents a wide (fullwidth) character
    Wide(BytePos),
    /// Represents a tab character, represented visually with a width of 4
    /// characters
    Tab(BytePos),
}

impl NonNarrowChar {
    fn new(pos: BytePos, width: usize) -> Self {
        match width {
            0 => NonNarrowChar::ZeroWidth(pos),
            2 => NonNarrowChar::Wide(pos),
            4 => NonNarrowChar::Tab(pos),
            _ => panic!("width {} given for non-narrow character", width),
        }
    }

    /// Returns the absolute offset of the character in the SourceMap
    pub fn pos(self) -> BytePos {
        match self {
            NonNarrowChar::ZeroWidth(p) | NonNarrowChar::Wide(p) | NonNarrowChar::Tab(p) => p,
        }
    }

    /// Returns the width of the character, 0 (zero-width) or 2 (wide)
    pub fn width(self) -> usize {
        match self {
            NonNarrowChar::ZeroWidth(_) => 0,
            NonNarrowChar::Wide(_) => 2,
            NonNarrowChar::Tab(_) => 4,
        }
    }
}

impl Add<BytePos> for NonNarrowChar {
    type Output = Self;

    fn add(self, rhs: BytePos) -> Self {
        match self {
            NonNarrowChar::ZeroWidth(pos) => NonNarrowChar::ZeroWidth(pos + rhs),
            NonNarrowChar::Wide(pos) => NonNarrowChar::Wide(pos + rhs),
            NonNarrowChar::Tab(pos) => NonNarrowChar::Tab(pos + rhs),
        }
    }
}

impl Sub<BytePos> for NonNarrowChar {
    type Output = Self;

    fn sub(self, rhs: BytePos) -> Self {
        match self {
            NonNarrowChar::ZeroWidth(pos) => NonNarrowChar::ZeroWidth(pos - rhs),
            NonNarrowChar::Wide(pos) => NonNarrowChar::Wide(pos - rhs),
            NonNarrowChar::Tab(pos) => NonNarrowChar::Tab(pos - rhs),
        }
    }
}

/// A single source in the SourceMap.
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Clone)]
pub struct SourceFile {
    /// The name of the file that the source came from. Source that doesn't
    /// originate from files has names between angle brackets by convention,
    /// e.g. `<anon>`
    pub name: FileName,
    /// True if the `name` field above has been modified by
    /// `--remap-path-prefix`
    pub name_was_remapped: bool,
    /// The unmapped path of the file that the source came from.
    /// Set to `None` if the `SourceFile` was imported from an external crate.
    pub unmapped_path: Option<FileName>,
    /// Indicates which crate this `SourceFile` was imported from.
    pub crate_of_origin: u32,
    /// The complete source code
    pub src: Lrc<String>,
    /// The source code's hash
    pub src_hash: u128,
    /// The start position of this source in the `SourceMap`
    pub start_pos: BytePos,
    /// The end position of this source in the `SourceMap`
    pub end_pos: BytePos,
    /// Locations of lines beginnings in the source code
    pub lines: Vec<BytePos>,
    /// Locations of multi-byte characters in the source code
    pub multibyte_chars: Vec<MultiByteChar>,
    /// Width of characters that are not narrow in the source code
    pub non_narrow_chars: Vec<NonNarrowChar>,
    /// A hash of the filename, used for speeding up the incr. comp. hashing.
    pub name_hash: u128,
}

impl fmt::Debug for SourceFile {
    fn fmt(&self, fmt: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(fmt, "SourceFile({})", self.name)
    }
}

impl SourceFile {
    pub fn new(
        name: FileName,
        name_was_remapped: bool,
        unmapped_path: FileName,
        mut src: String,
        start_pos: BytePos,
    ) -> SourceFile {
        remove_bom(&mut src);

        let src_hash = {
            let mut hasher: StableHasher = StableHasher::new();
            hasher.write(src.as_bytes());
            hasher.finish()
        };
        let name_hash = {
            let mut hasher: StableHasher = StableHasher::new();
            name.hash(&mut hasher);
            hasher.finish()
        };
        let end_pos = start_pos.to_usize() + src.len();

        let (lines, multibyte_chars, non_narrow_chars) =
            analyze_source_file::analyze_source_file(&src[..], start_pos);

        SourceFile {
            name,
            name_was_remapped,
            unmapped_path: Some(unmapped_path),
            crate_of_origin: 0,
            src: Lrc::new(src),
            src_hash,
            start_pos,
            end_pos: Pos::from_usize(end_pos),
            lines,
            multibyte_chars,
            non_narrow_chars,
            name_hash,
        }
    }

    /// Return the BytePos of the beginning of the current line.
    pub fn line_begin_pos(&self, pos: BytePos) -> BytePos {
        let line_index = self.lookup_line(pos).unwrap();
        self.lines[line_index]
    }

    /// Get a line from the list of pre-computed line-beginnings.
    /// The line number here is 0-based.
    pub fn get_line(&self, line_number: usize) -> Option<Cow<'_, str>> {
        fn get_until_newline(src: &str, begin: usize) -> &str {
            // We can't use `lines.get(line_number+1)` because we might
            // be parsing when we call this function and thus the current
            // line is the last one we have line info for.
            let slice = &src[begin..];
            match slice.find('\n') {
                Some(e) => &slice[..e],
                None => slice,
            }
        }

        let begin = {
            let line = self.lines.get(line_number)?;
            let begin: BytePos = *line - self.start_pos;
            begin.to_usize()
        };

        Some(Cow::from(get_until_newline(&self.src, begin)))
    }

    pub fn is_real_file(&self) -> bool {
        self.name.is_real()
    }

    pub fn byte_length(&self) -> u32 {
        self.end_pos.0 - self.start_pos.0
    }

    pub fn count_lines(&self) -> usize {
        self.lines.len()
    }

    /// Find the line containing the given position. The return value is the
    /// index into the `lines` array of this SourceFile, not the 1-based line
    /// number. If the `source_file` is empty or the position is located before
    /// the first line, `None` is returned.
    pub fn lookup_line(&self, pos: BytePos) -> Option<usize> {
        if self.lines.is_empty() {
            return None;
        }

        let line_index = lookup_line(&self.lines[..], pos);
        assert!(line_index < self.lines.len() as isize);
        if line_index >= 0 {
            Some(line_index as usize)
        } else {
            None
        }
    }

    pub fn line_bounds(&self, line_index: usize) -> (BytePos, BytePos) {
        if self.start_pos == self.end_pos {
            return (self.start_pos, self.end_pos);
        }

        assert!(line_index < self.lines.len());
        if line_index == (self.lines.len() - 1) {
            (self.lines[line_index], self.end_pos)
        } else {
            (self.lines[line_index], self.lines[line_index + 1])
        }
    }

    #[inline]
    pub fn contains(&self, byte_pos: BytePos) -> bool {
        byte_pos >= self.start_pos && byte_pos <= self.end_pos
    }
}

/// Remove utf-8 BOM if any.
fn remove_bom(src: &mut String) {
    if src.starts_with('\u{feff}') {
        src.drain(..3);
    }
}

// _____________________________________________________________________________
// Pos, BytePos, CharPos
//

pub trait Pos {
    fn from_usize(n: usize) -> Self;
    fn to_usize(&self) -> usize;
    fn from_u32(n: u32) -> Self;
    fn to_u32(&self) -> u32;
}

/// A byte offset. Keep this small (currently 32-bits), as AST contains
/// a lot of them.
///
///
/// # Reserved
///
///  - [u32::MAX] is reserved for dummy spans. It means `BytePos(0)` means the
///    `BytePos` is synthesized by the compiler.
///
///  - Values larger than `u32::MAX - 2^16` are reserved for the comments.
///
/// `u32::MAX` is special value used to generate source map entries.
#[derive(Clone, Copy, PartialEq, Eq, Hash, PartialOrd, Ord, Debug, Serialize, Deserialize)]
#[serde(transparent)]
#[cfg_attr(feature = "arbitrary", derive(arbitrary::Arbitrary))]
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
pub struct BytePos(#[cfg_attr(feature = "rkyv", omit_bounds)] pub u32);

impl BytePos {
    pub const DUMMY: Self = BytePos(u32::MAX);
    const MIN_RESERVED: Self = BytePos(DUMMY_RESERVE);

    pub const fn is_reserved_for_comments(self) -> bool {
        self.0 >= Self::MIN_RESERVED.0 && self.0 != u32::MAX
    }

    /// Returns true if this is synthesized and has no relevant input source
    /// code.
    pub const fn is_dummy(self) -> bool {
        self.0 == u32::MAX
    }
}

/// A character offset. Because of multibyte utf8 characters, a byte offset
/// is not equivalent to a character offset. The SourceMap will convert BytePos
/// values to CharPos values as necessary.
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Copy, Clone, PartialEq, Eq, Hash, PartialOrd, Ord, Debug)]
pub struct CharPos(pub usize);

// FIXME: Lots of boilerplate in these impls, but so far my attempts to fix
// have been unsuccessful

impl Pos for BytePos {
    #[inline(always)]
    fn from_usize(n: usize) -> BytePos {
        BytePos(n as u32)
    }

    #[inline(always)]
    fn to_usize(&self) -> usize {
        self.0 as usize
    }

    #[inline(always)]
    fn from_u32(n: u32) -> BytePos {
        BytePos(n)
    }

    #[inline(always)]
    fn to_u32(&self) -> u32 {
        self.0
    }
}

impl Add for BytePos {
    type Output = BytePos;

    #[inline(always)]
    fn add(self, rhs: BytePos) -> BytePos {
        BytePos((self.to_usize() + rhs.to_usize()) as u32)
    }
}

impl Sub for BytePos {
    type Output = BytePos;

    #[inline(always)]
    fn sub(self, rhs: BytePos) -> BytePos {
        BytePos((self.to_usize() - rhs.to_usize()) as u32)
    }
}

impl Pos for CharPos {
    #[inline(always)]
    fn from_usize(n: usize) -> CharPos {
        CharPos(n)
    }

    #[inline(always)]
    fn to_usize(&self) -> usize {
        self.0
    }

    #[inline(always)]
    fn from_u32(n: u32) -> CharPos {
        CharPos(n as usize)
    }

    #[inline(always)]
    fn to_u32(&self) -> u32 {
        self.0 as u32
    }
}

impl Add for CharPos {
    type Output = CharPos;

    #[inline(always)]
    fn add(self, rhs: CharPos) -> CharPos {
        CharPos(self.to_usize() + rhs.to_usize())
    }
}

impl Sub for CharPos {
    type Output = CharPos;

    #[inline(always)]
    fn sub(self, rhs: CharPos) -> CharPos {
        CharPos(self.to_usize() - rhs.to_usize())
    }
}

// _____________________________________________________________________________
// Loc, LocWithOpt, SourceFileAndLine, SourceFileAndBytePos
//

/// A source code location used for error reporting
#[cfg_attr(
    feature = "rkyv",
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[derive(Debug, Clone)]
pub struct Loc {
    /// Information about the original source
    pub file: Lrc<SourceFile>,
    /// The (1-based) line number
    pub line: usize,
    /// The (0-based) column offset
    pub col: CharPos,
    /// The (0-based) column offset when displayed
    pub col_display: usize,
}

/// A source code location used as the result of `lookup_char_pos_adj`
// Actually, *none* of the clients use the filename *or* file field;
// perhaps they should just be removed.
#[derive(Debug)]
pub struct LocWithOpt {
    pub filename: FileName,
    pub line: usize,
    pub col: CharPos,
    pub file: Option<Lrc<SourceFile>>,
}

// used to be structural records. Better names, anyone?
#[derive(Debug)]
pub struct SourceFileAndLine {
    pub sf: Lrc<SourceFile>,
    pub line: usize,
}
#[derive(Debug)]
pub struct SourceFileAndBytePos {
    pub sf: Lrc<SourceFile>,
    pub pos: BytePos,
}

#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub struct LineInfo {
    /// Index of line, starting from 0.
    pub line_index: usize,

    /// Column in line where span begins, starting from 0.
    pub start_col: CharPos,

    /// Column in line where span ends, starting from 0, exclusive.
    pub end_col: CharPos,
}

/// Used to create a `.map` file.
#[derive(Copy, Clone, Debug, PartialEq, Eq)]
pub struct LineCol {
    pub line: u32,
    pub col: u32,
}

pub struct FileLines {
    pub file: Lrc<SourceFile>,
    pub lines: Vec<LineInfo>,
}

// _____________________________________________________________________________
// SpanLinesError, SpanSnippetError, DistinctSources,
// MalformedSourceMapPositions
//

pub type FileLinesResult = Result<FileLines, SpanLinesError>;

#[derive(Clone, PartialEq, Eq, Debug)]
pub enum SpanLinesError {
    IllFormedSpan(Span),
    DistinctSources(DistinctSources),
}

#[derive(Clone, PartialEq, Eq, Debug)]
pub enum SpanSnippetError {
    DummyBytePos,
    IllFormedSpan(Span),
    DistinctSources(DistinctSources),
    MalformedForSourcemap(MalformedSourceMapPositions),
    SourceNotAvailable { filename: FileName },
}

#[derive(Clone, PartialEq, Eq, Debug)]
pub struct DistinctSources {
    pub begin: (FileName, BytePos),
    pub end: (FileName, BytePos),
}

#[derive(Clone, PartialEq, Eq, Debug)]
pub struct MalformedSourceMapPositions {
    pub name: FileName,
    pub source_len: usize,
    pub begin_pos: BytePos,
    pub end_pos: BytePos,
}

// Given a slice of line start positions and a position, returns the index of
// the line the position is on. Returns -1 if the position is located before
// the first line.
fn lookup_line(lines: &[BytePos], pos: BytePos) -> isize {
    match lines.binary_search(&pos) {
        Ok(line) => line as isize,
        Err(line) => line as isize - 1,
    }
}

#[cfg(test)]
mod tests {
    use super::{lookup_line, BytePos, Span};

    #[test]
    fn test_lookup_line() {
        let lines = &[BytePos(3), BytePos(17), BytePos(28)];

        assert_eq!(lookup_line(lines, BytePos(0)), -1);
        assert_eq!(lookup_line(lines, BytePos(3)), 0);
        assert_eq!(lookup_line(lines, BytePos(4)), 0);

        assert_eq!(lookup_line(lines, BytePos(16)), 0);
        assert_eq!(lookup_line(lines, BytePos(17)), 1);
        assert_eq!(lookup_line(lines, BytePos(18)), 1);

        assert_eq!(lookup_line(lines, BytePos(28)), 2);
        assert_eq!(lookup_line(lines, BytePos(29)), 2);
    }

    #[test]
    fn size_of_span() {
        assert_eq!(std::mem::size_of::<Span>(), 12);
    }
}
