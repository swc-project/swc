use crate::option::MangleOptions;
use fxhash::FxHashSet;
use swc_common::DUMMY_SP;
use swc_ecma_ast::*;
use swc_ecma_utils::ident::IdentLike;
use swc_ecma_utils::Id;
use swc_ecma_visit::noop_visit_type;
use swc_ecma_visit::Node;
use swc_ecma_visit::Visit;
use swc_ecma_visit::VisitWith;

pub(super) fn idents_to_preserve<N>(options: MangleOptions, n: &N) -> FxHashSet<Id>
where
    N: VisitWith<Preserver>,
{
    let mut v = Preserver {
        options,
        preserved: Default::default(),
    };
    n.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.preserved
}
pub(super) struct Preserver {
    options: MangleOptions,
    preserved: FxHashSet<Id>,
}

impl Visit for Preserver {
    noop_visit_type!();

    fn visit_fn_decl(&mut self, n: &FnDecl, _: &dyn Node) {
        n.visit_children_with(self);

        if self.options.keep_fn_names {
            self.preserved.insert(n.ident.to_id());
        }
    }
}
