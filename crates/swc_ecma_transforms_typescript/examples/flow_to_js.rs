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
use swc_ecma_parser::{attach_comments, Parser, SourceType};
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

    let source_type = SourceType::flow().with_jsx(input.ends_with(".jsx"));
    let mut result = Parser::new(&fm.src, source_type)
        .with_start_pos(fm.start_pos)
        .with_tokens()
        .parse();
    attach_comments(
        &fm.src,
        fm.start_pos,
        &comments,
        std::mem::take(&mut result.comments),
        &result.tokens,
        &result.program,
    );
    for error in result.diagnostics {
        error.into_diagnostic(&handler).emit();
    }
    assert!(!handler.has_errors(), "failed to parse module");
    let program = result.program;

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
