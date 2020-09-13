macro_rules! tok {
    (";") => {
        crate::token::Token::Semi
    };
    ("{") => {
        crate::token::Token::LBrace
    };
    ("}") => {
        crate::token::Token::RBrace
    };
}

macro_rules! expect {
    ($parser:expr, $t:tt) => {{
        use crate::error::{Error, ErrorKind};

        match $parser.i.cur() {
            Some(tok!($t)) => {}
            Some(other) => Err(Error {
                inner: Box::new((
                    $parser.i.span(),
                    ErrorKind::Expected {
                        expected: tok!($t),
                        got: other,
                    },
                )),
            }),
            None => Err(Error {
                inner: Box::new(($parser.i.span(), ErrorKind::Eof)),
            }),
        }
    }};
}

macro_rules! is {
    ($parser:expr, $t:tt) => {{
        match $parser.i.cur() {
            Some(tok!($t)) => true,
            _ => false,
        }
    }};
}
