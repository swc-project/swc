use crate::specifier::{Source, Specifier};
use indexmap::IndexMap;
use swc_ecma_ast::Str;

#[derive(Debug, Default)]
pub struct RawExports {
    /// Key is None if it's exported from the module itself.
    pub items: IndexMap<Option<Str>, Vec<Specifier>>,
}

#[derive(Debug, Default)]
pub struct Exports {
    pub items: Vec<Specifier>,
    pub reexports: Vec<(Source, Vec<Specifier>)>,
}
