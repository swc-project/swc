use std::ops::RangeFull;

use swc_common::{comments::Comments, util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::stack_size::maybe_grow_default;
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

pub fn paren_remover(comments: Option<&dyn Comments>) -> impl '_ + Pass + VisitMut {
    visit_mut_pass(Fixer {
        comments,
        span_map: Default::default(),
    })
}

struct Fixer<'a> {
    comments: Option<&'a dyn Comments>,
    /// Span mappings of inner expression and paren expression.
    span_map: Vec<(Span, Span)>,
}

impl VisitMut for Fixer<'_> {
    noop_visit_mut_type!();

    fn visit_mut_assign_target(&mut self, n: &mut AssignTarget) {
        n.visit_mut_children_with(self);

        match n {
            AssignTarget::Simple(a) => {
                if let SimpleAssignTarget::Paren(s) = a {
                    *n = AssignTarget::try_from(s.expr.take()).unwrap();
                }
            }
            AssignTarget::Pat(b) => {
                if let AssignTargetPat::Invalid(_) = b {
                    *n = AssignTarget::Simple(SimpleAssignTarget::Invalid(Invalid {
                        span: DUMMY_SP,
                    }));
                }
            }
        }
    }

    fn visit_mut_class(&mut self, node: &mut Class) {
        node.super_class.visit_mut_with(self);
        node.body.visit_mut_with(self);
        node.body.retain(|m| !matches!(m, ClassMember::Empty(..)));
    }

    fn visit_mut_expr(&mut self, e: &mut Expr) {
        self.unwrap_expr(e);

        maybe_grow_default(|| e.visit_mut_children_with(self));
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }

    fn visit_mut_script(&mut self, n: &mut Script) {
        debug_assert!(self.span_map.is_empty());
        self.span_map.clear();

        n.visit_mut_children_with(self);
        if let Some(c) = self.comments {
            for (to, from) in self.span_map.drain(RangeFull).rev() {
                c.move_leading(from.lo, to.lo);
                c.move_trailing(from.hi, to.hi);
            }
        }
    }
}

impl Fixer<'_> {
    /// Removes paren
    fn unwrap_expr(&mut self, e: &mut Expr) {
        loop {
            match e {
                Expr::Seq(SeqExpr { exprs, .. }) if exprs.len() == 1 => {
                    *e = *exprs[0].take();
                }

                Expr::Paren(ParenExpr {
                    span: paren_span,
                    expr,
                    ..
                }) => {
                    let expr_span = expr.span();
                    let paren_span = *paren_span;
                    *e = *expr.take();

                    self.span_map.push((expr_span, paren_span));
                }

                _ => return,
            }
        }
    }
}
