use std::path::Path;
use swc::{
    swc_ecmascript::{
        ast::Module,
        parser::{lexer::Lexer, PResult, Parser, Session, Syntax},
    },
    SourceFileInput,
};
use testing::NormalizedOutput;

fn with_parser<F, Ret>(file_name: &str, f: F) -> Result<Ret, NormalizedOutput>
where
    F: for<'a> FnOnce(&mut Parser<'a, Lexer<'a, SourceFileInput<'_>>>) -> PResult<'a, Ret>,
{
    let output = ::testing::run_test(false, |cm, handler| {
        let fm = cm
            .load_file(Path::new(file_name))
            .unwrap_or_else(|e| panic!("failed to load {}: {}", file_name, e));

        let lexer = Lexer::new(
            Session { handler: &handler },
            if file_name.ends_with(".ts") {
                Syntax::Typescript(Default::default())
            } else {
                Syntax::default()
            },
            Default::default(),
            (&*fm).into(),
            None,
        );
        let res =
            f(&mut Parser::new_from(Session { handler: &handler }, lexer)).map_err(|mut e| {
                e.emit();
            });

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
