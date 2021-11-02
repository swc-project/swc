macro_rules! emit {
    ($g:expr,$n:expr) => {{
        use crate::Emit;

        $g.emit(&$n)?;
    }};
}

macro_rules! punct {
    ($g:expr,$span:expr,$n:expr) => {{
        $g.wr.write_punct(Some($span), $n)?;
    }};

    ($g:expr,$n:expr) => {{
        $g.wr.write_punct(None, $n)?;
    }};
}

macro_rules! keyword {
    ($g:expr,$span:expr,$n:expr) => {{
        $g.wr.write_raw(Some($span), $n)?;
    }};

    ($g:expr,$n:expr) => {{
        $g.wr.write_raw(None, $n)?;
    }};
}

macro_rules! formatting_space {
    ($g:expr) => {{
        if !$g.config.minify {
            $g.wr.write_space()?;
        }
    }};
}

macro_rules! space {
    ($g:expr) => {{
        $g.wr.write_space()?;
    }};
}

macro_rules! semi {
    ($g:expr) => {{
        punct!($g, ";");
    }};
}
