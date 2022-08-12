use std::{env::args, io, path::Path};
use swc_common::{input::SourceFileInput, sync::Lrc, FilePathMapping, Mark, SourceMap};
use swc_ecma_ast::Module;
use swc_ecma_codegen::text_writer::{omit_trailing_semi, JsWriter};
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::{error::Error as ParseError, lexer::Lexer, Parser};
use swc_ecma_transforms::{fixer, hygiene::hygiene_with_config, resolver_with_mark};
use swc_ecma_visit::FoldWith;

fn parse_js(cm: &Lrc<SourceMap>, filename: String) -> Result<Module, ParseError> {
    let fm = cm
        .load_file(Path::new(&filename))
        .expect("Failed to load file");

    let lexer = Lexer::new(
        Default::default(),
        Default::default(),
        SourceFileInput::from(&*fm),
        None,
    );
    let mut parser = Parser::new_from(lexer);

    parser.parse_module()
}

fn print_js(cm: Lrc<SourceMap>, module: &Module) {
    let stdout = io::stdout();

    let mut emitter = swc_ecma_codegen::Emitter {
        cfg: swc_ecma_codegen::Config { minify: true },
        cm: cm.clone(),
        comments: None,
        wr: Box::new(omit_trailing_semi(
            JsWriter::new(cm.clone(), "\n", &stdout, None),
        )),
    };
    emitter.emit_module(module).unwrap();

    print!("\n");
}

fn run_cli(filename: String) -> Result<(), ParseError> {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm = Lrc::new(SourceMap::new(FilePathMapping::empty()));

        let top_level_mark = Mark::fresh(Mark::root());
        let program = parse_js(&cm, filename)?.fold_with(&mut resolver_with_mark(top_level_mark));

        let output = optimize(
            program,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                compress: Some(Default::default()),
                mangle: Some(Default::default()),
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let output = output
            .fold_with(&mut hygiene_with_config(Default::default()))
            .fold_with(&mut fixer(None));

        print_js(cm.clone(), &output);

        Ok(())
    })
}

fn main() {
    let filename = args().nth(1).expect("Usage: cargo run [filename.js]");

    if let Err(error) = run_cli(filename) {
        println!("{:?}", error);
    }
}
