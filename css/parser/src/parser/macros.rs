macro_rules! span {
    ($parser:expr, $start:expr) => {{
        swc_common::Span::new($start, $parser.input.last_pos(), Default::default())
    }};
}

macro_rules! tok_pat {
    (Ident) => {
        crate::token::Token::Ident(..)
    };

    (AtKeyword) => {
        crate::token::Token::AtKeyword(..)
    };

    (Function) => {
        crate::token::Token::Function { .. }
    };

    (Str) => {
        crate::token::Token::Str { .. }
    };

    (Num) => {
        crate::token::Token::Num { .. }
    };

    ($t:tt) => {
        tok!($t)
    };
}

macro_rules! cur {
    ($parser:expr) => {
        match $parser.input.cur()? {
            Some(v) => v,
            None => {
                let last_pos = $parser.input.last_pos();
                let span = swc_common::Span::new(last_pos, last_pos, Default::default());
                Err(crate::error::Error::new(span, crate::error::ErrorKind::Eof))?
            }
        }
    };
}

macro_rules! bump {
    ($parser:expr) => {
        $parser.input.bump()?.unwrap().token
    };
}

macro_rules! is {
    ($parser:expr, EOF) => {{
        $parser.input.cur()?.is_none()
    }};

    ($parser:expr, $tt:tt) => {{
        match cur!($parser) {
            tok_pat!($tt) => true,
            _ => false,
        }
    }};
}

macro_rules! peeked_is {
    ($parser:expr, $tt:tt) => {{
        match $parser.input.peek()? {
            Some(peeked) => match peeked {
                tok_pat!($tt) => true,
                _ => false,
            },
            None => false,
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

macro_rules! eat {
    ($parser:expr, $tt:tt) => {
        if is!($parser, $tt) {
            bump!($parser);
            true
        } else {
            false
        }
    };
}

macro_rules! expect {
    ($parser:expr, $tt:tt) => {
        if !eat!($parser, $tt) {
            let span = $parser.input.cur_span()?;
            Err(crate::error::Error::new(
                span,
                crate::error::ErrorKind::ExpectedButGot(
                    stringify!($tt),
                    format!("{:?}", $parser.input.cur()),
                ),
            ))?
        }
    };
}
