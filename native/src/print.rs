use crate::{
    complete_output, get_compiler,
    util::{CtxtExt, MapErr},
};
use napi::{CallContext, Env, JsObject, JsString, Task};
use std::sync::Arc;
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler, TransformOutput,
};
use swc_ecma_ast::Program;
use swc_ecma_parser::JscTarget;

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
        self.c
            .print(
                &self.program,
                self.options
                    .config
                    .as_ref()
                    .map(|config| &config.jsc)
                    .map(|jsc| jsc.target)
                    .unwrap_or(JscTarget::Es2020),
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
            .convert_err()
    }

    fn resolve(&self, env: &mut Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_output(env, result)
    }
}

#[js_function(2)]
pub fn print(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let program = cx.get::<JsString>(0)?;
    let program: Program =
        serde_json::from_str(program.as_str()?).expect("failed to deserialize Program");

    let options: Options = cx.get_deserialized(1)?;

    cx.env.spawn(PrintTask {
        c: c.clone(),
        program,
        options,
    })
}

#[js_function(2)]
pub fn print_sync(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);

    let program = cx.get::<JsString>(0)?;
    let program: Program =
        serde_json::from_str(&program.as_str()?).expect("failed to deserialize Program");

    let options: Options = cx.get_deserialized(1)?;

    // Defaults to es3
    let codegen_target = options.codegen_target().unwrap_or_default();

    let result = {
        c.print(
            &program,
            codegen_target,
            options
                .source_maps
                .clone()
                .unwrap_or(SourceMapsConfig::Bool(false)),
            None,
            options.config.unwrap_or_default().minify.unwrap_or(false),
        )
    }
    .convert_err()?;
    complete_output(cx.env, result)
}
