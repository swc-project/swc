#![cfg(feature = "tsrx")]

use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, FileName};
use swc_ecma_parser::{Lexer, Parser, Syntax, TsSyntax};
use testing::StdErr;

fn tsrx_syntax() -> Syntax {
    Syntax::Typescript(TsSyntax {
        tsrx: true,
        ..Default::default()
    })
}

#[testing::fixture("tests/tsrx/**/*.tsrx")]
fn lowering(entry: PathBuf) {
    testing::run_test(false, |cm, handler| {
        let comments = SingleThreadedComments::default();
        let fm = cm.load_file(&entry).expect("failed to load TSRX fixture");
        let lexer = Lexer::new(
            tsrx_syntax(),
            Default::default(),
            (&*fm).into(),
            Some(&comments),
        );
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|error| error.into_diagnostic(handler).emit())?;
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }

        let json = serde_json::to_string(&module).expect("failed to serialize lowered AST");
        for forbidden in [
            "JSXCodeBlock",
            "JSXForExpression",
            "JSXIfExpression",
            "JSXStyleElement",
            "JSXSwitchExpression",
            "JSXTryExpression",
            "TsrxExpression",
        ] {
            assert!(
                !json.contains(forbidden),
                "lowered AST leaked TSRX node type {forbidden}"
            );
        }

        let output = swc_ecma_codegen::to_code_default(cm.clone(), Some(&comments), &module);
        StdErr::from(output.clone())
            .compare_to_file(format!("{}.tsx", entry.display()))
            .map_err(|_| ())?;

        let output_fm = cm.new_source_file(
            FileName::Custom(format!("{}.lowered.tsx", entry.display())).into(),
            output,
        );
        let lexer = Lexer::new(
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            }),
            Default::default(),
            (&*output_fm).into(),
            None,
        );
        let mut parser = Parser::new_from(lexer);
        parser
            .parse_module()
            .map_err(|error| error.into_diagnostic(handler).emit())?;
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }
        if handler.has_errors() {
            return Err(());
        }

        Ok(())
    })
    .unwrap();
}

#[testing::fixture("tests/tsrx-errors/**/*.tsrx")]
fn errors(entry: PathBuf) {
    let error = testing::run_test(false, |cm, handler| {
        let fm = cm.load_file(&entry).expect("failed to load TSRX fixture");
        let lexer = Lexer::new(tsrx_syntax(), Default::default(), (&*fm).into(), None);
        let mut parser = Parser::new_from(lexer);
        if let Err(error) = parser.parse_module() {
            error.into_diagnostic(handler).emit();
        }
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }
        if !handler.has_errors() {
            panic!("expected TSRX fixture to fail: {}", entry.display());
        }
        Err::<(), ()>(())
    })
    .expect_err("invalid TSRX fixture unexpectedly parsed");

    error
        .compare_to_file(format!("{}.swc-stderr", entry.display()))
        .unwrap();
}

#[test]
fn rejects_non_module_entry_points() {
    testing::run_test(false, |cm, _handler| {
        for entry in ["script", "commonjs", "expression"] {
            let source = if entry == "expression" {
                "@if (ok) { <Ready /> }"
            } else {
                "const view = @if (ok) { <Ready /> };"
            };
            let fm = cm.new_source_file(FileName::Custom(format!("{entry}.tsrx")).into(), source);
            let lexer = Lexer::new(tsrx_syntax(), Default::default(), (&*fm).into(), None);
            let mut parser = Parser::new_from(lexer);
            let result = match entry {
                "script" => parser.parse_script().map(|_| ()),
                "commonjs" => parser.parse_commonjs().map(|_| ()),
                "expression" => parser.parse_expr().map(|_| ()),
                _ => unreachable!(),
            };
            let error = result.expect_err("TSRX must be rejected outside a module entry point");
            let swc_ecma_parser::error::SyntaxError::Unexpected { got, .. } = error.kind() else {
                panic!("expected a dedicated TSRX entry-point error")
            };
            assert!(got.contains("TSRX syntax"));
        }
        Ok(())
    })
    .unwrap();
}
