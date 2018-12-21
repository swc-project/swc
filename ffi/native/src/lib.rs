#[macro_use]
extern crate neon;
extern crate swc;
use swc::{
    common::{
        self, errors::Handler, sync::Lrc, FileName, FilePathMapping, Fold, FoldWith, SourceMap,
    },
    ecmascript::{
        ast::Module,
        codegen,
        transforms::{compat, hygiene, simplifier},
    },
    Compiler,
};
use neon::prelude::*;
use std::sync::Arc;

fn parse(mut cx: FunctionContext) -> JsResult<JsObject> {
    let source = cx.argument::<JsString>(0)?;

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let c = Compiler::new(cm.clone(), handler);
    let _module = c.parse_js(FileName::Anon(0), &source.value()).unwrap();

    Ok(cx.empty_object())
}

fn transform(mut cx: FunctionContext) -> JsResult<JsString> {
    let source = cx.argument::<JsString>(0)?;

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let c = Compiler::new(cm.clone(), handler);
    let module = c.parse_js(FileName::Anon(0), &source.value()).unwrap();
    let module = c.run(|| transform_module(cm.clone(), module));
    let mut buf = vec![];
    c.emit_module(
        &module,
        codegen::Config {
            enable_comments: false,
            omit_trailing_semi: true,
            sourcemap: None,
        },
        &mut buf,
    )
    .unwrap();

    let s = String::from_utf8(buf).unwrap();

    Ok(cx.string(&s))
}

fn transform_module(cm: Lrc<SourceMap>, module: Module) -> Module {
    let helpers = Arc::new(compat::helpers::Helpers::default());

    let module = module
        .fold_with(
            &mut compat::es2016()
                .then(compat::es2015(&helpers))
                .then(compat::es3())
                .then(compat::helpers::InjectHelpers {
                    cm,
                    helpers: helpers.clone(),
                }),
        )
        .fold_with(&mut simplifier())
        .fold_with(&mut hygiene());
    module
}

register_module!(mut cx, {
    cx.export_function("parse", parse)?;
    cx.export_function("transform", transform)?;
    Ok(())
});
