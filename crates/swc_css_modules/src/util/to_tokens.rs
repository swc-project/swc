use swc_common::{input::StringInput, Span, Spanned};
use swc_css_ast::Tokens;
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{lexer::Lexer, parser::ParserConfig};

pub(crate) fn to_tokens_vec<N>(n: &[N]) -> Tokens
where
    N: Spanned,
    for<'aa, 'ab> CodeGenerator<BasicCssWriter<'aa, &'ab mut String>>: swc_css_codegen::Emit<N>,
{
    let lo = n.first().span().lo();
    let hi = n.last().span().lo();

    let tokens = n.iter().flat_map(|n| to_tokens(n).tokens).collect();

    Tokens {
        span: Span::new(lo, hi, Default::default()),
        tokens,
    }
}

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
            allow_wrong_line_comments: true,
            css_modules: true,
        },
    );

    Tokens {
        span,
        tokens: lexer.collect(),
    }
}
