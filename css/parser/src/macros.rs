macro_rules! tok {
    (";") => {
        crate::token::Token::Semi;
    };
}

macro_rules! expect {
    ($parser:expr, $t:tt) => {{
        use crate::error::{Error, ErrorKind};

        match $parser.lexer.next() {
            tok!($t) => true,
            _ => Err(Error {
                inner: Box::new(span!($parser), ErrorKind::Eof),
            }),
        }
    }};
}
