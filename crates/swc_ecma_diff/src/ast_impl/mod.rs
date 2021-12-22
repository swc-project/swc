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

impl Diff for ModuleItem {
    fn diff(&mut self, other: &mut Self, ctx: &mut Ctx) -> DiffResult {
        match (self, other) {
            (ModuleItem::Stmt(l), ModuleItem::Stmt(r)) => l.diff(r, ctx),
            (ModuleItem::ModuleDecl(l), ModuleItem::ModuleDecl(r)) => l.diff(r, ctx),
            _ => DiffResult::Different(Difference {
                path: ctx.path.clone(),
                left: Node(format!("{:?}", self)),
                right: Node(format!("{:?}", other)),
            }),
        }
    }
}
