use swc_common::Span;
use swc_ecma_codegen::{text_writer::WriteJs, Result};
use swc_ecma_parser::JscTarget;

pub(crate) struct WriterWapper<W>
where
    W: WriteJs,
{
    pub target: JscTarget,
    pub inner: W,
}

impl<W> WriteJs for WriterWapper<W>
where
    W: WriteJs,
{
    fn increase_indent(&mut self) -> Result {
        self.inner.increase_indent()
    }

    fn decrease_indent(&mut self) -> Result {
        self.inner.decrease_indent()
    }

    fn write_semi(&mut self) -> Result {
        self.inner.write_semi()
    }

    fn write_space(&mut self) -> Result {
        self.inner.write_space()
    }

    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        self.inner.write_keyword(span, s)
    }

    fn write_operator(&mut self, s: &str) -> Result {
        self.inner.write_operator(s)
    }

    fn write_param(&mut self, s: &str) -> Result {
        self.inner.write_param(s)
    }

    fn write_property(&mut self, s: &str) -> Result {
        self.inner.write_property(s)
    }

    fn write_line(&mut self) -> Result {
        self.inner.write_line()
    }

    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        self.inner.write_lit(span, s)
    }

    fn write_comment(&mut self, span: Span, s: &str) -> Result {
        self.inner.write_comment(span, s)
    }

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        self.inner.write_str_lit(span, s)
    }

    fn write_str(&mut self, s: &str) -> Result {
        self.inner.write_str(s)
    }

    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        self.inner.write_symbol(span, s)
    }

    fn write_punct(&mut self, s: &'static str) -> Result {
        self.inner.write_punct(s)
    }

    fn target(&self) -> JscTarget {
        self.target
    }
}
