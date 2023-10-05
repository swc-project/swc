#[allow(unused)]
macro_rules! tok {
    ('`') => {
        crate::token::TokenKind::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        crate::token::TokenKind::At
    };
    ('#') => {
        crate::token::TokenKind::Hash
    };

    ('&') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::BitAnd)
    };
    ('|') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::BitOr)
    };
    ('^') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::BitXor)
    };
    ('+') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Sub)
    };
    ("??") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::NullishCoalescing)
    };
    ('~') => {
        crate::token::TokenKind::Tilde
    };
    ('!') => {
        crate::token::TokenKind::Bang
    };
    ("&&") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::LogicalAnd)
    };
    ("||") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::LogicalOr)
    };
    ("&&=") => {
        crate::token::TokenKind::AssignOp(crate::token::AssignOpToken::AndAssign)
    };
    ("||=") => {
        crate::token::TokenKind::AssignOp(crate::token::AssignOpToken::OrAssign)
    };
    ("??=") => {
        crate::token::TokenKind::AssignOp(crate::token::AssignOpToken::NullishAssign)
    };

    ("==") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::EqEq)
    };
    ("===") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::EqEqEq)
    };
    ("!=") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::NotEq)
    };
    ("!==") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::NotEqEq)
    };

    (',') => {
        crate::token::TokenKind::Comma
    };
    ('?') => {
        crate::token::TokenKind::QuestionMark
    };
    (':') => {
        crate::token::TokenKind::Colon
    };
    ('.') => {
        crate::token::TokenKind::Dot
    };
    ("=>") => {
        crate::token::TokenKind::Arrow
    };
    ("...") => {
        crate::token::TokenKind::DotDotDot
    };
    ("${") => {
        crate::token::TokenKind::DollarLBrace
    };

    ('+') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Sub)
    };
    ('*') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Mul)
    };
    ('/') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Div)
    };
    ("/=") => {
        crate::token::TokenKind::AssignOp(crate::token::AssignOpToken::DivAssign)
    };
    ('%') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Mod)
    };
    ('~') => {
        crate::token::TokenKind::Tilde
    };
    ('<') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Lt)
    };
    ('>') => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::Gt)
    };
    ("<<") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::LShift)
    };
    (">>") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::RShift)
    };
    (">=") => {
        crate::token::TokenKind::BinOp(crate::token::BinOpToken::GtEq)
    };

    ("++") => {
        crate::token::TokenKind::PlusPlus
    };
    ("--") => {
        crate::token::TokenKind::MinusMinus
    };

    ('=') => {
        crate::token::TokenKind::AssignOp(crate::token::AssignOpToken::Assign)
    };

    ('(') => {
        crate::token::TokenKind::LParen
    };
    (')') => {
        crate::token::TokenKind::RParen
    };
    ('{') => {
        crate::token::TokenKind::LBrace
    };
    ('}') => {
        crate::token::TokenKind::RBrace
    };
    ('[') => {
        crate::token::TokenKind::LBracket
    };
    (']') => {
        crate::token::TokenKind::RBracket
    };

    ("let") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Let))
    };
    ("var") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Var))
    };
    ("await") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Await,
        ))
    };
    ("break") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Break,
        ))
    };
    ("case") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Case))
    };
    ("catch") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Catch,
        ))
    };
    ("class") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Class,
        ))
    };
    ("const") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Const,
        ))
    };
    ("continue") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Continue,
        ))
    };
    ("debugger") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Debugger,
        ))
    };
    ("default") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Default_,
        ))
    };
    ("delete") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Delete,
        ))
    };
    ("do") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Do))
    };
    ("else") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Else))
    };
    ("export") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Export,
        ))
    };
    ("extends") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Extends,
        ))
    };
    ("false") => {
        crate::token::TokenKind::Word(crate::token::WordKind::False)
    };
    ("finally") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Finally,
        ))
    };
    ("for") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::For))
    };

    ("function") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Function,
        ))
    };
    ("if") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::If))
    };
    ("in") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::In))
    };
    ("instanceof") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::InstanceOf,
        ))
    };
    ("import") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Import,
        ))
    };

    ("new") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::New))
    };
    ("null") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Null)
    };

    ("return") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Return,
        ))
    };
    ("super") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Super,
        ))
    };

    ("switch") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Switch,
        ))
    };

    ("this") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::This))
    };
    ("throw") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Throw,
        ))
    };
    ("true") => {
        crate::token::TokenKind::Word(crate::token::WordKind::True)
    };
    ("try") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Try))
    };
    ("typeof") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::TypeOf,
        ))
    };

    ("void") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::Void))
    };
    ("while") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::While,
        ))
    };
    ("with") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(crate::token::Keyword::With))
    };
    ("yield") => {
        crate::token::TokenKind::Word(crate::token::WordKind::Keyword(
            crate::token::Keyword::Yield,
        ))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        crate::token::TokenKind::JSXTagStart
    };

    (JSXTagEnd) => {
        crate::token::TokenKind::JSXTagEnd
    };

    ($tt:tt) => {
        known_ident_token!($tt)
    };
}

macro_rules! token_including_semi {
    (';') => {
        crate::token::TokenKind::Semi
    };
    ($t:tt) => {
        tok!($t)
    };
}
