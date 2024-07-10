extern crate swc_malloc;

use std::{io::stderr, path::Path};

use codspeed_criterion_compat::{black_box, criterion_group, criterion_main, Bencher, Criterion};
use swc_common::{errors::Handler, sync::Lrc, FilePathMapping, SourceMap};
use swc_ecma_utils::swc_common::GLOBALS;

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
            GLOBALS.set(&Default::default(), || {
                c.process_js_file(fm, &handler, &Default::default())
                    .unwrap()
            })
        };
        black_box(result);
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
