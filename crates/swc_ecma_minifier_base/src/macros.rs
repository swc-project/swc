/// Used when something is modified.
#[macro_export]
macro_rules! report_change {
    ($($tt:tt)+) => {{
        tracing::debug!(
            kind = "change",
            $($tt)*
        );
    }};
}

/// Used when a function decided to give up.
#[macro_export]
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

#[macro_export]
macro_rules! dump_change_detail {
    ($($tt:tt)+) => {{
        if cfg!(feature = "debug") {
            tracing::trace!(
                kind = "detail",
                $($tt)*
            );
        }
    }};
}

#[macro_export]
macro_rules! trace_op {
    ($($tt:tt)+) => {{
        if cfg!(feature = "debug") {
            tracing::trace!(
                $($tt)*
            );
        }
    }};
}
