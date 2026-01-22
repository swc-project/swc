//! Hook-based global definitions replacer.
//!
//! This module provides a hook-based implementation of the global definitions
//! pass, which can be combined with other hooks for a single AST traversal.

use swc_common::{EqIgnoreSpan, Mark, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_hooks::VisitMutHook;

use crate::metadata::hook::InfoMarkerCtx;

/// Hook for replacing global definitions.
pub(crate) struct GlobalDefsHook {
    defs: Vec<(Box<Expr>, Box<Expr>)>,

    unresolved_ctxt: SyntaxContext,
    top_level_ctxt: SyntaxContext,

    in_lhs_of_assign: bool,
}

impl GlobalDefsHook {
    pub(crate) fn new(
        defs: Vec<(Box<Expr>, Box<Expr>)>,
        unresolved_mark: Mark,
        top_level_mark: Mark,
    ) -> Self {
        Self {
            defs,
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            top_level_ctxt: SyntaxContext::empty().apply_mark(top_level_mark),
            in_lhs_of_assign: false,
        }
    }

    fn try_replace(&self, n: &mut Expr) -> bool {
        if self.in_lhs_of_assign {
            return false;
        }

        match n {
            Expr::Ident(i) => {
                if i.ctxt != self.unresolved_ctxt && i.ctxt != self.top_level_ctxt {
                    return false;
                }
            }
            Expr::Member(MemberExpr { obj, .. }) => {
                if let Expr::Ident(i) = &**obj {
                    if i.ctxt != self.unresolved_ctxt && i.ctxt != self.top_level_ctxt {
                        return false;
                    }
                }
            }
            _ => {}
        }

        if let Some((_, new)) = self
            .defs
            .iter()
            .find(|(pred, _)| Ident::within_ignored_ctxt(|| should_replace(pred, n)))
        {
            *n = *new.clone();
            return true;
        }

        false
    }
}

impl VisitMutHook<InfoMarkerCtx> for GlobalDefsHook {
    fn enter_assign_expr(&mut self, _n: &mut AssignExpr, _ctx: &mut InfoMarkerCtx) {
        // We need to track that we're in the LHS of an assignment
        // to avoid replacing assignment targets
        self.in_lhs_of_assign = true;

        // Visit left side with in_lhs_of_assign = true
        // The actual expression visiting will happen via enter_expr

        // Note: We set the flag here, and it will be reset in exit_assign_expr
        // The hook system will visit the expression children
    }

    fn exit_assign_expr(&mut self, _n: &mut AssignExpr, _ctx: &mut InfoMarkerCtx) {
        self.in_lhs_of_assign = false;
    }

    fn enter_expr(&mut self, n: &mut Expr, _ctx: &mut InfoMarkerCtx) {
        self.try_replace(n);
    }

    fn enter_update_expr(&mut self, e: &mut UpdateExpr, _ctx: &mut InfoMarkerCtx) {
        // Don't replace expressions that are targets of update operations
        // (e.g., ++x, x--)
        match &mut *e.arg {
            Expr::Ident(..) => {}
            Expr::Member(MemberExpr { prop, .. }) if !prop.is_computed() => {
                // TODO: Check for `obj`
            }
            _ => {
                // For other cases, try to replace the argument
                self.try_replace(&mut e.arg);
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
