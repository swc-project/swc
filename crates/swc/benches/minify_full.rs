extern crate swc_node_base;

use std::fs::read_to_string;

use criterion::{black_box, criterion_group, criterion_main, Criterion};
use swc_common::{sync::Lrc, FileName, Mark, SourceMap};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MangleOptions, MinifyOptions},
};
use swc_ecma_parser::parse_file_as_module;
use swc_ecma_transforms_base::{fixer::fixer, resolver::resolver_with_mark};
use swc_ecma_visit::FoldWith;

pub fn bench_files(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/swc/minify/libraries");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        let src =
            read_to_string(&format!("../swc_ecma_minifier/benches/full/{}.js", name)).unwrap();

        group.bench_function(name, |b| {
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

criterion_group!(files, bench_files);
criterion_main!(files);

fn run(src: &str) {
    testing::run_test2(false, |cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, src.into());

        let top_level_mark = Mark::fresh(Mark::root());

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
        .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)))
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
            &ExtraOptions { top_level_mark },
        );

        let output = output.fold_with(&mut fixer(None));

        let code = print(cm, &[output], true);

        black_box(code);
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
