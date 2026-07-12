/// Use memory allocator
extern crate swc_malloc;

use std::{
    env,
    fs::{self, File},
    io::BufWriter,
    path::Path,
    time::Instant,
};

use swc_common::source_map::DefaultSourceMapGenConfig;
use swc_ecma_ast::*;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{Parser, SourceType};

fn parse_and_gen(entry: &Path) {
    testing::run_test2(false, |cm, _| {
        let fm = cm.load_file(entry).unwrap();

        let result = Parser::new(&fm.src, SourceType::typescript())
            .with_start_pos(fm.start_pos)
            .parse();
        assert!(result.diagnostics.is_empty());
        let Program::Module(m) = result.program else {
            unreachable!("TypeScript source type must produce a module")
        };

        let mut code = Vec::new();
        let mut srcmap = Vec::new();

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: cm.clone(),
                comments: None,
                wr: JsWriter::new(cm.clone(), "\n", &mut code, Some(&mut srcmap)),
            };

            emitter.emit_module(&m).unwrap();
        }

        let srcmap = cm.build_source_map(&srcmap, None, DefaultSourceMapGenConfig);

        fs::write("output.js", &code).unwrap();

        let srcmap_file = File::create("output.js.map").unwrap();
        let srcmap_wr = BufWriter::new(srcmap_file);
        srcmap.to_writer(srcmap_wr).unwrap();

        Ok(())
    })
    .expect("failed to process a module");
}

/// Usage: ./scripts/instruements path/to/input/file
fn main() {
    let main_file = env::args().nth(1).unwrap();

    let start = Instant::now();
    parse_and_gen(Path::new(&main_file));
    let dur = start.elapsed();
    println!("Took {dur:?}");
}
