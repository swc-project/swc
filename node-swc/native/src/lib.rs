#![feature(box_syntax)]

#[macro_use]
extern crate neon;
#[macro_use]
extern crate lazy_static;
extern crate libswc;
extern crate serde;
extern crate serde_json;
#[macro_use]
extern crate slog;

use libswc::{
    common::{
        errors::{ColorConfig, Handler},
        sync::Lrc,
        FileName, FilePathMapping, Fold, FoldWith, SourceFile, SourceMap,
    },
    ecmascript::{
        ast::Module,
        codegen,
        transforms::{compat, simplifier},
    },
    Compiler,
};
use neon::{borrow::Ref, prelude::*};
use std::{path::Path, sync::Arc};

fn new_compiler(mut cx: MethodContext<JsUndefined>) -> Result<Compiler, neon::result::Throw> {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));
    let handler = Handler::with_tty_emitter(ColorConfig::Always, true, false, Some(cm.clone()));
    Ok(Compiler::new(
        slog::Logger::root(slog::Discard, o!()),
        cm,
        handler,
    ))
}

/// Compiler.transform()
fn transform(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    if cx.len() == 0 {
        return cx.throw_type_error("first argument must be string");
    }

    // let guard = cx.lock();
    let this = cx.this().downcast_or_throw::<JsCompiler, _>(&mut cx)?;
    // let compiler = this.borrow(&guard);

    let source = cx.argument::<JsString>(0)?;

    let fm = cx.borrow(&this, |compiler| {
        compiler
            .cm
            .new_source_file(FileName::Anon, String::from(source.value()))
    });
    wrap_tr_output(cx, fm)
}

fn transform_file(mut cx: MethodContext<JsCompiler>) -> JsResult<JsValue> {
    if cx.len() == 0 {
        return cx.throw_type_error("first argument must be a path to file");
    }

    // let guard = cx.lock();
    let this = cx.this().downcast_or_throw::<JsCompiler, _>(&mut cx)?;
    // let compiler = this.borrow(&guard);

    let source = cx.argument::<JsString>(0)?;
    let fm = match cx.borrow(&this, |compiler| {
        compiler.cm.load_file(Path::new(&source.value()))
    }) {
        Ok(fm) => fm,
        Err(e) => cx.throw_error(format!("failed to load file: {}", e))?,
    };

    wrap_tr_output(cx, fm)
}

fn wrap_tr_output<'a>(
    mut cx: MethodContext<'a, JsCompiler>,
    fm: Lrc<SourceFile>,
) -> JsResult<'a, JsValue> {
    fn js_pass(cm: Lrc<SourceMap>, optimize: bool) -> Box<Fold<Module>> {
        use libswc::ecmascript::transforms::{compat, simplifier};
        let helpers = Arc::new(compat::helpers::Helpers::default());

        let pass: Box<Fold<Module>> = box compat::es2016()
            .then(compat::es2015(&helpers))
            .then(compat::es3())
            .then(compat::helpers::InjectHelpers {
                cm,
                helpers: helpers.clone(),
            });

        let pass: Box<Fold<Module>> = if !optimize {
            pass
        } else {
            box pass.then(simplifier())
        };

        pass
    }

    let this = cx.this().downcast_or_throw::<JsCompiler, _>(&mut cx)?;

    let module = match cx.borrow(&this, |compiler| compiler.parse_js(fm)) {
        Err(()) => {
            return cx.throw_type_error("failed parse module");
        }
        Ok(module) => module,
    };
    let mut folder = js_pass(cx.borrow(&this, |compiler| compiler.cm.clone()), true);
    let module = module.fold_with(&mut folder);

    let mut buf = vec![];
    match cx.borrow(&this, |compiler| {
        compiler.emit_module(
            &module,
            codegen::Config {
                enable_comments: false,
                omit_trailing_semi: false,
                sourcemap: None,
            },
            &mut buf,
        )
    }) {
        Ok(_) => {}
        Err(e) => cx.throw_error(format!("failed to emit module: {}", e))?,
    }

    Ok(cx.string(&String::from_utf8_lossy(&buf)).upcast())
}

declare_types! {
    pub class JsModule for Module {
        init(mut cx) {
            cx.throw_type_error("cannot construct new module from javascript")
        }
    }
}

declare_types! {

    pub class JsCompiler for Compiler {
        init(cx) {
            new_compiler(cx)
        }

        method transform(cx) {
            transform(cx)
        }

        method transformFile(cx) {
            transform(cx)
        }
    }

}

register_module!(mut cx, {
    cx.export_class::<JsModule>("Module")?;
    cx.export_class::<JsCompiler>("Compiler")?;
    Ok(())
});
