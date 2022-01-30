use crate::{config::LintConfig, rule::Rule};
use swc_common::SyntaxContext;
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold};

mod const_assign;
mod duplicate_bindings;
mod duplicate_exports;
pub mod no_alert;
pub mod no_console;
mod no_debugger;

pub struct LintParams<'a> {
    pub program: &'a Program,
    pub lint_config: &'a LintConfig,
    pub top_level_ctxt: SyntaxContext,
    pub es_version: EsVersion,
}

pub fn all(lint_params: LintParams) -> Vec<Box<dyn Rule>> {
    let LintParams {
        program,
        lint_config,
        top_level_ctxt,
        es_version,
    } = lint_params;

    let mut rules = vec![
        const_assign::const_assign(),
        duplicate_bindings::duplicate_bindings(),
        duplicate_exports::duplicate_exports(),
    ];

    rules.extend(no_console::no_console(
        &lint_config.no_console,
        top_level_ctxt,
    ));

    rules.extend(no_alert::no_alert(
        program,
        &lint_config.no_alert,
        top_level_ctxt,
        es_version,
    ));
    rules.extend(no_debugger::no_debugger(&lint_config.no_debugger));

    rules
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
