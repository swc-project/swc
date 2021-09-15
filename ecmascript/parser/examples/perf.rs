#![feature(bench_black_box)]

use std::hint::black_box;
use swc_common::{
    self,
    errors::{ColorConfig, Handler},
    sync::Lrc,
    SourceMap,
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, StringInput, Syntax};

fn main() {
    for entry in walkdir::WalkDir::new("tests/typescript") {
        let entry = entry.unwrap();
        if !entry.path().to_string_lossy().ends_with(".ts")
            && !entry.path().to_string_lossy().ends_with(".tsx")
        {
            continue;
        }

        let cm: Lrc<SourceMap> = Default::default();
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let fm = cm.load_file(entry.path()).unwrap();

        let lexer = Lexer::new(
            Syntax::Typescript(Default::default()),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit();
        }

        let module = parser
            .parse_typescript_module()
            .map_err(|e| e.into_diagnostic(&handler).emit())
            .expect("Failed to parse module.");

        black_box(module);
    }
}
