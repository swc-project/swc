macro_rules! emit {
    ($g:expr,$n:expr) => {{
        use crate::Emit;

        $g.emit(&$n)?;
    }};
}
