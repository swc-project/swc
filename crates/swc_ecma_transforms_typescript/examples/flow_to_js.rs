//! Usage: cargo run --example flow_to_js path/to/input.js
//!
//! This program parses Flow syntax and emits stripped JavaScript to stdout.

use std::{env, path::Path};

use swc_common::{
    comments::SingleThreadedComments,
    errors::{ColorConfig, Handler},
    sync::Lrc,
    Globals, Mark, SourceMap, GLOBALS,
};
use swc_ecma_codegen::to_code_default;
use swc_ecma_parser::{lexer::Lexer, FlowSyntax, Parser, StringInput, Syntax};
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene, resolver};
use swc_ecma_transforms_typescript::typescript;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    let input = env::args()
        .nth(1)
        .expect("please provide the path of input flow file");

    let fm = cm
        .load_file(Path::new(&input))
        .expect("failed to load input flow file");

    let comments = SingleThreadedComments::default();

    let lexer = Lexer::new(
        Syntax::Flow(FlowSyntax {
            jsx: input.ends_with(".jsx"),
            ..Default::default()
        }),
        Default::default(),
        StringInput::from(&*fm),
        Some(&comments),
    );

    let mut parser = Parser::new_from(lexer);

    for e in parser.take_errors() {
        e.into_diagnostic(&handler).emit();
    }

    let program = parser
        .parse_program()
        .map_err(|e| e.into_diagnostic(&handler).emit())
        .expect("failed to parse module.");

    let globals = Globals::default();
    GLOBALS.set(&globals, || {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        let program = program.apply(resolver(unresolved_mark, top_level_mark, false));
        let program = program.apply(typescript::typescript(
            typescript::Config {
                flow_syntax: true,
                ..Default::default()
            },
            unresolved_mark,
            top_level_mark,
        ));
        let program = program.apply(hygiene());
        let program = program.apply(fixer(Some(&comments)));

        println!("{}", to_code_default(cm, Some(&comments), &program));
    })
}
