//! Usage: cargo run --example ts_to_js path/to/ts
//!
//! This program will emit output to stdout.

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
use swc_ecma_transforms_typescript::strip;

fn main() {
    let cm: Lrc<SourceMap> = Default::default();
    let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

    // Real usage
    // let fm = cm
    //     .load_file(Path::new("test.js"))
    //     .expect("failed to load test.js");

    let input = env::args()
        .nth(1)
        .expect("please provide the path of input typescript file");

    let fm = cm
        .load_file(Path::new(&input))
        .expect("failed to load input typescript file");

    let comments = SingleThreadedComments::default();

    let source_type = SourceType::typescript().with_jsx(input.ends_with(".tsx"));
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
    let module = result.program;

    let globals = Globals::default();
    GLOBALS.set(&globals, || {
        let unresolved_mark = Mark::new();
        let top_level_mark = Mark::new();

        // Optionally transforms decorators here before the resolver pass
        // as it might produce runtime declarations.

        // Conduct identifier scope analysis
        let module = module.apply(resolver(unresolved_mark, top_level_mark, true));

        // Remove typescript types
        let module = module.apply(strip(unresolved_mark, top_level_mark));

        // Fix up any identifiers with the same name, but different contexts
        let module = module.apply(hygiene());

        // Ensure that we have enough parenthesis.
        let program = module.apply(fixer(Some(&comments)));

        println!("{}", to_code_default(cm, Some(&comments), &program));
    })
}
