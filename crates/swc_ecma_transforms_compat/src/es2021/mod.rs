use swc_common::chain;
use swc_ecma_visit::{Fold, VisitMut};

pub use self::{logical_assignments::logical_assignments, numeric_separator::numeric_separator};

mod logical_assignments;
mod numeric_separator;

#[tracing::instrument(level = "info", skip_all)]
pub fn es2021() -> impl Fold + VisitMut {
    chain!(logical_assignments(), numeric_separator())
}
