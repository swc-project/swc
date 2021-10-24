use std::cell::RefCell;

use swc_atoms::JsWord;
use swc_common::collections::AHashMap;

#[derive(Debug, Default)]
pub(super) struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,

    pub data: ScopeData,
}

#[derive(Debug, Default)]
pub struct ScopeData {
    direct_decls: RefCell<AHashMap<JsWord, Vec<usize>>>,
    decls: RefCell<AHashMap<JsWord, Vec<usize>>>,

    n: usize,

    /// Usages in current scope.
    direct_usages: RefCell<AHashMap<JsWord, Vec<usize>>>,
    usages: RefCell<AHashMap<JsWord, Vec<usize>>>,
}

impl Scope<'_> {}
