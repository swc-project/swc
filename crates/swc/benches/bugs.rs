extern crate swc_node_base;

use std::{io::stderr, path::Path};

use criterion::{criterion_group, criterion_main, Bencher, Criterion};
use swc::config::{IsModule, Options};
use swc_common::{errors::Handler, sync::Lrc, FilePathMapping, SourceMap};

fn mk() -> swc::Compiler {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn bench_file(b: &mut Bencher, path: &Path) {
    let c = mk();

    b.iter(|| {
        let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

        let fm = c.cm.load_file(path).unwrap();

        let result = {
            c.process_js_file(
                fm,
                &handler,
                &Options {
                    is_module: IsModule::Bool(true),
                    ..Default::default()
                },
            )
            .unwrap()
        };
        println!("{}", result.code);
    });
}

fn bugs_1(b: &mut Bencher) {
    bench_file(b, Path::new("benches/bugs/1/input.tsx"));
}

fn bench_bugs(c: &mut Criterion) {
    c.bench_function("es/full/bugs-1", bugs_1);
}

criterion_group!(benches, bench_bugs);
criterion_main!(benches);
