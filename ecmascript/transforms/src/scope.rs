use ast::*;
use fnv::{FnvHashMap, FnvHashSet};
use std::{
    cell::{Cell, RefCell},
    rc::Rc,
};
use swc_atoms::JsWord;
use swc_common::{Span, SyntaxContext};

#[derive(Debug, Clone)]
pub struct Scope<'a> {
    /// Parent scope of this scope
    pub parent: Option<&'a Scope<'a>>,

    /// Kind of the scope.
    pub kind: ScopeKind,

    /// Whether or not the `super` keyword was used
    pub used_super: Cell<bool>,

    /// Whether or not the `this` keyword was used
    pub used_this: Cell<bool>,

    // /// All references used in this scope
    pub used_refs: FnvHashSet<(JsWord, Span)>,

    // /// All references declared in this scope
    pub declared_refs: FnvHashSet<(JsWord, Span)>,

    pub declared_symbols: FnvHashMap<JsWord, SyntaxContext>,

    pub(crate) ops: Rc<RefCell<Vec<ScopeOp>>>,
}

impl<'a> Scope<'a> {
    pub fn new(kind: ScopeKind, parent: Option<&'a Scope<'a>>) -> Self {
        Scope {
            parent,
            kind,
            used_super: Cell::new(false),
            used_this: Cell::new(false),
            used_refs: Default::default(),
            declared_refs: Default::default(),
            declared_symbols: Default::default(),
            // children: Default::default(),
            ops: Default::default(),
        }
    }

    pub fn scope_of(&self, ident: &Ident) -> &'a Scope {
        if self
            .declared_refs
            .contains(&(ident.sym.clone(), ident.span))
        {
            self
        } else {
            match self.parent {
                Some(ref parent) => parent.scope_of(ident),
                _ => self,
            }
        }
    }

    pub(crate) fn is_declared(&self, sym: &JsWord) -> bool {
        if self.declared_symbols.contains_key(sym) {
            return true;
        }
        for op in self.ops.borrow().iter() {
            match *op {
                ScopeOp::Rename { ref to, .. } if sym == to => return true,
                _ => {}
            }
        }
        match self.parent {
            Some(parent) => parent.is_declared(sym),
            _ => false,
        }
    }
}

#[derive(Debug)]
pub(crate) enum ScopeOp {
    Rename { from: Ident, to: JsWord },
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum ScopeKind {
    Block,
    Fn,
}
