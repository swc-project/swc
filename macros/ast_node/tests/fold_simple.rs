#![feature(specialization)]

extern crate serde;
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

#[derive(Fold)]
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

pub struct PanicOnFold;

impl<F> FoldWith<F> for PanicOnFold {
    fn fold_children(self, _: &mut F) -> Self {
        unreachable!("this should not be called")
    }
}

#[derive(Fold)]
pub enum ExprKind {
    RecursiveBoud(Box<Expr>),
    Rec2(Vec<Option<Box<Expr>>>),

    Lit(Lit),
}

#[derive(Fold)]
pub enum Lit {
    A,
    B,
}
