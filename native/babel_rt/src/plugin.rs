use anyhow::Context;
use anyhow::Error;
use napi::threadsafe_function::ThreadsafeFunction;
use napi::threadsafe_function::ThreadsafeFunctionCallMode;
use napi::Env;
use napi::JsFunction;
use napi::JsObject;
use napi::JsString;
use napi::JsUnknown;
use swc_babel_compat::ast::module::Program;

use crate::util::napi::status_to_error;

/// One babel plugin.
pub struct Plugin {
    inner: ThreadsafeFunction<Program>,
}

impl Plugin {
    pub fn load(env: &Env, js_module: JsUnknown) -> Result<Self, napi::Error> {
        panic!("not implemented yet")
    }

    /// 
    /// - `options.require`: `require` of node.js
    /// - `options.option`: Option passed to the babel plugin.
    pub fn load_named(env: &Env, name: &JsString, options: JsObject) -> Result<Self, napi::Error> {
        let require = options.get_named_property::<JsFunction>("require")?;

        let js_module = require.call(None, &[name.into_unknown()])?;

        Self::load(env, js_module)
    }

    pub fn invoke(&self, program: Program) -> Result<Program, Error> {
        let (status, program) = self
            .inner
            .call_with_result(Ok(program), ThreadsafeFunctionCallMode::NonBlocking);

        status_to_error(status)?;

        program.context("js function failed")
    }
}
