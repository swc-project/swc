macro_rules! emit {
    ($g:expr,$n:expr) => {{
        use crate::Emit;

        $g.emit(&$n)?;
    }};
}

macro_rules! write_raw {
    ($g:expr,$span:expr,$n:expr) => {{
        $g.wr.write_raw(Some($span), $n)?;
    }};

    ($g:expr,$n:expr) => {{
        $g.wr.write_raw(None, $n)?;
    }};
}

macro_rules! write_str {
    ($g:expr,$span:expr,$n:expr) => {{
        $g.wr.write_str($span, $n)?;
    }};
}

macro_rules! formatting_newline {
    ($g:expr) => {{
        if !$g.config.minify {
            $g.wr.write_newline()?;
        }
    }};
}

macro_rules! space {
    ($g:expr) => {{
        $g.wr.write_space()?;
    }};
}

macro_rules! formatting_space {
    ($g:expr) => {{
        if !$g.config.minify {
            $g.wr.write_space()?;
        }
    }};
}

macro_rules! semi {
    ($g:expr) => {{
        write_raw!($g, ";");
    }};
}

macro_rules! formatting_semi {
    ($g:expr) => {{
        if !$g.config.minify {
            write_raw!($g, ";");
        }
    }};
}

macro_rules! increase_indent {
    ($g:expr) => {{
        if !$g.config.minify {
            $g.wr.increase_indent();
        }
    }};
}

macro_rules! decrease_indent {
    ($g:expr) => {{
        if !$g.config.minify {
            $g.wr.decrease_indent();
        }
    }};
}
macro_rules! lo_span_offset {
    ($s:expr,$o:expr) => {{
        if $s.is_dummy() {
            DUMMY_SP
        } else {
            Span::new($s.lo, $s.lo + BytePos($o), Default::default())
        }
    }};
}

macro_rules! hi_span_offset {
    ($s:expr,$o:expr) => {{
        if $s.is_dummy() {
            DUMMY_SP
        } else {
            Span::new($s.hi - BytePos($o), $s.hi, Default::default())
        }
    }};
}

///
/// - `srcmap!(true)` for start (span.lo)
/// - `srcmap!(false)` for end (span.hi)
macro_rules! srcmap {
    ($emitter:expr, $n:expr, true) => {{
        let lo = $n.span_lo();
        if !lo.is_dummy() {
            $emitter.wr.add_srcmap(lo)?;
        }
    }};
    ($emitter:expr, $n:expr, false) => {
        let hi = $n.span_hi();
        if !hi.is_dummy() {
            $emitter.wr.add_srcmap(hi)?;
        }
    };
}
