macro_rules! log_change {
    ($($tt:tt)+) => {{
        tracing::debug!(
            kind = "change",
            $($tt)*
        );
    }};
}
