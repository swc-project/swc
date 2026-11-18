macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            #[cfg(debug_assertions)]
            tracing::debug!("{}: {:?}", stringify!($name), $p.input.cur());
        }
    }};
}
