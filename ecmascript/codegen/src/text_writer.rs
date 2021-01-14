pub use self::{basic_impl::JsWriter, semicolon::omit_trailing_semi};
use super::*;
use swc_common::Span;
use swc_ecma_parser::JscTarget;

mod basic_impl;
mod semicolon;

/// TODO
pub type Symbol = Str;

/// Ecmascript writer.
///
/// Ported from `EmitWriteJs`.
pub trait WriteJs {
    /// Returns javascript target which should be used while generating code.
    ///
    /// This defaults to [JscTarget::Es2020] because it preserves input as much
    /// as possible.
    ///
    /// Implementor **should return same value** regardless how much time it is
    /// called.
    fn target(&self) -> JscTarget {
        JscTarget::Es2020
    }

    fn increase_indent(&mut self) -> Result;
    fn decrease_indent(&mut self) -> Result;

    /// This *may* write semicolon.
    fn write_semi(&mut self) -> Result;

    fn write_space(&mut self) -> Result;
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result;
    fn write_operator(&mut self, s: &str) -> Result;
    fn write_param(&mut self, s: &str) -> Result;
    fn write_property(&mut self, s: &str) -> Result;

    fn write_line(&mut self) -> Result;

    fn write_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_comment(&mut self, span: Span, s: &str) -> Result;

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_str(&mut self, s: &str) -> Result;

    fn write_symbol(&mut self, span: Span, s: &str) -> Result;

    fn write_punct(&mut self, s: &'static str) -> Result;
}

impl<W> WriteJs for Box<W>
where
    W: ?Sized + WriteJs,
{
    fn increase_indent(&mut self) -> Result {
        (**self).increase_indent()
    }
    fn decrease_indent(&mut self) -> Result {
        (**self).decrease_indent()
    }

    fn write_semi(&mut self) -> Result {
        (**self).write_semi()
    }
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_keyword(span, s)
    }
    fn write_operator(&mut self, s: &str) -> Result {
        (**self).write_operator(s)
    }
    fn write_param(&mut self, s: &str) -> Result {
        (**self).write_param(s)
    }
    fn write_property(&mut self, s: &str) -> Result {
        (**self).write_property(s)
    }

    fn write_line(&mut self) -> Result {
        (**self).write_line()
    }

    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_lit(span, s)
    }

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_str_lit(span, s)
    }
    fn write_str(&mut self, s: &str) -> Result {
        (**self).write_str(s)
    }

    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        (**self).write_symbol(span, s)
    }

    fn write_comment(&mut self, span: Span, s: &str) -> Result {
        (**self).write_comment(span, s)
    }

    fn write_punct(&mut self, s: &'static str) -> Result {
        (**self).write_punct(s)
    }

    fn target(&self) -> JscTarget {
        (**self).target()
    }
}
