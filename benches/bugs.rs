#![feature(test)]
#![feature(bench_black_box)]

extern crate test;

use std::{hint::black_box, io::stderr, path::Path};
use swc_common::{errors::Handler, sync::Lrc, FilePathMapping, SourceMap};
use test::Bencher;

fn mk() -> swc::Compiler {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    let c = swc::Compiler::new(cm.clone());

    c
}

#[bench]
fn bugs_1(b: &mut Bencher) {
    let c = mk();

    b.iter(|| {
        let handler = Handler::with_emitter_writer(Box::new(stderr()), Some(c.cm.clone()));

        let fm = c.cm.load_file(Path::new("benches/bugs/1.tsx")).unwrap();

        let result = {
            c.process_js_file(fm.clone(), &handler, &Default::default())
                .unwrap()
        };
        black_box(result);
    });
}
