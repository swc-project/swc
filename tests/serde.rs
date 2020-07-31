use std::path::Path;
use swc_common::input::StringInput;
use swc_ecma_ast::Module;
use swc_ecma_parser::{lexer::Lexer, PResult, Parser, Syntax};
use testing::NormalizedOutput;

fn with_parser<F, Ret>(file_name: &str, f: F) -> Result<Ret, NormalizedOutput>
where
    F: FnOnce(&mut Parser<Lexer<StringInput>>) -> PResult<Ret>,
{
    let output = ::testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(Path::new(file_name))
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name, e));

        let lexer = Lexer::new(
            if file_name.ends_with(".ts") {
                Syntax::Typescript(Default::default())
            } else {
                Syntax::default()
            },
            Default::default(),
            (&*fm).into(),
            None,
        );
        let mut p = Parser::new_from(lexer);
        let res = f(&mut p).map_err(|e| e.into_diagnostic(&handler).emit());

        for e in p.take_errors() {
            e.into_diagnostic(&handler).emit()
        }

        if handler.has_errors() {
            return Err(());
        }

        res
    });

    output
}

#[test]
fn color_js() {
    with_parser("tests/serde/colors.js", |p| {
        let m = p.parse_module()?;

        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");

        Ok(())
    })
    .expect("failed");
}

#[test]
fn color_ts() {
    with_parser("tests/serde/colors.ts", |p| {
        let m = p.parse_module()?;

        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");

        Ok(())
    })
    .expect("failed");
}

#[test]
fn super_js() {
    with_parser("tests/serde/supers.js", |p| {
        let m = p.parse_module()?;

        let s = serde_json::to_string(&m).expect("failed to serialize");
        let _: Module = serde_json::from_str(&s).expect("failed to deserialize");

        Ok(())
    })
    .expect("failed");
}
