use std::{
    fs,
    path::{Path, PathBuf},
};

use swc_common::{input::StringInput, FileName, SourceMap};
use swc_es_parser::{lexer::Lexer, EsSyntax, Syntax, Token, TokenKind, TokenValue};
use walkdir::WalkDir;

fn format_token(token: &Token) -> String {
    let value = match &token.value {
        Some(TokenValue::Ident(v)) => format!("ident:{v}"),
        Some(TokenValue::Str(v)) => format!("str:{v}"),
        Some(TokenValue::Num(v)) => format!("num:{v:?}"),
        Some(TokenValue::BigInt(v)) => format!("bigint:{v}"),
        None => "-".to_string(),
    };

    format!(
        "{:?}\t{:?}\thad_lb={}\tflags={:?}\t{value}",
        token.kind, token.span, token.had_line_break_before, token.flags
    )
}

fn run_fixture(input: &Path) {
    let src = fs::read_to_string(input)
        .unwrap_or_else(|err| panic!("failed to read fixture {}: {err}", input.display()));

    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Custom("fixture.js".into()).into(), src);

    let syntax = Syntax::Es(EsSyntax {
        jsx: true,
        explicit_resource_management: true,
        import_attributes: true,
        ..Default::default()
    });
    let mut lexer = Lexer::new(syntax, StringInput::from(&*fm), None);

    let mut lines = Vec::new();
    loop {
        let token = lexer.next_token();
        lines.push(format_token(&token));
        if token.kind == TokenKind::Eof {
            break;
        }
    }

    for err in lexer.take_errors() {
        lines.push(format!(
            "ERROR\t{:?}\t{:?}\t{}",
            err.code(),
            err.span(),
            err.message()
        ));
    }

    let actual = format!("{}\n", lines.join("\n"));
    let output = input
        .parent()
        .expect("fixture directory should have parent")
        .join("output.txt");

    if std::env::var("UPDATE").is_ok() {
        fs::write(&output, &actual).unwrap_or_else(|err| {
            panic!(
                "failed to update fixture output {}: {err}",
                output.display()
            )
        });
        return;
    }

    let expected = fs::read_to_string(&output)
        .unwrap_or_else(|err| panic!("failed to read fixture output {}: {err}", output.display()));
    assert_eq!(
        expected,
        actual,
        "lexer fixture mismatch for {}",
        input.display()
    );
}

#[test]
fn lexer_fixtures() {
    let root = PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures/lexer");
    let mut inputs: Vec<PathBuf> = WalkDir::new(&root)
        .into_iter()
        .filter_map(Result::ok)
        .filter(|entry| entry.file_type().is_file())
        .map(|entry| entry.into_path())
        .filter(|path| path.file_name().and_then(|v| v.to_str()) == Some("input.js"))
        .collect();
    inputs.sort();

    assert!(
        !inputs.is_empty(),
        "no lexer fixtures found in {}",
        root.display()
    );
    for input in &inputs {
        run_fixture(input);
    }
}
