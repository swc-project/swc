#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use swc_common::SourceMap;
    use swc_ecma_ast::*;

    use crate::{
        common::parser::Parser as ParserTrait,
        lexer,
        token::{BinOpToken, Token, TokenAndSpan},
        Capturing, Lexer, Parser, StringInput, Syntax, TsSyntax,
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

    // Reuse the main parser's fixtures for `type` specifier disambiguation.
    #[testing::fixture(
        "../swc_ecma_parser/tests/typescript/custom/type-only/export/type-only-specifier/input.ts"
    )]
    #[testing::fixture(
        "../swc_ecma_parser/tests/typescript/import/type-only-string-specifier/input.ts"
    )]
    fn type_only_specifiers(file: PathBuf) {
        let cm = SourceMap::default();
        let file = cm.load_file(&file).expect("failed to load fixture");
        // Match the TypeScript fixture harness, which disables early errors.
        let syntax = Syntax::Typescript(TsSyntax {
            no_early_errors: true,
            ..Default::default()
        });
        let input = Lexer::new(syntax, Default::default(), StringInput::from(&*file), None);
        let mut parser = Parser::new_from(input.clone());
        let actual = parser.parse_module().expect("specifiers should parse");
        let errors = parser.take_errors();
        assert!(errors.is_empty(), "{errors:?}");

        let mut reference = swc_ecma_parser::Parser::new(syntax, StringInput::from(&*file), None);
        let expected = reference.parse_module().expect("reference should parse");
        assert!(reference.take_errors().is_empty());
        assert_eq!(actual, expected);

        let tokens = lexer(input).expect("public lexer should accept specifiers");
        assert!(!tokens.is_empty());
    }
}
