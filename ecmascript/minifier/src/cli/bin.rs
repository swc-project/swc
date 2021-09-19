use std::{env::args, path::Path};
use swc_common::{input::SourceFileInput, sync::Lrc, Mark, SourceMap};
use swc_ecma_codegen::text_writer::JsWriter;
use swc_ecma_minifier::{
    optimize,
    option::{ExtraOptions, MinifyOptions},
};
use swc_ecma_parser::{lexer::Lexer, Parser};
use swc_ecma_transforms::{
    fixer,
    hygiene::{self, hygiene_with_config},
    resolver_with_mark,
};
use swc_ecma_visit::FoldWith;

fn main() {
    let file = args().nth(1).expect("should provide a path to file");

    testing::run_test2(false, |cm, handler| {
        let fm = cm.load_file(Path::new(&file)).expect("failed to load file");

        let top_level_mark = Mark::fresh(Mark::root());

        let lexer = Lexer::new(
            Default::default(),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );

        let mut parser = Parser::new_from(lexer);
        let program = parser
            .parse_module()
            .map_err(|err| {
                err.into_diagnostic(&handler).emit();
            })
            .map(|module| module.fold_with(&mut resolver_with_mark(top_level_mark)))
            .unwrap();

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
            .fold_with(&mut hygiene_with_config(hygiene::Config {
                ..Default::default()
            }))
            .fold_with(&mut fixer(None));

        println!("{}", print(cm.clone(), &output));

        Ok(())
    })
    .unwrap();
}

fn print<N: swc_ecma_codegen::Node>(cm: Lrc<SourceMap>, node: &N) -> String {
    let mut buf = vec![];

    {
        let mut emitter = swc_ecma_codegen::Emitter {
            cfg: swc_ecma_codegen::Config { minify: true },
            cm: cm.clone(),
            comments: None,
            wr: Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)),
        };

        node.emit_with(&mut emitter).unwrap();
    }

    String::from_utf8(buf).unwrap()
}
