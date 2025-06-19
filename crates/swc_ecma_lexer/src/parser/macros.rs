macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            tracing::debug!("{}: {:?}", stringify!($name), $p.input.cur());
        }
    }};
}
