use std::path::{Path, PathBuf};

use swc_common::{sync::Lrc, SourceFile, SourceMap};
use swc_ecma_lexer::{error::SyntaxError, lexer, Lexer, Parser, StringInput, Syntax};

fn load_file(path: &Path) -> Lrc<SourceFile> {
    let cm = SourceMap::default();
    cm.load_file(path).expect("failed to load fixture")
}

// Reuse the AST parser's fixtures to keep both public parser paths in sync.
#[testing::fixture("../swc_ecma_parser/tests/typescript/types/tuple-optional/input.ts")]
#[testing::fixture("../swc_ecma_parser/tests/typescript/types/tuple-rest-after-optional/input.ts")]
fn tuple_elements(file: PathBuf) {
    let file = load_file(&file);
    let input = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*file),
        None,
    );
    let mut parser = Parser::new_from(input.clone());
    let actual = parser.parse_module().expect("tuple should parse");
    assert!(parser.take_errors().is_empty());

    let mut reference = swc_ecma_parser::Parser::new(
        swc_ecma_parser::Syntax::Typescript(Default::default()),
        StringInput::from(&*file),
        None,
    );
    let expected = reference.parse_module().expect("reference should parse");
    assert!(reference.take_errors().is_empty());
    assert_eq!(actual, expected);
    assert!(!lexer(input)
        .expect("public lexer should succeed")
        .is_empty());
}

#[testing::fixture(
    "../swc_ecma_parser/tests/typescript-errors/types/tuple-optional-rest-invalid/input.ts"
)]
fn optional_rest_error(file: PathBuf) {
    let file = load_file(&file);
    let input = Lexer::new(
        Syntax::Typescript(Default::default()),
        Default::default(),
        StringInput::from(&*file),
        None,
    );
    let mut parser = Parser::new_from(input.clone());
    let error = parser.parse_module().expect_err("optional rest is invalid");
    assert!(matches!(error.kind(), SyntaxError::TsOptionalRestElement));
    assert!(parser.take_errors().is_empty());

    // lexer() only propagates fatal parser errors, so check this entry as well.
    let error = lexer(input).expect_err("public lexer should reject optional rest");
    assert!(matches!(error.kind(), SyntaxError::TsOptionalRestElement));
}
