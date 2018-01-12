macro_rules! cur {
    ($l:expr) => {{
        $l.input.current()
    }};
}
macro_rules! bump {
    ($l:expr) => {{
        $l.input.bump()
    }};
}
macro_rules! peek {
    ($l:expr) => {{
        $l.input.peek()
    }};
}
macro_rules! peek_ahead {
    ($l:expr) => {{
        $l.input.peek_ahead()
    }};
}

macro_rules! cur_pos {
    ($l:expr) => {{
        $l.input.cur_pos()
    }};
}

macro_rules! last_pos {
    ($l:expr) => {{
        $l.input.last_pos()
    }};
}

macro_rules! is {
    ($l:expr, $t:tt) => {{
        cur!($l) == Some($t)
    }};
}

macro_rules! eat {
    ($l:expr, $t:tt) => {{
        if is!($l, $t) {
            bump!($l);
            true
        } else {
            false
        }
    }};
}
