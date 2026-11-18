use std::borrow::Cow;

use swc_common::{pass::CompilerPass, EqIgnoreSpan, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_mut_type, VisitMut, VisitMutWith};

pub fn globals_defs(
    defs: Vec<(Box<Expr>, Box<Expr>)>,
    unresolved_mark: Mark,
    top_level_mark: Mark,
) -> impl VisitMut {
    GlobalDefs {
        defs,
        unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
        top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
        ..Default::default()
    }
}

#[derive(Default)]
struct GlobalDefs {
    defs: Vec<(Box<Expr>, Box<Expr>)>,

    unresolved_ctxt: SyntaxContext,
    top_level_ctxt: SyntaxContext,

    in_lhs_of_assign: bool,
}

impl CompilerPass for GlobalDefs {
    fn name(&self) -> Cow<'static, str> {
        Cow::Borrowed("global-defs")
    }
}

/// We use [VisitMut] instead of [swc_ecma_visit::Fold] because it's faster.
impl VisitMut for GlobalDefs {
    noop_visit_mut_type!(fail);

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

        let has_local_root = match n.leftmost() {
            Some(i) => i.ctxt != self.unresolved_ctxt && i.ctxt != self.top_level_ctxt,
            None => false,
        };
        if has_local_root {
            self.visit_mut_computed_props(n);
            return;
        }

        if let Some((_, new)) = self
            .defs
            .iter()
            .find(|(pred, _)| Ident::within_ignored_ctxt(|| should_replace(pred, n)))
        {
            *n = *new.clone();
            return;
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_update_expr(&mut self, e: &mut UpdateExpr) {
        self.visit_mut_computed_props(&mut e.arg);
    }
}

impl GlobalDefs {
    /// Visits computed property expressions without replacing a protected
    /// member chain or its static property accesses.
    fn visit_mut_computed_props(&mut self, expr: &mut Expr) {
        match expr {
            Expr::Member(MemberExpr { obj, prop, .. }) => {
                self.visit_mut_computed_props(obj);
                if let MemberProp::Computed(prop) = prop {
                    prop.expr.visit_mut_with(self);
                }
            }
            Expr::OptChain(OptChainExpr { base, .. }) => match &mut **base {
                OptChainBase::Member(MemberExpr { obj, prop, .. }) => {
                    self.visit_mut_computed_props(obj);
                    if let MemberProp::Computed(prop) = prop {
                        prop.expr.visit_mut_with(self);
                    }
                }
                // Optional calls can be the root of a protected update target,
                // e.g. `(getObject?.())[KEY]++`.
                OptChainBase::Call(..) => expr.visit_mut_children_with(self),
            },
            Expr::Ident(..) => {}
            Expr::Paren(ParenExpr { expr, .. }) => self.visit_mut_computed_props(expr),
            // The root of an update target can be an arbitrary expression, such
            // as `this`, a call, or an object literal. Walk its children so
            // nested expressions can still use global definitions, but do not
            // visit the root itself and replace the protected update target.
            _ => expr.visit_mut_children_with(self),
        }
    }
}

/// This is used to detect optional chaining expressions like `a?.b.c` without
/// allocation.
fn should_replace(pred: &Expr, node: &Expr) -> bool {
    if pred.eq_ignore_span(node) {
        return true;
    }

    fn match_node(node: &Expr) -> Option<(&Expr, &MemberProp)> {
        match node {
            Expr::Member(MemberExpr {
                obj: node_obj,
                prop: nodes,
                ..
            }) => Some((node_obj, nodes)),

            Expr::OptChain(OptChainExpr { base, .. }) => {
                let base = base.as_member()?;
                Some((&base.obj, &base.prop))
            }

            _ => None,
        }
    }

    match (pred, match_node(node)) {
        // super?. is invalid
        (
            Expr::Member(MemberExpr {
                obj: pred_obj,
                prop: pred,
                ..
            }),
            Some((node_obj, nodes)),
        ) if !(pred.is_computed() || nodes.is_computed()) => {
            if !pred.eq_ignore_span(nodes) {
                return false;
            }

            return should_replace(pred_obj, node_obj);
        }
        _ => {}
    }

    false
}
