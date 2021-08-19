macro_rules! emit {
    ($g:expr,$n:expr) => {{
        use crate::Emit;

        $g.emit(&$n)?;
    }};
}

macro_rules! punct {
    ($g:expr,$n:expr) => {{
        write!($g.wr, "{}", $n)?;
    }};
}

macro_rules! keyword {
    ($g:expr,$n:expr) => {{
        write!($g.wr, "{}", $n)?;
    }};
}

macro_rules! space {
    ($g:expr) => {{
        write!($g.wr, " ")?;
    }};
}

macro_rules! semi {
    ($g:expr) => {{
        write!($g.wr, ";")?;
    }};
}
