#![deny(warnings)]

extern crate swc_malloc;

use std::{
    env,
    path::PathBuf,
    time::{Duration, Instant},
};

use anyhow::Result;
use rayon::prelude::*;
use swc_common::{sync::Lrc, Mark, SourceMap, GLOBALS};
use swc_ecma_ast::Program;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{
    fixer::{fixer, paren_remover},
    resolver,
};
use swc_ecma_utils::parallel::{Parallel, ParallelExt};
use walkdir::WalkDir;

fn main() {
    let dirs = env::args().skip(1).collect::<Vec<_>>();
    let files = expand_dirs(dirs);
    eprintln!("Using {} files", files.len());

    for i in 0..10 {
        let start = Instant::now();
        minify_all(&files);
        eprintln!("{}: Took {:?}", i, start.elapsed());
    }
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

#[derive(Default)]
struct Worker {
    total_size: usize,
    /// Single file max duration
    max_duration: Duration,
}

impl Parallel for Worker {
    fn create(&self) -> Self {
        Worker {
            total_size: 0,
            ..*self
        }
    }

    fn merge(&mut self, other: Self) {
        self.total_size += other.total_size;
        self.max_duration = self.max_duration.max(other.max_duration);
    }
}

#[inline(never)] // For profiling
fn minify_all(files: &[PathBuf]) {
    GLOBALS.set(&Default::default(), || {
        let mut worker = Worker::default();

        worker.maybe_par(2, files, |worker, path| {
            testing::run_test(false, |cm, handler| {
                let fm = cm.load_file(path).expect("failed to load file");

                let start = Instant::now();

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
                    err.into_diagnostic(handler).emit();
                })
                .map(Program::Module)
                .map(|module| module.apply(&mut resolver(unresolved_mark, top_level_mark, false)))
                .map(|module| module.apply(&mut paren_remover(None)))
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
                        mangle_name_cache: None,
                    },
                );

                let output = output.apply(&mut fixer(None));

                let code = print(cm.clone(), &[output], true);

                let duration = start.elapsed();

                worker.total_size += code.len();
                worker.max_duration = worker.max_duration.max(duration);

                if duration > Duration::from_secs(1) {
                    eprintln!("{}: {:?}", path.display(), duration);
                }

                Ok(())
            })
            .unwrap()
        });

        eprintln!("Total size: {}", worker.total_size);
        eprintln!("Max duration: {:?}", worker.max_duration);
    });
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N], minify: bool) -> String {
    let mut buf = Vec::new();

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config::default().with_minify(minify),
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
