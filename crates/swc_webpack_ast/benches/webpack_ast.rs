#![feature(test)]

use std::path::Path;

use swc_ecma_parser::{EsConfig, Parser, StringInput, Syntax};
use test::Bencher;

extern crate swc_node_base;
extern crate test;

/// this benchmark requires real input, which cannot be committed into git
/// repository
#[bench]
#[cfg(not(all))]
fn total(b: &mut Bencher) {
    let input = Path::new("tests/fixture/real/input.js");

    if !input.exists() {
        println!(
            "Skipping webpack_ast benchmark due to missing input fixture at {}",
            input.display()
        );
        return;
    }

    b.iter(|| {
        testing::run_test(false, |cm, handler| {
            let fm = cm.load_file(input).unwrap();

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
                    .map_err(|e| e.into_diagnostic(handler).emit());

                for e in p.take_errors() {
                    e.into_diagnostic(handler).emit()
                }

                res?
            };

            let s = swc_webpack_ast::webpack_ast(cm, fm, module).unwrap();
            println!("{} bytes", s.len());

            Ok(())
        })
        .unwrap();
    });
}
