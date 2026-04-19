use std::hint::black_box;

use swc_atoms::atom;
use swc_common::{comments::SingleThreadedComments, BytePos, FileName, SourceMap, DUMMY_SP};
use swc_ecma_ast::EsVersion;
use swc_ecma_visit::assert_eq_ignore_span;

use super::*;
use crate::{
    lexer::{FastToken, FastTokenAndValue, SharedTokenValue, TokenAndSpan, TokenFlags, TokenValue},
    parse_file_as_expr, parse_file_as_module, Context, EsSyntax, SyntaxFlags, TsSyntax,
};

#[derive(Clone)]
struct SharedOnlyTokens {
    ctx: Context,
    tokens: Vec<(TokenAndSpan, Option<SharedTokenValue>)>,
    idx: usize,
    token_value: Option<SharedTokenValue>,
    token_flags: TokenFlags,
    current_token_type: Option<Token>,
}

impl SharedOnlyTokens {
    fn new(tokens: Vec<(TokenAndSpan, Option<TokenValue>)>) -> Self {
        Self {
            ctx: Context::empty(),
            tokens: tokens
                .into_iter()
                .map(|(token, value)| (token, value.map(SharedTokenValue::new)))
                .collect(),
            idx: 0,
            token_value: None,
            token_flags: TokenFlags::default(),
            current_token_type: None,
        }
    }

    fn next_entry(&mut self) -> FastTokenAndValue {
        let Some((token, value)) = self.tokens.get(self.idx).cloned() else {
            return FastTokenAndValue::new(FastToken::new(Token::Eof, DUMMY_SP, false), None);
        };
        self.idx += 1;
        let fast = FastToken::from(token);
        self.token_value = value.clone();
        FastTokenAndValue::new(fast, value)
    }
}

impl crate::input::Tokens for SharedOnlyTokens {
    type Checkpoint = (
        usize,
        Option<SharedTokenValue>,
        Context,
        TokenFlags,
        Option<Token>,
    );

    fn set_ctx(&mut self, ctx: Context) {
        self.ctx = ctx;
    }

    fn ctx(&self) -> Context {
        self.ctx
    }

    fn ctx_mut(&mut self) -> &mut Context {
        &mut self.ctx
    }

    fn syntax(&self) -> SyntaxFlags {
        Syntax::Es(EsSyntax::default()).into_flags()
    }

    fn target(&self) -> EsVersion {
        EsVersion::Es2022
    }

    fn checkpoint_save(&self) -> Self::Checkpoint {
        (
            self.idx,
            self.token_value.clone(),
            self.ctx,
            self.token_flags,
            self.current_token_type,
        )
    }

    fn checkpoint_load(&mut self, checkpoint: Self::Checkpoint) {
        self.idx = checkpoint.0;
        self.token_value = checkpoint.1;
        self.ctx = checkpoint.2;
        self.token_flags = checkpoint.3;
        self.current_token_type = checkpoint.4;
    }

    fn read_string(&self, _: swc_common::Span) -> &str {
        ""
    }

    fn set_expr_allowed(&mut self, _: bool) {}

    fn set_next_regexp(&mut self, _: Option<BytePos>) {}

    fn add_error(&mut self, _: crate::error::Error) {
        panic!("shared-only token stream should not add parser errors")
    }

    fn add_module_mode_error(&mut self, _: crate::error::Error) {
        panic!("shared-only token stream should not add module mode errors")
    }

    fn end_pos(&self) -> BytePos {
        DUMMY_SP.hi
    }

    fn take_errors(&mut self) -> Vec<crate::error::Error> {
        Vec::new()
    }

    fn take_script_module_errors(&mut self) -> Vec<crate::error::Error> {
        Vec::new()
    }

    fn update_token_flags(&mut self, f: impl FnOnce(&mut TokenFlags)) {
        f(&mut self.token_flags);
    }

    fn token_flags(&self) -> TokenFlags {
        self.token_flags
    }

    fn set_current_token_type(&mut self, token: Token) {
        self.current_token_type = Some(token);
    }

    fn clone_token_value(&self) -> Option<TokenValue> {
        self.token_value
            .as_ref()
            .map(|value| value.as_ref().clone())
    }

    fn take_token_value_shared(&mut self) -> Option<SharedTokenValue> {
        self.token_value.take()
    }

    fn take_token_value(&mut self) -> Option<TokenValue> {
        panic!("buffer should use shared token payload handoff")
    }

    fn get_token_value(&self) -> Option<&TokenValue> {
        self.token_value.as_ref().map(SharedTokenValue::as_ref)
    }

    fn set_token_value_shared(&mut self, token_value: Option<SharedTokenValue>) {
        self.token_value = token_value;
    }

    fn set_token_value(&mut self, _: Option<TokenValue>) {
        panic!("buffer should use shared token payload handoff")
    }

    fn first_token(&mut self) -> TokenAndSpan {
        panic!("buffer should use fast token frame handoff")
    }

    fn first_token_fast(&mut self) -> FastTokenAndValue {
        self.next_entry()
    }

    fn next_token(&mut self) -> TokenAndSpan {
        panic!("buffer should use fast token frame handoff")
    }

    fn next_token_fast(&mut self) -> FastTokenAndValue {
        self.next_entry()
    }

    fn scan_jsx_token(&mut self) -> TokenAndSpan {
        panic!("shared-only token stream does not implement JSX token scans")
    }

    fn scan_jsx_open_el_terminal_token(&mut self) -> TokenAndSpan {
        panic!("shared-only token stream does not implement JSX terminal scans")
    }

    fn rescan_jsx_open_el_terminal_token(&mut self, _: BytePos) -> TokenAndSpan {
        panic!("shared-only token stream does not implement JSX terminal rescans")
    }

    fn rescan_jsx_token(&mut self, _: BytePos) -> TokenAndSpan {
        panic!("shared-only token stream does not implement JSX rescans")
    }

    fn scan_jsx_identifier(&mut self, start: BytePos) -> TokenAndSpan {
        let _ = start;
        panic!("buffer should use fast jsx identifier rescans")
    }

    fn scan_jsx_identifier_fast(&mut self, start: BytePos) -> FastTokenAndValue {
        assert_eq!(self.current_token_type, Some(Token::Ident));
        FastTokenAndValue::new(
            FastToken::new(
                Token::JSXName,
                swc_common::Span::new_with_checked(start, start + BytePos(3)),
                false,
            ),
            self.token_value.take(),
        )
    }

    fn scan_jsx_attribute_value(&mut self) -> TokenAndSpan {
        panic!("shared-only token stream does not implement JSX attribute scans")
    }

    fn rescan_template_token(&mut self, _: BytePos, _: bool) -> TokenAndSpan {
        panic!("shared-only token stream does not implement template rescans")
    }
}

fn program(src: &'static str) -> Program {
    test_parser(src, Default::default(), |p| p.parse_program())
}

#[test]
fn peek_preserves_current_token_value() {
    crate::with_test_sess("foo + bar", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2019,
            input,
            None,
        );
        let mut buffer = crate::parser::input::Buffer::new(lexer);
        buffer.first_bump();

        assert_eq!(buffer.cur(), Token::Ident);
        assert_eq!(buffer.peek(), Some(Token::Plus));
        assert_eq!(buffer.expect_word_token_value(), atom!("foo"));

        buffer.bump();
        assert_eq!(buffer.cur(), Token::Plus);

        buffer.bump();
        assert_eq!(buffer.cur(), Token::Ident);
        assert_eq!(buffer.expect_word_token_value(), atom!("bar"));

        Ok(())
    })
    .unwrap();
}

#[test]
fn buffer_uses_shared_payload_handoff_for_first_bump_and_peek() {
    let tokens = vec![
        (
            TokenAndSpan {
                token: Token::Ident,
                had_line_break: false,
                span: swc_common::Span::new_with_checked(BytePos(0), BytePos(3)),
            },
            Some(TokenValue::Word(atom!("foo"))),
        ),
        (
            TokenAndSpan {
                token: Token::Ident,
                had_line_break: true,
                span: swc_common::Span::new_with_checked(BytePos(4), BytePos(7)),
            },
            Some(TokenValue::Word(atom!("bar"))),
        ),
    ];

    let mut buffer = crate::parser::input::Buffer::new(SharedOnlyTokens::new(tokens));
    buffer.first_bump();

    assert_eq!(buffer.cur(), Token::Ident);
    assert_eq!(buffer.expect_word_token_value_ref(), &atom!("foo"));
    assert_eq!(buffer.peek(), Some(Token::Ident));
}

#[test]
fn buffer_uses_shared_payload_handoff_for_jsx_identifier_rescan() {
    let tokens = vec![(
        TokenAndSpan {
            token: Token::Ident,
            had_line_break: false,
            span: swc_common::Span::new_with_checked(BytePos(0), BytePos(3)),
        },
        Some(TokenValue::Word(atom!("foo"))),
    )];

    let mut buffer = crate::parser::input::Buffer::new(SharedOnlyTokens::new(tokens));
    buffer.first_bump();
    buffer.scan_jsx_identifier();

    assert_eq!(buffer.cur(), Token::JSXName);
    let Some(TokenValue::Word(value)) = buffer.get_token_value() else {
        panic!("expected jsx name token value");
    };
    assert_eq!(value, &atom!("foo"));
}

#[test]
fn lexer_token_and_span_path_restores_jsx_identifier_payload() {
    crate::with_test_sess("foo", |_, input| {
        let mut lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2022,
            input,
            None,
        );

        let first = crate::input::Tokens::first_token(&mut lexer);
        assert_eq!(first.token, Token::Ident);

        let value = crate::input::Tokens::take_token_value_shared(&mut lexer)
            .expect("identifier payload should exist");
        crate::input::Tokens::set_current_token_type(&mut lexer, first.token);
        crate::input::Tokens::set_token_value_shared(&mut lexer, Some(value));

        let jsx_name = crate::input::Tokens::scan_jsx_identifier(&mut lexer, first.span.lo);
        assert_eq!(jsx_name.token, Token::JSXName);
        let Some(TokenValue::Word(value)) = crate::input::Tokens::get_token_value(&lexer) else {
            panic!("expected jsx name token value on legacy path");
        };
        assert_eq!(value, &atom!("foo"));

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn try_parse_ts_rolls_back_cursor_and_ignore_error_context() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);

        assert!(!parser.ctx().contains(Context::IgnoreError));

        let result = parser.try_parse_ts(|p| {
            assert!(p.ctx().contains(Context::IgnoreError));
            p.bump();
            Ok(None::<()>)
        });

        assert!(result.is_none());
        assert_eq!(parser.input().cur(), Token::Ident);
        assert!(!parser.ctx().contains(Context::IgnoreError));

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn try_parse_ts_rolls_back_parser_state_and_module_marker() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let trailing_comma = swc_common::Span::new_with_checked(BytePos(1), BytePos(2));

        parser.state_mut().labels.push(atom!("outer"));
        parser.state_mut().potential_arrow_start = Some(BytePos(10));
        parser
            .state_mut()
            .trailing_commas
            .insert(BytePos(10), trailing_comma);

        let result = parser.try_parse_ts(|p| {
            p.state_mut().labels.push(atom!("inner"));
            p.state_mut().potential_arrow_start = Some(BytePos(20));
            p.state_mut().trailing_commas.insert(
                BytePos(20),
                swc_common::Span::new_with_checked(BytePos(3), BytePos(4)),
            );
            p.mark_found_module_item();
            Ok(None::<()>)
        });

        assert!(result.is_none());
        assert_eq!(&parser.state().labels[..], &[atom!("outer")]);
        assert_eq!(parser.state().potential_arrow_start, Some(BytePos(10)));
        assert_eq!(parser.state().trailing_commas.len(), 1);
        assert_eq!(
            parser.state().trailing_commas.get(&BytePos(10)),
            Some(&trailing_comma)
        );
        assert!(!parser.found_module_item);

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn try_parse_ts_commits_success_without_leaking_ignore_error_context() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let result = parser.try_parse_ts(|p| {
            assert!(p.ctx().contains(Context::IgnoreError));
            p.bump();
            Ok(Some(()))
        });

        assert!(result.is_some());
        assert_eq!(parser.input().cur(), Token::Eof);
        assert!(!parser.ctx().contains(Context::IgnoreError));

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn try_parse_ts_commits_parser_state_on_success() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let trailing_comma = swc_common::Span::new_with_checked(BytePos(5), BytePos(6));

        let result = parser.try_parse_ts(|p| {
            p.state_mut().labels.push(atom!("inner"));
            p.state_mut().potential_arrow_start = Some(BytePos(30));
            p.state_mut()
                .trailing_commas
                .insert(BytePos(30), trailing_comma);
            p.mark_found_module_item();
            Ok(Some(()))
        });

        assert!(result.is_some());
        assert_eq!(&parser.state().labels[..], &[atom!("inner")]);
        assert_eq!(parser.state().potential_arrow_start, Some(BytePos(30)));
        assert_eq!(
            parser.state().trailing_commas.get(&BytePos(30)),
            Some(&trailing_comma)
        );
        assert!(parser.found_module_item);

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn ts_look_ahead_restores_cursor_and_ignore_error_context() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);

        let saw_eof = parser.ts_look_ahead(|p| {
            assert!(p.ctx().contains(Context::IgnoreError));
            p.bump();
            p.input().cur() == Token::Eof
        });

        assert!(saw_eof);
        assert_eq!(parser.input().cur(), Token::Ident);
        assert!(!parser.ctx().contains(Context::IgnoreError));

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn ts_modifier_fast_lookahead_preserves_semantics_without_bumping() {
    for (src, expected_next, expected) in [
        ("readonly foo", Token::Ident, true),
        ("readonly\nfoo", Token::Ident, true),
        ("readonly [foo]", Token::LBracket, true),
        ("readonly\n[foo]", Token::LBracket, false),
        ("readonly", Token::Eof, false),
    ] {
        crate::with_test_sess(src, |_, input| {
            let lexer = crate::lexer::Lexer::new(
                Syntax::Typescript(TsSyntax::default()),
                EsVersion::Es2022,
                input,
                None,
            );
            let mut parser = Parser::new_from(lexer);

            assert_eq!(parser.input().cur(), Token::Readonly);

            let result = parser.ts_next_token_can_follow_modifier_fast();

            assert_eq!(result, expected, "source: {src}");
            assert_eq!(parser.input().cur(), Token::Readonly);
            assert_eq!(parser.input_mut().peek(), Some(expected_next));

            Ok(())
        })
        .unwrap();
    }
}

#[cfg(feature = "typescript")]
#[test]
fn token_look_ahead_restores_cursor_and_lexer_context() {
    crate::with_test_sess("in foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);

        parser.state_mut().labels.push(atom!("outer"));
        let original_ctx = parser.ctx();
        let original_token = parser.input().cur();

        let saw_ident = parser.token_look_ahead(|p| {
            p.bump();
            p.set_ctx(p.ctx() | Context::IgnoreError);
            p.input().cur() == Token::Ident
        });

        assert!(saw_ident);
        assert_eq!(parser.input().cur(), original_token);
        assert_eq!(parser.ctx().bits(), original_ctx.bits());
        assert_eq!(&parser.state().labels[..], &[atom!("outer")]);

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "typescript")]
#[test]
fn parser_checkpoint_shares_state_storage_until_mutation() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Typescript(TsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut parser = Parser::new_from(lexer);
        let original_trailing_comma = swc_common::Span::new_with_checked(BytePos(1), BytePos(2));

        parser.state_mut().labels.push(atom!("outer"));
        parser.state_mut().potential_arrow_start = Some(BytePos(10));
        parser
            .state_mut()
            .trailing_commas
            .insert(BytePos(10), original_trailing_comma);

        assert_eq!(parser.state().labels_ref_count(), 1);
        assert_eq!(parser.state().trailing_commas_ref_count(), 1);

        let checkpoint = parser.checkpoint_save();

        assert_eq!(parser.state().labels_ref_count(), 2);
        assert_eq!(parser.state().trailing_commas_ref_count(), 2);
        assert_eq!(checkpoint.state.labels_ref_count(), 2);
        assert_eq!(checkpoint.state.trailing_commas_ref_count(), 2);

        parser.state_mut().labels.push(atom!("inner"));
        parser.state_mut().potential_arrow_start = Some(BytePos(20));
        parser.state_mut().trailing_commas.insert(
            BytePos(20),
            swc_common::Span::new_with_checked(BytePos(3), BytePos(4)),
        );

        assert_eq!(parser.state().labels_ref_count(), 1);
        assert_eq!(parser.state().trailing_commas_ref_count(), 1);
        assert_eq!(checkpoint.state.labels_ref_count(), 1);
        assert_eq!(checkpoint.state.trailing_commas_ref_count(), 1);
        assert_eq!(
            &parser.state().labels[..],
            &[atom!("outer"), atom!("inner")]
        );
        assert_eq!(&checkpoint.state.labels[..], &[atom!("outer")]);

        parser.checkpoint_load(checkpoint);

        assert_eq!(&parser.state().labels[..], &[atom!("outer")]);
        assert_eq!(parser.state().potential_arrow_start, Some(BytePos(10)));
        assert_eq!(
            parser.state().trailing_commas.get(&BytePos(10)),
            Some(&original_trailing_comma)
        );
        assert_eq!(parser.state().labels_ref_count(), 1);
        assert_eq!(parser.state().trailing_commas_ref_count(), 1);

        Ok(())
    })
    .unwrap();
}

#[cfg(feature = "unstable")]
#[test]
fn capturing_uses_fast_token_frame_handoff() {
    let tokens = vec![
        (
            TokenAndSpan {
                token: Token::Ident,
                had_line_break: false,
                span: swc_common::Span::new_with_checked(BytePos(0), BytePos(3)),
            },
            Some(TokenValue::Word(atom!("foo"))),
        ),
        (
            TokenAndSpan {
                token: Token::Ident,
                had_line_break: true,
                span: swc_common::Span::new_with_checked(BytePos(4), BytePos(7)),
            },
            Some(TokenValue::Word(atom!("bar"))),
        ),
    ];

    let mut buffer = crate::parser::input::Buffer::new(crate::lexer::capturing::Capturing::new(
        SharedOnlyTokens::new(tokens),
    ));
    buffer.first_bump();

    assert_eq!(buffer.cur(), Token::Ident);
    assert_eq!(buffer.peek(), Some(Token::Ident));
    assert_eq!(buffer.expect_word_token_value_ref(), &atom!("foo"));

    let captured = buffer.iter().tokens();
    assert_eq!(captured.len(), 2);
    assert_eq!(captured[0].token, Token::Ident);
    assert_eq!(captured[1].token, Token::Ident);
}

#[cfg(feature = "unstable")]
#[test]
fn capturing_legacy_first_token_restores_payload() {
    crate::with_test_sess("identifier", |_, input| {
        let mut lexer = crate::lexer::capturing::Capturing::new(crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        ));

        let first = crate::input::Tokens::first_token(&mut lexer);
        assert_eq!(first.token, Token::Ident);

        let Some(TokenValue::Word(value)) = crate::input::Tokens::get_token_value(&lexer) else {
            panic!("expected identifier payload on capturing legacy path");
        };
        assert_eq!(value, &atom!("identifier"));
        assert_eq!(lexer.tokens().len(), 1);
        assert_eq!(lexer.tokens()[0].token, Token::Ident);

        Ok(())
    })
    .unwrap();
}

#[test]
fn buffer_checkpoint_restores_cur_and_peek_values() {
    crate::with_test_sess("foo + bar", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2019,
            input,
            None,
        );
        let mut buffer = crate::parser::input::Buffer::new(lexer);
        buffer.first_bump();
        assert_eq!(buffer.peek(), Some(Token::Plus));

        let checkpoint = buffer.checkpoint_save();

        assert_eq!(buffer.expect_word_token_value(), atom!("foo"));
        buffer.bump();
        assert_eq!(buffer.cur(), Token::Plus);
        buffer.bump();
        assert_eq!(buffer.expect_word_token_value(), atom!("bar"));

        buffer.checkpoint_load(checkpoint);
        assert_eq!(buffer.cur(), Token::Ident);
        let Some(crate::lexer::TokenValue::Word(value)) = buffer.get_token_value() else {
            panic!("expected restored word token value");
        };
        assert_eq!(value, &atom!("foo"));
        assert_eq!(buffer.peek(), Some(Token::Plus));

        Ok(())
    })
    .unwrap();
}

#[test]
fn buffer_checkpoint_shares_token_payload_storage() {
    crate::with_test_sess("foo + bar", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2019,
            input,
            None,
        );
        let mut buffer = crate::parser::input::Buffer::new(lexer);
        buffer.first_bump();
        assert_eq!(buffer.peek(), Some(Token::Plus));
        assert_eq!(buffer.cur_value_ref_count(), Some(1));
        assert_eq!(buffer.next_value_ref_count(), None);

        let checkpoint = buffer.checkpoint_save();
        assert_eq!(buffer.cur_value_ref_count(), Some(2));
        assert_eq!(buffer.next_value_ref_count(), None);

        drop(checkpoint);
        assert_eq!(buffer.cur_value_ref_count(), Some(1));

        Ok(())
    })
    .unwrap();
}

#[test]
fn lexer_checkpoint_shares_token_payload_storage() {
    crate::with_test_sess("identifier", |_, input| {
        let mut lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax::default()),
            EsVersion::Es2022,
            input,
            None,
        );

        let first = crate::input::Tokens::first_token(&mut lexer);
        assert_eq!(first.token, Token::Ident);
        assert_eq!(lexer.token_value_ref_count(), Some(1));

        let checkpoint = crate::input::Tokens::checkpoint_save(&lexer);
        assert_eq!(lexer.token_value_ref_count(), Some(2));

        drop(checkpoint);
        assert_eq!(lexer.token_value_ref_count(), Some(1));

        Ok(())
    })
    .unwrap();
}

#[test]
fn jsx_identifier_rescan_reuses_existing_payload_handle() {
    crate::with_test_sess("foo", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut buffer = crate::parser::input::Buffer::new(lexer);
        buffer.first_bump();

        let before = buffer
            .clone_cur_value_handle()
            .expect("identifier payload should exist");
        buffer.scan_jsx_identifier();
        let after = buffer
            .clone_cur_value_handle()
            .expect("jsx name payload should exist");

        assert_eq!(buffer.cur(), Token::JSXName);
        assert!(before.ptr_eq(&after));
        let Some(TokenValue::Word(value)) = buffer.get_token_value() else {
            panic!("expected jsx name token value");
        };
        assert_eq!(value, &atom!("foo"));

        Ok(())
    })
    .unwrap();
}

#[test]
fn jsx_identifier_rescan_keeps_shared_prefix_handle_when_extending_name() {
    crate::with_test_sess("foo-bar", |_, input| {
        let lexer = crate::lexer::Lexer::new(
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            EsVersion::Es2022,
            input,
            None,
        );
        let mut buffer = crate::parser::input::Buffer::new(lexer);
        buffer.first_bump();

        let prefix = buffer
            .clone_cur_value_handle()
            .expect("identifier payload should exist");
        buffer.scan_jsx_identifier();

        assert_eq!(prefix.strong_count(), 1);
        let TokenValue::Word(prefix_value) = prefix.as_ref() else {
            panic!("expected shared prefix payload to remain accessible");
        };
        assert_eq!(prefix_value, &atom!("foo"));
        assert_eq!(buffer.cur(), Token::JSXName);
        let Some(TokenValue::Word(value)) = buffer.get_token_value() else {
            panic!("expected jsx name token value");
        };
        assert_eq!(value, &atom!("foo-bar"));

        Ok(())
    })
    .unwrap();
}

#[test]
fn parse_file_as_module_collects_comments_in_fast_path() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(
        FileName::Anon.into(),
        "// leading\nexport const answer = 42;\n".to_string(),
    );
    let comments = SingleThreadedComments::default();
    let mut errors = Vec::new();

    let module = parse_file_as_module(
        &fm,
        Syntax::Es(EsSyntax::default()),
        EsVersion::Es2022,
        Some(&comments),
        &mut errors,
    )
    .expect("module should parse");

    assert_eq!(module.body.len(), 1);
    assert!(errors.is_empty());

    let (leading, trailing) = comments.take_all();
    let leading = leading.borrow();
    assert!(leading
        .values()
        .flatten()
        .any(|comment| comment.text.trim() == "leading"));
    assert!(trailing.borrow().is_empty());
}

#[cfg(feature = "unstable")]
#[test]
fn capturing_tracks_tokens_through_jsx_relex() {
    crate::with_test_sess(
        "export const view = <Foo bar=\"baz\">{value as string}</Foo>;",
        |_, input| {
            let lexer = crate::lexer::capturing::Capturing::new(crate::lexer::Lexer::new(
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    ..Default::default()
                }),
                EsVersion::Es2022,
                input,
                None,
            ));
            let mut parser = Parser::new_from(lexer);

            parser.parse_module().expect("module should parse");
            let tokens = parser.input_mut().iter_mut().take();

            assert!(parser.take_errors().is_empty());
            assert!(tokens.iter().any(|token| token.token == Token::JSXTagStart));
            assert!(tokens.iter().any(|token| token.token == Token::JSXTagEnd));
            assert!(tokens.iter().any(|token| token.token == Token::JSXName));

            Ok(())
        },
    )
    .unwrap();
}

/// Assert that Parser.parse_program returns [Program::Module].
fn module(src: &'static str) -> Module {
    program(src).expect_module()
}

/// Assert that Parser.parse_program returns [Program::Script].
fn script(src: &'static str) -> Script {
    program(src).expect_script()
}

/// Assert that Parser.parse_program returns [Program::Module] and has errors.
#[track_caller]
fn assert_module_error(src: &'static str) -> Module {
    test_parser(src, Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_ne!(errors, Vec::new());

        let module = program.expect_module();

        Ok(module)
    })
}

#[test]
fn parse_program_module_01() {
    module("import 'foo';");
    module("export const a = 1;");
}

#[test]
fn parse_program_script_01() {
    script("let a = 5;");
    script("function foo() {}");
    script("const a = 00176;");
}

#[test]
fn parse_program_module_02() {
    module(
        "
        function foo() {}
        export default foo;
        ",
    );
    module(
        "
        export function foo() {}
        export default foo;
        ",
    );
}

#[test]
fn parse_program_module_error_01() {
    assert_module_error(
        "
        const a = 01234;
        export default a;
        ",
    );
}

#[test]
fn issue_1813() {
    test_parser(
        "\\u{cccccccccsccccccQcXt[uc(~).const[uctor().const[uctor())tbr())",
        Default::default(),
        |p| {
            p.parse_program().expect_err("should fail");

            Ok(())
        },
    )
}

#[test]
fn parse_module_export_named_span() {
    let m = module("export function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(ExportDecl { span, .. })) = &m.body[0] {
        assert_eq!(span.lo, BytePos(1));
    } else {
        panic!("expected ExportDecl");
    }
}

#[test]
fn parse_module_export_default_fn_span() {
    let m = module("export default function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(33));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_async_fn_span() {
    let m = module("export default async function foo() {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(39));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn parse_module_export_default_class_span() {
    let m = module("export default class Foo {}");
    if let ModuleItem::ModuleDecl(ModuleDecl::ExportDefaultDecl(ExportDefaultDecl {
        span, ..
    })) = &m.body[0]
    {
        assert_eq!(span.lo, BytePos(1));
        assert_eq!(span.hi, BytePos(28));
    } else {
        panic!("expected ExportDefaultDecl");
    }
}

#[test]
fn issue_1878() {
    // file with only comments should have the comments
    // in the leading map instead of the trailing
    {
        let c = SingleThreadedComments::default();
        let s = "
            // test
        ";
        let _ = super::test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(trailing.borrow().is_empty());
        assert_eq!(leading.borrow().len(), 1);
        assert!(leading.borrow().get(&BytePos(1)).is_some());
    }

    // file with shebang and comments should still work with the comments trailing
    // the shebang
    {
        let c = SingleThreadedComments::default();
        let s = "#!/foo/bar
            // test
        ";
        let _ = super::test_parser_comment(&c, s, Syntax::Typescript(Default::default()), |p| {
            p.parse_typescript_module()
        });

        let (leading, trailing) = c.take_all();
        assert!(leading.borrow().is_empty());
        assert_eq!(trailing.borrow().len(), 1);
        assert!(trailing.borrow().get(&BytePos(11)).is_some());
    }
}

#[test]
fn issue_2264_1() {
    let c = SingleThreadedComments::default();
    let s = "
        const t = <Switch>
            // 1
            /* 2 */
        </Switch>
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (_leading, trailing) = c.take_all();
    // assert!(leading.borrow().is_empty());
    assert!(trailing.borrow().is_empty());
}

#[test]
fn issue_2264_2() {
    let c = SingleThreadedComments::default();
    let s = "
        const t = <Switch>
            // 1
            /* 2 */
        </Switch>
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Es(EsSyntax {
            jsx: true,
            ..Default::default()
        }),
        |p| p.parse_module(),
    );

    let (leading, trailing) = c.take_all();
    assert!(leading.borrow().is_empty());
    assert!(trailing.borrow().is_empty());
}

#[test]
fn should_only_has_one_block_comment() {
    let c = SingleThreadedComments::default();
    let s = "
/** block comment */
import h from 'h';
<div></div>
";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (leading, trailing) = c.take_all();

    assert!(!leading.borrow().is_empty());
    for leading in leading.borrow().values() {
        assert_eq!(leading.len(), 1);
    }
    assert!(trailing.borrow().is_empty());
}

#[test]
fn issue_2264_3() {
    let c = SingleThreadedComments::default();
    let s = "const foo = <h1>/* no */{/* 1 */ bar /* 2 */}/* no */</h1>;";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (leading, trailing) = c.take_all();

    assert!(leading.borrow().is_empty());
    assert_eq!(trailing.borrow().len(), 2);
    assert_eq!(trailing.borrow().get(&BytePos(26)).unwrap().len(), 1);
    assert_eq!(trailing.borrow().get(&BytePos(37)).unwrap().len(), 1);
}

#[test]
fn issue_2339_1() {
    let c = SingleThreadedComments::default();
    // Use `<T,>` instead of `<T>` because `<T>` is ambiguous with JSX in TSX mode
    let s = "
        const t = <T,>() => {
            // 1
            /* 2 */
            test;
        };
    ";
    let _ = super::test_parser_comment(
        &c,
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );

    let (leading, trailing) = c.take_all();
    assert_eq!(leading.borrow().len(), 1);
    // Adjusted byte position due to trailing comma in `<T,>`
    assert_eq!(leading.borrow().get(&BytePos(81)).unwrap().len(), 2);
    assert!(trailing.borrow().is_empty());
}

/// Test that `<T>() => {}` is invalid in TSX mode (issue #10598)
/// TypeScript treats `<T>` as JSX in .tsx files, so this syntax should fail.
#[test]
fn issue_10598() {
    // In TSX mode, `<T>() => {}` should fail because `<T>` looks like JSX
    let s = "const t = <T>() => { test; };";
    let result = std::panic::catch_unwind(|| {
        test_parser(
            s,
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            |p| p.parse_typescript_module(),
        )
    });
    // The parsing should fail (panic in test_parser or return an error)
    assert!(
        result.is_err(),
        "Expected parsing to fail for <T>() => {{}} in TSX mode"
    );
}

/// Verify that `<T,>() => {}` is valid in TSX mode (workaround syntax)
#[test]
fn issue_10598_valid_tsx_syntax() {
    // `<T,>` with trailing comma is unambiguous and should parse successfully
    let s = "const t = <T,>() => { test; };";
    test_parser(
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );
}

/// Verify that `<T extends unknown>() => {}` is valid in TSX mode
#[test]
fn issue_10598_valid_tsx_syntax_with_constraint() {
    // `<T extends unknown>` is unambiguous and should parse successfully
    let s = "const t = <T extends unknown>() => { test; };";
    test_parser(
        s,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );
}

/// Verify that `<T>() => {}` is still valid in non-TSX TypeScript mode
#[test]
fn issue_10598_valid_non_tsx() {
    // In regular .ts mode (not TSX), `<T>() => {}` should work
    let s = "const t = <T>() => { test; };";
    test_parser(
        s,
        Syntax::Typescript(TsSyntax {
            tsx: false,
            ..Default::default()
        }),
        |p| p.parse_typescript_module(),
    );
}

#[test]
fn issue_2853_1() {
    test_parser("const a = \"\\0a\";", Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_eq!(errors, Vec::new());
        assert_eq!(errors, Vec::new());

        Ok(program)
    });
}

#[test]
fn issue_2853_2() {
    test_parser("const a = \"\u{0000}a\";", Default::default(), |p| {
        let program = p.parse_program()?;

        let errors = p.take_errors();
        assert_eq!(errors, Vec::new());

        Ok(program)
    });
}

#[test]
fn illegal_language_mode_directive1() {
    test_parser(
        r#"function f(a = 0) { "use strict"; }"#,
        Default::default(),
        |p| {
            let program = p.parse_program()?;

            let errors = p.take_errors();
            assert_eq!(
                errors,
                vec![Error::new(
                    Span {
                        lo: BytePos(21),
                        hi: BytePos(34),
                    },
                    SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn illegal_language_mode_directive2() {
    test_parser(
        r#"let f = (a = 0) => { "use strict"; }"#,
        Default::default(),
        |p| {
            let program = p.parse_program()?;

            let errors = p.take_errors();
            assert_eq!(
                errors,
                vec![Error::new(
                    Span {
                        lo: BytePos(22),
                        hi: BytePos(35),
                    },
                    SyntaxError::IllegalLanguageModeDirective
                )]
            );

            Ok(program)
        },
    );
}

#[test]
fn parse_non_strict_for_loop() {
    script("for (var v1 = 1 in v3) {}");
}

#[test]
fn parse_program_take_script_module_errors() {
    test_parser(r#"077;"#, Default::default(), |p| {
        let program = p.parse_program()?;

        assert_eq!(p.take_errors(), vec![]);
        // will contain the script's potential module errors
        assert_eq!(
            p.take_script_module_errors(),
            vec![Error::new(
                Span {
                    lo: BytePos(1),
                    hi: BytePos(4),
                },
                SyntaxError::LegacyOctal
            )]
        );

        Ok(program)
    });
}

#[test]
fn parse_module_merges_deferred_errors_in_source_order() {
    test_parser(
        r#"077; export const a = 1; with (foo) {}"#,
        Default::default(),
        |p| {
            let module = p.parse_module()?;

            let errors = p.take_errors();
            assert_eq!(errors.len(), 2);
            assert_eq!(errors[0].kind(), &SyntaxError::LegacyOctal);
            assert_eq!(errors[1].kind(), &SyntaxError::WithInStrict);
            assert!(errors[0].span().lo < errors[1].span().lo);

            Ok(module)
        },
    );
}

fn syntax() -> Syntax {
    Syntax::Es(EsSyntax {
        allow_super_outside_method: true,
        ..Default::default()
    })
}

fn lhs(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| p.parse_lhs_expr())
}

fn new_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| p.parse_new_expr())
}

fn member_expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| p.parse_member_expr())
}

fn expr(s: &'static str) -> Box<Expr> {
    test_parser(s, syntax(), |p| {
        p.parse_stmt().map(|stmt| match stmt {
            Stmt::Expr(expr) => expr.expr,
            _ => unreachable!(),
        })
    })
}
fn regex_expr() -> Box<Expr> {
    AssignExpr {
        span: DUMMY_SP,
        left: Ident::new_no_ctxt(atom!("re"), DUMMY_SP).into(),
        op: AssignOp::Assign,
        right: Box::new(
            Lit::Regex(Regex {
                span: DUMMY_SP,
                exp: atom!("w+"),
                flags: atom!(""),
            })
            .into(),
        ),
    }
    .into()
}

fn bin(s: &'static str) -> Box<Expr> {
    test_parser(s, Syntax::default(), |p| p.parse_bin_expr())
}

#[test]
fn simple() {
    assert_eq_ignore_span!(
        bin("5 + 4 * 7"),
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: op!(bin, "+"),
            left: bin("5"),
            right: bin("4 * 7"),
        }))
    );
}

#[test]
fn same_prec() {
    assert_eq_ignore_span!(
        bin("5 + 4 + 7"),
        Box::new(Expr::Bin(BinExpr {
            span: DUMMY_SP,
            op: op!(bin, "+"),
            left: bin("5 + 4"),
            right: bin("7"),
        }))
    );
}

#[test]
fn regex_single_line_comment() {
    assert_eq_ignore_span!(
        expr(
            r#"re = // ...
            /w+/"#
        ),
        regex_expr()
    )
}

#[test]
fn regex_multi_line_comment() {
    assert_eq_ignore_span!(expr(r#"re = /* ... *//w+/"#), regex_expr())
}
#[test]
fn regex_multi_line_comment_with_lines() {
    assert_eq_ignore_span!(
        expr(
            r#"re =
            /*
             ...
             */
             /w+/"#
        ),
        regex_expr()
    )
}

#[test]
fn arrow_assign() {
    assert_eq_ignore_span!(
        expr("a = b => false"),
        Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            left: Ident::new_no_ctxt(atom!("a"), DUMMY_SP).into(),
            op: op!("="),
            right: expr("b => false"),
        }))
    );
}

#[test]
fn async_call() {
    assert_eq_ignore_span!(
        expr("async()"),
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(expr("async")),
            args: Vec::new(),
            ..Default::default()
        }))
    );
}

#[test]
fn async_arrow() {
    assert_eq_ignore_span!(
        expr("async () => foo"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            is_async: true,
            is_generator: false,
            params: Vec::new(),
            body: Box::new(BlockStmtOrExpr::Expr(expr("foo"))),
            ..Default::default()
        }))
    );
}

#[test]
fn object_rest_pat() {
    assert_eq_ignore_span!(
        expr("({ ...a34 }) => {}"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Object(ObjectPat {
                span: DUMMY_SP,
                optional: false,
                props: vec![ObjectPatProp::Rest(RestPat {
                    span: DUMMY_SP,
                    dot3_token: DUMMY_SP,
                    arg: Box::new(Pat::Ident(
                        Ident::new_no_ctxt(atom!("a34"), DUMMY_SP).into()
                    )),
                    type_ann: None,
                })],
                type_ann: None
            })],
            body: Box::new(BlockStmtOrExpr::BlockStmt(BlockStmt {
                span: DUMMY_SP,
                ..Default::default()
            })),
            ..Default::default()
        }))
    );
}

#[test]
fn object_spread() {
    assert_eq_ignore_span!(
        expr("foo = {a, ...bar, b}"),
        Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            left: Ident::new_no_ctxt(atom!("foo"), DUMMY_SP).into(),
            op: op!("="),
            right: Box::new(Expr::Object(ObjectLit {
                span: DUMMY_SP,
                props: vec![
                    PropOrSpread::Prop(Box::new(Ident::new_no_ctxt(atom!("a"), DUMMY_SP).into())),
                    PropOrSpread::Spread(SpreadElement {
                        dot3_token: DUMMY_SP,
                        expr: Box::new(Expr::Ident(Ident::new_no_ctxt(atom!("bar"), DUMMY_SP))),
                    }),
                    PropOrSpread::Prop(Box::new(Ident::new_no_ctxt(atom!("b"), DUMMY_SP).into())),
                ]
            }))
        }))
    );
}

#[test]
fn new_expr_should_not_eat_too_much() {
    assert_eq_ignore_span!(
        new_expr("new Date().toString()"),
        Box::new(Expr::Member(MemberExpr {
            span: DUMMY_SP,
            obj: member_expr("new Date()"),
            prop: MemberProp::Ident(IdentName::new(atom!("toString"), DUMMY_SP)),
        }))
    );
}
#[test]
fn lhs_expr_as_new_expr_prod() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()"),
        Box::new(Expr::New(NewExpr {
            span: DUMMY_SP,
            callee: lhs("Date.toString"),
            args: Some(Vec::new()),
            ..Default::default()
        }))
    );
}

#[test]
fn lhs_expr_as_call() {
    assert_eq_ignore_span!(
        lhs("new Date.toString()()"),
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(lhs("new Date.toString()")),
            args: Vec::new(),
            ..Default::default()
        }))
    )
}

#[test]
fn arrow_fn_no_args() {
    assert_eq_ignore_span!(
        expr("() => 1"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            params: Vec::new(),
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn() {
    assert_eq_ignore_span!(
        expr("(a) => 1"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Ident(Ident::new_no_ctxt(atom!("a"), DUMMY_SP).into())],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn_rest() {
    assert_eq_ignore_span!(
        expr("(...a) => 1"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            is_async: false,
            is_generator: false,
            params: vec![Pat::Rest(RestPat {
                span: DUMMY_SP,
                dot3_token: DUMMY_SP,
                arg: Box::new(Pat::Ident(Ident::new_no_ctxt(atom!("a"), DUMMY_SP).into())),
                type_ann: None
            })],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),

            ..Default::default()
        }))
    );
}
#[test]
fn arrow_fn_no_paren() {
    assert_eq_ignore_span!(
        expr("a => 1"),
        Box::new(Expr::Arrow(ArrowExpr {
            span: DUMMY_SP,
            params: vec![Pat::Ident(Ident::new_no_ctxt(atom!("a"), DUMMY_SP).into())],
            body: Box::new(BlockStmtOrExpr::Expr(expr("1"))),
            ..Default::default()
        }))
    );
}

#[test]
fn new_no_paren() {
    assert_eq_ignore_span!(
        expr("new a"),
        Box::new(Expr::New(NewExpr {
            span: DUMMY_SP,
            callee: expr("a"),
            args: None,
            ..Default::default()
        }))
    );
}

#[test]
fn new_new_no_paren() {
    assert_eq_ignore_span!(
        expr("new new a"),
        Box::new(Expr::New(NewExpr {
            span: DUMMY_SP,
            callee: expr("new a"),
            args: None,
            ..Default::default()
        }))
    );
}

#[test]
fn array_lit() {
    assert_eq_ignore_span!(
        expr("[a,,,,, ...d,, e]"),
        Box::new(Expr::Array(ArrayLit {
            span: DUMMY_SP,
            elems: vec![
                Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Ident(Ident::new_no_ctxt(atom!("a"), DUMMY_SP))),
                }),
                None,
                None,
                None,
                None,
                Some(ExprOrSpread {
                    spread: Some(DUMMY_SP),
                    expr: Box::new(Expr::Ident(Ident::new_no_ctxt(atom!("d"), DUMMY_SP))),
                }),
                None,
                Some(ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Ident(Ident::new_no_ctxt(atom!("e"), DUMMY_SP))),
                }),
            ]
        }))
    );
}

#[test]
fn max_integer() {
    assert_eq_ignore_span!(
        expr("1.7976931348623157e+308"),
        Box::new(Expr::Lit(Lit::Num(Number {
            span: DUMMY_SP,
            value: 1.797_693_134_862_315_7e308,
            raw: Some(atom!("1.7976931348623157e+308")),
        })))
    )
}

#[test]
fn iife() {
    assert_eq_ignore_span!(
        expr("(function(){})()"),
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(expr("(function(){})")),
            args: Vec::new(),
            ..Default::default()
        }))
    )
}

#[test]
fn issue_319_1() {
    assert_eq_ignore_span!(
        expr("obj(({ async f() { await g(); } }));"),
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(expr("obj")),
            args: vec![ExprOrSpread {
                spread: None,
                expr: expr("({ async f() { await g(); } })"),
            }],
            ..Default::default()
        }))
    );
}

#[test]
fn issue_328() {
    assert_eq_ignore_span!(
        test_parser("import('test')", Syntax::Es(Default::default()), |p| {
            p.parse_stmt()
        }),
        Stmt::Expr(ExprStmt {
            span: DUMMY_SP,
            expr: Box::new(Expr::Call(CallExpr {
                span: DUMMY_SP,
                callee: Callee::Import(Import {
                    span: DUMMY_SP,
                    phase: Default::default()
                }),
                args: vec![ExprOrSpread {
                    spread: None,
                    expr: Box::new(Expr::Lit(Lit::Str(Str {
                        span: DUMMY_SP,
                        value: atom!("test").into(),
                        raw: Some(atom!("'test'")),
                    }))),
                }],
                ..Default::default()
            }))
        })
    );
}

#[test]
fn issue_337() {
    test_parser(
        "const foo = 'bar' in bas ? 'beep' : 'boop';",
        Default::default(),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_350() {
    assert_eq_ignore_span!(
        expr(
            r#""ok\
ok\
hehe.";"#,
        ),
        Box::new(Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value: atom!("okokhehe.").into(),
            raw: Some(atom!("\"ok\\\nok\\\nhehe.\"")),
        })))
    );
}

#[test]
fn issue_380() {
    expr(
        " import('../foo/bar')
    .then(bar => {
        // bar should be {default: DEFAULT_EXPORTED_THING_IN_BAR} or at least what it is supposed \
         to be
    })
}",
    );
}

#[test]
fn issue_675() {
    expr("fn = function () { Object.setPrototypeOf(this, new.target.prototype); }");
}

#[test]
fn super_expr() {
    assert_eq_ignore_span!(
        expr("super.foo();"),
        Box::new(Expr::Call(CallExpr {
            span: DUMMY_SP,
            callee: Callee::Expr(Box::new(Expr::SuperProp(SuperPropExpr {
                span: DUMMY_SP,
                obj: Super { span: DUMMY_SP },
                prop: SuperProp::Ident(IdentName {
                    span: DUMMY_SP,
                    sym: atom!("foo"),
                })
            }))),
            ..Default::default()
        }))
    );
}

#[test]
fn super_expr_computed() {
    assert_eq_ignore_span!(
        expr("super[a] ??= 123;"),
        Box::new(Expr::Assign(AssignExpr {
            span: DUMMY_SP,
            op: AssignOp::NullishAssign,
            left: SuperPropExpr {
                span: DUMMY_SP,
                obj: Super { span: DUMMY_SP },
                prop: SuperProp::Computed(ComputedPropName {
                    span: DUMMY_SP,
                    expr: Box::new(Expr::Ident(Ident {
                        span: DUMMY_SP,
                        sym: atom!("a"),
                        ..Default::default()
                    })),
                })
            }
            .into(),
            right: Box::new(Expr::Lit(Lit::Num(Number {
                span: DUMMY_SP,
                value: 123f64,
                raw: Some(atom!("123")),
            })))
        }))
    );
}

#[test]
fn issue_3672_1() {
    test_parser(
        "report({
    fix: fixable ? null : (): RuleFix => {},
});",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_3672_2() {
    test_parser(
        "f(a ? (): void => { } : (): void => { })",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_5947() {
    test_parser(
        "[a as number, b as number, c as string] = [1, 2, '3']",
        Syntax::Typescript(Default::default()),
        |p| p.parse_module(),
    );
}

#[test]
fn issue_6781() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), "import.meta.env".to_string());
    let mut errors = Vec::new();
    let expr = parse_file_as_expr(
        &fm,
        Default::default(),
        Default::default(),
        None,
        &mut errors,
    );
    assert!(expr.is_ok());
    assert!(errors.is_empty());
}

#[bench]
fn bench_new_expr_ts(b: &mut Bencher) {
    bench_parser(
        b,
        "new Foo()",
        Syntax::Typescript(Default::default()),
        |p| {
            black_box(p.parse_expr()?);
            Ok(())
        },
    );
}

#[bench]
fn bench_new_expr_es(b: &mut Bencher) {
    bench_parser(b, "new Foo()", Syntax::Es(Default::default()), |p| {
        black_box(p.parse_expr()?);
        Ok(())
    });
}

#[bench]
fn bench_member_expr_ts(b: &mut Bencher) {
    bench_parser(
        b,
        "a.b.c.d.e.f",
        Syntax::Typescript(Default::default()),
        |p| {
            black_box(p.parse_expr()?);
            Ok(())
        },
    );
}

#[bench]
fn bench_member_expr_es(b: &mut Bencher) {
    bench_parser(b, "a.b.c.d.e.f", Syntax::Es(Default::default()), |p| {
        black_box(p.parse_expr()?);
        Ok(())
    });
}
