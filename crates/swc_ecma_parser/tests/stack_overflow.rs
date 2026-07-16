use swc_common::BytePos;
#[cfg(any(
    target_arch = "wasm32",
    target_arch = "arm",
    not(feature = "stacker"),
    miri
))]
use swc_ecma_parser::error::SyntaxError;
use swc_ecma_parser::{Parser, StringInput, Syntax};

#[cfg(all(
    not(any(target_arch = "wasm32", target_arch = "arm", miri)),
    feature = "stacker"
))]
#[test]
fn deeply_nested_expressions_do_not_overflow_the_stack() {
    std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(|| {
            let depth = 5_000;
            let sources = [
                format!("{}0{}", "(".repeat(depth), ")".repeat(depth)),
                format!("{}0{}", "[".repeat(depth), "]".repeat(depth)),
                format!("{}0{}", "{a:".repeat(depth), "}".repeat(depth)),
                format!("{}0{}", "f(".repeat(depth), ")".repeat(depth)),
            ];

            for source in sources {
                let end = BytePos(source.len() as u32);
                let mut parser = Parser::new(
                    Syntax::default(),
                    StringInput::new(&source, BytePos(0), end),
                    None,
                );

                let expr = parser.parse_expr().expect("nested expression should parse");
                assert!(parser.take_errors().is_empty());

                // Dropping a deeply recursive AST is independent of parser stack usage.
                std::mem::forget(expr);
            }
        })
        .expect("test thread should start")
        .join()
        .expect("parser should not overflow its stack");
}

#[cfg(any(
    target_arch = "wasm32",
    target_arch = "arm",
    not(feature = "stacker"),
    miri
))]
#[test]
fn deeply_nested_expressions_return_an_error_without_stacker() {
    std::thread::Builder::new()
        .stack_size(2 * 1024 * 1024)
        .spawn(|| {
            let depth = 5_000;
            let sources = [
                format!("{}0{}", "(".repeat(depth), ")".repeat(depth)),
                format!("{}0{}", "[".repeat(depth), "]".repeat(depth)),
                format!("{}0{}", "{a:".repeat(depth), "}".repeat(depth)),
                format!("{}0{}", "f(".repeat(depth), ")".repeat(depth)),
            ];

            for source in sources {
                let end = BytePos(source.len() as u32);
                let mut parser = Parser::new(
                    Syntax::default(),
                    StringInput::new(&source, BytePos(0), end),
                    None,
                );

                let error = parser
                    .parse_expr()
                    .expect_err("nested expression should be rejected");
                assert_eq!(error.kind(), &SyntaxError::TooManyNestedExpressions);
            }
        })
        .expect("test thread should start")
        .join()
        .expect("parser should reject the input without overflowing its stack");
}
