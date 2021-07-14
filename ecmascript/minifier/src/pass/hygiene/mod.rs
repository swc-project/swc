use std::time::Instant;

use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::pass::hygiene::analyzer::HygieneAnalyzer;
use crate::pass::hygiene::analyzer::HygieneData;
use swc_common::Mark;
use swc_common::SyntaxContext;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_visit::noop_visit_mut_type;
use swc_ecma_visit::VisitMut;
use swc_ecma_visit::VisitMutWith;
use swc_ecma_visit::VisitWith;

mod analyzer;

pub fn optimize_hygiene(m: &mut Module, top_level_mark: Mark) {
    let data = analyze(&*m);
    m.visit_mut_with(&mut hygiene_optimizer(data, top_level_mark))
}

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub(crate) fn hygiene_optimizer(
    data: ProgramData,
    top_level_mark: Mark,
) -> impl 'static + VisitMut {
    Optimizer {
        data,
        hygiene: Default::default(),
        top_level_mark,
    }
}

struct Optimizer {
    data: ProgramData,
    hygiene: HygieneData,
    top_level_mark: Mark,
}

impl Optimizer {}

impl VisitMut for Optimizer {
    noop_visit_mut_type!();

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        if i.span.ctxt == SyntaxContext::empty() {
            return;
        }

        if self.hygiene.preserved.contains(&i.to_id())
            || !self.hygiene.modified.contains(&i.to_id())
        {
            return;
        }

        i.span.ctxt = SyntaxContext::empty().apply_mark(self.top_level_mark);
    }

    fn visit_mut_member_expr(&mut self, n: &mut MemberExpr) {
        n.obj.visit_mut_with(self);

        if n.computed {
            n.prop.visit_mut_with(self);
        }
    }

    fn visit_mut_module(&mut self, n: &mut Module) {
        log::debug!("hygiene: Analyzing span hygiene");
        let start = Instant::now();

        let mut analyzer = HygieneAnalyzer {
            data: &self.data,
            hygiene: Default::default(),
            top_level_mark: self.top_level_mark,
            cur_scope: None,
        };
        n.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
        self.hygiene = analyzer.hygiene;

        let end = Instant::now();
        log::debug!("hygiene: Span hygiene analysis took {:?}", end - start);
        let start = end;

        log::debug!("hygiene: Optimizing span hygiene");
        n.visit_mut_children_with(self);
        let end = Instant::now();
        log::debug!("hygiene: Span hygiene optimiation took {:?}", end - start);
    }
}
