use swc_common::FileName;
use swc_ecma_parser::{lexer::Lexer, unstable::Capturing, Parser, StringInput, Syntax, TsSyntax};

use super::*;

fn with_cursor(source: &str, test: impl FnOnce(TokenCursor<'_>, BytePos)) {
    testing::run_test(false, |cm, _| {
        let file = cm.new_source_file(FileName::Anon.into(), source.to_owned());
        let lexer = Capturing::new(Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            swc_ecma_ast::EsVersion::latest(),
            StringInput::from(&*file),
            None,
        ));
        let mut parser = Parser::new_from(lexer);
        parser.parse_module().unwrap();
        assert!(parser.take_errors().is_empty());
        let tokens = parser.input_mut().iter_mut().take();
        test(
            TokenCursor::new(source, file.start_pos, &tokens),
            file.start_pos,
        );
        Ok(())
    })
    .unwrap();
}

#[test]
fn range_lookup_skips_trivia_and_respects_direction() {
    let source = "import { A, /* keep */ type B, C } from 'm';";
    with_cursor(source, |cursor, start| {
        let end = start + BytePos(source.len() as u32);
        let forward = cursor.find_forward(start, end, Token::Comma).unwrap();
        let backward = cursor.find_backward(start, end, Token::Comma).unwrap();
        assert_eq!(forward.span.lo - start, BytePos(10));
        assert_eq!(backward.span.lo - start, BytePos(29));
    });
}

#[test]
fn range_endpoints_use_parser_token_boundaries() {
    let source = "type Result = Box<Foo>;";
    with_cursor(source, |cursor, start| {
        let first = cursor
            .first_in_range(start + BytePos(5), start + BytePos(22))
            .unwrap();
        let last = cursor
            .last_in_range(start + BytePos(5), start + BytePos(22))
            .unwrap();
        let text = |token: &TokenAndSpan| {
            &source[(token.span.lo - start).0 as usize..(token.span.hi - start).0 as usize]
        };
        assert_eq!(text(first), "Result");
        assert_eq!(text(last), ">");
    });
}
