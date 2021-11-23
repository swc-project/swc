use swc_common::collections::AHashMap;
use swc_ecma_utils::Id;

#[derive(Debug, Clone)]
pub struct Symbol {}

#[derive(Debug)]
pub struct SymbolMap {
    symbols: AHashMap<Id, Symbol>,
}

impl SymbolMap {
    pub fn get(&self, id: &Id) -> Option<&Symbol> {
        self.symbols.get(id)
    }
}
