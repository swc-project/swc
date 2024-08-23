/// Explicit extern crate to use allocator.
extern crate swc_malloc;

use std::{path::PathBuf, sync::Arc};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::{config::JsMinifyOptions, try_with_handler, BoolOrDataConfig};
use swc_common::{FilePathMapping, SourceMap};
use swc_ecma_utils::swc_common::GLOBALS;

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn bench_minify(b: &mut Bencher, filename: &str) {
    let c = mk();

    b.iter(|| {
        let _guard = testing::init();

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
            GLOBALS.set(&Default::default(), || {
                c.minify(
                    fm,
                    handler,
                    &JsMinifyOptions {
                        compress: BoolOrDataConfig::from_bool(true),
                        mangle: BoolOrDataConfig::from_bool(true),
                        toplevel: Some(true),
                        source_map: BoolOrDataConfig::from_bool(true),
                        output_path: Default::default(),
                        inline_sources_content: true,
                        emit_source_map_columns: true,
                        ..Default::default()
                    },
                    Default::default(),
                )
            })
        })
        .unwrap();

        black_box(res);

        // assert_eq!(res.map, None);
    })
}

fn files_group(c: &mut Criterion) {
    let mut group = c.benchmark_group("es/full/minify/libraries");
    group.sample_size(10);

    let mut bench_file = |name: &str| {
        group.bench_function(format!("es/full/minify/libraries/{name}"), |b| {
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
    // bench_file("large");
}

criterion_group!(benches, files_group);
criterion_main!(benches);
