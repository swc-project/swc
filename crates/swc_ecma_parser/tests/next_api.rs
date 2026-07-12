use swc_common::{
    comments::SingleThreadedComments, BytePos, EqIgnoreSpan, FileName, SourceMap, Spanned,
};
use swc_ecma_ast::{EsVersion, Program};
use swc_ecma_parser::{
    attach_comments, lexer::Lexer, EsSyntax, LegacyParser, ModuleKind, ParseOptions,
    Parser as NextParser, ParserReturn, SourceType, StringInput, Syntax, TsSyntax,
};

fn legacy_parse(source: &str, syntax: Syntax, module_kind: ModuleKind) -> Program {
    let cm = SourceMap::default();
    let fm = cm.new_source_file(FileName::Anon.into(), source.to_owned());
    let comments = SingleThreadedComments::default();
    let lexer = Lexer::new(
        syntax,
        EsVersion::latest(),
        StringInput::from(&*fm),
        Some(&comments),
    );
    let mut parser = LegacyParser::new_from(lexer);
    let program = match module_kind {
        ModuleKind::Script => parser.parse_script().map(Program::Script),
        ModuleKind::Module => parser.parse_module().map(Program::Module),
        ModuleKind::Unambiguous => parser.parse_program(),
        ModuleKind::CommonJs => parser.parse_commonjs().map(Program::Script),
    }
    .expect("legacy parser should accept fixture");
    assert!(parser.take_errors().is_empty());
    program
}

#[test]
fn javascript_ast_matches_legacy_parser() {
    let source = "export const answer = (value = 40) => value + 2;";
    let options = ParseOptions {
        decorators: true,
        ..ParseOptions::default()
    };
    let next = NextParser::new(source, SourceType::module())
        .with_options(options)
        .parse();
    let legacy = legacy_parse(
        source,
        Syntax::Es(EsSyntax {
            decorators: true,
            import_attributes: true,
            ..EsSyntax::default()
        }),
        ModuleKind::Module,
    );

    assert!(!next.panicked);
    assert!(next.diagnostics.is_empty());
    assert!(next.program.eq_ignore_span(&legacy));
}

#[test]
fn token_and_comment_collection_is_opt_in_and_ordered() {
    let source = "// first\nconst value = 1; /* last */";
    let without_tokens = NextParser::new(source, SourceType::script()).parse();
    let with_tokens = NextParser::new(source, SourceType::script())
        .with_start_pos(BytePos(41))
        .with_tokens()
        .parse();

    assert!(without_tokens.tokens.is_empty());
    assert!(!with_tokens.tokens.is_empty());
    assert_eq!(with_tokens.comments.len(), 2);
    assert!(with_tokens.comments[0].span.lo < with_tokens.comments[1].span.lo);
    assert!(with_tokens
        .tokens
        .iter()
        .all(|token| token.span().lo >= BytePos(41)));
    assert!(with_tokens.program.span().lo >= BytePos(41));
}

#[test]
fn collected_tokens_preserve_legacy_debug_names() {
    let result = NextParser::new("`value ${item}`; 1n;", SourceType::script())
        .with_tokens()
        .parse();
    let tokens = format!("{:?}", result.tokens);
    assert!(tokens.contains('`'));
    assert!(tokens.contains("<bigint literal>"));
}

#[test]
fn flat_comments_attach_deterministically() {
    let source = "const a = 1; // trailing\n// leading\nconst b = 2;";
    let start_pos = BytePos(17);
    let ParserReturn {
        program,
        comments,
        tokens,
        ..
    } = NextParser::new(source, SourceType::script())
        .with_start_pos(start_pos)
        .with_tokens()
        .parse();
    let destination = SingleThreadedComments::default();

    attach_comments(source, start_pos, &destination, comments, &tokens, &program);

    let (leading, trailing) = destination.borrow_all();
    assert_eq!(leading.values().map(Vec::len).sum::<usize>(), 1);
    assert_eq!(trailing.values().map(Vec::len).sum::<usize>(), 1);
    assert_eq!(leading.values().flatten().next().unwrap().text, " leading");
    assert_eq!(
        trailing.values().flatten().next().unwrap().text,
        " trailing"
    );
}

#[cfg(feature = "typescript")]
#[test]
fn typescript_ast_matches_legacy_parser() {
    let source = "interface Box<T> { value: T } export const box: Box<number> = { value: 1 };";
    let next = NextParser::new(source, SourceType::typescript()).parse();
    let legacy = legacy_parse(
        source,
        Syntax::Typescript(TsSyntax::default()),
        ModuleKind::Unambiguous,
    );

    assert!(!next.panicked);
    assert!(next.diagnostics.is_empty());
    assert!(next.program.eq_ignore_span(&legacy));
}

#[cfg(feature = "typescript")]
#[test]
fn tsx_ast_matches_legacy_parser() {
    let source = "export const view = <Box value={1 satisfies number} />;";
    let next = NextParser::new(source, SourceType::tsx()).parse();
    let legacy = legacy_parse(
        source,
        Syntax::Typescript(TsSyntax {
            tsx: true,
            ..TsSyntax::default()
        }),
        ModuleKind::Unambiguous,
    );

    assert!(!next.panicked);
    assert!(next.diagnostics.is_empty());
    assert!(next.program.eq_ignore_span(&legacy));
}

#[cfg(feature = "flow")]
#[test]
fn flow_ast_matches_legacy_parser() {
    use swc_ecma_parser::{FlowOptions, FlowSyntax};

    let source = "// @flow\nexport const value: number = 1;";
    let options = ParseOptions {
        flow: FlowOptions {
            require_directive: true,
            ..FlowOptions::default()
        },
        ..ParseOptions::default()
    };
    let next = NextParser::new(source, SourceType::flow())
        .with_options(options)
        .parse();
    let legacy = legacy_parse(
        source,
        Syntax::Flow(FlowSyntax {
            require_directive: true,
            ..FlowSyntax::default()
        }),
        ModuleKind::Unambiguous,
    );

    assert!(!next.panicked);
    assert!(next.diagnostics.is_empty());
    assert!(next.program.eq_ignore_span(&legacy));
}
