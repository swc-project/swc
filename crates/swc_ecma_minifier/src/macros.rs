/// Used when something is modified.
macro_rules! report_change {
    ($($tt:tt)+) => {{}};
}

/// Used when a function decided to give up.
macro_rules! log_abort {
    ($($tt:tt)+) => {{}};
}

macro_rules! dump_change_detail {
    ($($tt:tt)+) => {{}};
}

macro_rules! trace_op {
    ($($tt:tt)+) => {{}};
}
