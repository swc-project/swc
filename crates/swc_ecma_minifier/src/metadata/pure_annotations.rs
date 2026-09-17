//! Side table of `/*#__PURE__*/` annotations that cannot be stored on the AST.
//!
//! Most pure annotations are recorded as a [`swc_common::Mark`] on the node's
//! [`swc_common::SyntaxContext`]. [`swc_ecma_ast::MemberExpr`],
//! [`swc_ecma_ast::ObjectPat`] and [`swc_ecma_ast::ArrayPat`] have no
//! `SyntaxContext`, so annotations on them are keyed by source position
//! instead.
//!
//! Keying on `lo` rather than the whole span keeps the annotation attached
//! when a pass rebuilds a node with a different `hi`.

use rustc_hash::FxHashSet;
use swc_common::BytePos;

/// Source positions of nodes annotated with `/*#__PURE__*/` that cannot carry
/// the annotation on their own [`swc_common::SyntaxContext`].
///
/// Cheap to share: the minifier's passes hold a `&PureAnnotations`, including
/// across the parallel `Pure` visitor.
#[derive(Debug, Default)]
pub(crate) struct PureAnnotations {
    /// `lo` of each annotated node. A position denotes a single syntactic
    /// node, so member expressions and destructuring patterns cannot collide.
    annotated: FxHashSet<BytePos>,
}

impl PureAnnotations {
    /// Records that the node starting at `lo` is annotated.
    pub(crate) fn insert(&mut self, lo: BytePos) {
        self.annotated.insert(lo);
    }

    /// Returns `true` if the node starting at `lo` was annotated.
    ///
    /// A dummy position never matches: it carries no source location, so it
    /// cannot identify a particular annotated node.
    pub(crate) fn contains(&self, lo: BytePos) -> bool {
        !lo.is_dummy() && self.annotated.contains(&lo)
    }
}
