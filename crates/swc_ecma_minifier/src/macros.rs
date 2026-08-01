/// Used when something is modified.
macro_rules! report_change {
    ($($tt:tt)+) => {{
        #[cfg(all(debug_assertions, feature = "debug"))]
        #[cfg(debug_assertions)]
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
            #[cfg(debug_assertions)]
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
            #[cfg(debug_assertions)]
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
            #[cfg(debug_assertions)]
            tracing::trace!(
                $($tt)*
            );
        }
    }};
}
