use anyhow::Context;
use anyhow::Error;
use napi::threadsafe_function::ThreadsafeFunction;
use napi::threadsafe_function::ThreadsafeFunctionCallMode;
use swc_babel_compat::ast::module::Program;

use crate::util::napi::status_to_error;

/// One babel plugin.
pub struct Plugin {
    inner: ThreadsafeFunction<Program>,
}

impl Plugin {
    pub fn invoke(&self, program: Program) -> Result<Program, Error> {
        let (status, program) = self
            .inner
            .call_with_result(Ok(program), ThreadsafeFunctionCallMode::NonBlocking);

        status_to_error(status)?;

        program.context("js function failed")
    }
}
