pub use self::semicolon::omit_trailing_semi;
use super::*;

mod semicolon;

/// TODO
pub type Symbol = String;

/// Ported from `EmitTextWriter`.
pub trait TextWriter: Write {
    fn increase_indent(&mut self) -> Result;
    fn decrease_indent(&mut self) -> Result;

    /// This *may* write semicolon.
    fn write_semi(&mut self) -> Result;

    fn write_space(&mut self) -> Result;
    fn write_keyword(&mut self, s: &'static str) -> Result;
    fn write_operator(&mut self, s: &str) -> Result;
    fn write_param(&mut self, s: &str) -> Result;
    fn write_property(&mut self, s: &str) -> Result;

    fn write_line(&mut self) -> Result;

    fn write_lit(&mut self, s: &str) -> Result;

    fn write_str_lit(&mut self, s: &str) -> Result;

    fn write_symbol(&mut self, s: &str, sym: &Symbol) -> Result;

    fn write_punct(&mut self, s: &'static str) -> Result;
}

impl<W> TextWriter for Box<W>
where
    W: ?Sized + TextWriter,
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
    fn write_keyword(&mut self, s: &'static str) -> Result {
        (**self).write_keyword(s)
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

    fn write_lit(&mut self, s: &str) -> Result {
        (**self).write_lit(s)
    }

    fn write_str_lit(&mut self, s: &str) -> Result {
        (**self).write_str_lit(s)
    }

    fn write_symbol(&mut self, s: &str, sym: &Symbol) -> Result {
        (**self).write_symbol(s, sym)
    }

    fn write_punct(&mut self, s: &'static str) -> Result {
        (**self).write_punct(s)
    }
}
