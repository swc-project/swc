use crate::rule::Rule;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold};

mod const_assign;
mod duplicate_bindings;
mod duplicate_exports;
mod no_console;

pub fn all() -> Vec<Box<dyn Rule>> {
    vec![
        const_assign::const_assign(),
        duplicate_bindings::duplicate_bindings(),
        duplicate_exports::duplicate_exports(),
        no_console::no_console(),
    ]
}

pub fn lint_to_fold<R>(r: R) -> impl Fold
where
    R: Rule,
{
    LintFolder(r)
}

struct LintFolder<R>(R)
where
    R: Rule;

impl<R> Fold for LintFolder<R>
where
    R: Rule,
{
    noop_fold_type!();

    #[inline(always)]
    fn fold_module(&mut self, program: Module) -> Module {
        self.0.lint_module(&program);

        program
    }

    #[inline(always)]
    fn fold_script(&mut self, program: Script) -> Script {
        self.0.lint_script(&program);

        program
    }
}
