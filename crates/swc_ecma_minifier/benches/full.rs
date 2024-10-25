//! Ported from https://github.com/privatenumber/minification-benchmarks

extern crate swc_malloc;

use std::fs::read_to_string;

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Criterion};
use swc_allocator::Allocator;
use swc_common::{errors::HANDLER, sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_ast::Program;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver};

pub fn bench_files(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/minifier/libs");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        let src = read_to_string(format!("benches/full/{}.js", name)).unwrap();

        group.bench_function(format!("es/minifier/libs/{}", name), |b| {
            b.iter(|| {
                // We benchmark full time, including time for creating cm, handler
                let allocator = Allocator::default();
                let _guard = unsafe { allocator.guard() };

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

criterion_group!(files, bench_files);
criterion_main!(files);

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
