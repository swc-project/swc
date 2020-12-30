use std::collections::HashMap;
use swc_ecma_utils::Id;
use swc_ecma_visit::VisitMut;

#[derive(Debug, Default)]
pub struct NameMangler {
    ids: HashMap<Id, Id>,
}

impl VisitMut for NameMangler {}
