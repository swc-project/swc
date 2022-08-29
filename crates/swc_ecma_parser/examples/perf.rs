#![feature(bench_black_box)]

extern crate swc_node_base;

use std::{collections::hash_map::DefaultHasher, hash::Hash, hint::black_box};

use swc_common::{self, sync::Lrc, SourceMap};
use swc_ecma_parser::{lexer::Lexer, JSXKind, Parser, StringInput, Syntax, TsConfig};

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

        let lexer = Lexer::new(
            Syntax::Typescript(TsConfig {
                no_early_errors: true,
                tsx: JSXKind::Bool(entry.path().to_string_lossy().ends_with(".tsx")),
                ..Default::default()
            }),
            Default::default(),
            StringInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);

        let module = parser.parse_typescript_module();

        if let Ok(module) = &module {
            module.hash(&mut hasher);
        }

        let _ = black_box(module);

        cnt += 1;
    }

    eprintln!("Parsed {} files", cnt);
    eprintln!("Hash: {:?}", hasher);
}
