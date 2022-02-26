use std::{fmt::Debug, sync::Arc};

use auto_impl::auto_impl;
use parking_lot::Mutex;
use rayon::prelude::*;
use swc_common::errors::{Diagnostic, DiagnosticBuilder, Emitter, Handler, HANDLER};
use swc_css_ast::Stylesheet;
use swc_css_visit::{Visit, VisitWith};

/// A lint rule.
///
/// # Implementation notes
///
/// Must report error to [swc_common::HANDLER]
#[auto_impl(Box, &mut)]
pub trait Rule: Debug + Send + Sync {
    fn lint_stylesheet(&mut self, stylesheet: &Stylesheet);
}

/// This preserves the order of errors.
impl<R> Rule for Vec<R>
where
    R: Rule,
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
                    DiagnosticBuilder::new_diagnostic(&handler, error).emit();
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
    fn lint_stylesheet(&mut self, stylesheet: &Stylesheet) {
        stylesheet.visit_with(&mut self.0);
    }
}
