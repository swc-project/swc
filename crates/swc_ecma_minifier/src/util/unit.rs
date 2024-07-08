#![allow(dead_code)]

use std::fmt::Debug;

use swc_ecma_ast::*;
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene};
use swc_ecma_utils::DropSpan;
#[cfg(debug_assertions)]
use swc_ecma_visit::VisitWith;
use swc_ecma_visit::{as_folder, FoldWith, VisitMut, VisitMutWith};

use crate::debug::dump;
#[cfg(debug_assertions)]
use crate::debug::AssertValid;

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
        #[cfg(feature = "debug")]
        {
            self.force_dump()
        }
        #[cfg(not(feature = "debug"))]
        {
            String::new()
        }
    }

    fn force_dump(&self) -> String;

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut;
}

impl CompileUnit for Module {
    fn is_module() -> bool {
        true
    }

    fn force_dump(&self) -> String {
        let _noop_sub =
            tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {})),
            true,
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor);

        crate::debug::invoke_module(self);
    }
}

impl CompileUnit for Script {
    fn is_module() -> bool {
        false
    }

    fn force_dump(&self) -> String {
        let _noop_sub =
            tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {})),
            true,
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor);

        crate::debug::invoke_script(self);
    }
}

impl CompileUnit for FnExpr {
    fn is_module() -> bool {
        false
    }

    fn force_dump(&self) -> String {
        let _noop_sub =
            tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

        dump(
            &self
                .clone()
                .fold_with(&mut fixer(None))
                .fold_with(&mut hygiene())
                .fold_with(&mut as_folder(DropSpan {})),
            true,
        )
    }

    fn apply<V>(&mut self, visitor: &mut V)
    where
        V: VisitMut,
    {
        self.visit_mut_with(&mut *visitor);
        #[cfg(debug_assertions)]
        {
            self.visit_with(&mut AssertValid);
        }
    }
}
