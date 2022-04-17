#![allow(clippy::needless_update)]

use std::path::PathBuf;

use swc_common::{errors::Handler, input::SourceFileInput, Span, Spanned};
use swc_html_ast::*;
use swc_html_parser::{
    lexer::Lexer,
    parser::{PResult, Parser, ParserConfig},
};
use swc_html_visit::{Visit, VisitWith};
use testing::NormalizedOutput;

pub struct Invalid {
    pub span: Span,
}

fn test_pass(input: PathBuf, config: ParserConfig) {
    testing::run_test2(false, |cm, handler| {
        let ref_json_path = input.parent().unwrap().join("output.json");

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let document: PResult<Document> = parser.parse_document();

        match document {
            Ok(document) => {
                let actual_json = serde_json::to_string_pretty(&document)
                    .map(NormalizedOutput::from)
                    .expect("failed to serialize document");

                actual_json.compare_to_file(&ref_json_path).unwrap();

                Ok(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();

                Err(())
            }
        }
    })
    .unwrap();
}

#[testing::fixture("tests/fixture/**/input.html")]
fn pass(input: PathBuf) {
    test_pass(
        input,
        ParserConfig {
            ..Default::default()
        },
    )
}

struct SpanVisualizer<'a> {
    handler: &'a Handler,
}

macro_rules! mtd {
    ($T:ty,$name:ident) => {
        fn $name(&mut self, n: &$T) {
            self.handler
                .struct_span_err(n.span(), stringify!($T))
                .emit();

            n.visit_children_with(self);
        }
    };
}

impl Visit for SpanVisualizer<'_> {
    mtd!(Document, visit_document);

    fn visit_token_and_span(&mut self, n: &TokenAndSpan) {
        self.handler
            .struct_span_err(n.span, &format!("{:?}", n.token))
            .emit();
    }
}

#[testing::fixture("tests/fixture/**/input.html")]
fn span(input: PathBuf) {
    let dir = input.parent().unwrap().to_path_buf();

    let output = testing::run_test2(false, |cm, handler| {
        // Type annotation
        if false {
            return Ok(());
        }

        let config = ParserConfig {
            ..Default::default()
        };

        let fm = cm.load_file(&input).unwrap();
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);

        let document: PResult<Document> = parser.parse_document();

        match document {
            Ok(document) => {
                document.visit_with(&mut SpanVisualizer { handler: &handler });

                Err(())
            }
            Err(err) => {
                let mut d = err.to_diagnostics(&handler);
                d.note(&format!("current token = {}", parser.dump_cur()));

                d.emit();

                panic!();
            }
        }
    })
    .unwrap_err();

    output
        .compare_to_file(&dir.join("span.rust-debug"))
        .unwrap();
}
