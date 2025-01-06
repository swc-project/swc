use std::sync::Arc;

use swc_common::{SourceMap, SyntaxContext};
use swc_ecma_ast::*;

#[deprecated = "Use lint_pass instead"]
pub use self::lint_pass as lint_to_fold;
use crate::{config::LintConfig, rule::Rule};

mod const_assign;
mod duplicate_bindings;
mod duplicate_exports;
mod no_dupe_args;
mod utils;

#[cfg(feature = "non_critical_lints")]
#[path = ""]
pub(crate) mod non_critical_lints {
    pub mod constructor_super;
    pub mod default_case_last;
    pub mod default_param_last;
    pub mod dot_notation;
    pub mod eqeqeq;
    pub mod no_alert;
    pub mod no_await_in_loop;
    pub mod no_bitwise;
    pub mod no_compare_neg_zero;
    pub mod no_cond_assign;
    pub mod no_console;
    pub mod no_debugger;
    pub mod no_empty_function;
    pub mod no_empty_pattern;
    pub mod no_loop_func;
    pub mod no_new;
    pub mod no_new_object;
    pub mod no_new_symbol;
    pub mod no_obj_calls;
    pub mod no_param_reassign;
    pub mod no_prototype_builtins;
    pub mod no_restricted_syntax;
    pub mod no_sparse_arrays;
    pub mod no_throw_literal;
    pub mod no_use_before_define;
    pub mod no_var;
    pub mod prefer_const;
    pub mod prefer_object_spread;
    pub mod prefer_regex_literals;
    pub mod quotes;
    pub mod radix;
    pub mod symbol_description;
    pub mod use_is_nan;
    pub mod valid_typeof;
    pub mod yoda;
}

#[cfg(feature = "non_critical_lints")]
use non_critical_lints::*;

pub struct LintParams<'a> {
    pub program: &'a Program,
    pub lint_config: &'a LintConfig,
    pub unresolved_ctxt: SyntaxContext,
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
            unresolved_ctxt,
            top_level_ctxt: _,
            es_version,
            source_map,
        } = lint_params;

        rules.extend(no_use_before_define::no_use_before_define(
            &lint_params.lint_config.no_use_before_define,
        ));

        rules.extend(no_console::no_console(
            &lint_config.no_console,
            unresolved_ctxt,
        ));

        rules.extend(no_alert::no_alert(
            &lint_config.no_alert,
            unresolved_ctxt,
            es_version,
        ));

        rules.extend(no_debugger::no_debugger(&lint_config.no_debugger));

        rules.extend(quotes::quotes(&lint_config.quotes));

        rules.extend(prefer_regex_literals::prefer_regex_literals(
            &lint_config.prefer_regex_literals,
            unresolved_ctxt,
            es_version,
        ));

        rules.extend(dot_notation::dot_notation(
            program,
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

        rules.extend(radix::radix(unresolved_ctxt, &lint_config.radix));

        rules.extend(no_bitwise::no_bitwise(&lint_config.no_bitwise));

        rules.extend(default_param_last::default_param_last(
            &lint_config.default_param_last,
        ));

        rules.extend(yoda::yoda(&lint_config.yoda));

        rules.extend(no_new_symbol::no_new_symbol(
            unresolved_ctxt,
            &lint_config.no_new_symbol,
        ));

        rules.extend(use_is_nan::use_is_nan(
            unresolved_ctxt,
            &lint_config.use_isnan,
        ));

        rules.extend(valid_typeof::valid_typeof(&lint_config.valid_typeof));

        rules.extend(no_param_reassign::no_param_reassign(
            &lint_config.no_param_reassign,
        ));

        rules.extend(symbol_description::symbol_description(
            unresolved_ctxt,
            &lint_config.symbol_description,
        ));

        rules.extend(no_obj_calls::no_obj_calls(
            unresolved_ctxt,
            &lint_config.no_obj_calls,
        ));

        rules.extend(no_throw_literal::no_throw_literal(
            &lint_config.no_throw_literal,
        ));

        rules.extend(no_var::no_var(&lint_config.no_var));

        rules.extend(prefer_const::prefer_const(&lint_config.prefer_const));

        rules.extend(no_compare_neg_zero::no_compare_neg_zero(
            &lint_config.no_compare_neg_zero,
        ));

        rules.extend(constructor_super::constructor_super(
            &lint_config.constructor_super,
        ));

        rules.extend(no_sparse_arrays::no_sparse_arrays(
            &lint_config.no_sparse_arrays,
        ));

        rules.extend(default_case_last::default_case_last(
            &lint_config.default_case_last,
        ));

        rules.extend(no_await_in_loop::no_await_in_loop(
            &lint_config.no_await_in_loop,
        ));

        rules.extend(no_cond_assign::no_cond_assign(&lint_config.no_cond_assign));

        rules.extend(no_prototype_builtins::no_prototype_builtins(
            &lint_config.no_prototype_builtins,
        ));

        rules.extend(no_new_object::no_new_object(
            unresolved_ctxt,
            &lint_config.no_new_object,
        ));

        rules.extend(prefer_object_spread::prefer_object_spread(
            &lint_config.prefer_object_spread,
            unresolved_ctxt,
            es_version,
        ));
    }

    rules
}

pub fn lint_pass<R>(r: R) -> impl Pass
where
    R: Rule,
{
    LintPass(r)
}

struct LintPass<R>(R)
where
    R: Rule;

impl<R> Pass for LintPass<R>
where
    R: Rule,
{
    fn process(&mut self, program: &mut Program) {
        match program {
            Program::Module(m) => self.0.lint_module(m),
            Program::Script(s) => self.0.lint_script(s),
        }
    }
}
