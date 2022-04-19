/// Explicit extern crate to use allocator.
extern crate swc_node_base;

use std::{path::PathBuf, sync::Arc};

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::{config::JsMinifyOptions, try_with_handler};
use swc_common::{FilePathMapping, SourceMap};

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn bench_minify(b: &mut Bencher, filename: &str) {
    let c = mk();

    b.iter(|| {
        let fm = black_box(
            c.cm.load_file(
                &PathBuf::from("..")
                    .join("swc_ecma_minifier")
                    .join("benches")
                    .join("full")
                    .join(filename),
            )
            .unwrap(),
        );

        let res = try_with_handler(c.cm.clone(), Default::default(), |handler| {
            c.minify(
                fm,
                handler,
                &JsMinifyOptions {
                    compress: true.into(),
                    mangle: true.into(),
                    format: Default::default(),
                    ecma: Default::default(),
                    keep_classnames: Default::default(),
                    keep_fnames: Default::default(),
                    module: Default::default(),
                    safari10: Default::default(),
                    toplevel: Default::default(),
                    source_map: Default::default(),
                    output_path: Default::default(),
                    inline_sources_content: Default::default(),
                },
            )
        })
        .unwrap();

        let res = black_box(res);

        assert_eq!(res.map, None);
    })
}

fn files_group(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/full/minify/libraries");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        group.bench_function(name, |b| {
            bench_minify(b, &format!("{}.js", name));
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

criterion_group!(benches, files_group);
criterion_main!(benches);
