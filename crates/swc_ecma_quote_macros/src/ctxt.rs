use swc_common::collections::AHashMap;
use swc_ecma_ast::Ident;

#[derive(Debug)]
pub(crate) struct Ctx {
    pub(crate) vars: Vars,
}

#[derive(Debug)]
pub struct VarData {
    /// How many times this variable should be cloned. 0 for variables used only
    /// once.
    clone: usize,

    ident: Ident,
}

pub type Vars = AHashMap<String, VarData>;
