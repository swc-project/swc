use crate::debug::dump;
use swc_ecma_ast::*;
use swc_ecma_transforms::fixer;
use swc_ecma_utils::DropSpan;
use swc_ecma_visit::{FoldWith, VisitMut, VisitMutWith};

/// Inidicates a unit of minifaction.
pub(crate) trait CompileUnit:
    swc_ecma_codegen::Node + Clone + VisitMutWith<DropSpan> + VisitMutWith<crate::debug::Debugger>
{
    fn dump(&self) -> String;

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut;
}

impl CompileUnit for Module {
    fn dump(&self) -> String {
        dump(&self.clone().fold_with(&mut fixer(None)))
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor)
    }
}

impl CompileUnit for FnExpr {
    fn dump(&self) -> String {
        dump(&self.clone().fold_with(&mut fixer(None)))
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor)
    }
}
