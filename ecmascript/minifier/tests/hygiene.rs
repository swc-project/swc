use std::path::PathBuf;
use swc_common::sync::Lrc;
use swc_common::SourceMap;
use swc_common::{input::SourceFileInput, Mark};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_codegen::Emitter;
use swc_ecma_minifier::optimize_hygiene;
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_transforms::{fixer, hygiene, resolver_with_mark};
use swc_ecma_utils::drop_span;
use swc_ecma_visit::FoldWith;
use testing::assert_eq;
use testing::run_test2;
use testing::DebugUsingDisplay;

#[testing::fixture("hygiene/identical/**/*.js")]
fn identical(input: PathBuf) {
    run_test2(false, |cm, handler| {
        let fm = cm.load_file(&input).expect("failed to load input.js");

        let top_level_mark = Mark::fresh(Mark::root());

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let program = parser.parse_module().map_err(|err| {
            err.into_diagnostic(&handler).emit();
        });

        let mut program = program
            .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)))
            .unwrap();

        let expected = print(cm.clone(), &[drop_span(program.clone())]);

        optimize_hygiene(&mut program, top_level_mark);

        let program = program
            .fold_with(&mut hygiene())
            .fold_with(&mut fixer(None));

        let actual = print(cm.clone(), &[program]);

        assert_eq!(DebugUsingDisplay(&*expected), DebugUsingDisplay(&*actual));

        Ok(())
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, nodes: &[N]) -> String {
    let mut buf = vec![];

    {
        let mut emitter = Emitter {
            cfg: Default::default(),
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        for n in nodes {
            n.emit_with(&mut emitter).unwrap();
        }
    }

    String::from_utf8(buf).unwrap()
}
