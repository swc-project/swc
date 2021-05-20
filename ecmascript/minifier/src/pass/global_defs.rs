use std::borrow::Cow;
use swc_common::pass::CompilerPass;
use swc_common::EqIgnoreSpan;
use swc_ecma_ast::*;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub fn globals_defs(defs: Vec<(Box<Expr>, Lit)>) -> impl VisitMut {
    GlobalDefs {
        defs,
        ..Default::default()
    }
}

#[derive(Default)]
struct GlobalDefs {
    defs: Vec<(Box<Expr>, Lit)>,
    in_lhs_of_assign: bool,
}

impl CompilerPass for GlobalDefs {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("global-defs")
    }
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

        if let Some((_, new)) = self
            .defs
            .iter()
            .find(|(pred, _)| (&**pred).eq_ignore_span(&*n))
        {
            *n = Expr::Lit(new.clone());
            return;
        }

        n.visit_mut_children_with(self);
    }

    /// Noop.
    #[inline]
    fn visit_mut_update_expr(&mut self, _: &mut UpdateExpr) {}
}
