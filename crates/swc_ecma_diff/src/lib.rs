pub use self::ctx::{Ctx, PathComponent};
use swc_common::Span;

mod ast_impl;
mod ctx;

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Config {
    /// If this value is true, the differences of [Span]s are ignored.
    ///
    /// Defaults to false.
    pub ignore_span: bool,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Node(String);

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub struct Difference {
    pub path: Vec<PathComponent>,
    pub left: Node,
    pub right: Node,
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum DiffResult {
    /// Two nodes are identical.
    Identical,

    Different(Difference),
}

impl From<Difference> for DiffResult {
    fn from(v: Difference) -> Self {
        DiffResult::Different(v)
    }
}

pub trait Diff {
    /// This may remove common node from `self` and `other`.
    fn diff(&mut self, other: &mut Self, ctx: Ctx) -> DiffResult;
}

impl Diff for Span {
    fn diff(&mut self, other: &mut Self, ctx: Ctx) -> DiffResult {
        if ctx.config.ignore_span {
            return DiffResult::Identical;
        }
    }
}
