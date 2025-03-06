use std::rc::Rc;

use swc_atoms::Atom;
use swc_common::DUMMY_SP;

use crate::{
    lexer::Lexer,
    token::{Token, TokenType, TokenValue},
    JscTarget, Syntax,
};

/// Utility function to verify lexer tokens
fn verify_tokens(input: &str, expected_tokens: Vec<(TokenType, Option<TokenValue>)>) {
    // Create a new lexer
    let mut lexer = Lexer::new(input, JscTarget::Es2020, Syntax::default(), None);

    // Verify each token
    for (i, (expected_type, expected_value)) in expected_tokens.into_iter().enumerate() {
        let token = lexer.next_token().expect("Failed to get next token");

        assert_eq!(
            token.token_type, expected_type,
            "Token #{}: Expected token type {:?}, got {:?}",
            i, expected_type, token.token_type
        );

        // If an expected value is provided, verify it
        if let Some(expected_value) = expected_value {
            match (expected_value, &token.value) {
                (TokenValue::Word(expected), TokenValue::Word(actual)) => {
                    assert_eq!(
                        expected.as_ref(),
                        actual.as_ref(),
                        "Token #{}: Expected word '{}', got '{}'",
                        i,
                        expected,
                        actual
                    );
                }
                (
                    TokenValue::Num {
                        value: expected_val,
                        ..
                    },
                    TokenValue::Num {
                        value: actual_val, ..
                    },
                ) => {
                    assert_eq!(
                        expected_val, *actual_val,
                        "Token #{}: Expected number {}, got {}",
                        i, expected_val, actual_val
                    );
                }
                (
                    TokenValue::Str {
                        value: expected_val,
                        ..
                    },
                    TokenValue::Str {
                        value: actual_val, ..
                    },
                ) => {
                    assert_eq!(
                        expected_val.as_ref(),
                        actual_val.as_ref(),
                        "Token #{}: Expected string '{}', got '{}'",
                        i,
                        expected_val,
                        actual_val
                    );
                }
                _ => panic!(
                    "Token #{}: Value type mismatch or unsupported value comparison",
                    i
                ),
            }
        }
    }

    // Verify we've reached EOF
    let final_token = lexer.next_token().expect("Failed to get final token");
    assert_eq!(
        final_token.token_type,
        TokenType::EOF,
        "Expected final token to be EOF, got {:?}",
        final_token.token_type
    );
}

#[test]
fn test_lexer_variable_declaration() {
    // Simple JavaScript variable declaration
    let input = "const x = 42;";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("x")))),
        (TokenType::Eq, None),
        (
            TokenType::Num,
            Some(TokenValue::Num {
                value: 42.0,
                raw: "42".into(),
            }),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_function_declaration() {
    // JavaScript function declaration
    let input = "function add(a, b) { return a + b; }";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Function, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("add")))),
        (TokenType::LParen, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("a")))),
        (TokenType::Comma, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("b")))),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        (TokenType::Return, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("a")))),
        (TokenType::Plus, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("b")))),
        (TokenType::Semi, None),
        (TokenType::RBrace, None),
    ];

    verify_tokens(input, expected_tokens);
}
