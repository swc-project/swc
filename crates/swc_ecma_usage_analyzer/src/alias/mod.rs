#![allow(clippy::needless_update)]

use swc_ecma_ast::*;

use crate::marks::Marks;

mod ctx;
mod infection_collector;

pub use infection_collector::{
    collect_infects_from, try_collect_infects_from, InfectionCollector, TooManyAccesses,
};

#[derive(Default)]
#[non_exhaustive]
pub struct AliasConfig {
    pub marks: Option<Marks>,
    pub ignore_nested: bool,
    /// TODO(kdy1): This field is used for sequential inliner.
    /// It should be renamed to some correct name.
    pub need_all: bool,

    /// We can skip visiting children nodes in some cases.
    ///
    /// Because we recurse in the usage analyzer, we don't need to recurse into
    /// child node that the usage analyzer will invoke [`collect_infects_from`]
    /// on.
    pub ignore_named_child_scope: bool,
}

impl AliasConfig {
    pub fn marks(mut self, arg: Option<Marks>) -> Self {
        self.marks = arg;
        self
    }

    pub fn ignore_nested(mut self, arg: bool) -> Self {
        self.ignore_nested = arg;
        self
    }

    pub fn ignore_named_child_scope(mut self, arg: bool) -> Self {
        self.ignore_named_child_scope = arg;
        self
    }

    pub fn need_all(mut self, arg: bool) -> Self {
        self.need_all = arg;
        self
    }
}

pub trait InfectableNode {
    fn is_fn_or_arrow_expr(&self) -> bool;
}

impl InfectableNode for Function {
    fn is_fn_or_arrow_expr(&self) -> bool {
        false
    }
}

impl InfectableNode for Expr {
    fn is_fn_or_arrow_expr(&self) -> bool {
        matches!(self, Expr::Arrow(..) | Expr::Fn(..))
    }
}

impl<T> InfectableNode for Box<T>
where
    T: InfectableNode,
{
    fn is_fn_or_arrow_expr(&self) -> bool {
        (**self).is_fn_or_arrow_expr()
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]

pub enum AccessKind {
    Reference,
    Call,
}

pub type Access = (IdIdx, AccessKind);
