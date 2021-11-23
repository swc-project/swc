use crate::{
    esbuild::js_ast::{SlotNamespace, SymbolMap},
    types::ProgramLike,
    Rename,
};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_utils::Id;

/// Implementation of [Rename] which renames an identifier if there's a
/// collision.
#[derive(Debug)]
pub struct HygieneRenamer {
    map: AHashMap<Id, String>,
}

struct Scope {}

pub struct HygieneRenamerBuilder {
    symbols: SymbolMap,
    map: AHashMap<Id, String>,
}

impl HygieneRenamerBuilder {
    /// https://github.com/evanw/esbuild/blob/2b885e528eb82441ca965cdd75c188ab2dc64e13/internal/renamer/renamer.go#L426
    pub fn add_top_level_symbol(&mut self, id: Id) {}

    fn assign_name(&mut self, scope: &mut Scope, id: Id) {
        // Don't rename the same symbol more than once
        if self.map.contains_key(&id) {
            return;
        }

        // Don't rename unbound symbols, symbols marked as reserved names, labels, or
        // private names
        let symbol = self.symbols.get(&id);
        if symbol.slot_namespace() != SlotNamespace::SlotDefault {
            return;
        }
    }
}

impl HygieneRenamer {
    /// Creates a hygiene renamer for a module or a script.
    ///
    /// Currently this requires `&mut` because of the scoping issue.
    ///
    /// `N` should be [Module] or [Script]
    pub fn new_for<N>(node: &mut N) -> Self
    where
        N: ProgramLike,
    {
    }
}

impl Rename for HygieneRenamer {
    fn rename_ident(&self, sym: &JsWord, ctxt: SyntaxContext, write_to: &mut String) {
        match self.map.get(&(sym.clone(), ctxt)) {
            Some(s) => {
                write_to.push_str(&s);
            }
            None => {
                write_to.push_str(&sym);
            }
        }
    }
}
