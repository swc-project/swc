use std::sync::Arc;

use criterion::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc::{try_with_handler, HandlerOpts};
use swc_common::{errors::ColorConfig, FileName, FilePathMapping, SourceMap};
use swc_ecma_ast::EsVersion;

fn mk() -> swc::Compiler {
    let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn plugin_group(c: &mut Criterion) {
    c.bench_function("es/plugin/with-transform/1/cached", |b| {
        bench_transform(b, true)
    });
    c.bench_function("es/plugin/with-transform/1/no-cache", |b| {
        bench_transform(b, false)
    });
}

fn bench_transform(b: &mut Bencher, use_cache: bool) {
    static SOURCE: &str = include_str!("assets/Observable.ts");

    b.iter(|| {
        let c = mk();

        let fm =
            c.cm.new_source_file(FileName::Real("src/test.ts".into()), SOURCE.to_string());

        let res = try_with_handler(
            c.cm.clone(),
            HandlerOpts {
                color: ColorConfig::Never,
                skip_filename: true,
            },
            |handler| {
                c.process_js_file(
                    fm.clone(),
                    handler,
                    &swc::config::Options {
                        config: swc::config::Config {
                            jsc: swc::config::JscConfig {
                                target: Some(EsVersion::latest()),
                                experimental: swc::config::JscExperimental {
                                    plugins: Some(from_json(r###"[["internal_plugin", {}]]"###)),
                                    cache_root: if use_cache { Some(".swc".into()) } else { None },
                                    ..Default::default()
                                },
                                ..Default::default()
                            },
                            ..Default::default()
                        },
                        ..Default::default()
                    },
                )
            },
        )
        .unwrap();

        let _ = black_box(res);
    })
}

criterion_group!(benches, plugin_group);
criterion_main!(benches);

fn from_json<T>(json: &str) -> T
where
    T: serde::de::DeserializeOwned,
{
    serde_json::from_str(json).unwrap()
}
