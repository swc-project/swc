use swc_common::{input::StringInput, Spanned};
use swc_css_ast::Tokens;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{lexer::Lexer, parser::ParserConfig};

pub(crate) fn to_tokens<N>(n: &N) -> Tokens
where
    N: Spanned,
    for<'aa, 'ab> CodeGenerator<BasicCssWriter<'aa, &'ab mut String>>: swc_css_codegen::Emit<N>,
{
    let span = n.span();

    let mut buf = String::new();
    {
        let wr = BasicCssWriter::new(
            &mut buf,
            None,
            BasicCssWriterConfig {
                indent_type: IndentType::Tab,
                ..Default::default()
            },
        );
        let mut g = CodeGenerator::new(
            wr,
            CodegenConfig {
                ..Default::default()
            },
        );

        g.emit(n).unwrap();
    }

    let lexer = Lexer::new(
        StringInput::new(&buf, span.lo, span.hi),
        ParserConfig {
            css_modules: true,
            legacy_nesting: true,
            ..Default::default()
        },
    );

    Tokens {
        span,
        tokens: lexer.collect(),
    }
}
