use std::{hash::BuildHasherDefault, ops::RangeFull};

use indexmap::IndexMap;
use rustc_hash::FxHasher;
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
    /// A hash map to preserve original span.
    ///
    /// Key is span of inner expression, and value is span of the paren
    /// expression.
    span_map: IndexMap<Span, Span, BuildHasherDefault<FxHasher>>,
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

        self.wrap_with_paren_if_required(e)
    }

    fn visit_mut_for_of_stmt(&mut self, s: &mut ForOfStmt) {
        s.visit_mut_children_with(self);

        if !s.is_await {
            match &s.left {
                ForHead::Pat(p)
                    if match &**p {
                        Pat::Ident(BindingIdent {
                            id: Ident { sym, .. },
                            ..
                        }) => &**sym == "async",
                        _ => false,
                    } =>
                {
                    let expr: Pat = p.clone().expect_ident().into();
                    s.left = ForHead::Pat(expr.into());
                }
                _ => (),
            }
        }
    }

    fn visit_mut_if_stmt(&mut self, node: &mut IfStmt) {
        node.visit_mut_children_with(self);

        if will_eat_else_token(&node.cons) {
            node.cons = Box::new(
                BlockStmt {
                    span: node.cons.span(),
                    stmts: vec![*node.cons.take()],
                    ..Default::default()
                }
                .into(),
            );
        }
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

    fn visit_mut_opt_chain_base(&mut self, n: &mut OptChainBase) {
        if !n.is_member() {
            n.visit_mut_children_with(self);
            return;
        }

        n.visit_mut_children_with(self);
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
    fn wrap_with_paren_if_required(&mut self, e: &mut Expr) {
        let mut has_padding_value = false;
        if let Expr::Seq(SeqExpr { span, exprs }) = e {
            let len = exprs
                .iter()
                .map(|expr| match **expr {
                    Expr::Paren(ParenExpr { ref expr, .. }) => {
                        if let Expr::Seq(SeqExpr { exprs, .. }) = expr.as_ref() {
                            exprs.len()
                        } else {
                            1
                        }
                    }
                    Expr::Seq(SeqExpr { ref exprs, .. }) => exprs.len(),
                    _ => 1,
                })
                .sum();

            let exprs_len = exprs.len();
            // don't has child seq
            let exprs = if len == exprs_len {
                let mut exprs = exprs
                    .iter_mut()
                    .enumerate()
                    .filter_map(|(i, e)| {
                        let is_last = i + 1 == exprs_len;
                        if is_last {
                            Some(e.take())
                        } else {
                            ignore_return_value(e.take(), &mut has_padding_value)
                        }
                    })
                    .collect::<Vec<_>>();
                if exprs.len() == 1 {
                    *e = *exprs.pop().unwrap();
                    return;
                }
                ignore_padding_value(exprs)
            } else {
                let mut buf = Vec::with_capacity(len);
                for (i, expr) in exprs.iter_mut().enumerate() {
                    let is_last = i + 1 == exprs_len;

                    match &mut **expr {
                        Expr::Seq(SeqExpr { exprs, .. }) => {
                            let exprs = exprs.take();
                            if !is_last {
                                buf.extend(exprs.into_iter().filter_map(|expr| {
                                    ignore_return_value(expr, &mut has_padding_value)
                                }));
                            } else {
                                let exprs_len = exprs.len();
                                for (i, expr) in exprs.into_iter().enumerate() {
                                    let is_last = i + 1 == exprs_len;
                                    if is_last {
                                        buf.push(expr);
                                    } else {
                                        buf.extend(ignore_return_value(
                                            expr,
                                            &mut has_padding_value,
                                        ));
                                    }
                                }
                            }
                        }
                        _ => {
                            if is_last {
                                buf.push(expr.take());
                            } else {
                                buf.extend(ignore_return_value(
                                    expr.take(),
                                    &mut has_padding_value,
                                ));
                            }
                        }
                    }
                }

                if buf.len() == 1 {
                    *e = *buf.pop().unwrap();
                    return;
                }

                ignore_padding_value(buf)
            };

            let expr = SeqExpr { span: *span, exprs }.into();

            *e = expr;
        }
    }

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

                    self.span_map.insert(expr_span, paren_span);
                }

                _ => return,
            }
        }
    }
}

fn ignore_return_value(expr: Box<Expr>, has_padding_value: &mut bool) -> Option<Box<Expr>> {
    match *expr {
        Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) => {
            if *has_padding_value {
                None
            } else {
                *has_padding_value = true;
                Some(expr)
            }
        }
        Expr::Seq(SeqExpr { span, exprs }) => {
            let len = exprs.len();
            let mut exprs: Vec<_> = exprs
                .into_iter()
                .enumerate()
                .filter_map(|(i, expr)| {
                    if i + 1 == len {
                        Some(expr)
                    } else {
                        ignore_return_value(expr, has_padding_value)
                    }
                })
                .collect();

            match exprs.len() {
                0 | 1 => exprs.pop(),
                _ => Some(SeqExpr { span, exprs }.into()),
            }
        }
        Expr::Unary(UnaryExpr {
            op: op!("void"),
            arg,
            ..
        }) => ignore_return_value(arg, has_padding_value),
        _ => Some(expr),
    }
}

// at least 3 element in seq, which means we can safely
// remove that padding, if not at last position
#[allow(clippy::vec_box)]
fn ignore_padding_value(exprs: Vec<Box<Expr>>) -> Vec<Box<Expr>> {
    let len = exprs.len();

    if len > 2 {
        exprs
            .into_iter()
            .enumerate()
            .filter_map(|(i, e)| match e.as_ref() {
                Expr::Fn(..) | Expr::Arrow(..) | Expr::Lit(..) if i + 1 != len => None,
                _ => Some(e),
            })
            .collect()
    } else {
        exprs
    }
}

fn will_eat_else_token(s: &Stmt) -> bool {
    match s {
        Stmt::If(s) => match &s.alt {
            Some(alt) => will_eat_else_token(alt),
            None => true,
        },
        // Ends with `}`.
        Stmt::Block(..) => false,

        Stmt::Labeled(s) => will_eat_else_token(&s.body),

        Stmt::While(s) => will_eat_else_token(&s.body),

        Stmt::For(s) => will_eat_else_token(&s.body),

        Stmt::ForIn(s) => will_eat_else_token(&s.body),

        Stmt::ForOf(s) => will_eat_else_token(&s.body),

        _ => false,
    }
}
