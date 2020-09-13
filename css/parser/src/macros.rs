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

        match $parser.lexer.cur() {
            Some(tok!($t)) => true,
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
