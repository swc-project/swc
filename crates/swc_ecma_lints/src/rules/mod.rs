use std::sync::Arc;

use swc_common::{SourceMap, SyntaxContext};
use swc_ecma_ast::*;
use swc_ecma_visit::{noop_fold_type, Fold};

use crate::{config::LintConfig, rule::Rule};

mod const_assign;
mod duplicate_bindings;
mod duplicate_exports;
mod no_dupe_args;
mod utils;

#[cfg(feature = "non_critical_lints")]
#[path = ""]
pub(crate) mod non_critical_lints {
    pub mod default_param_last;
    pub mod dot_notation;
    pub mod eqeqeq;
    pub mod no_alert;
    pub mod no_bitwise;
    pub mod no_console;
    pub mod no_debugger;
    pub mod no_empty_function;
    pub mod no_empty_pattern;
    pub mod no_loop_func;
    pub mod no_new;
    pub mod no_restricted_syntax;
    pub mod no_use_before_define;
    pub mod prefer_regex_literals;
    pub mod quotes;
}

#[cfg(feature = "non_critical_lints")]
use non_critical_lints::*;

pub struct LintParams<'a> {
    pub program: &'a Program,
    pub lint_config: &'a LintConfig,
    pub top_level_ctxt: SyntaxContext,
    pub es_version: EsVersion,
    pub source_map: Arc<SourceMap>,
}

pub fn all(lint_params: LintParams) -> Vec<Box<dyn Rule>> {
    let mut rules = vec![
        const_assign::const_assign(),
        duplicate_bindings::duplicate_bindings(),
        duplicate_exports::duplicate_exports(),
        no_dupe_args::no_dupe_args(),
    ];

    #[cfg(feature = "non_critical_lints")]
    {
        let LintParams {
            program,
            lint_config,
            top_level_ctxt,
            es_version,
            source_map,
        } = lint_params;

        rules.extend(no_use_before_define::no_use_before_define(
            &lint_params.lint_config.no_use_before_define,
        ));

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

        rules.extend(quotes::quotes(&source_map, &lint_config.quotes));

        rules.extend(prefer_regex_literals::prefer_regex_literals(
            program,
            &lint_config.prefer_regex_literals,
            top_level_ctxt,
            es_version,
        ));

        rules.extend(dot_notation::dot_notation(
            program,
            &source_map,
            &lint_config.dot_notation,
        ));

        rules.extend(no_empty_function::no_empty_function(
            &source_map,
            &lint_config.no_empty_function,
        ));

        rules.extend(no_empty_pattern::no_empty_pattern(
            &lint_config.no_empty_pattern,
        ));

        rules.extend(eqeqeq::eqeqeq(&lint_config.eqeqeq));

        rules.extend(no_loop_func::no_loop_func(&lint_config.no_loop_func));

        rules.extend(no_new::no_new(&lint_config.no_new));

        rules.extend(no_restricted_syntax::no_restricted_syntax(
            &lint_config.no_restricted_syntax,
        ));

        rules.extend(no_bitwise::no_bitwise(&lint_config.no_bitwise));

        rules.extend(default_param_last::default_param_last(
            &lint_config.default_param_last,
        ));
    }

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
