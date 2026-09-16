//! Side table of `/*#__PURE__*/` annotations that cannot be stored on the AST.
//!
//! Most pure annotations are recorded as a [`swc_common::Mark`] on the node's
//! [`swc_common::SyntaxContext`]. [`swc_ecma_ast::MemberExpr`],
//! [`swc_ecma_ast::ObjectPat`] and [`swc_ecma_ast::ArrayPat`] have no
//! `SyntaxContext`, so annotations on them are keyed by source position
//! instead.
//!
//! # Why [`BytePos`] and not the whole [`Span`]
//!
//! A pass may rebuild a node with a narrower or wider `hi`, but the position a
//! leading comment attaches to is `lo`. Keying on `lo` alone keeps the
//! annotation attached across such rewrites.
//!
//! # Soundness
//!
//! A position is only ever *inserted* for a node that carried an annotation in
//! the original source. If a later pass synthesizes a node that happens to
//! reuse a recorded position, the worst case is that the annotation is honored
//! for that node too. This matches how `SyntaxContext`-borne pure marks already
//! behave when a node is cloned, and only ever applies to code the user
//! explicitly annotated.
//!
//! Positions are never removed, so a lookup after a node is dropped is simply
//! never performed.

use rustc_hash::FxHashSet;
use swc_common::BytePos;

/// Source positions of nodes annotated with `/*#__PURE__*/` that cannot carry
/// the annotation on their own [`swc_common::SyntaxContext`].
///
/// Cheap to share: the minifier's passes hold a `&PureAnnotations`, including
/// across the parallel `Pure` visitor.
#[derive(Debug, Default)]
pub(crate) struct PureAnnotations {
    /// `lo` of each annotated [`swc_ecma_ast::MemberExpr`].
    members: FxHashSet<BytePos>,

    /// `lo` of each annotated destructuring pattern.
    patterns: FxHashSet<BytePos>,
}

impl PureAnnotations {
    /// Records that the member expression starting at `lo` is annotated.
    pub(crate) fn insert_member(&mut self, lo: BytePos) {
        self.members.insert(lo);
    }

    /// Records that the destructuring pattern starting at `lo` is annotated.
    pub(crate) fn insert_pattern(&mut self, lo: BytePos) {
        self.patterns.insert(lo);
    }

    /// Returns `true` if the member expression starting at `lo` was annotated.
    ///
    /// A dummy position never matches: it carries no source location, so it
    /// cannot identify a particular annotated node.
    pub(crate) fn has_member(&self, lo: BytePos) -> bool {
        !lo.is_dummy() && self.members.contains(&lo)
    }

    /// Returns `true` if the destructuring pattern starting at `lo` was
    /// annotated.
    pub(crate) fn has_pattern(&self, lo: BytePos) -> bool {
        !lo.is_dummy() && self.patterns.contains(&lo)
    }
}
