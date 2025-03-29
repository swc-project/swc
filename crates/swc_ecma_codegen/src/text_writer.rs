use auto_impl::auto_impl;

pub use self::{basic_impl::JsWriter, semicolon::omit_trailing_semi};
use super::*;

mod basic_impl;
mod semicolon;

/// TODO
pub type Symbol = Str;

/// Ecmascript writer.
///
/// Ported from `EmitWriteJs`.
#[auto_impl(Box, &mut)]
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
}

#[auto_impl(Box, &mut)]
pub trait SpannedWriteJs: WriteJs {}
