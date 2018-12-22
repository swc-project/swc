#![feature(box_syntax)]
#![feature(box_patterns)]

#[macro_use]
extern crate neon;
extern crate fnv;
extern crate neon_serde;
extern crate serde;
#[macro_use]
extern crate serde_derive;
extern crate sourcemap;
extern crate swc;

use fnv::FnvHashMap;
use neon::prelude::*;
use std::{collections::HashMap, env, path::Path, sync::Arc};
use swc::{
    atoms::JsWord,
    common::{
        self, errors::Handler, sync::Lrc, FileName, FilePathMapping, Fold, FoldWith, SourceMap,
    },
    ecmascript::{
        ast::{Expr, Module, ModuleItem, Stmt},
        codegen,
        transforms::{compat, hygiene, simplifier, InlineGlobals},
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
    globals: Option<GlobalPassOption>,
}

#[derive(Default, Deserialize)]
struct GlobalPassOption {
    vars: FnvHashMap<String, String>,
}
impl GlobalPassOption {
    fn build(self, c: &Compiler) -> InlineGlobals {
        fn mk_map(
            c: &Compiler,
            values: impl Iterator<Item = (String, String)>,
            is_env: bool,
        ) -> HashMap<JsWord, Expr> {
            let mut m = HashMap::new();

            for (k, v) in values {
                let v = if is_env {
                    format!("'{}'", v)
                } else {
                    (*v).into()
                };

                let mut module = c
                    .parse_js(FileName::Custom(format!("GLOBAL_{}", k)), &v)
                    .unwrap_or_else(|err| panic!("failed to parse globals.{}: {:?}", k, err));
                let expr = match module.body.pop().unwrap() {
                    ModuleItem::Stmt(Stmt::Expr(box expr)) => expr,
                    _ => panic!("{} is not a valid expression", v),
                };

                m.insert((*k).into(), expr);
            }

            m
        }

        InlineGlobals {
            globals: mk_map(c, self.vars.into_iter(), false),
            envs: mk_map(c, env::vars(), true),
        }
    }
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
    let module = c.run(|| transform_module(&c, module, options));

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
    let module = c.run(|| transform_module(&c, module, options));

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

fn transform_module(c: &Compiler, module: Module, options: TransformOption) -> Module {
    let helpers = Arc::new(compat::helpers::Helpers::default());

    let module = {
        let opts = if let Some(opts) = options.globals {
            opts
        } else {
            Default::default()
        };
        module.fold_with(&mut opts.build(c))
    };

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
        cm: c.cm.clone(),
        helpers: helpers.clone(),
    })
}

register_module!(mut cx, {
    cx.export_function("parse", parse)?;
    cx.export_function("transform", transform)?;
    cx.export_function("transformFileSync", transform_file)?;
    Ok(())
});
