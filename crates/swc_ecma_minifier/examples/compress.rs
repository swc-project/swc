//! This example applies only AST compressor.
//!
//! This is used along with creduce

#![deny(warnings)]

extern crate swc_node_base;

use std::{env::args, fs, path::Path};

use swc_common::{sync::Lrc, Mark, SourceMap};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_visit::FoldWith;

fn main() {
    let file = args().nth(1).expect("should provide a path to file");

    eprintln!("File: {}", file);

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(Path::new(&file)).expect("failed to load file");

        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let program = parse_file_as_module(
            &fm,
            Default::default(),
            Default::default(),
            None,
            &mut vec![],
        )
        .map_err(|err| {
            err.into_diagnostic(&handler).emit();
        })
        .map(|module| module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false)))
        .unwrap();

        let output = optimize(
            program,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                compress: Some(Default::default()),
                mangle: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let output = output.fold_with(&mut fixer(None));

        let code = print(cm, &[output], true);

        fs::write("output.js", code.as_bytes()).expect("failed to write output");

        Ok(())
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
