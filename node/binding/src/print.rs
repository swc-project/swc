use crate::{
    complete_output, get_compiler,
    util::{deserialize_json, CtxtExt, MapErr},
};
use napi::{CallContext, Env, JsObject, JsString, Task};
use std::sync::Arc;
use swc::{
    config::{Options, SourceMapsConfig},
    Compiler, TransformOutput,
};
use swc_ecma_ast::{EsVersion, Program};

// ----- Printing -----

pub struct PrintTask {
    pub c: Arc<Compiler>,
    pub program_json: String,
    pub options: String,
}

impl Task for PrintTask {
    type Output = TransformOutput;
    type JsValue = JsObject;

    fn compute(&mut self) -> napi::Result<Self::Output> {
        let program: Program = deserialize_json(&self.program_json).convert_err()?;
        let options: Options = deserialize_json(&self.options).convert_err()?;

        self.c
            .print(
                &program,
                None,
                options.output_path.clone(),
                true,
                options.config.jsc.target.unwrap_or(EsVersion::Es2020),
                options
                    .source_maps
                    .clone()
                    .unwrap_or(SourceMapsConfig::Bool(false)),
                &Default::default(),
                None,
                options.config.clone().minify,
                None,
            )
            .convert_err()
    }

    fn resolve(self, env: Env, result: Self::Output) -> napi::Result<Self::JsValue> {
        complete_output(&env, result)
    }
}

#[js_function(2)]
pub fn print(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);
    let program_json = cx.get::<JsString>(0)?.into_utf8()?.as_str()?.to_string();
    let options = cx.get_buffer_as_string(1)?;

    cx.env
        .spawn(PrintTask {
            c: c.clone(),
            program_json,
            options,
        })
        .map(|t| t.promise_object())
}

#[js_function(2)]
pub fn print_sync(cx: CallContext) -> napi::Result<JsObject> {
    let c = get_compiler(&cx);

    let program = cx.get::<JsString>(0)?.into_utf8()?;
    let program: Program =
        deserialize_json(&program.as_str()?).expect("failed to deserialize Program");

    let options: Options = cx.get_deserialized(1)?;

    // Defaults to es3
    let codegen_target = options.codegen_target().unwrap_or_default();

    let result = {
        c.print(
            &program,
            None,
            options.output_path,
            true,
            codegen_target,
            options
                .source_maps
                .clone()
                .unwrap_or(SourceMapsConfig::Bool(false)),
            &Default::default(),
            None,
            options.config.minify,
            None,
        )
    }
    .convert_err()?;
    complete_output(cx.env, result)
}
