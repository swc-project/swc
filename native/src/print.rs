use crate::{complete_output, napi_serde::deserialize};
use anyhow::Error;
use napi::{CallContext, Env, JsExternal, JsFunction, JsObject, JsString, Task};
use std::sync::Arc;
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler, TransformOutput,
};
use swc_ecma_ast::Program;

// ----- Printing -----

pub struct PrintTask {
    pub c: Arc<Compiler>,
    pub program: Program,
    pub options: Options,
}

impl Task for PrintTask {
    type Output = TransformOutput;
    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        self.c.run(|| {
            self.c.print(
                &self.program,
                self.options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                None,
                self.options
                    .config
                    .clone()
                    .unwrap_or_default()
                    .minify
                    .unwrap_or(false),
            )
        })
    }

    fn resolve(&self, env: &mut Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_output(env, result)
    }
}

#[js_function(2)]
pub fn print(mut cx: CallContext<JsExternal>) -> napi::Result<JsObject> {
    let program = cx.get::<JsString>(0)?;
    let program: Program =
        serde_json::from_str(&program.value()).expect("failed to deserialize Program");

    let options = cx.get::<JsObject>(1)?;
    let options: Options = deserialize(cx.env, &options)?;

    cx.env.spawn(PrintTask {
        c: c.clone(),
        program,
        options,
    })
}

#[js_function(2)]
pub fn print_sync(mut cx: CallContext<JsExternal>) -> napi::Result<JsObject> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    c.run(|| {
        let program = cx.get::<JsString>(0)?;
        let program: Program =
            serde_json::from_str(&program.value()).expect("failed to deserialize Program");

        let options = cx.get::<JsValue>(1)?;
        let options: Options = neon_serde::from_value(&mut cx, options)?;

        let result = {
            c.print(
                &program,
                options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                None,
                options.config.unwrap_or_default().minify.unwrap_or(false),
            )
        };
        complete_output(cx, result)
    })
}
