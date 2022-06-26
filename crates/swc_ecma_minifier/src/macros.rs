/// Used when something is modified.
macro_rules! report_change {
    ($($tt:tt)+) => {{
        #[cfg(feature = "debug")]
        tracing::debug!(
            kind = "change",
            $($tt)*
        );
    }};
}

/// Used when a function decided to give up.
macro_rules! log_abort {
    ($($tt:tt)+) => {{
        #[cfg(feature = "debug")]
        {
            tracing::trace!(
                kind = "abort",
                $($tt)*
            );
        }
    }};
}

macro_rules! dump_change_detail {
    ($($tt:tt)+) => {{
        #[cfg(feature = "debug")]
        {
            tracing::trace!(
                kind = "detail",
                $($tt)*
            );
        }
    }};
}

macro_rules! trace_op {
    ($($tt:tt)+) => {{
        #[cfg(feature = "debug")]
        {
            tracing::trace!(
                $($tt)*
            );
        }
    }};
}
