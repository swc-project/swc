use napi::threadsafe_function::ThreadsafeFunction;
use napi::threadsafe_function::ThreadsafeFunctionCallMode;
use swc_babel_compat::ast::module::Program;

/// One babel plugin.
pub struct Plugin {
    inner: ThreadsafeFunction<Program>,
}

impl Plugin {
    pub fn invoke(&self, program: Program) -> Program {
        let status = self
            .inner
            .call(Ok(program), ThreadsafeFunctionCallMode::NonBlocking);
    }
}
