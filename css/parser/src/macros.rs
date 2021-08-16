macro_rules! ident_tok {
    ($tt:tt) => {
        crate::token::Token::Ident(swc_atoms::js_word!($tt))
    };
}

macro_rules! tok {
    ("(") => {
        crate::token::Token::LParen
    };

    (")") => {
        crate::token::Token::RParen
    };

    ("%") => {
        crate::token::Token::Percent
    };

    ("--") => {
        crate::token::Token::MinusMinus
    };

    (",") => {
        crate::token::Token::Comma
    };

    (";") => {
        crate::token::Token::Semi
    };

    ("!") => {
        crate::token::Token::Bang
    };

    ("{") => {
        crate::token::Token::LBrace
    };

    ("}") => {
        crate::token::Token::RBrace
    };

    ("[") => {
        crate::token::Token::LBracket
    };

    ("]") => {
        crate::token::Token::RBracket
    };

    (":") => {
        crate::token::Token::Colon
    };

    ("*") => {
        crate::token::Token::Asterisk
    };

    (".") => {
        crate::token::Token::Dot
    };

    ("#") => {
        crate::token::Token::Hash
    };

    ("&") => {
        crate::token::Token::Ampersand
    };

    ("|") => {
        crate::token::Token::Bar
    };

    ("$") => {
        crate::token::Token::Dollar
    };

    ("^") => {
        crate::token::Token::Caret
    };

    ("~") => {
        crate::token::Token::Tilde
    };

    ("=") => {
        crate::token::Token::Equals
    };

    (" ") => {
        crate::token::Token::WhiteSpace
    };

    ("<!--") => {
        crate::token::Token::CDO
    };

    ("-->") => {
        crate::token::Token::CDC
    };

    ("+") => {
        crate::token::Token::Plus
    };

    ("-") => {
        crate::token::Token::Minus
    };

    ("/") => {
        crate::token::Token::Div
    };

    ("important") => {
        ident_tok!("important")
    };

    ("not") => {
        ident_tok!("not")
    };

    ("or") => {
        ident_tok!("or")
    };

    ("and") => {
        ident_tok!("and")
    };
}
