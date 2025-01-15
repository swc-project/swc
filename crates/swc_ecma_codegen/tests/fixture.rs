use std::path::{Path, PathBuf};

use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{
    text_writer::{JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_parser::{parse_file_as_module, Syntax, TsSyntax};
use testing::{run_test2, NormalizedOutput};

fn run(input: &Path, minify: bool) {
    let dir = input.parent().unwrap();
    let output = if minify {
        dir.join(format!(
            "output.min.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    } else {
        dir.join(format!(
            "output.{}",
            input.extension().unwrap().to_string_lossy()
        ))
    };

    run_test2(false, |cm, _| {
        let fm = cm.load_file(input).unwrap();

        let m = parse_file_as_module(
            &fm,
            Syntax::Typescript(TsSyntax {
                decorators: true,
                tsx: true,
                ..Default::default()
            }),
            EsVersion::latest(),
            None,
            &mut Vec::new(),
        )
        .expect("failed to parse input as a module");

        let mut buf = Vec::new();

        {
            let mut wr =
                Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

            if minify {
                wr = Box::new(swc_ecma_codegen::text_writer::omit_trailing_semi(wr));
            }

            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config::default().with_minify(minify),
                cm,
                comments: None,
                wr,
            };

            emitter.emit_module(&m).unwrap();
        }

        NormalizedOutput::from(String::from_utf8(buf).unwrap())
            .compare_to_file(&output)
            .unwrap();

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.ts")]
#[testing::fixture("tests/fixture/**/input.tsx")]
fn ts(input: PathBuf) {
    run(&input, false);
}

#[testing::fixture("tests/fixture/**/input.js")]
#[testing::fixture("tests/fixture/**/input.jsx")]
fn js(input: PathBuf) {
    run(&input, false);
    run(&input, true);
}
