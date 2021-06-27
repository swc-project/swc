use std::path::PathBuf;

use swc_common::input::SourceFileInput;
use swc_ecma_ast::EsVersion;
use swc_ecma_codegen::{text_writer::JsWriter, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, Syntax};
use testing::{run_test2, NormalizedOutput};

#[testing::fixture("fixture/**/input.ts")]
fn test_fixture(input: PathBuf) {
    let dir = input.parent().unwrap();
    let output = dir.join(format!(
        "output.{}",
        input.extension().unwrap().to_string_lossy()
    ));

    run_test2(false, |cm, _| {
        let fm = cm.load_file(&input).unwrap();

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

        let mut buf = vec![];

        {
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config { minify: false },
                cm: cm.clone(),
                comments: None,
                wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
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
