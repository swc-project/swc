#![deny(warnings)]

extern crate swc_node_base;

use std::{env, fs, path::PathBuf, time::Instant};

use anyhow::Result;
use rayon::prelude::*;
use swc_common::{sync::Lrc, Mark, SourceMap, GLOBALS};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_visit::FoldWith;
use walkdir::WalkDir;

fn main() {
    let dirs = env::args().skip(1).collect::<Vec<_>>();
    let files = expand_dirs(dirs);
    eprintln!("Using {} files", files.len());

    let start = Instant::now();
    testing::run_test2(false, |cm, handler| {
        GLOBALS.with(|globals| {
            let _ = files
                .into_iter()
                .map(|path| -> Result<_> {
                    GLOBALS.set(globals, || {
                        let fm = cm.load_file(&path).expect("failed to load file");

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
                        .map(|module| {
                            module.fold_with(&mut resolver(unresolved_mark, top_level_mark, false))
                        })
                        .unwrap();

                        let output = optimize(
                            program,
                            cm.clone(),
                            None,
                            None,
                            &MinifyOptions {
                                compress: Some(Default::default()),
                                mangle: Some(MangleOptions {
                                    top_level: true,
                                    ..Default::default()
                                }),
                                ..Default::default()
                            },
                            &ExtraOptions {
                                unresolved_mark,
                                top_level_mark,
                            },
                        );

                        let output = output.fold_with(&mut fixer(None));

                        let code = print(cm.clone(), &[output], true);

                        fs::write("output.js", code.as_bytes()).expect("failed to write output");

                        Ok(())
                    })
                })
                .collect::<Vec<_>>();

            Ok(())
        })
    })
    .unwrap();

    eprintln!("Took {:?}", start.elapsed());
}

/// Return the whole input files as abolute path.
fn expand_dirs(dirs: Vec<String>) -> Vec<PathBuf> {
    dirs.into_par_iter()
        .map(PathBuf::from)
        .map(|dir| dir.canonicalize().unwrap())
        .flat_map(|dir| {
            WalkDir::new(dir)
                .into_iter()
                .filter_map(Result::ok)
                .filter_map(|entry| {
                    if entry.metadata().map(|v| v.is_file()).unwrap_or(false) {
                        Some(entry.into_path())
                    } else {
                        None
                    }
                })
                .filter(|path| path.extension().map(|ext| ext == "js").unwrap_or(false))
                .collect::<Vec<_>>()
        })
        .collect()
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
