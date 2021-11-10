#![feature(test)]

extern crate test;

#[global_allocator]
static GLOBAL: System = System;

use std::alloc::System;
use swc_common::{chain, FileName};
use swc_ecma_parser::{Parser, StringInput, Syntax};
use swc_ecma_transforms_base::helpers;
use swc_ecma_visit::FoldWith;
use test::Bencher;

static SOURCE: &str = include_str!("assets/AjaxObservable.ts");

/// Benchmark a folder
macro_rules! tr {
    ($b:expr, $tr:expr) => {
        $b.bytes = SOURCE.len() as _;

        let _ = ::testing::run_test(false, |cm, _| {
            let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

            let mut parser = Parser::new(
                Syntax::Typescript(Default::default()),
                StringInput::from(&*fm),
                None,
            );
            let module = parser.parse_module().map_err(|_| ()).unwrap();
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
    tr!(b, || swc_ecma_transforms_base::resolver::resolver());
}

#[bench]
fn fixer(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms_base::fixer::fixer(None));
}

#[bench]
fn hygiene(b: &mut Bencher) {
    tr!(b, || swc_ecma_transforms_base::hygiene::hygiene());
}

#[bench]
fn resolver_with_hygiene(b: &mut Bencher) {
    tr!(b, || chain!(
        swc_ecma_transforms_base::resolver::resolver(),
        swc_ecma_transforms_base::hygiene::hygiene()
    ));
}
