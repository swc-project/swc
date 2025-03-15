//! Ported from https://github.com/privatenumber/minification-benchmarks

extern crate swc_malloc;

use std::{
    fs::read_to_string,
    path::{Path, PathBuf},
    process::Command,
};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{errors::HANDLER, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::Program;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver};
use swc_ecma_utils::parallel::{Parallel, ParallelExt};
use testing::CARGO_TARGET_DIR;
use walkdir::WalkDir;

fn bench_libs(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/minifier/libs");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        let src = read_to_string(format!("benches/full/{}.js", name)).unwrap();

        group.bench_function(format!("es/minifier/libs/{}", name), |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler

                run(&src)
            })
        });
    };

    bench_file("antd");
    bench_file("d3");
    bench_file("echarts");
    bench_file("jquery");
    bench_file("lodash");
    bench_file("moment");
    bench_file("react");
    bench_file("terser");
    bench_file("three");
    bench_file("typescript");
    bench_file("victory");
    bench_file("vue");
}

fn bench_real(c: &mut Criterion) {
    let input_dir = CARGO_TARGET_DIR.join("swc-minifier-inputs");

    git_clone(
        "https://github.com/kdy1/swc-minifier-inputs.git",
        "a967ebba1668d1f78e1b5077bdbdce6ad0bfcaee",
        &input_dir,
    );

    let mut group = c.benchmark_group("es/minifier/real");
    group.sample_size(10);

    let files = expand_dirs(&input_dir);
    let sources = files
        .iter()
        .map(|path| read_to_string(path).unwrap())
        .collect::<Vec<_>>();

    group.bench_function("es/minifier/real/sequential", |b| {
        b.iter(|| {
            // We benchmark full time, including time for creating cm, handler

            for src in &sources {
                run(src);
            }
        })
    });

    group.bench_function("es/minifier/real/parallel", |b| {
        b.iter(|| {
            // We benchmark full time, including time for creating cm, handler

            Worker::default().maybe_par(0, &*sources, |_, src| run(src));
        })
    });
}

#[derive(Default, Clone, Copy)]
struct Worker {}

impl Parallel for Worker {
    fn create(&self) -> Self {
        *self
    }

    fn merge(&mut self, _other: Self) {}
}

fn git_clone(url: &str, commit: &str, path: &Path) {
    if !path.join(".git").exists() {
        let status = Command::new("git")
            .arg("clone")
            .arg(url)
            .arg(path)
            .status()
            .unwrap();

        if !status.success() {
            panic!("failed to clone `{}` to `{}`", url, path.display());
        }
    }

    let status = Command::new("git")
        .current_dir(path)
        .args(["checkout", commit])
        .status()
        .unwrap();

    if !status.success() {
        panic!("failed to checkout `{}` in `{}`", commit, path.display());
    }
}

/// Return the whole input files as abolute path.
fn expand_dirs(dir: &Path) -> Vec<PathBuf> {
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
}

fn run(src: &str) {
    testing::run_test2(false, |cm, handler| {
        HANDLER.set(&handler, || {
            let fm = cm.new_source_file(FileName::Anon.into(), src.into());

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
            .unwrap();

            let output = optimize(
                program,
                cm.clone(),
                None,
                None,
                &MinifyOptions {
                    rename: false,
                    compress: Some(Default::default()),
                    mangle: Some(MangleOptions {
                        props: None,
                        top_level: Some(true),
                        keep_class_names: false,
                        keep_fn_names: false,
                        keep_private_props: false,
                        ie8: false,
                        ..Default::default()
                    }),
                    wrap: false,
                    enclose: false,
                },
                &ExtraOptions {
                    unresolved_mark,
                    top_level_mark,
                    mangle_name_cache: None,
                },
            );

            let output = output.apply(fixer(None));

            let code = print(cm, &[output], true);

            black_box(code);
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
            wr: Box::new(JsWriter::new(cm, "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}

criterion_group!(bench_all, bench_libs, bench_real);
criterion_main!(bench_all);
