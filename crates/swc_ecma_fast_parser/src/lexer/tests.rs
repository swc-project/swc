use swc_atoms::Atom;

use crate::{
    lexer::Lexer,
    token::{TokenType, TokenValue},
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
            match (&expected_value, &token.value) {
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
                        *expected_val, *actual_val,
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
                (
                    TokenValue::Regex {
                        exp: expected_exp,
                        flags: expected_flags,
                    },
                    TokenValue::Regex {
                        exp: actual_exp,
                        flags: actual_flags,
                    },
                ) => {
                    assert_eq!(
                        expected_exp.as_ref(),
                        actual_exp.as_ref(),
                        "Token #{}: Expected regex pattern '{}', got '{}'",
                        i,
                        expected_exp,
                        actual_exp
                    );
                    assert_eq!(
                        expected_flags.as_ref(),
                        actual_flags.as_ref(),
                        "Token #{}: Expected regex flags '{}', got '{}'",
                        i,
                        expected_flags,
                        actual_flags
                    );
                }
                (
                    TokenValue::Template {
                        raw: expected_raw,
                        cooked: expected_cooked,
                    },
                    TokenValue::Template {
                        raw: actual_raw,
                        cooked: actual_cooked,
                    },
                ) => {
                    assert_eq!(
                        expected_raw.as_ref(),
                        actual_raw.as_ref(),
                        "Token #{}: Expected template raw '{}', got '{}'",
                        i,
                        expected_raw,
                        actual_raw
                    );

                    match (&expected_cooked, &actual_cooked) {
                        (Some(expected), Some(actual)) => {
                            assert_eq!(
                                expected.as_ref(),
                                actual.as_ref(),
                                "Token #{}: Expected template cooked '{}', got '{}'",
                                i,
                                expected,
                                actual
                            );
                        }
                        (None, None) => {
                            // Both are None - valid for invalid templates
                        }
                        _ => {
                            panic!(
                                "Token #{}: Template cooked value mismatch, expected: {:?}, got: \
                                 {:?}",
                                i, expected_cooked, actual_cooked
                            );
                        }
                    }
                }
                _ => panic!(
                    "Token #{}: Value type mismatch or unsupported value comparison\nexpected: \
                     {:?}\nactual: {:?}\ninput: {:?}",
                    i, expected_value, token.value, input
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

#[test]
fn test_lexer_object_literal() {
    // JavaScript object literal
    let input = "const obj = { name: 'John', age: 30, isActive: true };";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("obj")))),
        (TokenType::Eq, None),
        (TokenType::LBrace, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::Colon, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("John"),
                raw: "'John'".into(),
            }),
        ),
        (TokenType::Comma, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("age")))),
        (TokenType::Colon, None),
        (
            TokenType::Num,
            Some(TokenValue::Num {
                value: 30.0,
                raw: "30".into(),
            }),
        ),
        (TokenType::Comma, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("isActive"))),
        ),
        (TokenType::Colon, None),
        (TokenType::True, None),
        (TokenType::RBrace, None),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_array_literal() {
    // JavaScript array literal with different types of elements
    let input = "const arr = [1, 'two', true, null, undefined];";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("arr")))),
        (TokenType::Eq, None),
        (TokenType::LBracket, None),
        (
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1.0,
                raw: "1".into(),
            }),
        ),
        (TokenType::Comma, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("two"),
                raw: "'two'".into(),
            }),
        ),
        (TokenType::Comma, None),
        (TokenType::True, None),
        (TokenType::Comma, None),
        (TokenType::Null, None),
        (TokenType::Comma, None),
        (TokenType::Undefined, None),
        (TokenType::RBracket, None),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_arrow_function() {
    // JavaScript arrow function
    let input = "const multiply = (x, y) => x * y;";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("multiply"))),
        ),
        (TokenType::Eq, None),
        (TokenType::LParen, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("x")))),
        (TokenType::Comma, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("y")))),
        (TokenType::RParen, None),
        (TokenType::Arrow, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("x")))),
        (TokenType::Asterisk, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("y")))),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_template_literal() {
    // JavaScript template literal with expressions
    let input = "const greeting = `Hello, ${name}! You have ${messages.length} messages.`;";

    // Expected token types and values according to ECMAScript standard
    let expected_tokens = vec![
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("greeting"))),
        ),
        (TokenType::Eq, None),
        (TokenType::BackQuote, None), // Opening backtick
        (
            TokenType::Template,
            Some(TokenValue::Template {
                raw: "Hello, ".into(),
                cooked: Some("Hello, ".into()),
            }),
        ),
        (TokenType::DollarLBrace, None), // Start of expression
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::RBrace, None), // End of expression
        (
            TokenType::Template,
            Some(TokenValue::Template {
                raw: "! You have ".into(),
                cooked: Some("! You have ".into()),
            }),
        ),
        (TokenType::DollarLBrace, None), // Start of expression
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("messages"))),
        ),
        (TokenType::Dot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("length"))),
        ),
        (TokenType::RBrace, None), // End of expression
        (
            TokenType::Template,
            Some(TokenValue::Template {
                raw: " messages.".into(),
                cooked: Some(" messages.".into()),
            }),
        ),
        (TokenType::BackQuote, None), // Closing backtick
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_conditional_operator() {
    // JavaScript conditional (ternary) operator
    let input = "const result = isValid ? 'Valid' : 'Invalid';";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("result"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("isValid"))),
        ),
        (TokenType::QuestionMark, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("Valid"),
                raw: "'Valid'".into(),
            }),
        ),
        (TokenType::Colon, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("Invalid"),
                raw: "'Invalid'".into(),
            }),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_class_declaration() {
    // JavaScript class declaration with a method
    let input = "class Person { constructor(name) { this.name = name; } }";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Class, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("Person"))),
        ),
        (TokenType::LBrace, None),
        (TokenType::Constructor, None),
        (TokenType::LParen, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        (TokenType::This, None),
        (TokenType::Dot, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::Eq, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::Semi, None),
        (TokenType::RBrace, None),
        (TokenType::RBrace, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_destructuring_assignment() {
    // JavaScript destructuring assignment with objects and arrays
    let input = "const { name, age, [key]: value, ...rest } = person; const [first, second, \
                 ...others] = items;";

    // Expected token types and values
    let expected_tokens = vec![
        // Object destructuring
        (TokenType::Const, None),
        (TokenType::LBrace, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::Comma, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("age")))),
        (TokenType::Comma, None),
        (TokenType::LBracket, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("key")))),
        (TokenType::RBracket, None),
        (TokenType::Colon, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("value"))),
        ),
        (TokenType::Comma, None),
        (TokenType::DotDotDot, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("rest")))),
        (TokenType::RBrace, None),
        (TokenType::Eq, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("person"))),
        ),
        (TokenType::Semi, None),
        // Array destructuring
        (TokenType::Const, None),
        (TokenType::LBracket, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("first"))),
        ),
        (TokenType::Comma, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("second"))),
        ),
        (TokenType::Comma, None),
        (TokenType::DotDotDot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("others"))),
        ),
        (TokenType::RBracket, None),
        (TokenType::Eq, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("items"))),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_async_await() {
    // JavaScript async/await syntax
    let input = "async function fetchData() { try { const response = await fetch(url); return \
                 await response.json(); } catch (error) { console.error(error); } }";

    // Expected token types and values
    let expected_tokens = vec![
        // async function declaration
        (TokenType::Async, None),
        (TokenType::Function, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("fetchData"))),
        ),
        (TokenType::LParen, None),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        // try block
        (TokenType::Try, None),
        (TokenType::LBrace, None),
        // const response = await fetch(url);
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("response"))),
        ),
        (TokenType::Eq, None),
        (TokenType::Await, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("fetch"))),
        ),
        (TokenType::LParen, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("url")))),
        (TokenType::RParen, None),
        (TokenType::Semi, None),
        // return await response.json();
        (TokenType::Return, None),
        (TokenType::Await, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("response"))),
        ),
        (TokenType::Dot, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("json")))),
        (TokenType::LParen, None),
        (TokenType::RParen, None),
        (TokenType::Semi, None),
        // end of try block
        (TokenType::RBrace, None),
        // catch block
        (TokenType::Catch, None),
        (TokenType::LParen, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("error"))),
        ),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        // console.error(error);
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("console"))),
        ),
        (TokenType::Dot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("error"))),
        ),
        (TokenType::LParen, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("error"))),
        ),
        (TokenType::RParen, None),
        (TokenType::Semi, None),
        // end of catch block and function
        (TokenType::RBrace, None),
        (TokenType::RBrace, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_spread_operator() {
    // JavaScript spread operator in function calls and array literals
    let input = "function sum(...numbers) { return Math.max(...numbers, ...moreNumbers); }";

    // Expected token types and values
    let expected_tokens = vec![
        // Function declaration with rest parameter
        (TokenType::Function, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("sum")))),
        (TokenType::LParen, None),
        (TokenType::DotDotDot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("numbers"))),
        ),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        // Return statement with spread in function call
        (TokenType::Return, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("Math")))),
        (TokenType::Dot, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("max")))),
        (TokenType::LParen, None),
        (TokenType::DotDotDot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("numbers"))),
        ),
        (TokenType::Comma, None),
        (TokenType::DotDotDot, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("moreNumbers"))),
        ),
        (TokenType::RParen, None),
        (TokenType::Semi, None),
        // End of function
        (TokenType::RBrace, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_for_of_loop() {
    // JavaScript for-of loop
    let input = "for (const item of items) { console.log(item); }";

    // Expected token types and values
    let expected_tokens = vec![
        // for-of loop header
        (TokenType::For, None),
        (TokenType::LParen, None),
        (TokenType::Const, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("item")))),
        (TokenType::Of, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("items"))),
        ),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        // Loop body
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("console"))),
        ),
        (TokenType::Dot, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("log")))),
        (TokenType::LParen, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("item")))),
        (TokenType::RParen, None),
        (TokenType::Semi, None),
        // End of loop
        (TokenType::RBrace, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_import_statement() {
    // JavaScript import statements with various syntax forms
    let input = "import defaultExport from 'module'; import * as name from 'module'; import { \
                 export1, export2 as alias } from 'module';";

    // Expected token types and values
    let expected_tokens = vec![
        // Default import
        (TokenType::Import, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("defaultExport"))),
        ),
        (TokenType::From, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("module"),
                raw: "'module'".into(),
            }),
        ),
        (TokenType::Semi, None),
        // Namespace import
        (TokenType::Import, None),
        (TokenType::Asterisk, None),
        (TokenType::As, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("name")))),
        (TokenType::From, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("module"),
                raw: "'module'".into(),
            }),
        ),
        (TokenType::Semi, None),
        // Named imports
        (TokenType::Import, None),
        (TokenType::LBrace, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("export1"))),
        ),
        (TokenType::Comma, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("export2"))),
        ),
        (TokenType::As, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("alias"))),
        ),
        (TokenType::RBrace, None),
        (TokenType::From, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("module"),
                raw: "'module'".into(),
            }),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_export_statement() {
    // JavaScript export statements with various syntax forms
    let input = "export const value = 42; export default function() {}; export { name1, name2 as \
                 alias }; export * from 'module';";

    // Expected token types and values
    let expected_tokens = vec![
        // Named export with declaration
        (TokenType::Export, None),
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("value"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Num,
            Some(TokenValue::Num {
                value: 42.0,
                raw: "42".into(),
            }),
        ),
        (TokenType::Semi, None),
        // Default export
        (TokenType::Export, None),
        (TokenType::Default, None),
        (TokenType::Function, None),
        (TokenType::LParen, None),
        (TokenType::RParen, None),
        (TokenType::LBrace, None),
        (TokenType::RBrace, None),
        (TokenType::Semi, None),
        // Named exports
        (TokenType::Export, None),
        (TokenType::LBrace, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("name1"))),
        ),
        (TokenType::Comma, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("name2"))),
        ),
        (TokenType::As, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("alias"))),
        ),
        (TokenType::RBrace, None),
        (TokenType::Semi, None),
        // Re-export
        (TokenType::Export, None),
        (TokenType::Asterisk, None),
        (TokenType::From, None),
        (
            TokenType::Str,
            Some(TokenValue::Str {
                value: Atom::from("module"),
                raw: "'module'".into(),
            }),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_regular_expressions() {
    // JavaScript regular expressions with various flags
    let input = "const pattern1 = /[a-z]+/; const pattern2 = /\\d+/g; const pattern3 = /^test$/i;";

    // Expected token types and values
    let expected_tokens = vec![
        // First regex
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("pattern1"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Regex,
            Some(TokenValue::Regex {
                exp: "[a-z]+".into(),
                flags: "".into(),
            }),
        ),
        (TokenType::Semi, None),
        // Second regex with global flag
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("pattern2"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Regex,
            Some(TokenValue::Regex {
                exp: "\\d+".into(),
                flags: "g".into(),
            }),
        ),
        (TokenType::Semi, None),
        // Third regex with case-insensitive flag
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("pattern3"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Regex,
            Some(TokenValue::Regex {
                exp: "^test$".into(),
                flags: "i".into(),
            }),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_optional_chaining() {
    // JavaScript optional chaining
    let input = "const value = obj?.prop?.method?.()?.nested;";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("value"))),
        ),
        (TokenType::Eq, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("obj")))),
        (TokenType::OptionalChain, None),
        (TokenType::Ident, Some(TokenValue::Word(Atom::from("prop")))),
        (TokenType::OptionalChain, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("method"))),
        ),
        (TokenType::OptionalChain, None),
        (TokenType::LParen, None),
        (TokenType::RParen, None),
        (TokenType::OptionalChain, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("nested"))),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_nullish_coalescing() {
    // JavaScript nullish coalescing operator
    let input = "const value = first ?? second ?? defaultValue;";

    // Expected token types and values
    let expected_tokens = vec![
        (TokenType::Const, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("value"))),
        ),
        (TokenType::Eq, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("first"))),
        ),
        (TokenType::NullishCoalescing, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("second"))),
        ),
        (TokenType::NullishCoalescing, None),
        (
            TokenType::Ident,
            Some(TokenValue::Word(Atom::from("defaultValue"))),
        ),
        (TokenType::Semi, None),
    ];

    verify_tokens(input, expected_tokens);
}

#[test]
fn test_lexer_number_literals() {
    // Test decimal integers
    verify_tokens(
        "123",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 123.0,
                raw: Atom::from("123"),
            }),
        )],
    );

    // Test decimal with underscores
    verify_tokens(
        "1_000_000",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1000000.0,
                raw: Atom::from("1_000_000"),
            }),
        )],
    );

    // Test floating point
    verify_tokens(
        "123.456",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 123.456,
                raw: Atom::from("123.456"),
            }),
        )],
    );

    // Test floating point with leading dot
    verify_tokens(
        ".456",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.456,
                raw: Atom::from(".456"),
            }),
        )],
    );

    // Test floating point with underscores
    verify_tokens(
        "123_456.789_012",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 123456.789012,
                raw: Atom::from("123_456.789_012"),
            }),
        )],
    );

    // Test exponential notation
    verify_tokens(
        "1.23e10",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1.23e10,
                raw: Atom::from("1.23e10"),
            }),
        )],
    );

    // Test exponential notation with underscores
    verify_tokens(
        "1_234.5_67e1_0",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1234.567e10,
                raw: Atom::from("1_234.5_67e1_0"),
            }),
        )],
    );

    // Test exponential notation with positive exponent
    verify_tokens(
        "1.23e+10",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1.23e10,
                raw: Atom::from("1.23e+10"),
            }),
        )],
    );

    // Test exponential notation with negative exponent
    verify_tokens(
        "1.23e-10",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1.23e-10,
                raw: Atom::from("1.23e-10"),
            }),
        )],
    );

    // Test binary literals
    verify_tokens(
        "0b1010",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 10.0,
                raw: Atom::from("0b1010"),
            }),
        )],
    );

    // Test binary literals with underscores
    verify_tokens(
        "0b1010_1010",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 170.0,
                raw: Atom::from("0b1010_1010"),
            }),
        )],
    );

    // Test octal literals
    verify_tokens(
        "0o755",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 493.0,
                raw: Atom::from("0o755"),
            }),
        )],
    );

    // Test octal literals with underscores
    verify_tokens(
        "0o7_5_5",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 493.0,
                raw: Atom::from("0o7_5_5"),
            }),
        )],
    );

    // Test hexadecimal literals
    verify_tokens(
        "0xABCD",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 43981.0,
                raw: Atom::from("0xABCD"),
            }),
        )],
    );

    // Test hexadecimal literals with underscores
    verify_tokens(
        "0xA_BCD",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 43981.0,
                raw: Atom::from("0xA_BCD"),
            }),
        )],
    );

    // Test BigInt literals
    verify_tokens(
        "123n",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(123)),
                raw: Atom::from("123"),
            }),
        )],
    );

    // Test BigInt literals with underscores
    verify_tokens(
        "1_234_567n",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(1234567)),
                raw: Atom::from("1_234_567"),
            }),
        )],
    );

    // Test binary BigInt literals
    verify_tokens(
        "0b1010n",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(10)),
                raw: Atom::from("0b1010"),
            }),
        )],
    );

    // Test octal BigInt literals
    verify_tokens(
        "0o755n",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(493)),
                raw: Atom::from("0o755"),
            }),
        )],
    );

    // Test hexadecimal BigInt literals
    verify_tokens(
        "0xABCDn",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(43981)),
                raw: Atom::from("0xABCD"),
            }),
        )],
    );

    // Test large decimal integers
    verify_tokens(
        "9007199254740991", // Max safe integer
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 9007199254740991.0,
                raw: Atom::from("9007199254740991"),
            }),
        )],
    );

    // Test large decimal floats
    verify_tokens(
        "1.7976931348623157e+308", // Close to max double
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 1.7976931348623157e+308,
                raw: Atom::from("1.7976931348623157e+308"),
            }),
        )],
    );

    // Test special values
    verify_tokens(
        "0",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.0,
                raw: Atom::from("0"),
            }),
        )],
    );
}

#[test]
fn test_lexer_number_edge_cases() {
    // Test number followed by identifier (no space)
    verify_tokens(
        "123abc",
        vec![
            (
                TokenType::Num,
                Some(TokenValue::Num {
                    value: 123.0,
                    raw: Atom::from("123"),
                }),
            ),
            (TokenType::Ident, Some(TokenValue::Word(Atom::from("abc")))),
        ],
    );

    // Test floating point without integer part followed by identifier
    verify_tokens(
        ".123abc",
        vec![
            (
                TokenType::Num,
                Some(TokenValue::Num {
                    value: 0.123,
                    raw: Atom::from(".123"),
                }),
            ),
            (TokenType::Ident, Some(TokenValue::Word(Atom::from("abc")))),
        ],
    );

    // Test dot followed by non-digit
    verify_tokens(
        ".abc",
        vec![
            (TokenType::Dot, None),
            (TokenType::Ident, Some(TokenValue::Word(Atom::from("abc")))),
        ],
    );

    // Test number followed by dot-dot (range operator)
    verify_tokens(
        "123..",
        vec![
            (
                TokenType::Num,
                Some(TokenValue::Num {
                    value: 123.0,
                    raw: Atom::from("123"),
                }),
            ),
            (TokenType::Dot, None),
            (TokenType::Dot, None),
        ],
    );

    // Test zero with leading decimal point
    verify_tokens(
        ".0",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.0,
                raw: Atom::from(".0"),
            }),
        )],
    );

    // Test leading zeros
    verify_tokens(
        "0123",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 123.0,
                raw: Atom::from("0123"),
            }),
        )],
    );

    // Test small number in scientific notation
    verify_tokens(
        "4.94065645841247e-324", // Min positive double
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 4.94065645841247e-324,
                raw: Atom::from("4.94065645841247e-324"),
            }),
        )],
    );
}

#[test]
#[should_panic]
fn test_lexer_invalid_binary_number() {
    verify_tokens(
        "0b",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.0,
                raw: Atom::from("0b"),
            }),
        )],
    );
}

#[test]
#[should_panic]
fn test_lexer_invalid_octal_number() {
    verify_tokens(
        "0o",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.0,
                raw: Atom::from("0o"),
            }),
        )],
    );
}

#[test]
#[should_panic]
fn test_lexer_invalid_hex_number() {
    verify_tokens(
        "0x",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 0.0,
                raw: Atom::from("0x"),
            }),
        )],
    );
}

#[test]
#[should_panic]
fn test_lexer_invalid_bigint_with_decimal() {
    verify_tokens(
        "123.456n",
        vec![(
            TokenType::BigInt,
            Some(TokenValue::BigInt {
                value: Box::new(num_bigint::BigInt::from(123)),
                raw: Atom::from("123.456"),
            }),
        )],
    );
}

#[test]
#[should_panic]
fn test_lexer_invalid_exponent() {
    verify_tokens(
        "123e",
        vec![(
            TokenType::Num,
            Some(TokenValue::Num {
                value: 123.0,
                raw: Atom::from("123e"),
            }),
        )],
    );
}
