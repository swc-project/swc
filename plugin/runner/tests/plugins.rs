use std::{path::Path, sync::Arc};
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::{input::SourceFileInput, FileName, SourceFile};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_plugin_runner::apply_js_plugin;

#[test]
fn emotion() {
    testing::run_test2(false, |cm, _handler| {
        let fm = cm.new_source_file(FileName::Anon, "import foo from 'foo';".into());

        let program = parse(fm.clone());

        let new = apply_js_plugin(&program, Path::new("libswc_plugin_emotion")).unwrap();

        let code = print(cm.clone(), &new);

        if true {
            panic!("{}", code)
        }

        Ok(())
    })
    .unwrap();
}

fn print(cm: Lrc<SourceMap>, e: &Program) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify: false },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        emitter.emit_program(&e).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(fm: Arc<SourceFile>) -> Program {
    let lexer = Lexer::new(
        Default::default(),
        EsVersion::latest(),
        SourceFileInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);

    parser.parse_module().map(Program::Module).unwrap()
}
