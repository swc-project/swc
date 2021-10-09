use std::borrow::Cow;
use swc_common::{collections::AHashSet, pass::CompilerPass, EqIgnoreSpan, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_utils::{ident::IdentLike, Id};
use swc_ecma_visit::{noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith};

pub fn globals_defs(defs: Vec<(Box<Expr>, Box<Expr>)>, top_level_mark: Mark) -> impl VisitMut {
    GlobalDefs {
        defs,
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        ..Default::default()
    }
}

#[derive(Default)]
struct GlobalDefs {
    defs: Vec<(Box<Expr>, Box<Expr>)>,
    /// If syntax context of a identifier reference is not top-level, it means
    /// the reference points a binding (var / fn / class or whatever).
    top_level_ctxt: SyntaxContext,
    /// If a varaible is registered in this variable, it's not a global
    /// constant.
    ///
    /// Non-top level bindings are filtered using `top_level_mark`.
    top_level_bindings: AHashSet<Id>,
    in_lhs_of_assign: bool,
}

impl CompilerPass for GlobalDefs {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("global-defs")
    }
}

/// Finds top-level bindings.
impl Visit for GlobalDefs {
    noop_visit_type!();
}

/// We use [VisitMut] instead of [swc_ecma_visit::Fold] because it's faster.
impl VisitMut for GlobalDefs {
    noop_visit_mut_type!();

    fn visit_mut_assign_expr(&mut self, n: &mut AssignExpr) {
        let old = self.in_lhs_of_assign;
        self.in_lhs_of_assign = true;
        n.left.visit_mut_with(self);
        self.in_lhs_of_assign = false;
        n.right.visit_mut_with(self);
        self.in_lhs_of_assign = old;
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if self.in_lhs_of_assign {
            return;
        }

        match n {
            Expr::Ident(i) => {
                if i.span.ctxt != self.top_level_ctxt
                    || self.top_level_bindings.contains(&i.to_id())
                {
                    return;
                }
            }
            Expr::Member(MemberExpr {
                obj: ExprOrSuper::Expr(obj),
                ..
            }) => match &**obj {
                Expr::Ident(i) => {
                    if i.span.ctxt != self.top_level_ctxt
                        || self.top_level_bindings.contains(&i.to_id())
                    {
                        return;
                    }
                }
                _ => {}
            },
            _ => {}
        }

        if let Some((_, new)) = self.defs.iter().find(|(pred, _)| should_replace(&pred, &n)) {
            *n = *new.clone();
            return;
        }

        n.visit_mut_children_with(self);
    }

    #[inline]
    fn visit_mut_update_expr(&mut self, e: &mut UpdateExpr) {
        match &mut *e.arg {
            Expr::Ident(..) => {}

            Expr::Member(MemberExpr {
                computed: false, ..
            }) => {
                // TODO: Check for `obj`
            }

            _ => {
                e.arg.visit_mut_with(self);
            }
        }
    }
}

/// This is used to detect optional chaining expressions like `a?.b.c` without
/// allocation.
fn should_replace(pred: &Expr, node: &Expr) -> bool {
    if pred.eq_ignore_span(node) {
        return true;
    }

    match (pred, node) {
        (pred, Expr::OptChain(node)) => {
            if should_replace(pred, &node.expr) {
                return true;
            }
        }

        (Expr::Member(pred), Expr::Member(node)) => {
            if pred.computed || node.computed {
                return false;
            }

            if !pred.prop.eq_ignore_span(&node.prop) {
                return false;
            }

            match (&pred.obj, &node.obj) {
                (ExprOrSuper::Expr(pred_obj), ExprOrSuper::Expr(node_obj)) => {
                    return should_replace(pred_obj, node_obj)
                }
                _ => {}
            }
        }
        _ => {}
    }

    false
}
