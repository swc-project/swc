//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use crate::{Ctxt, Diff, DiffResult};
use swc_ecma_ast::Module;

mod expr;

impl Diff for Module {
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctxt) -> DiffResult {}
}
