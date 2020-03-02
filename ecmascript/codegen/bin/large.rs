#![feature(box_syntax)]

use sourcemap::SourceMapBuilder;
use std::{
    clone::Clone,
    convert::{From, Into},
    sync::Arc,
};
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, FilePathMapping, SourceMap,
};
use swc_ecma_ast::*;
use swc_ecma_codegen::{self, Emitter};
use swc_ecma_parser::{lexer::Lexer, Parser, Session, SourceFileInput, Syntax};

fn main() {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm = Arc::new(SourceMap::new(FilePathMapping::empty()));

        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let session = Session { handler: &handler };

        let fm = cm.new_source_file(FileName::Anon, include_str!("large.js").into());

        println!("MultiByte chars: {}", fm.multibyte_chars.len());
        println!("NonNarrow chars: {}", fm.non_narrow_chars.len());

        let mut parser = Parser::new(
            session,
            Syntax::default(),
            SourceFileInput::from(&*fm),
            None,
        );
        let mut src_map_buf = vec![];
        let module = parser
            .parse_module()
            .map_err(|mut e| {
                e.emit();
            })
            .unwrap();

        let buf = vec![];
        let mut src_map_builder = SourceMapBuilder::new(None);
        {
            let handlers = box MyHandlers;
            let mut emitter = Emitter {
                cfg: swc_ecma_codegen::Config {
                    ..Default::default()
                },
                comments: None,
                cm: cm.clone(),
                wr: box swc_ecma_codegen::text_writer::JsWriter::new(
                    cm.clone(),
                    "\n",
                    buf,
                    Some(&mut src_map_buf),
                ),
                handlers,
            };
            println!("Before emit");

            let _ = emitter.emit_module(&module);

            println!("Emit is done");
        }
        let srcmap = cm.build_source_map(&mut src_map_buf);
        println!("Built source map");
    });
}

struct MyHandlers;

impl swc_ecma_codegen::Handlers for MyHandlers {}
