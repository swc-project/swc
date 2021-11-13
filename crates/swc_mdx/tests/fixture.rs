#![deny(warnings)]

use std::path::PathBuf;
use swc_ecma_codegen::text_writer::JsWriter;
use swc_mdx::compile_file;
use testing::NormalizedOutput;

#[testing::fixture("tests/fixture/**/input.mdx")]
fn fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output_path = dir.join("output.js");

    testing::run_test2(false, |cm, _handler| {
        let fm = cm.load_file(&input).unwrap();
        println!("---- Input ----\n{}", fm.src);

        let res = compile_file(&fm).unwrap();

        let mut buf = vec![];
        {
            let mut emitter = swc_ecma_codegen::Emitter {
                cfg: Default::default(),
                cm: cm.clone(),
                comments: Default::default(),
                wr: JsWriter::new(cm.clone(), "\n", &mut buf, None),
            };

            emitter.emit_module(&res).unwrap();
        }

        let out = NormalizedOutput::from(String::from_utf8(buf).unwrap());

        out.compare_to_file(&output_path).unwrap();

        Ok(())
    })
    .unwrap();
}
