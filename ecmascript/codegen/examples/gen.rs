/// Use memory allocator
extern crate swc_node_base;

use std::{env, fs, path::Path, time::Instant};
use swc_common::input::SourceFileInput;
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};

fn do_test(entry: &Path) {
    testing::run_test2(false, |cm, _| {
        let fm = cm.load_file(entry).unwrap();

        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            EsVersion::latest(),
            SourceFileInput::from(&*fm),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let m = parser
            .parse_module()
            .expect("failed to parse input as a module");

        for _ in 0..100 {
            let code = {
                let mut buf = vec![];

                {
                    let mut emitter = Emitter {
                        cfg: swc_ecma_codegen::Config {
                            ..Default::default()
                        },
                        cm: cm.clone(),
                        comments: None,
                        wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
                    };

                    emitter.emit_module(&m).unwrap();
                }

                String::from_utf8_lossy(&buf).to_string()
            };

            fs::write("output.js", &code).unwrap();
        }

        Ok(())
    })
    .expect("failed to process a module");
}

/// Usage: ./scripts/instruements path/to/input/file
fn main() {
    let main_file = env::args().nth(1).unwrap();

    let start = Instant::now();
    do_test(Path::new(&main_file));
    let dur = start.elapsed();
    println!("Took {:?}", dur);
}
