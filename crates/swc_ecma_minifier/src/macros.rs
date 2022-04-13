/// Used when something is modified.
macro_rules! report_change {
    ($($tt:tt)+) => {{
        tracing::debug!(
            kind = "change",
            $($tt)*
        );
    }};
}

/// Used when a function decided to give up.
macro_rules! log_abort {
    ($($tt:tt)+) => {{
        if cfg!(feature = "debug") {
            tracing::trace!(
                kind = "abort",
                $($tt)*
            );
        }
    }};
}
