#![feature(test)]

extern crate test;

#[global_allocator]
static GLOBAL: System = System;

use std::alloc::System;
use swc_common::{chain, FileName};
use swc_ecma_parser::{Parser, Session, SourceFileInput, Syntax};
use swc_ecma_transforms::helpers;
use swc_ecma_visit::FoldWith;
use test::Bencher;

static SOURCE: &str = include_str!("../../parser/benches/files/angular-1.2.5.js");

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
        $b.bytes = SOURCE.len() as _;

        let _ = ::testing::run_test(false, |cm, handler| {
            let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

            let mut parser = Parser::new(
                Session { handler: &handler },
                Syntax::default(),
                SourceFileInput::from(&*fm),
                None,
            );
            let module = parser
                .parse_module()
                .map_err(|mut e| {
                    e.emit();
                    ()
                })
                .unwrap();
            helpers::HELPERS.set(&Default::default(), || {
                let mut tr = $tr();

                $b.iter(|| {
                    let module = module.clone();
                    test::black_box(module.fold_with(&mut tr))
                });
                Ok(())
            })
        });
    };
}

#[bench]
fn resolver(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms::resolver());
}

#[bench]
fn fixer(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms::fixer());
}

#[bench]
fn hygiene(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms::hygiene());
}

#[bench]
fn resolver_with_hygiene(b: &mut Bencher) {
    tr!(b, || chain!(
        swc_ecma_transforms::resolver(),
        swc_ecma_transforms::hygiene()
    ));
}
