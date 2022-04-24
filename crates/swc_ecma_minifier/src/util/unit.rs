use std::fmt::Debug;

use swc_common::Mark;
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene};
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::{as_folder, FoldWith, VisitMut, VisitMutWith, VisitWith};

use crate::debug::{dump, AssertValid};

/// Indicates a unit of minifaction.
pub(crate) trait CompileUnit:
    swc_ecma_codegen::Node
    + Clone
    + VisitMutWith<DropSpan>
    + VisitMutWith<crate::debug::Debugger>
    + Debug
{
    fn is_module() -> bool;

    fn dump(&self) -> String {
        if !cfg!(feature = "debug") {
            return String::new();
        }

        self.force_dump()
    }

    fn force_dump(&self) -> String;

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut;

    fn remove_mark(&mut self) -> Mark;

    fn invoke_for_debugging(&self);
}

impl CompileUnit for Module {
    fn is_module() -> bool {
        true
    }

    fn force_dump(&self) -> String {
        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {
                    preserve_ctxt: false,
                })),
            true,
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor);
        if cfg!(debug_assertions) {
            self.visit_with(&mut AssertValid);
        }
    }

    fn remove_mark(&mut self) -> Mark {
        Mark::root()
    }

    fn invoke_for_debugging(&self) {
        crate::debug::invoke(self)
    }
}

impl CompileUnit for FnExpr {
    fn is_module() -> bool {
        false
    }

    fn force_dump(&self) -> String {
        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {
                    preserve_ctxt: false,
                })),
            true,
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor);
        if cfg!(debug_assertions) {
            self.visit_with(&mut AssertValid);
        }
    }

    fn remove_mark(&mut self) -> Mark {
        self.function.span.remove_mark()
    }

    fn invoke_for_debugging(&self) {}
}
