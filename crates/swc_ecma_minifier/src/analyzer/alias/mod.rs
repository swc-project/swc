use rustc_hash::FxHashSet;

mod ctx;

pub(super) fn get_infects_of<N>(init: &N) -> impl 'static + Iterator<Item = Id>
where
    N: for<'aa> VisitWith<InfectsTo<'aa>> + VisitWith<BindingCollector<Id>>,
{
    let excluded: AHashSet<Id> = collect_decls(init);
    let used_idents = {
        let mut v = InfectsTo {
            excludes: &excluded,
            infects: Default::default(),
        };

        init.visit_with(&mut v);

        v.infects
    };

    used_idents
        .into_iter()
        .filter(move |id| !excluded.contains(id))
}

pub(super) struct InfectsTo<'a> {
    pub excludes: &'a AHashSet<Id>,
    pub infects: FxHashSet<Id>,
}

impl Visit for InfectsTo<'_> {
    noop_visit_type!();

    visit_obj_and_computed!();

    fn visit_ident(&mut self, n: &Ident) {
        if self.excludes.contains(&n.to_id()) {
            return;
        }
        self.infects.insert(n.to_id());
    }

    fn visit_member_prop(&mut self, n: &MemberProp) {
        if let MemberProp::Computed(..) = n {
            n.visit_children_with(self);
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}
