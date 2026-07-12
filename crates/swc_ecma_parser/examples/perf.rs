extern crate swc_malloc;

use std::{collections::hash_map::DefaultHasher, hash::Hash};

use codspeed_criterion_compat::black_box;
use swc_common::{sync::Lrc, SourceMap};
use swc_ecma_parser::{ModuleKind, Parser, SourceType, Syntax, TsSyntax};

fn main() {
    let mut cnt = 0;
    let mut hasher = DefaultHasher::new();

    for entry in walkdir::WalkDir::new("tests/typescript") {
        let entry = entry.unwrap();
        if !entry.path().to_string_lossy().ends_with(".ts")
            && !entry.path().to_string_lossy().ends_with(".tsx")
        {
            continue;
        }

        let cm: Lrc<SourceMap> = Default::default();

        let fm = cm.load_file(entry.path()).unwrap();

        let syntax = Syntax::Typescript(TsSyntax {
                no_early_errors: true,
                tsx: entry.path().to_string_lossy().ends_with(".tsx"),
                ..Default::default()
            });
        let (source_type, options) =
            SourceType::from_legacy(syntax, ModuleKind::Module, Default::default());
        let result = Parser::new(&fm.src, source_type)
            .with_options(options)
            .with_start_pos(fm.start_pos)
            .parse();
        result.program.hash(&mut hasher);
        let _ = black_box(result);

        cnt += 1;
    }

    eprintln!("Parsed {cnt} files");
    eprintln!("Hash: {hasher:?}");
}
