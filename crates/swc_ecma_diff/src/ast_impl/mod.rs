//! Implementation of [crate::Diff] for types in [swc_ecma_ast].

use crate::{Ctx, Diff, DiffResult, Difference, Node};
use swc_ecma_ast::{Module, ModuleItem};

mod expr;
mod stmt;

impl Diff for Module {
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        ctx.diff_struct("Module", |ctx| {
            ctx.field("span", &mut self.span, &mut other.span);
            ctx.field("body", &mut self.body, &mut other.body);
        })
    }
}

diff_enum!(ModuleItem, [Stmt, ModuleDecl]);
