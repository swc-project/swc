use std::borrow::Cow;
use swc_common::pass::CompilerPass;
use swc_common::EqIgnoreSpan;
use swc_ecma_ast::*;
use swc_ecma_visit::as_folder;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;

pub fn globals_defs(defs: Vec<(Box<Expr>, Box<Expr>)>) -> impl CompilerPass {
    as_folder(GlobalDefs { defs })
}

struct GlobalDefs {
    defs: Vec<(Box<Expr>, Box<Expr>)>,
}

impl CompilerPass for GlobalDefs {
    fn name() -> Cow<'static, str> {
        Cow::Borrowed("global-defs")
    }
}

/// We use [VisitMut] instead of [swc_ecma_visit::Fold] because it's faster.
impl VisitMut for GlobalDefs {
    noop_visit_mut_type!();

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        if let Some((_, new)) = self.defs.iter().find(|(pred, _)| pred.eq_ignore_span(&*n)) {
            *n = *new.clone();
            return;
        }

        n.visit_mut_children_with(self);
    }
}
