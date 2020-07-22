use crate::{complete_output, JsCompiler};
use anyhow::Error;
use neon::prelude::*;
use std::sync::Arc;
use swc::{
    config::{Options, SourceMapsConfig},
    ecmascript::ast::Program,
    Compiler, TransformOutput,
};

// ----- Printing -----

pub struct PrintTask {
    pub c: Arc<Compiler>,
    pub program: Program,
    pub options: Options,
}

impl Task for PrintTask {
    type Output = TransformOutput;
    type Error = Error;
    type JsEvent = JsValue;
    fn perform(&self) -> Result<Self::Output, Self::Error> {
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

    fn complete(
        self,
        cx: TaskContext,
        result: Result<Self::Output, Self::Error>,
    ) -> JsResult<Self::JsEvent> {
        complete_output(cx, result)
    }
}

pub fn print(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let program = cx.argument::<JsString>(0)?;
    let program: Program =
        serde_json::from_str(&program.value()).expect("failed to deserialize Program");

    let options = cx.argument::<JsValue>(1)?;
    let options: Options = neon_serde::from_value(&mut cx, options)?;

    let callback = cx.argument::<JsFunction>(2)?;

    let this = cx.this();
    {
        let guard = cx.lock();
        let c = this.borrow(&guard);

        PrintTask {
            c: c.clone(),
            program,
            options,
        }
        .schedule(callback)
    }

    Ok(cx.undefined().upcast())
}

pub fn print_sync(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    let c;
    let this = cx.this();
    {
        let guard = cx.lock();
        let compiler = this.borrow(&guard);
        c = compiler.clone();
    }
    c.run(|| {
        let program = cx.argument::<JsString>(0)?;
        let program: Program =
            serde_json::from_str(&program.value()).expect("failed to deserialize Program");

        let options = cx.argument::<JsValue>(1)?;
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
