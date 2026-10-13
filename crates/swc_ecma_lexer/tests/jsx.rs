use std::path::PathBuf;

use swc_ecma_lexer::{EsSyntax, Lexer, Parser, Syntax, TsSyntax};
use testing::{run_test, StdErr};

// Exercise both lexer implementations with the same inputs and AST snapshots.
#[testing::fixture("../swc_ecma_parser/tests/jsx/entities/**/*.jsx")]
#[testing::fixture("../swc_ecma_parser/tests/jsx/entities/**/*.tsx")]
fn entities(entry: PathBuf) {
    run_test(true, |cm, handler| {
        let fm = cm
            .load_file(&entry)
            .expect("failed to load JSX entity fixture");
        let syntax = if entry.extension().is_some_and(|ext| ext == "tsx") {
            Syntax::Typescript(TsSyntax {
                tsx: true,
                ..Default::default()
            })
        } else {
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            })
        };
        let lexer = Lexer::new(syntax, Default::default(), (&*fm).into(), None);
        let mut parser = Parser::new_from(lexer);
        let module = parser
            .parse_module()
            .map_err(|error| error.into_diagnostic(handler).emit())?;
        for error in parser.take_errors() {
            error.into_diagnostic(handler).emit();
        }

        let json = serde_json::to_string_pretty(&module).expect("failed to serialize JSX module");
        StdErr::from(json)
            .compare_to_file(format!("{}.json", entry.display()))
            .expect("legacy lexer must match the parser's JSX entity values and spans");
        Ok(())
    })
    .unwrap();
}
