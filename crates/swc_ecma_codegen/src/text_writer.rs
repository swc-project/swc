pub use self::{basic_impl::JsWriter, semicolon::omit_trailing_semi};
use super::*;

mod basic_impl;
mod semicolon;

/// TODO
pub type Symbol = Str;

/// Ecmascript writer.
///
/// Ported from `EmitWriteJs`.
pub trait WriteJs {
    fn increase_indent(&mut self) -> Result;
    fn decrease_indent(&mut self) -> Result;

    /// This *may* write semicolon.
    fn write_semi(&mut self, span: Option<Span>) -> Result;

    fn write_space(&mut self) -> Result;
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result;
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result;
    fn write_param(&mut self, s: &str) -> Result;
    fn write_property(&mut self, s: &str) -> Result;

    fn write_line(&mut self) -> Result;

    fn write_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_comment(&mut self, s: &str) -> Result;

    fn write_str_lit(&mut self, span: Span, s: &str) -> Result;
    fn write_str(&mut self, s: &str) -> Result;

    fn write_symbol(&mut self, span: Span, s: &str) -> Result;

    fn write_punct(&mut self, span: Option<Span>, s: &'static str) -> Result;

    fn care_about_srcmap(&self) -> bool;

    fn add_srcmap(&mut self, pos: BytePos) -> Result;

    fn commit_pending_semi(&mut self) -> Result;

    /// If true, the code generator will skip **modification** of invalid
    /// unicode characters.
    ///
    /// Defaults to `false``
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        false
    }

    /// Start a new scope in the generated output.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    /// The default implementation does nothing.
    fn start_scope(
        &mut self,
        _name: Option<&str>,
        _kind: Option<&str>,
        _is_stack_frame: bool,
    ) -> Result {
        Ok(())
    }

    /// End the current scope in the generated output.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    /// The default implementation does nothing.
    fn end_scope(&mut self) -> Result {
        Ok(())
    }

    /// Add a variable binding to the current scope.
    ///
    /// This is used for source map scope tracking (ECMA-426).
    /// The default implementation does nothing.
    fn add_scope_variable(&mut self, _name: &str, _binding: Option<&str>) -> Result {
        Ok(())
    }
}

impl<W> WriteJs for Box<W>
where
    W: ?Sized + WriteJs,
{
    #[inline]
    fn increase_indent(&mut self) -> Result {
        (**self).increase_indent()
    }

    #[inline]
    fn decrease_indent(&mut self) -> Result {
        (**self).decrease_indent()
    }

    #[inline]
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        (**self).write_semi(span)
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }

    #[inline]
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_keyword(span, s)
    }

    #[inline]
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        (**self).write_operator(span, s)
    }

    #[inline]
    fn write_param(&mut self, s: &str) -> Result {
        (**self).write_param(s)
    }

    #[inline]
    fn write_property(&mut self, s: &str) -> Result {
        (**self).write_property(s)
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        (**self).write_line()
    }

    #[inline]
    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_lit(span, s)
    }

    #[inline]
    fn write_comment(&mut self, s: &str) -> Result {
        (**self).write_comment(s)
    }

    #[inline]
    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_str_lit(span, s)
    }

    #[inline]
    fn write_str(&mut self, s: &str) -> Result {
        (**self).write_str(s)
    }

    #[inline]
    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        (**self).write_symbol(span, s)
    }

    #[inline]
    fn write_punct(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_punct(span, s)
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        (**self).care_about_srcmap()
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        (**self).add_srcmap(pos)
    }

    fn commit_pending_semi(&mut self) -> Result {
        (**self).commit_pending_semi()
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        (**self).can_ignore_invalid_unicodes()
    }

    #[inline]
    fn start_scope(
        &mut self,
        name: Option<&str>,
        kind: Option<&str>,
        is_stack_frame: bool,
    ) -> Result {
        (**self).start_scope(name, kind, is_stack_frame)
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        (**self).end_scope()
    }

    #[inline]
    fn add_scope_variable(&mut self, name: &str, binding: Option<&str>) -> Result {
        (**self).add_scope_variable(name, binding)
    }
}

impl<W> WriteJs for &'_ mut W
where
    W: ?Sized + WriteJs,
{
    #[inline]
    fn increase_indent(&mut self) -> Result {
        (**self).increase_indent()
    }

    #[inline]
    fn decrease_indent(&mut self) -> Result {
        (**self).decrease_indent()
    }

    #[inline]
    fn write_semi(&mut self, span: Option<Span>) -> Result {
        (**self).write_semi(span)
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }

    #[inline]
    fn write_keyword(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_keyword(span, s)
    }

    #[inline]
    fn write_operator(&mut self, span: Option<Span>, s: &str) -> Result {
        (**self).write_operator(span, s)
    }

    #[inline]
    fn write_param(&mut self, s: &str) -> Result {
        (**self).write_param(s)
    }

    #[inline]
    fn write_property(&mut self, s: &str) -> Result {
        (**self).write_property(s)
    }

    #[inline]
    fn write_line(&mut self) -> Result {
        (**self).write_line()
    }

    #[inline]
    fn write_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_lit(span, s)
    }

    #[inline]
    fn write_comment(&mut self, s: &str) -> Result {
        (**self).write_comment(s)
    }

    #[inline]
    fn write_str_lit(&mut self, span: Span, s: &str) -> Result {
        (**self).write_str_lit(span, s)
    }

    #[inline]
    fn write_str(&mut self, s: &str) -> Result {
        (**self).write_str(s)
    }

    #[inline]
    fn write_symbol(&mut self, span: Span, s: &str) -> Result {
        (**self).write_symbol(span, s)
    }

    #[inline]
    fn write_punct(&mut self, span: Option<Span>, s: &'static str) -> Result {
        (**self).write_punct(span, s)
    }

    #[inline]
    fn care_about_srcmap(&self) -> bool {
        (**self).care_about_srcmap()
    }

    #[inline]
    fn add_srcmap(&mut self, pos: BytePos) -> Result {
        (**self).add_srcmap(pos)
    }

    #[inline(always)]
    fn commit_pending_semi(&mut self) -> Result {
        (**self).commit_pending_semi()
    }

    #[inline(always)]
    fn can_ignore_invalid_unicodes(&mut self) -> bool {
        (**self).can_ignore_invalid_unicodes()
    }

    #[inline]
    fn start_scope(
        &mut self,
        name: Option<&str>,
        kind: Option<&str>,
        is_stack_frame: bool,
    ) -> Result {
        (**self).start_scope(name, kind, is_stack_frame)
    }

    #[inline]
    fn end_scope(&mut self) -> Result {
        (**self).end_scope()
    }

    #[inline]
    fn add_scope_variable(&mut self, name: &str, binding: Option<&str>) -> Result {
        (**self).add_scope_variable(name, binding)
    }
}
