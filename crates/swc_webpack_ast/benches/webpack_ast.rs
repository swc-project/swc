#![feature(test)]

use std::path::Path;
use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use test::Bencher;

extern crate test;

#[bench]
fn total(b: &mut Bencher) {
    let input = Path::new("tests/fixture/real/input.js");

    b.iter(|| {
        testing::run_test(false, |cm, handler| {
            let fm = cm.load_file(&input).unwrap();

            let module = {
                let mut p = Parser::new(
                    Syntax::Es(EsConfig {
                        jsx: true,
                        ..Default::default()
                    }),
                    StringInput::from(&*fm),
                    None,
                );
                let res = p
                    .parse_module()
                    .map_err(|e| e.into_diagnostic(&handler).emit());

                for e in p.take_errors() {
                    e.into_diagnostic(&handler).emit()
                }

                res?
            };

            let s = swc_webpack_ast::webpack_ast(cm.clone(), fm.clone(), module).unwrap();
            println!("{} bytes", s.len());

            Ok(())
        })
        .unwrap();
    });
}
