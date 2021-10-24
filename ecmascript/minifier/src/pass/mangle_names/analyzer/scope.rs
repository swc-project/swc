use std::cell::RefCell;

use swc_atoms::JsWord;
use swc_common::collections::AHashMap;

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,

    pub direct_decls: RefCell<AHashMap<JsWord, Vec<usize>>>,
    pub decls: RefCell<AHashMap<JsWord, Vec<usize>>>,

    /// Usages in current scope.
    pub direct_usages: RefCell<AHashMap<JsWord, Vec<usize>>>,
    pub usages: RefCell<AHashMap<JsWord, Vec<usize>>>,
}

impl Scope<'_> {}
