use rustc_hash::FxHashSet;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_visit_type, visit_obj_and_computed, Visit, VisitWith};

pub(crate) struct IdentUsageCollector<'a> {
    id_map: &'a mut Ids,
    ids: FxHashSet<IdIdx>,
    ignore_nested: bool,
}

impl Visit for IdentUsageCollector<'_> {
    noop_visit_type!(fail);

    visit_obj_and_computed!();

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_function(&mut self, n: &Function) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_ident(&mut self, n: &Ident) {
        let id = self.id_map.intern_ident(n);
        self.ids.insert(id);
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}

pub(crate) fn idents_used_by<'a, N>(n: &N, id_map: &'a mut Ids) -> FxHashSet<IdIdx>
where
    N: VisitWith<IdentUsageCollector<'a>>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: false,
        ids: FxHashSet::default(),
        id_map,
    };
    n.visit_with(&mut v);
    v.ids
}

pub(crate) fn idents_used_by_ignoring_nested<'a, N>(n: &N, id_map: &'a mut Ids) -> FxHashSet<IdIdx>
where
    N: VisitWith<IdentUsageCollector<'a>>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: true,
        ids: FxHashSet::default(),
        id_map,
    };
    n.visit_with(&mut v);
    v.ids
}
