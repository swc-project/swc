use super::*;

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

pub fn omit_trailing_semi(w: Box<TextWriter>) -> Box<TextWriter> {
    box OmitTrailingSemi {
        inner: w,
        pending_semi: false,
    }
}

#[derive(Debug, Clone)]
struct OmitTrailingSemi<W: TextWriter> {
    inner: W,
    pending_semi: bool,
}

macro_rules! with_semi {
    (
        $fn_name:ident
        (
            $(
                $arg_name:ident
                :
                $arg_ty:ty
            ),*
        )
    ) => {
        fn $fn_name(&mut self, $($arg_name: $arg_ty),* ) -> Result {
            self.commit_pending_semi()?;

            self.inner.$fn_name( $($arg_name),* )
        }
    };
}

impl<W: TextWriter> TextWriter for OmitTrailingSemi<W> {
    with_semi!(increase_indent());
    with_semi!(decrease_indent());

    fn write_semi(&mut self) -> Result {
        self.pending_semi = true;
    }

    with_semi!(write_space());
    with_semi!(write_keyword(s: &'static str));
    with_semi!(write_operator(s: &str));
    with_semi!(write_param(s: &str));
    with_semi!(write_property(s: &str));
    with_semi!(write_line());
    with_semi!(write_lit(s: &str));
    with_semi!(write_str_lit(s: &str));
    with_semi!(write_symbol(s: &str, sym: &Symbol));
    with_semi!(write_punct(s: &'static str));
}

impl<W: TextWriter> OmitTrailingSemi<W> {
    fn commit_pending_semi(&mut self) -> Result {
        if self.pending_semi {
            self.inner.write_punct(";")?;
            self.pending_semi = false;
        }
        Ok(())
    }
}

impl<W: TextWriter> Write for OmitTrailingSemi<W> {
    fn write(&mut self, s: &[u8]) -> io::Result<usize> {
        //TODO: +1 if semi is pending
        self.commit_pending_semi()?;
        self.inner.write(s)
    }

    fn flush(&mut self) -> Result {
        self.inner.flush()
    }
}
