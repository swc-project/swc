use std::path::{Path, PathBuf};
use swc_common::{input::SourceFileInput, sync::Lrc};
use swc_common::{FileName, Mark, SourceFile, SourceMap};
use swc_ecma_ast::*;
use swc_ecma_codegen::{
    text_writer::{omit_trailing_semi, JsWriter, WriteJs},
    Emitter,
};
use swc_ecma_minifier::optimize;
use swc_ecma_minifier::option::{
    ExtraOptions, MangleOptions, ManglePropertiesOptions, MinifyOptions,
};
use swc_ecma_parser::lexer::Lexer;
use swc_ecma_parser::{EsConfig, Parser, Syntax};

fn print(cm: Lrc<SourceMap>, m: &Module, minify: bool) -> String {
    let mut buf = vec![];

    {
        let mut wr = Box::new(JsWriter::new(cm.clone(), "\n", &mut buf, None)) as Box<dyn WriteJs>;

        if minify {
            wr = Box::new(omit_trailing_semi(wr));
        }

        let mut emitter = Emitter {
            cfg: swc_ecma_codegen::Config { minify },
            cm: cm.clone(),
            comments: None,
            wr,
        };

        emitter.emit_module(m).unwrap();
    }

    String::from_utf8(buf).unwrap()
}

fn parse(cm: Lrc<SourceMap>, path: &Path) -> Module {
    let fm = cm.load_file(path).unwrap();
    parse_fm(fm)
}

fn parse_fm(fm: Lrc<SourceFile>) -> Module {
    let lexer = Lexer::new(
        Syntax::Es(EsConfig {
            dynamic_import: true,
            ..Default::default()
        }),
        EsVersion::latest(),
        SourceFileInput::from(&*fm),
        None,
    );

    let mut parser = Parser::new_from(lexer);
    parser.parse_module().unwrap()
}

#[testing::fixture("tests/compress/fixture/**/output.js")]
fn compressed(compressed_file: PathBuf) {
    testing::run_test2(false, |cm, _handler| {
        let m = parse(cm.clone(), &compressed_file);

        let top_level_mark = Mark::fresh(Mark::root());

        let m = optimize(
            m,
            cm.clone(),
            None,
            None,
            &MinifyOptions {
                mangle: Some(MangleOptions {
                    props: Some(ManglePropertiesOptions {
                        reserved: Default::default(),
                        undeclared: false,
                        regex: Default::default(),
                    }),
                    top_level: true,
                    keep_class_names: false,
                    keep_fn_names: false,
                    keep_private_props: false,
                    ie8: false,
                    safari10: false,
                }),
                compress: None,
                ..Default::default()
            },
            &ExtraOptions { top_level_mark },
        );

        let mangled = print(cm.clone(), &m, false);
        let minified = print(cm.clone(), &m, true);

        parse_fm(cm.new_source_file(FileName::Anon, mangled));
        parse_fm(cm.new_source_file(FileName::Anon, minified));

        Ok(())
    })
    .unwrap();
}
