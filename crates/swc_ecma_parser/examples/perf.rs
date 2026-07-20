extern crate swc_malloc;

use codspeed_criterion_compat::black_box;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsSyntax};

fn main() {
    let mut cnt = 0;

    for entry in walkdir::WalkDir::new("tests/typescript") {
        let entry = entry.unwrap();
        if !entry.path().to_string_lossy().ends_with(".ts")
            && !entry.path().to_string_lossy().ends_with(".tsx")
        {
            continue;
        }

        let cm: Lrc<SourceMap> = Default::default();

        let fm = cm.load_file(entry.path()).unwrap();

        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax {
                no_early_errors: true,
                tsx: entry.path().to_string_lossy().ends_with(".tsx"),
                ..Default::default()
            }),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let module = parser.parse_typescript_module();

        let _ = black_box(module);

        cnt += 1;
    }

    eprintln!("Parsed {cnt} files");
}
