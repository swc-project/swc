#![feature(test)]

extern crate swc_common;
extern crate swc_ecma_parser;
extern crate test;
extern crate testing;

use swc_common::FileName;
use swc_ecma_parser::{Parser, Session, SourceFileInput};
use test::Bencher;

/// Copied from ratel-rust
static SOURCE: &'static str = include_str!("../colors.js");

#[bench]
fn parse_module(b: &mut Bencher) {
    b.bytes = SOURCE.len() as _;

    let _ = ::testing::run_test(|logger, cm, handler| {
        let fm = cm.new_source_file(FileName::Anon, SOURCE.into());

        b.iter(|| {
            test::black_box({
                let mut parser = Parser::new(
                    Session {
                        logger: &logger,
                        handler: &handler,
                        cfg: Default::default(),
                    },
                    SourceFileInput::from(&*fm),
                );
                let _ = parser.parse_module();
            })
        });
        Ok(())
    });
}
