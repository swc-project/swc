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
    (",") => {
        crate::token::Token::Comma
    };
    (":") => {
        crate::token::Token::Colon
    };
    ("!important") => {
        crate::token::Token::BangImportant
    };
    (".") => {
        crate::token::Token::Dot
    };
    ("*") => {
        crate::token::Token::Mul
    };
    ("#") => {
        crate::token::Token::Hash
    };
    ("[") => {
        crate::token::Token::LBracket
    };
    ("]") => {
        crate::token::Token::RBracket
    };
    ("<") => {
        crate::token::Token::Lt
    };
    (">") => {
        crate::token::Token::Gt
    };
    ("=") => {
        crate::token::Token::Eq
    };
    ("$=") => {
        crate::token::Token::DollarEq
    };
    ("*=") => {
        crate::token::Token::MulEq
    };
    ("^=") => {
        crate::token::Token::XorEq
    };
    ("|=") => {
        crate::token::Token::OrEq
    };
    ("~=") => {
        crate::token::Token::TildeEq
    };
    ("+") => {
        crate::token::Token::Plus
    };
    ("~") => {
        crate::token::Token::Tilde
    };
}

macro_rules! cur {
    ($parser:expr) => {{
        use crate::error::{Error, SyntaxError};

        match $parser.i.cur() {
            Some(token) => token,
            None => Err(Error {
                inner: Box::new(($parser.i.span(), SyntaxError::Eof)),
            })?,
        }
    }};
}

macro_rules! expect {
    ($parser:expr, $t:tt) => {{
        use crate::error::{Error, SyntaxError};

        match $parser.i.cur() {
            Some(tok!($t)) => {
                $parser.i.bump();
            }
            Some(other) => Err(Error {
                inner: Box::new((
                    $parser.i.span(),
                    SyntaxError::Expected {
                        expected: format!("{:?}", tok!($t)),
                        got: format!("{:?}", other),
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

macro_rules! is_one_of {
    ($parser:expr, $($t:tt),*) => {{
        match $parser.i.cur() {
            $(
               Some(tok!($t)) => true,
            )*
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

macro_rules! trace_cur {
    ($parser:expr, $name:ident) => {{
        // eprintln!("{}: {:?}", stringify!($name), cur!($parser));
    }};
}

/// Return an error
macro_rules! expected_one_of {
    ($parser:expr, $($t:tt),*) => {{
        Err(crate::error::Error {
            inner: Box::new((
                $parser.i.span(),
                crate::error::SyntaxError::Expected {
                    expected: concat!( $($t, )* ).to_string(),
                    got: format!("{:?}", cur!($parser)),
                },
            )),
        })?
    }};
}
