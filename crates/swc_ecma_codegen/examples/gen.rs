/// Use memory allocator
extern crate swc_malloc;

use std::{env, fs, path::Path, time::Instant};

use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{ModuleKind, Parser, SourceType};

fn parse_and_gen(entry: &Path) {
    testing::run_test2(false, |cm, _| {
        let fm = cm.load_file(entry).unwrap();

        let source_type = SourceType::typescript().with_module_kind(ModuleKind::Module);
        let result = Parser::new(&fm.src, source_type)
            .with_start_pos(fm.start_pos)
            .parse();
        assert!(result.diagnostics.is_empty());
        let Program::Module(m) = result.program else {
            unreachable!("TypeScript source type must produce a module")
        };

        let code = {
            let mut buf = Vec::new();

            {
                let mut emitter = Emitter {
                    cfg: Default::default(),
                    cm: cm.clone(),
                    comments: None,
                    wr: JsWriter::new(cm, "\n", &mut buf, None),
                };

                emitter.emit_module(&m).unwrap();
            }

            String::from_utf8_lossy(&buf).to_string()
        };

        fs::write("output.js", code).unwrap();

        Ok(())
    })
    .expect("failed to process a module");
}

/// Usage: ./scripts/instruments path/to/input/file
fn main() {
    let main_file = env::args().nth(1).unwrap();

    let start = Instant::now();
    parse_and_gen(Path::new(&main_file));
    let dur = start.elapsed();
    println!("Took {dur:?}");
}
