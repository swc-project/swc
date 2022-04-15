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

    c.run(|| {
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

            black_box(res);
        })
    });
}

fn files_group(c: &mut Criterion) {
    let mut group = c.benchmark_group("libraries");
    group.sample_size(10);

    macro_rules! one {
        ($name:ident, $target:expr) => {
            group.bench_function(stringify!($name), |b| {
                bench_minify(b, $target);
            });
        };
    }

    one!(antd, "antd.js");
}

criterion_group!(benches, files_group);
criterion_main!(benches);
