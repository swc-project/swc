use swc_atoms::JsWord;
use swc_common::collections::AHashMap;
use swc_ecma_ast::Id;

#[derive(Default)]
pub(super) struct RenameMap {
    map: AHashMap<Id, JsWord>,
    rev: AHashMap<JsWord, Vec<Id>>,
}

impl RenameMap {
    pub fn into_map(self) -> AHashMap<Id, JsWord> {
        self.map
    }

    pub fn insert(&mut self, id: Id, sym: JsWord) {
        self.map.insert(id.clone(), sym.clone());
        self.rev.entry(sym).or_default().push(id);
    }

    pub fn get_by_right(&self, right: &JsWord) -> Option<&[Id]> {
        self.rev.get(right).map(|v| &**v)
    }
}
