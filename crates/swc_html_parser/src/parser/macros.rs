macro_rules! is {
    ($parser:expr, EOF) => {{
        $parser.input.cur()?.is_none()
    }};

    ($parser:expr, $tt:tt) => {{
        match $parser.input.cur()? {
            Some(tok_pat!($tt)) => true,
            _ => false,
        }
    }};
}

macro_rules! is_one_of {
    ($parser:expr, $($tt:tt),+) => {
        $(
            is!($parser, $tt)
        )||*
    };
}
