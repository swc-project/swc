#![deny(warnings)]

extern crate swc_malloc;

use std::{env::args, fs, path::Path, sync::Arc};

use swc_common::{errors::HANDLER, sync::Lrc, Mark, SourceMap};
use swc_ecma_ast::Program;
use swc_ecma_codegen::text_writer::{omit_trailing_semi, JsWriter};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions, SimpleMangleCache},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{
    fixer::{fixer, paren_remover},
    resolver,
};

fn main() {
    let file = args().nth(1).expect("should provide a path to file");

    eprintln!("File: {}", file);

    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.load_file(Path::new(&file)).expect("failed to load file");

            let unresolved_mark = Mark::new();
            let top_level_mark = Mark::new();

            let program = parse_file_as_module(
                &fm,
                Default::default(),
                Default::default(),
                None,
                &mut Vec::new(),
            )
            .map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })
            .map(Program::Module)
            .map(|module| module.apply(resolver(unresolved_mark, top_level_mark, false)))
            .map(|module| module.apply(paren_remover(None)))
            .unwrap();

            let output = optimize(
                program,
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    compress: Some(Default::default()),
                    mangle: Some(MangleOptions {
                        top_level: Some(true),
                        ..Default::default()
                    }),
                    ..Default::default()
                },
                &ExtraOptions {
                    unresolved_mark,
                    top_level_mark,
                    // Mangle name cache example. You may not need this.
                    mangle_name_cache: Some(Arc::new(SimpleMangleCache::default())),
                },
            );

            let output = output.apply(fixer(None));

            let code = print(cm, &[output], true);

            fs::write("output.js", code.as_bytes()).expect("failed to write output");

            Ok(())
        })
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = Vec::new();

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
            cm: cm.clone(),
            comments: None,
            wr: omit_trailing_semi(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
