use std::sync::Arc;
use swc_common::{
    self,
    errors::{ColorConfig, Handler},
    FileName, SourceMap,
};
use swc_ecma_parser::{lexer::Lexer, Capturing, Parser, SourceFileInput, Syntax};

fn main() {
    swc_common::GLOBALS.set(&swc_common::Globals::new(), || {
        let cm: Arc<SourceMap> = Default::default();
        let handler = Handler::with_tty_emitter(ColorConfig::Auto, true, false, Some(cm.clone()));

        // Real usage
        // let fm = cm
        //     .load_file(Path::new("test.js"))
        //     .expect("failed to load test.js");

        let fm = cm.new_source_file(
            FileName::Custom("test.js".into()),
            "function foo() {}".into(),
        );

        let lexer = Lexer::new(
            Syntax::Es(Default::default()),
            Default::default(),
            SourceFileInput::from(&*fm),
            None,
        );

        let capturing = Capturing::new(lexer);

        let mut parser = Parser::new_from(capturing);

        for e in parser.take_errors() {
            e.into_diagnostic(&handler).emit();
        }

        let _module = parser
            .parse_module()
            .map_err(|e| e.into_diagnostic(&handler).emit())
            .expect("Failed to parse module.");

        println!("Tokens: {:?}", parser.input().take());
    });
}
