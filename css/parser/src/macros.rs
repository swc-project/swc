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
    ("(") => {
        crate::token::Token::LParen
    };
    (")") => {
        crate::token::Token::RParen
    };
}

macro_rules! expect {
    ($parser:expr, $t:tt) => {{
        use crate::error::{Error, SyntaxError};

        match $parser.i.cur() {
            Some(tok!($t)) => {}
            Some(other) => Err(Error {
                inner: Box::new((
                    $parser.i.span(),
                    SyntaxError::Expected {
                        expected: tok!($t),
                        got: other,
                    },
                )),
            })?,
            None => Err(Error {
                inner: Box::new(($parser.i.span(), SyntaxError::Eof)),
            })?,
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

macro_rules! eat {
    ($parser:expr, $t:tt) => {{
        if is!($parser, $t) {
            $parser.i.bump();
            true
        } else {
            false
        }
    }};
}
