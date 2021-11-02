use crate::debug::dump;
use std::fmt::Debug;
use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_transforms::{fixer, hygiene};
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::{as_folder, FoldWith, VisitMut, VisitMutWith};

/// Indicates a unit of minifaction.
pub(crate) trait CompileUnit:
    swc_ecma_codegen::Node
    + Clone
    + VisitMutWith<DropSpan>
    + VisitMutWith<crate::debug::Debugger>
    + Debug
{
    fn is_module() -> bool;

    fn dump(&self) -> String;

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut;

    fn remove_mark(&mut self) -> Mark;

    fn invoke(&self);
}

impl CompileUnit for Module {
    fn is_module() -> bool {
        true
    }

    fn dump(&self) -> String {
        if !cfg!(feature = "debug") {
            return String::new();
        }

        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {
                    preserve_ctxt: false,
                })),
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor)
    }

    fn remove_mark(&mut self) -> Mark {
        Mark::root()
    }

    fn invoke(&self) {
        crate::debug::invoke(self)
    }
}

impl CompileUnit for FnExpr {
    fn is_module() -> bool {
        false
    }

    fn dump(&self) -> String {
        if !cfg!(feature = "debug") {
            return String::new();
        }

        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {
                    preserve_ctxt: false,
                })),
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor)
    }

    fn remove_mark(&mut self) -> Mark {
        self.function.span.remove_mark()
    }

    fn invoke(&self) {}
}
