use swc_common::{input::SourceFileInput, FileName};
use swc_css_ast::*;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_modules::sel::SelVisitor;
use swc_css_parser::{
    lexer::Lexer,
    parser::{Parser, ParserConfig},
};
use swc_css_visit::VisitMutWith;
use testing::assert_eq;

fn parse_print<F>(content: &str, op: F) -> String
where
    F: FnOnce(Stylesheet) -> Stylesheet,
{
    testing::run_test(false, |cm, handler| {
        let config = ParserConfig {
            ..Default::default()
        };
        let fm = cm.new_source_file(FileName::Anon, content.into());
        let lexer = Lexer::new(SourceFileInput::from(&*fm), config);
        let mut parser = Parser::new(lexer, config);
        let stylesheet = parser.parse_all().map(op).unwrap();

        let mut css_str = String::new();
        {
            let wr = BasicCssWriter::new(
                &mut css_str,
                None, // Some(&mut src_map_buf),
                BasicCssWriterConfig::default(),
            );
            let mut gen = CodeGenerator::new(wr, CodegenConfig { minify: false });
            gen.emit(&stylesheet).unwrap();
        }
        Ok(css_str)
    })
    .unwrap()
}

fn test(src: &str, expected: &str) {
    let actual = parse_print(src, |mut s| {
        s.visit_mut_with(&mut SelVisitor {});
        s
    });

    let expected = parse_print(expected, |s| s);

    assert_eq!(actual, expected);
}

#[test]
fn case1() {
    test("h2 > :local(>h2)", "h2>(>h2)");
}

#[test]
fn case2() {
    test(".a:global(.b,.c)", ".a:global(.b, .c)");
}
