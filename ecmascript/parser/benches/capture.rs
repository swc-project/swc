#![feature(test)]

extern crate test;
use std::{hint::black_box, sync::Arc};
use swc_common::{
    self,
    errors::{ColorConfig, Handler},
    FileName, SourceMap,
};
use swc_ecma_parser::{
    lexer::Lexer, Capturing, JscTarget, Parser, Session, SourceFileInput, Syntax,
};
use test::Bencher;

#[bench]
fn check_ts(b: &mut Bencher) {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm: Arc<SourceMap> = Default::default();
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        let session = Session { handler: &handler };

        // Real usage
        // let fm = cm
        //     .load_file(Path::new("test.js"))
        //     .expect("failed to load test.js");

        let fm = cm.new_source_file(
            FileName::Custom("test.js".into()),
            include_str!("../../../../TypeScript/src/compiler/checker.ts").into(),
        );

        b.bytes = fm.src.len() as _;

        b.iter(|| {
            let lexer = Lexer::new(
                session,
                Syntax::Typescript(Default::default()),
                JscTarget::Es2015,
                SourceFileInput::from(&*fm),
                None,
            );

            let capturing = Capturing::new(lexer);

            let mut parser = Parser::new_from(session, capturing);

            let _module = parser
                .parse_typescript_module()
                .map_err(|mut e| {
                    e.emit();
                })
                .expect("Failed to parse module.");

            black_box(parser.input().take());
        })
    });
}
