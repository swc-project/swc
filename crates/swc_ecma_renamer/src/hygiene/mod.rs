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

        let mut orig_name = symbol.original_name.clone();
        if symbol.must_start_with_capital_letter_for_jsx {
            orig_name = ascii_uppercase_first_letter(&orig_name)
                .map(|s| s.into())
                .unwrap_or(orig_name);
        }

        let name = scope.find_unused_name(orig_name);

        self.map.insert(id, name);
    }

    pub fn assign_names_by_scope(&mut self) {}
}

fn ascii_uppercase_first_letter(s: &str) -> Option<String> {
    let mut c = s.chars();
    match c.next() {
        None => None,
        Some(f) => {
            if f.is_ascii_lowercase() {
                Some(f.to_uppercase().chain(c).collect::<String>())
            } else {
                None
            }
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
