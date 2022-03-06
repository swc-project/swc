use std::{fmt::Debug, sync::Arc};

use auto_impl::auto_impl;
use parking_lot::Mutex;
use rayon::prelude::*;
use serde::Serialize;
use swc_common::{
    errors::{Diagnostic, DiagnosticBuilder, Emitter, Handler, HANDLER},
    Spanned,
};
use swc_css_ast::Stylesheet;
use swc_css_visit::{Visit, VisitWith};

use super::config::{LintRuleReaction, RuleConfig};

/// A lint rule.
///
/// # Implementation notes
///
/// Must report error to [swc_common::HANDLER]
#[auto_impl(Box, &mut)]
pub trait LintRule: Debug + Send + Sync {
    fn lint_stylesheet(&mut self, stylesheet: &Stylesheet);
}

/// This preserves the order of errors.
impl<R> LintRule for Vec<R>
where
    R: LintRule,
{
    fn lint_stylesheet(&mut self, stylesheet: &Stylesheet) {
        if cfg!(target_arch = "wasm32") {
            for rule in self {
                rule.lint_stylesheet(stylesheet);
            }
        } else {
            let errors = self
                .par_iter_mut()
                .flat_map(|rule| {
                    let emitter = Capturing::default();
                    {
                        let handler = Handler::with_emitter(true, false, Box::new(emitter.clone()));
                        HANDLER.set(&handler, || {
                            rule.lint_stylesheet(stylesheet);
                        });
                    }

                    Arc::try_unwrap(emitter.errors).unwrap().into_inner()
                })
                .collect::<Vec<_>>();

            HANDLER.with(|handler| {
                for error in errors {
                    DiagnosticBuilder::new_diagnostic(handler, error).emit();
                }
            });
        }
    }
}

#[derive(Default, Clone)]
struct Capturing {
    errors: Arc<Mutex<Vec<Diagnostic>>>,
}

impl Emitter for Capturing {
    fn emit(&mut self, db: &DiagnosticBuilder<'_>) {
        self.errors.lock().push((**db).clone());
    }
}

pub(crate) fn visitor_rule<V>(reaction: LintRuleReaction, v: V) -> Box<dyn LintRule>
where
    V: 'static + Send + Sync + Visit + Default + Debug,
{
    Box::new(VisitorRule(v, reaction))
}

#[derive(Debug)]
struct VisitorRule<V>(V, LintRuleReaction)
where
    V: Send + Sync + Visit;

impl<V> LintRule for VisitorRule<V>
where
    V: Send + Sync + Visit + Debug,
{
    fn lint_stylesheet(&mut self, stylesheet: &Stylesheet) {
        if !matches!(self.1, LintRuleReaction::Off) {
            stylesheet.visit_with(&mut self.0);
        }
    }
}

#[derive(Debug, Clone, Default)]
pub struct LintRuleContext<C>
where
    C: Debug + Clone + Serialize + Default,
{
    reaction: LintRuleReaction,
    config: C,
}

impl<C> LintRuleContext<C>
where
    C: Debug + Clone + Serialize + Default,
{
    pub(crate) fn report<N, S>(&self, ast_node: N, message: S)
    where
        N: Spanned,
        S: AsRef<str>,
    {
        HANDLER.with(|handler| match self.reaction {
            LintRuleReaction::Error => handler
                .struct_span_err(ast_node.span(), message.as_ref())
                .emit(),
            LintRuleReaction::Warning => handler
                .struct_span_warn(ast_node.span(), message.as_ref())
                .emit(),
            _ => {}
        });
    }

    #[inline]
    pub(crate) fn config(&self) -> &C {
        &self.config
    }

    #[inline]
    pub(crate) fn reaction(&self) -> LintRuleReaction {
        self.reaction
    }
}

impl<C> From<&RuleConfig<C>> for LintRuleContext<C>
where
    C: Debug + Clone + Serialize + Default,
{
    fn from(config: &RuleConfig<C>) -> Self {
        Self {
            reaction: config.get_rule_reaction(),
            config: config.get_rule_config().clone(),
        }
    }
}
