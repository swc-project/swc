#![feature(test)]
#![feature(bench_black_box)]

extern crate swc_node_base;
extern crate test;

use std::{fs::read_to_string, io::stderr, path::Path};
use swc::config::{IsModule, Options};
use swc_common::{errors::Handler, sync::Lrc, FilePathMapping, SourceMap};
use test::Bencher;

fn mk() -> swc::Compiler {
    let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

    swc::Compiler::new(cm)
}

fn bench_file(b: &mut Bencher, path: &Path) {
    let c = mk();

    b.bytes = read_to_string(&path).unwrap().len() as _;

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

#[bench]
fn bugs_1(b: &mut Bencher) {
    bench_file(b, Path::new("benches/bugs/1/input.tsx"));
}
