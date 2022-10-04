use swc_common::{input::StringInput, Spanned};
use swc_css_ast::{Declaration, PseudoClassSelector, SelectorList, Stylesheet, TokenAndSpan};
use swc_css_codegen::{
    writer::basic::{BasicCssWriter, BasicCssWriterConfig, IndentType},
    CodeGenerator, CodegenConfig, Emit,
};
use swc_css_parser::{lexer::Lexer, parser::ParserConfig};
use swc_css_visit::{VisitMut, VisitMutWith};

pub(crate) trait ToTokens: Spanned + Sized {
    fn append_tokens(&self, buf: &mut Vec<TokenAndSpan>)
    where
        for<'aa, 'ab> CodeGenerator<BasicCssWriter<'aa, &'ab mut String>>:
            swc_css_codegen::Emit<Self>,
    {
        buf.extend(to_tokens_using_codegen(self))
    }

    fn to_tokens(&self) -> Vec<TokenAndSpan>
    where
        for<'aa, 'ab> CodeGenerator<BasicCssWriter<'aa, &'ab mut String>>:
            swc_css_codegen::Emit<Self>,
    {
        let mut buf = vec![];
        self.append_tokens(&mut buf);
        buf
    }
}

fn to_tokens_using_codegen<N>(n: &N) -> Vec<TokenAndSpan>
where
    N: Spanned,
    for<'aa, 'ab> CodeGenerator<BasicCssWriter<'aa, &'ab mut String>>: swc_css_codegen::Emit<N>,
{
    let span = n.span();

    let mut buf = String::new();
    {
        let mut wr = BasicCssWriter::new(
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

    let mut lexer = Lexer::new(
        StringInput::new(&buf, span.lo, span.hi),
        ParserConfig {
            allow_wrong_line_comments: true,
        },
    );

    lexer.collect()
}
