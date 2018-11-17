#![feature(specialization)]

extern crate swc_common;
use swc_common::{Fold, FoldWith};

pub trait AssertFold<T>: Fold<T> {}

// check for trait bound

pub struct LitFold;
impl Fold<Lit> for LitFold {
    fn fold(&mut self, _: Lit) -> Lit {
        Lit::A
    }
}
impl AssertFold<Expr> for LitFold {}
impl AssertFold<ExprKind> for LitFold {}

#[derive(Debug, Fold, PartialEq, Eq)]
pub struct Expr {
    pub node: ExprKind,
    /// This field should be skipped.
    pub bool_field: bool,
    /// Ensure that #[fold(ignore)] works.
    #[fold(ignore)]
    pub ignored: PanicOnFold,
    /* /// Ensure that #[cfg] works.
     * #[cfg(feature = "__never_exists")]
     * pub never_exists: Lit, */
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub struct PanicOnFold;

impl<F> FoldWith<F> for PanicOnFold {
    fn fold_children(self, _: &mut F) -> Self {
        unreachable!("this should not be called")
    }
}

#[derive(Debug, Fold, PartialEq, Eq)]
pub enum ExprKind {
    RecursiveBoud(Box<Expr>),
    Rec2(Vec<Option<Box<Expr>>>),

    Lit(Lit),
}

#[derive(Debug, Fold, PartialEq, Eq)]
pub enum Lit {
    A,
    B,
}
