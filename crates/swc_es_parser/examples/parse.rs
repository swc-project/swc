use swc_common::{input::StringInput, FileName, SourceMap};
use swc_es_parser::{lexer::Lexer, Parser, Syntax};

fn main() {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(
        FileName::Custom("example.js".into()).into(),
        "let x = 1 + 2;",
    );

    let lexer = Lexer::new(Syntax::default(), StringInput::from(&*fm), None);
    let mut parser = Parser::new_from(lexer);

    let parsed = parser.parse_program().expect("failed to parse");
    let program = parsed
        .store
        .program(parsed.program)
        .expect("missing program");

    println!(
        "parsed {:?} with {} top-level statements",
        program.kind,
        program.body.len()
    );
}
