use crate::{types::ProgramLike, Rename};
use swc_atoms::JsWord;
use swc_common::{collections::AHashMap, SyntaxContext};
use swc_ecma_utils::Id;

mod unique_scopes;

/// Implementation of [Rename] which renames an identifier if it's already in
/// scope.
#[derive(Debug)]
pub struct HygieneRenamer {
    map: AHashMap<Id, String>,
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
