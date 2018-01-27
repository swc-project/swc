use swc_common::{FoldWith, Folder};
use swc_ecma_ast::*;

pub trait FoldScope<T> {
    /// `scope`: Scope which contains `node`.
    fn fold_scope(&mut self, scope: &mut Scope, node: T) -> T;
}

#[derive(Debug)]
pub struct ScopeFolder<'a, F> {
    pub folder: F,
    pub cur_scope: &'a mut Scope<'a>,
}

impl<'a, F, T> Folder<T> for ScopeFolder<'a, F>
where
    F: FoldScope<T>,
    T: FoldWith<F> + FoldWith<ScopeFolder<'a, F>>,
{
    default fn fold(&mut self, node: T) -> T {
        self.folder.fold_scope(self.cur_scope, node)
    }
}

#[derive(Debug, PartialEq, Eq)]
pub struct Scope<'a> {
    pub parent: Option<&'a Scope<'a>>,
    pub kind: ScopeKind,
    pub children: Vec<Scope<'a>>,
    pub bindings: Vec<&'a str>,
    pub refs: Vec<&'a str>,
}

impl<'a> Scope<'a> {
    pub fn from_fn(parent: Option<&'a Scope<'a>>, f: &'a Function) -> Self {
        Scope {
            parent,
            kind: ScopeKind::Fn,
            children: vec![],
            bindings: vec![],
            refs: vec![],
        }
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Fn,
    Block,
}
