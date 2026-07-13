use std::mem;

use swc_common::{
    comments::Comments, source_map::PRESERVED_PAREN_SP, util::take::Take, Mark, Spanned,
};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

/// Records PURE annotation boundaries before optimizer rewrites can expose an
/// annotated invocation as the head of a larger expression continuation.
pub(crate) fn marker(comments: Option<&dyn Comments>, mark: Mark) -> impl '_ + VisitMut {
    Marker {
        comments,
        mark,
        in_bare_continuation_head: false,
        inherited_pure_annotation: false,
    }
}

/// Restores boundaries recorded by [`marker`] after all optimizer rewrites.
pub(crate) fn finalizer(mark: Mark) -> impl VisitMut {
    Finalizer { mark }
}

struct Marker<'a> {
    comments: Option<&'a dyn Comments>,
    mark: Mark,
    /// A one-shot flag consumed by the expression at a continuation head.
    in_bare_continuation_head: bool,
    /// Annotation provenance carried through parentheses and TypeScript-only
    /// wrappers to the invocation that owns it.
    inherited_pure_annotation: bool,
}

impl Marker<'_> {
    fn visit_bare_continuation_head(&mut self, expr: &mut Expr) {
        let old = mem::replace(&mut self.in_bare_continuation_head, true);
        expr.visit_mut_with(self);
        self.in_bare_continuation_head = old;
    }

    fn has_source_pure_annotation(&self, expr: &Expr) -> bool {
        let span = expr.span();

        !span.is_dummy_ignoring_cmt()
            && self
                .comments
                .is_some_and(|comments| comments.has_flag(span.lo, "PURE"))
    }

    fn mark_owner(&self, expr: &mut Expr) {
        match expr {
            Expr::Call(call) => call.ctxt = call.ctxt.apply_mark(self.mark),
            Expr::New(new) => new.ctxt = new.ctxt.apply_mark(self.mark),
            Expr::TaggedTpl(tagged) => tagged.ctxt = tagged.ctxt.apply_mark(self.mark),
            Expr::OptChain(chain) => {
                if let OptChainBase::Call(call) = &mut *chain.base {
                    call.ctxt = call.ctxt.apply_mark(self.mark);
                }
            }
            _ => {}
        }
    }

    fn is_owner(expr: &Expr) -> bool {
        matches!(expr, Expr::Call(..) | Expr::New(..) | Expr::TaggedTpl(..))
            || matches!(expr, Expr::OptChain(chain) if matches!(&*chain.base, OptChainBase::Call(..)))
    }

    fn is_transparent_ts_wrapper(expr: &Expr) -> bool {
        matches!(
            expr,
            Expr::TsTypeAssertion(..)
                | Expr::TsConstAssertion(..)
                | Expr::TsNonNull(..)
                | Expr::TsAs(..)
                | Expr::TsInstantiation(..)
                | Expr::TsSatisfies(..)
        )
    }

    fn transparent_inner(expr: &Expr) -> Option<&Expr> {
        match expr {
            Expr::Paren(wrapper) => Some(&wrapper.expr),
            Expr::TsTypeAssertion(wrapper) => Some(&wrapper.expr),
            Expr::TsConstAssertion(wrapper) => Some(&wrapper.expr),
            Expr::TsNonNull(wrapper) => Some(&wrapper.expr),
            Expr::TsAs(wrapper) => Some(&wrapper.expr),
            Expr::TsInstantiation(wrapper) => Some(&wrapper.expr),
            Expr::TsSatisfies(wrapper) => Some(&wrapper.expr),
            _ => None,
        }
    }
}

impl VisitMut for Marker<'_> {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        match &mut node.callee {
            Callee::Expr(callee) => self.visit_bare_continuation_head(callee),
            callee => callee.visit_mut_with(self),
        }
        node.args.visit_mut_with(self);
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        let in_bare_continuation_head = mem::replace(&mut self.in_bare_continuation_head, false);
        let inherited_pure_annotation = mem::replace(&mut self.inherited_pure_annotation, false);
        let span_is_pure = expr.span().is_pure();
        let is_owner = Self::is_owner(expr);
        let is_paren = matches!(expr, Expr::Paren(..));
        let is_transparent_ts_wrapper = Self::is_transparent_ts_wrapper(expr);
        let has_source_pure_annotation = (is_owner || is_paren || is_transparent_ts_wrapper)
            && self.has_source_pure_annotation(expr);

        if is_owner
            && (inherited_pure_annotation
                || span_is_pure
                || (!in_bare_continuation_head && has_source_pure_annotation))
        {
            self.mark_owner(expr);
        }

        // Parentheses retain annotation ownership. TypeScript-only wrappers do
        // not, because they disappear before JavaScript is emitted.
        let propagate_bare_head = in_bare_continuation_head && is_transparent_ts_wrapper;
        let propagate_annotation = (is_paren || is_transparent_ts_wrapper)
            && (inherited_pure_annotation
                || span_is_pure
                || (!in_bare_continuation_head && has_source_pure_annotation));

        if propagate_annotation && has_source_pure_annotation {
            if let (Some(comments), Some(inner)) = (self.comments, Self::transparent_inner(expr)) {
                let from = expr.span().lo;
                let to = inner.span().lo;

                if from != to {
                    comments.move_leading(from, to);
                }
            }
        }

        let old_bare_head = mem::replace(&mut self.in_bare_continuation_head, propagate_bare_head);
        let old_pure_annotation =
            mem::replace(&mut self.inherited_pure_annotation, propagate_annotation);
        expr.visit_mut_children_with(self);
        self.in_bare_continuation_head = old_bare_head;
        self.inherited_pure_annotation = old_pure_annotation;
    }

    fn visit_mut_member_expr(&mut self, node: &mut MemberExpr) {
        self.visit_bare_continuation_head(&mut node.obj);
        node.prop.visit_mut_with(self);
    }

    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        self.visit_bare_continuation_head(&mut node.callee);
        node.args.visit_mut_with(self);
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_tagged_tpl(&mut self, node: &mut TaggedTpl) {
        self.visit_bare_continuation_head(&mut node.tag);
        node.type_params.visit_mut_with(self);
        node.tpl.visit_mut_with(self);
    }
}

struct Finalizer {
    mark: Mark,
}

impl Finalizer {
    fn is_marked_owner(&self, mut expr: &Expr) -> bool {
        loop {
            match expr {
                Expr::Call(call) => return call.ctxt.has_mark(self.mark),
                Expr::New(new) => return new.ctxt.has_mark(self.mark),
                Expr::TaggedTpl(tagged) => return tagged.ctxt.has_mark(self.mark),
                Expr::OptChain(chain) => {
                    return match &*chain.base {
                        OptChainBase::Call(call) => call.ctxt.has_mark(self.mark),
                        OptChainBase::Member(..) => false,
                        #[cfg(swc_ast_unknown)]
                        _ => false,
                    };
                }
                Expr::Paren(paren) => expr = &paren.expr,
                Expr::TsTypeAssertion(wrapper) => expr = &wrapper.expr,
                Expr::TsConstAssertion(wrapper) => expr = &wrapper.expr,
                Expr::TsNonNull(wrapper) => expr = &wrapper.expr,
                Expr::TsAs(wrapper) => expr = &wrapper.expr,
                Expr::TsInstantiation(wrapper) => expr = &wrapper.expr,
                Expr::TsSatisfies(wrapper) => expr = &wrapper.expr,
                _ => return false,
            }
        }
    }

    fn preserve_boundary(&self, expr: &mut Expr) {
        if !self.is_marked_owner(expr) {
            return;
        }

        if let Expr::Paren(paren) = expr {
            paren.span = PRESERVED_PAREN_SP;
            return;
        }

        *expr = ParenExpr {
            span: PRESERVED_PAREN_SP,
            expr: Box::new(expr.take()),
        }
        .into();
    }
}

impl VisitMut for Finalizer {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, node: &mut CallExpr) {
        match &mut node.callee {
            Callee::Expr(callee) => {
                callee.visit_mut_with(self);
                self.preserve_boundary(callee);
            }
            callee => callee.visit_mut_with(self),
        }
        node.args.visit_mut_with(self);
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_member_expr(&mut self, node: &mut MemberExpr) {
        node.obj.visit_mut_with(self);
        self.preserve_boundary(&mut node.obj);
        node.prop.visit_mut_with(self);
    }

    fn visit_mut_opt_call(&mut self, node: &mut OptCall) {
        node.callee.visit_mut_with(self);
        self.preserve_boundary(&mut node.callee);
        node.args.visit_mut_with(self);
        node.type_args.visit_mut_with(self);
    }

    fn visit_mut_tagged_tpl(&mut self, node: &mut TaggedTpl) {
        node.tag.visit_mut_with(self);
        self.preserve_boundary(&mut node.tag);
        node.type_params.visit_mut_with(self);
        node.tpl.visit_mut_with(self);
    }
}

#[cfg(test)]
mod tests {
    use swc_common::{
        comments::{Comments, SingleThreadedComments},
        source_map::{PRESERVED_PAREN_SP, PURE_SP},
        BytePos, Globals, Span, SyntaxContext, DUMMY_SP, GLOBALS,
    };
    use swc_ecma_ast::{Expr, MemberExpr, NewExpr, ParenExpr};
    use swc_ecma_visit::VisitMutWith;

    use super::{finalizer, marker};

    fn new_expr(span: Span) -> Expr {
        NewExpr {
            span,
            ctxt: SyntaxContext::empty(),
            ..Default::default()
        }
        .into()
    }

    fn member(obj: Expr) -> Expr {
        MemberExpr {
            span: DUMMY_SP,
            obj: Box::new(obj),
            ..Default::default()
        }
        .into()
    }

    #[test]
    fn source_annotation_requires_a_protected_boundary() {
        GLOBALS.set(&Globals::new(), || {
            let comments = SingleThreadedComments::default();
            let span = Span::new(BytePos(1), BytePos(4));
            comments.add_pure_comment(span.lo);
            let mark = swc_common::Mark::new();

            let mut bare = member(new_expr(span));
            bare.visit_mut_with(&mut marker(Some(&comments), mark));
            let Expr::Member(bare) = bare else {
                unreachable!()
            };
            let Expr::New(bare) = *bare.obj else {
                unreachable!()
            };
            assert!(!bare.ctxt.has_mark(mark));

            let protected = ParenExpr {
                span: DUMMY_SP,
                expr: Box::new(new_expr(span)),
            }
            .into();
            let mut protected = member(protected);
            protected.visit_mut_with(&mut marker(Some(&comments), mark));
            protected.visit_mut_with(&mut finalizer(mark));

            let Expr::Member(protected) = protected else {
                unreachable!()
            };
            let Expr::Paren(boundary) = *protected.obj else {
                panic!("expected a preserved annotation boundary")
            };
            assert_eq!(boundary.span, PRESERVED_PAREN_SP);
        });
    }

    #[test]
    fn annotation_propagates_through_nested_parentheses() {
        GLOBALS.set(&Globals::new(), || {
            let comments = SingleThreadedComments::default();
            let owner_span = Span::new(BytePos(20), BytePos(24));
            let annotation_span = Span::new(BytePos(10), BytePos(25));
            comments.add_pure_comment(annotation_span.lo);
            let mark = swc_common::Mark::new();

            let nested = ParenExpr {
                span: annotation_span,
                expr: Box::new(
                    ParenExpr {
                        span: Span::new(BytePos(11), BytePos(25)),
                        expr: Box::new(new_expr(owner_span)),
                    }
                    .into(),
                ),
            }
            .into();
            let boundary = ParenExpr {
                span: Span::new(BytePos(5), BytePos(26)),
                expr: Box::new(nested),
            }
            .into();
            let mut expr = member(boundary);

            expr.visit_mut_with(&mut marker(Some(&comments), mark));
            expr.visit_mut_with(&mut finalizer(mark));

            assert!(comments.has_flag(owner_span.lo, "PURE"));
            assert!(!comments.has_leading(annotation_span.lo));

            let Expr::Member(member) = expr else {
                unreachable!()
            };
            let Expr::Paren(boundary) = *member.obj else {
                panic!("expected the outer boundary to be preserved")
            };
            assert_eq!(boundary.span, PRESERVED_PAREN_SP);
        });
    }

    #[test]
    fn annotation_before_outer_parenthesis_is_not_inherited() {
        GLOBALS.set(&Globals::new(), || {
            let comments = SingleThreadedComments::default();
            let boundary_span = Span::new(BytePos(5), BytePos(20));
            comments.add_pure_comment(boundary_span.lo);
            let mark = swc_common::Mark::new();
            let boundary = ParenExpr {
                span: boundary_span,
                expr: Box::new(new_expr(Span::new(BytePos(10), BytePos(18)))),
            }
            .into();
            let mut expr = member(boundary);

            expr.visit_mut_with(&mut marker(Some(&comments), mark));
            expr.visit_mut_with(&mut finalizer(mark));

            let Expr::Member(member) = expr else {
                unreachable!()
            };
            let Expr::Paren(boundary) = *member.obj else {
                unreachable!()
            };
            assert_ne!(boundary.span, PRESERVED_PAREN_SP);
            let Expr::New(owner) = *boundary.expr else {
                unreachable!()
            };
            assert!(!owner.ctxt.has_mark(mark));
        });
    }

    #[test]
    fn synthetic_annotation_is_owned_even_when_bare() {
        GLOBALS.set(&Globals::new(), || {
            let mark = swc_common::Mark::new();
            let mut expr = member(new_expr(PURE_SP));

            expr.visit_mut_with(&mut marker(None, mark));
            expr.visit_mut_with(&mut finalizer(mark));

            let Expr::Member(member) = expr else {
                unreachable!()
            };
            let Expr::Paren(boundary) = *member.obj else {
                panic!("expected a preserved synthetic annotation boundary")
            };
            assert_eq!(boundary.span, PRESERVED_PAREN_SP);
            let Expr::New(owner) = *boundary.expr else {
                unreachable!()
            };
            assert!(owner.ctxt.has_mark(mark));
        });
    }
}
