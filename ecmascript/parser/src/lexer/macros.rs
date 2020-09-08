macro_rules! itok {
    ("<") => {
        swc_ecma_raw_lexer::InternalToken::Lt
    };
    ("<=") => {
        swc_ecma_raw_lexer::InternalToken::Lte
    };
    (">") => {
        swc_ecma_raw_lexer::InternalToken::Gt
    };
    (">=") => {
        swc_ecma_raw_lexer::InternalToken::Gte
    };

    ("(") => {
        swc_ecma_raw_lexer::InternalToken::LParen
    };
    (")") => {
        swc_ecma_raw_lexer::InternalToken::RParen
    };

    ("[") => {
        swc_ecma_raw_lexer::InternalToken::LBracket
    };
    ("]") => {
        swc_ecma_raw_lexer::InternalToken::RBracket
    };

    ("{") => {
        swc_ecma_raw_lexer::InternalToken::LBrace
    };
    ("}") => {
        swc_ecma_raw_lexer::InternalToken::RBrace
    };

    ("&") => {
        swc_ecma_raw_lexer::InternalToken::BitAnd
    };
    ("#") => {
        swc_ecma_raw_lexer::InternalToken::Hash
    };
    ("\\") => {
        swc_ecma_raw_lexer::InternalToken::BackSlash
    };
    (".") => {
        swc_ecma_raw_lexer::InternalToken::Dot
    };
    ("...") => {
        swc_ecma_raw_lexer::InternalToken::DotDotDot
    };

    ("??=") => {
        swc_ecma_raw_lexer::InternalToken::NullishAssign
    };
    ("??") => {
        swc_ecma_raw_lexer::InternalToken::NullishCoalescing
    };
    ("?") => {
        swc_ecma_raw_lexer::InternalToken::QuestionMark
    };

    ("`") => {
        swc_ecma_raw_lexer::InternalToken::Tilde
    };
    (":") => {
        swc_ecma_raw_lexer::InternalToken::Colon
    };
    (",") => {
        swc_ecma_raw_lexer::InternalToken::Comma
    };
    (";") => {
        swc_ecma_raw_lexer::InternalToken::Semi
    };
    ("@") => {
        swc_ecma_raw_lexer::InternalToken::At
    };

    ("+") => {
        swc_ecma_raw_lexer::InternalToken::Plus
    };
    ("-") => {
        swc_ecma_raw_lexer::InternalToken::Minus
    };
    ("*") => {
        swc_ecma_raw_lexer::InternalToken::Mul
    };
    ("/") => {
        swc_ecma_raw_lexer::InternalToken::Div
    };
    ("%") => {
        swc_ecma_raw_lexer::InternalToken::Mod
    };
    ("*") => {
        swc_ecma_raw_lexer::InternalToken::Mul
    };
    ("**") => {
        swc_ecma_raw_lexer::InternalToken::Exp
    };
    ("|") => {
        swc_ecma_raw_lexer::InternalToken::BitOr
    };
    ("&") => {
        swc_ecma_raw_lexer::InternalToken::BitAnd
    };
    ("^") => {
        swc_ecma_raw_lexer::InternalToken::BitXor
    };
    ("||") => {
        swc_ecma_raw_lexer::InternalToken::Or
    };
    ("&&") => {
        swc_ecma_raw_lexer::InternalToken::And
    };

    ("*=") => {
        swc_ecma_raw_lexer::InternalToken::MulAssign
    };
    ("**=") => {
        swc_ecma_raw_lexer::InternalToken::ExpAssign
    };
    ("|=") => {
        swc_ecma_raw_lexer::InternalToken::BitOrAssign
    };
    ("&=") => {
        swc_ecma_raw_lexer::InternalToken::BitAndAssign
    };
    ("^=") => {
        swc_ecma_raw_lexer::InternalToken::BitXorAssign
    };
    ("||=") => {
        swc_ecma_raw_lexer::InternalToken::OrAssign
    };
    ("&&=") => {
        swc_ecma_raw_lexer::InternalToken::AndAssign
    };
}
