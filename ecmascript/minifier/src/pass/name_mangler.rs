#[derive(Default)]
pub struct NameMangler {
    ids: FxHashMap<Id, Id>,
}

impl VisitMut for NameMangler {}
