use swc_common;

use std::sync::Arc;
use swc_common::{
    errors::{ColorConfig, Handler},
    FileName, SourceMap,
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, Session, SourceFileInput, Syntax};

fn main() {
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
            "function foo() {}".into(),
        );

        let lexer = Lexer::new(
            session,
            Syntax::Es(Default::default()),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );

        let capturing = Capturing::new(lexer);

        let mut parser = Parser::new_from(session, capturing);

        let _module = parser
            .parse_module()
            .map_err(|mut e| {
                e.emit();
            })
            .expect("Failed to parse module.");

        println!("Tokens: {:?}", parser.input().take());
    });
}
