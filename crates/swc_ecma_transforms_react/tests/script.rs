#![allow(clippy::arc_with_non_send_sync)]
use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{FileName, Mark};
use swc_ecma_ast::Program;
use swc_ecma_codegen::{Config, Emitter};
use swc_ecma_parser::{EsSyntax, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::{fixer::fixer, hygiene, resolver};
use swc_ecma_transforms_react::{react, Options};
use swc_ecma_transforms_testing::{parse_options, Tester};
use testing::NormalizedOutput;

#[testing::fixture("tests/script/**/input.js")]
fn script(input: PathBuf) {
    let output = input.with_file_name("output.js");

    let options = parse_options(input.parent().unwrap());

    let input = fs::read_to_string(&input).unwrap();

    test_script(&input, &output, options);
}

fn test_script(src: &str, output: &Path, options: Options) {
    Tester::run(|tester| {
        let fm = tester
            .cm
            .new_source_file(FileName::Real("input.js".into()).into(), src.to_string());

        let syntax = Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        });

        let mut parser = Parser::new(syntax, StringInput::from(&*fm), Some(&tester.comments));

        let script = parser.parse_script().unwrap();

        let top_level_mark = Mark::new();
        let unresolved_mark = Mark::new();

        let script = Program::Script(script).apply((
            resolver(Mark::new(), top_level_mark, false),
            react(
                tester.cm.clone(),
                Some(&tester.comments),
                options,
                top_level_mark,
                unresolved_mark,
            ),
            hygiene::hygiene(),
            fixer(Some(&tester.comments)),
        ));

        let mut buf = Vec::new();

        let mut emitter = Emitter {
            cfg: Config::default()
                .with_ascii_only(true)
                .with_omit_last_semi(true),
            cm: tester.cm.clone(),
            wr: Box::new(swc_ecma_codegen::text_writer::JsWriter::new(
                tester.cm.clone(),
                "\n",
                &mut buf,
                None,
            )),
            comments: Some(&tester.comments),
        };

        // println!("Emitting: {:?}", module);
        emitter.emit_program(&script).unwrap();

        let s = String::from_utf8_lossy(&buf).to_string();
        assert!(NormalizedOutput::new_raw(s).compare_to_file(output).is_ok());

        Ok(())
    })
}
