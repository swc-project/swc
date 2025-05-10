#[cfg(test)]
mod tests {
    use swc_ecma_ast::*;

    use crate::{
        common::parser::Parser as ParserTrait,
        token::{BinOpToken, Token, TokenAndSpan},
        Capturing, Lexer, Parser, Syntax,
    };

    #[test]
    fn issue_726() {
        crate::with_test_sess(
            "type Test = (
    string | number);",
            |handler, input| {
                let lexer = Lexer::new(
                    Syntax::Typescript(Default::default()),
                    EsVersion::Es2019,
                    input,
                    None,
                );
                let lexer = Capturing::new(lexer);

                let mut parser = Parser::new_from(lexer);
                parser
                    .parse_typescript_module()
                    .map_err(|e| e.into_diagnostic(handler).emit())?;
                let tokens: Vec<TokenAndSpan> = parser.input_mut().iter.tokens().take();
                let tokens = tokens.into_iter().map(|t| t.token).collect::<Vec<_>>();
                assert_eq!(tokens.len(), 9, "Tokens: {tokens:#?}");
                Ok(())
            },
        )
        .unwrap();
    }

    #[test]
    fn issue_751() {
        crate::with_test_sess("t ? -(v >>> 1) : v >>> 1", |handler, input| {
            let lexer = Lexer::new(
                Syntax::Typescript(Default::default()),
                EsVersion::Es2019,
                input,
                None,
            );
            let lexer = Capturing::new(lexer);

            let mut parser = Parser::new_from(lexer);
            parser
                .parse_typescript_module()
                .map_err(|e| e.into_diagnostic(handler).emit())?;
            let tokens: Vec<TokenAndSpan> = parser.input_mut().iter.tokens().take();
            let token = &tokens[10];
            assert_eq!(
                token.token,
                Token::BinOp(BinOpToken::ZeroFillRShift),
                "Token: {:#?}",
                token.token
            );
            Ok(())
        })
        .unwrap();
    }
}
