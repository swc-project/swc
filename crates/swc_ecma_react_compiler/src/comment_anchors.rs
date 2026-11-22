//! Keep comments that are attached to an expression on that expression after
//! the React Compiler moves the expression.
//!
//! The React Compiler copies the source location of an expression to the code
//! that it generates for the expression. For example, it compiles
//! `return <div>{b}</div>;` to:
//!
//! ```js
//! let t1;
//! if ($[0] !== b) {
//!     t1 = <div>{b}</div>;
//! }
//! return t1;
//! ```
//!
//! The declaration `let t1`, the statement `t1 = ...`, and the identifier `t1`
//! all start at the offset of `<div>`. Comments are keyed by `span.lo`, and the
//! code generator emits the comments at an offset before the first node that
//! starts at that offset. Thus a `/*#__PURE__*/` annotation that the JSX
//! transform adds for `<div>` is emitted as `let /*#__PURE__*/ t1;`, and the
//! `React.createElement` call loses it.
//!
//! This pass finds each expression that can have such a comment (a JSX element
//! or fragment, a call, or a `new` expression). It then replaces with
//! `DUMMY_SP` the span of every other node that starts at the same offset and
//! comes before the expression in source order. The code generator then emits
//! the comments at the expression. Nodes after the expression keep their spans,
//! because the comments were already emitted. Nodes inside the expression also
//! keep their spans (for example, the callee of a call starts at the same
//! offset, and the comments are emitted before it anyway).
//!
//! Known limitation: the nodes that lose their spans also lose their source
//! map entries. These nodes are code that the compiler generated, or nodes that
//! start at the same position as the expression, so the expression gives the
//! same mapping.

use rustc_hash::FxHashSet;
use swc_common::{BytePos, Span, DUMMY_SP};
use swc_ecma_ast as swc;
use swc_ecma_ast::Program;
use swc_ecma_visit::{Visit, VisitMut, VisitMutWith, VisitWith};

/// Make sure that comments at the start of a compiled expression are emitted
/// on the expression. See the module documentation.
pub fn preserve_comment_anchors(program: &mut Program) {
    let mut collector = AnchorCollector::default();
    program.visit_with(&mut collector);
    if collector.anchors.is_empty() {
        return;
    }

    program.visit_mut_with(&mut AnchorProtector {
        pending: collector.anchors,
    });
}

/// Collect the start offsets of expressions that can carry a leading comment
/// that must stay on the expression.
#[derive(Default)]
struct AnchorCollector {
    anchors: FxHashSet<BytePos>,
}

impl AnchorCollector {
    fn add(&mut self, span: Span) {
        if !span.is_dummy() {
            self.anchors.insert(span.lo);
        }
    }
}

impl Visit for AnchorCollector {
    fn visit_jsx_element(&mut self, node: &swc::JSXElement) {
        self.add(node.span);
        node.visit_children_with(self);
    }

    fn visit_jsx_fragment(&mut self, node: &swc::JSXFragment) {
        self.add(node.span);
        node.visit_children_with(self);
    }

    fn visit_call_expr(&mut self, node: &swc::CallExpr) {
        self.add(node.span);
        node.visit_children_with(self);
    }

    fn visit_new_expr(&mut self, node: &swc::NewExpr) {
        self.add(node.span);
        node.visit_children_with(self);
    }
}

/// Remove the spans of nodes that start at a pending anchor before the anchor
/// expression is reached.
///
/// The visitor visits nodes in source order, which is the order in which the
/// code generator emits them.
struct AnchorProtector {
    /// Start offsets of anchor expressions that were not visited yet.
    pending: FxHashSet<BytePos>,
}

impl AnchorProtector {
    /// Mark the anchor at `span.lo` as reached, so that the anchor and the
    /// nodes after it keep their spans.
    fn reach(&mut self, span: Span) {
        self.pending.remove(&span.lo);
    }
}

impl VisitMut for AnchorProtector {
    fn visit_mut_span(&mut self, span: &mut Span) {
        if !span.is_dummy() && self.pending.contains(&span.lo) {
            *span = DUMMY_SP;
        }
    }

    fn visit_mut_jsx_element(&mut self, node: &mut swc::JSXElement) {
        self.reach(node.span);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_jsx_fragment(&mut self, node: &mut swc::JSXFragment) {
        self.reach(node.span);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_call_expr(&mut self, node: &mut swc::CallExpr) {
        self.reach(node.span);
        node.visit_mut_children_with(self);
    }

    fn visit_mut_new_expr(&mut self, node: &mut swc::NewExpr) {
        self.reach(node.span);
        node.visit_mut_children_with(self);
    }
}
