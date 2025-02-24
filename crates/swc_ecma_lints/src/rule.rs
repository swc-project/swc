use std::fmt::Debug;

use auto_impl::auto_impl;
use swc_common::{errors::HANDLER, GLOBALS};
use swc_ecma_ast::{Module, Script};
use swc_ecma_visit::{Visit, VisitWith};
use swc_parallel::join;

/// A lint rule.
///
/// # Implementation notes
///
/// Must report error to [swc_common::HANDLER]
#[auto_impl(Box, &mut)]
pub trait Rule: Debug + Send + Sync {
    fn lint_module(&mut self, program: &Module);
    fn lint_script(&mut self, program: &Script);
}

trait LintNode<R: Rule>: Send + Sync {
    fn lint(&self, rule: &mut R);
}

impl<R: Rule> LintNode<R> for Module {
    #[inline]
    fn lint(&self, rule: &mut R) {
        rule.lint_module(self);
    }
}

impl<R: Rule> LintNode<R> for Script {
    #[inline]
    fn lint(&self, rule: &mut R) {
        rule.lint_script(self);
    }
}

fn join_lint_rules<N: LintNode<R>, R: Rule>(rules: &mut [R], program: &N) {
    let len = rules.len();
    if len == 0 {
        return;
    }
    if len == 1 {
        program.lint(&mut rules[0]);
        return;
    }

    let (ra, rb) = rules.split_at_mut(len / 2);

    GLOBALS.with(|globals| {
        HANDLER.with(|handler| {
            join(
                || {
                    GLOBALS.set(globals, || {
                        HANDLER.set(handler, || join_lint_rules(ra, program))
                    })
                },
                || {
                    GLOBALS.set(globals, || {
                        HANDLER.set(handler, || join_lint_rules(rb, program))
                    })
                },
            )
        })
    });
}

fn lint_rules<N: LintNode<R>, R: Rule>(rules: &mut Vec<R>, program: &N) {
    if rules.is_empty() {
        return;
    }

    if cfg!(target_arch = "wasm32") {
        for rule in rules {
            program.lint(rule);
        }
    } else {
        join_lint_rules(rules, program);
    }
}

/// This preserves the order of errors.
impl<R> Rule for Vec<R>
where
    R: Rule,
{
    fn lint_module(&mut self, program: &Module) {
        lint_rules(self, program)
    }

    fn lint_script(&mut self, program: &Script) {
        lint_rules(self, program)
    }
}

pub(crate) fn visitor_rule<V>(v: V) -> Box<dyn Rule>
where
    V: 'static + Send + Sync + Visit + Default + Debug,
{
    Box::new(VisitorRule(v))
}

#[derive(Debug)]
struct VisitorRule<V>(V)
where
    V: Send + Sync + Visit;

impl<V> Rule for VisitorRule<V>
where
    V: Send + Sync + Visit + Debug,
{
    fn lint_module(&mut self, program: &Module) {
        program.visit_with(&mut self.0);
    }

    fn lint_script(&mut self, program: &Script) {
        program.visit_with(&mut self.0);
    }
}
