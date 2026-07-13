use swc_common::{comments::SingleThreadedComments, BytePos, Spanned};
use swc_ecma_ast::{Decl, ModuleDecl, ModuleItem, Program, Stmt};
use swc_ecma_parser::{attach_comments, ParseOptions, Parser, ParserReturn, SourceType};

#[test]
fn javascript_builds_direct_module_ast() {
    let source = "export const answer = (value = 40) => value + 2;";
    let options = ParseOptions {
        decorators: true,
        ..ParseOptions::default()
    };
    let parsed = Parser::new(source, SourceType::module())
        .with_options(options)
        .parse();
    assert!(!parsed.panicked);
    assert!(parsed.diagnostics.is_empty());
    assert!(matches!(
        parsed.program,
        Program::Module(module)
            if matches!(module.body.first(), Some(ModuleItem::ModuleDecl(ModuleDecl::ExportDecl(_))))
    ));
}

#[test]
fn token_and_comment_collection_is_opt_in_and_ordered() {
    let source = "// first\nconst value = 1; /* last */";
    let without_tokens = Parser::new(source, SourceType::script()).parse();
    let with_tokens = Parser::new(source, SourceType::script())
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
fn collected_tokens_expose_packed_kind_names() {
    let result = Parser::new("`value ${item}`; 1n;", SourceType::script())
        .with_tokens()
        .parse();
    let tokens = format!("{:?}", result.tokens);
    assert!(tokens.contains("TemplateHead"));
    assert!(tokens.contains("BigInt"));
}

#[test]
fn invalid_numeric_literals_report_diagnostics_without_panicking() {
    for source in ["0e0n;", ".1n;", "1.n;", "1.0n;", "0xgn;", "0b2n;"] {
        let parsed = std::panic::catch_unwind(|| Parser::new(source, SourceType::script()).parse())
            .unwrap_or_else(|_| panic!("parser panicked for {source:?}"));
        assert!(
            !parsed.diagnostics.is_empty(),
            "parser accepted invalid numeric literal {source:?}"
        );
    }
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
    } = Parser::new(source, SourceType::script())
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
fn typescript_builds_direct_ast() {
    let source = "interface Box<T> { value: T } export const box: Box<number> = { value: 1 };";
    let parsed = Parser::new(source, SourceType::typescript()).parse();
    assert!(!parsed.panicked);
    assert!(parsed.diagnostics.is_empty());
    let Program::Module(module) = parsed.program else {
        panic!("export must select a module")
    };
    assert!(matches!(
        module.body.first(),
        Some(ModuleItem::Stmt(Stmt::Decl(Decl::TsInterface(_))))
    ));
}

#[cfg(feature = "typescript")]
#[test]
fn production_prefixes_are_consumed_in_release_builds() {
    let source = "interface Box { value: string } declare const value: string; const enum Flag { \
                  Yes } declare global {}";

    for with_tokens in [false, true] {
        let parser = Parser::new(source, SourceType::typescript());
        let parsed = if with_tokens {
            parser.with_tokens().parse()
        } else {
            parser.parse()
        };
        assert!(!parsed.panicked, "token collection: {with_tokens}");
        assert!(
            parsed.diagnostics.is_empty(),
            "token collection: {with_tokens}, diagnostics: {:?}",
            parsed.diagnostics
        );
    }
}

#[cfg(feature = "typescript")]
#[test]
fn tsx_builds_direct_jsx_ast() {
    let source = "export const view = <Box value={1 satisfies number} />;";
    let parsed = Parser::new(source, SourceType::tsx()).parse();
    assert!(!parsed.panicked);
    assert!(parsed.diagnostics.is_empty());
    assert!(format!("{:#?}", parsed.program).contains("JSXElement"));
}

#[cfg(feature = "flow")]
#[test]
fn flow_builds_direct_typed_ast() {
    use swc_ecma_parser::{FlowOptions, Language};

    let source = "// @flow\nexport const value: number = 1;";
    let options = ParseOptions {
        flow: FlowOptions {
            require_directive: true,
            ..FlowOptions::default()
        },
        ..ParseOptions::default()
    };
    let parsed = Parser::new(source, SourceType::flow())
        .with_options(options)
        .parse();
    assert_eq!(SourceType::flow().language(), Language::Flow);
    assert!(!parsed.panicked);
    assert!(parsed.diagnostics.is_empty());

    let runtime_global = Parser::new(
        "/** @flow strict */\nglobal.ErrorUtils = {};\nexport type ErrorUtilsT = typeof \
         global.ErrorUtils;",
        SourceType::flow(),
    )
    .with_options(options)
    .parse();
    assert!(!runtime_global.panicked);
    assert!(runtime_global.diagnostics.is_empty());
}
