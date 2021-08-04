use crate::analyzer::analyze;
use crate::analyzer::ProgramData;
use crate::marks::Marks;
use crate::pass::hygiene::analyzer::HygieneAnalyzer;
use crate::pass::hygiene::analyzer::HygieneData;
use crate::util::now;
use std::time::Instant;
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

/// Optimize hygiene info to get minified output.
///
/// Requires [swc_common::GLOBALS].
pub fn optimize_hygiene(m: &mut Module, marks: Marks, top_level_mark: Mark) {
    let data = analyze(&*m, marks);
    m.visit_mut_with(&mut hygiene_optimizer(data, marks, top_level_mark))
}

/// Create a hygiene optimizer.
///
/// Hygiene optimizer removes span hygiene without renaming if it's ok to do so.
pub(crate) fn hygiene_optimizer(
    data: ProgramData,
    marks: Marks,
    top_level_mark: Mark,
) -> impl 'static + VisitMut {
    Optimizer {
        data,
        marks,
        hygiene: Default::default(),
        top_level_mark,
    }
}

struct Optimizer {
    data: ProgramData,
    marks: Marks,
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
        log::info!("hygiene: Analyzing span hygiene");
        let start = now();

        let mut analyzer = HygieneAnalyzer {
            data: &self.data,
            marks: self.marks,
            hygiene: Default::default(),
            top_level_mark: self.top_level_mark,
            cur_scope: None,
            skip_standalone: false,
        };
        n.visit_with(&Invalid { span: DUMMY_SP }, &mut analyzer);
        self.hygiene = analyzer.hygiene;

        if let Some(start) = start {
            let end = Instant::now();
            log::info!("hygiene: Span hygiene analysis took {:?}", end - start);
        }
        let start = now();

        log::info!("hygiene: Optimizing span hygiene");
        n.visit_mut_children_with(self);

        if let Some(start) = start {
            let end = Instant::now();
            log::info!("hygiene: Span hygiene optimiation took {:?}", end - start);
        }
    }
}
