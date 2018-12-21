#[macro_use]
extern crate neon;
extern crate neon_serde;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate sourcemap;
extern crate swc;

use neon::prelude::*;
use std::{path::Path, sync::Arc};
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

#[derive(Default, Deserialize)]
struct TransformOption {
    optimize: bool,
}

fn transform(mut cx: FunctionContext) -> JsResult<JsObject> {
    let source = cx.argument::<JsString>(0)?;
    let options = match cx.argument_opt(1) {
        Some(v) => neon_serde::from_value(&mut cx, v)?,
        None => Default::default(),
    };

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let c = Compiler::new(cm.clone(), handler);
    let module = c
        .parse_js(FileName::Anon(0), &source.value())
        .expect("failed to parse module");
    let module = c.run(|| transform_module(cm.clone(), module, options));

    let (code, map) = c
        .emit_module(
            &module,
            codegen::Config {
                enable_comments: false,
            },
        )
        .expect("failed to emit module");

    let code = cx.string(&code);

    let obj = cx.empty_object();
    obj.set(&mut cx, "code", code)?;
    {
        let mut buf = vec![];
        map.to_writer(&mut buf).expect("failed to write sourcemap");
        let map =
            cx.string(&String::from_utf8(buf).expect("failed to write sourcemap: invalid utf8"));
        obj.set(&mut cx, "map", map)?;
    }

    Ok(obj)
}

fn transform_file(mut cx: FunctionContext) -> JsResult<JsObject> {
    let path = cx.argument::<JsString>(0)?;
    let options = match cx.argument_opt(1) {
        Some(v) => neon_serde::from_value(&mut cx, v)?,
        None => Default::default(),
    };

    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let handler = Handler::with_tty_emitter(
        common::errors::ColorConfig::Always,
        true,
        false,
        Some(cm.clone()),
    );

    let c = Compiler::new(cm.clone(), handler);
    let module = c
        .parse_js_file(Path::new(&path.value()))
        .expect("failed to parse module");
    let module = c.run(|| transform_module(cm.clone(), module, options));

    let (code, map) = c
        .emit_module(
            &module,
            codegen::Config {
                enable_comments: false,
            },
        )
        .expect("failed to emit module");

    let code = cx.string(&code);

    let obj = cx.empty_object();
    obj.set(&mut cx, "code", code)?;
    {
        let mut buf = vec![];
        map.to_writer(&mut buf).expect("failed to write sourcemap");
        let map =
            cx.string(&String::from_utf8(buf).expect("failed to write sourcemap: invalid utf8"));
        obj.set(&mut cx, "map", map)?;
    }

    Ok(obj)
}

fn transform_module(cm: Lrc<SourceMap>, module: Module, options: TransformOption) -> Module {
    let helpers = Arc::new(compat::helpers::Helpers::default());

    let module = if options.optimize {
        module.fold_with(&mut simplifier())
    } else {
        module
    };

    let module = module
        .fold_with(
            &mut compat::es2016()
                .then(compat::es2015(&helpers))
                .then(compat::es3()),
        )
        .fold_with(&mut hygiene());

    module.fold_with(&mut compat::helpers::InjectHelpers {
        cm,
        helpers: helpers.clone(),
    })
}

register_module!(mut cx, {
    cx.export_function("parse", parse)?;
    cx.export_function("transform", transform)?;
    cx.export_function("transformFile", transform_file)?;
    Ok(())
});
