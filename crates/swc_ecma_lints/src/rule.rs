use auto_impl::auto_impl;
use parking_lot::Mutex;
use rayon::prelude::*;
use std::{fmt::Debug, sync::Arc};
use swc_common::errors::{Diagnostic, DiagnosticBuilder, Emitter, Handler, HANDLER};
use swc_ecma_ast::Program;

/// A lint rule.
///
/// # Implementation notes
///
/// Must report error to [swc_common::HANDLER]
#[auto_impl(Box, Arc)]
pub trait Rule: Debug + Send + Sync {
    fn lint(&self, program: &Program);
}

/// This preserves the order of errors.
impl<R> Rule for Vec<R>
where
    R: Rule,
{
    fn lint(&self, program: &Program) {
        if cfg!(target_arch = "wasm32") {
            for rule in self {
                rule.lint(program);
            }
        } else {
            let errors = self
                .par_iter()
                .flat_map(|rule| {
                    let mut emitter = Capturing::default();
                    {
                        let handler = Handler::with_emitter(true, false, Box::new(emitter.clone()));
                        HANDLER.set(&handler, || {
                            rule.lint(program);
                        });
                    }

                    let errors = Arc::try_unwrap(emitter.errors).unwrap().into_inner();

                    errors
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
