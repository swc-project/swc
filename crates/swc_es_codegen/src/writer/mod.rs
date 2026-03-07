use crate::Result;

pub mod basic;

/// JavaScript text output interface.
pub trait WriteJs {
    fn write_raw(&mut self, text: &str) -> Result;

    fn write_space(&mut self) -> Result {
        self.write_raw(" ")
    }

    fn write_newline(&mut self) -> Result;

    fn increase_indent(&mut self);

    fn decrease_indent(&mut self);
}

impl<W> WriteJs for Box<W>
where
    W: ?Sized + WriteJs,
{
    #[inline]
    fn write_raw(&mut self, text: &str) -> Result {
        (**self).write_raw(text)
    }

    #[inline]
    fn write_space(&mut self) -> Result {
        (**self).write_space()
    }

    #[inline]
    fn write_newline(&mut self) -> Result {
        (**self).write_newline()
    }

    #[inline]
    fn increase_indent(&mut self) {
        (**self).increase_indent()
    }

    #[inline]
    fn decrease_indent(&mut self) {
        (**self).decrease_indent()
    }
}
