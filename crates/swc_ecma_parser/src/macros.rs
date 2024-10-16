#[allow(unused)]
macro_rules! tok {
    ('`') => {
        crate::token::Token::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        crate::token::Token::At
    };
    ('#') => {
        crate::token::Token::Hash
    };

    ('&') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::BitAnd)
    };
    ('|') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::BitOr)
    };
    ('^') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::BitXor)
    };
    ('+') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Sub)
    };
    ("??") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::NullishCoalescing)
    };
    ('~') => {
        crate::token::Token::Tilde
    };
    ('!') => {
        crate::token::Token::Bang
    };
    ("&&") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::LogicalAnd)
    };
    ("||") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::LogicalOr)
    };
    ("&&=") => {
        crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::AndAssign)
    };
    ("||=") => {
        crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::OrAssign)
    };
    ("??=") => {
        crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::NullishAssign)
    };

    ("==") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::EqEq)
    };
    ("===") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::EqEqEq)
    };
    ("!=") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::NotEq)
    };
    ("!==") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::NotEqEq)
    };

    (',') => {
        crate::token::Token::Comma
    };
    ('?') => {
        crate::token::Token::QuestionMark
    };
    (':') => {
        crate::token::Token::Colon
    };
    ('.') => {
        crate::token::Token::Dot
    };
    ("=>") => {
        crate::token::Token::Arrow
    };
    ("...") => {
        crate::token::Token::DotDotDot
    };
    ("${") => {
        crate::token::Token::DollarLBrace
    };

    ('+') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Add)
    };
    ('-') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Sub)
    };
    ('*') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Mul)
    };
    ('/') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Div)
    };
    ("/=") => {
        crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::DivAssign)
    };
    ('%') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Mod)
    };
    ('~') => {
        crate::token::Token::Tilde
    };
    ('<') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Lt)
    };
    ("<<") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::LShift)
    };
    ("<=") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::LtEq)
    };
    ("<<=") => {
        crate::token::Token::AssignOp(crate::token::AssignOp::LShiftAssign)
    };
    ('>') => {
        crate::token::Token::BinOp(crate::token::BinOpToken::Gt)
    };
    (">>") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::RShift)
    };
    (">>>") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::ZeroFillRShift)
    };
    (">=") => {
        crate::token::Token::BinOp(crate::token::BinOpToken::GtEq)
    };
    (">>=") => {
        crate::token::Token::AssignOp(crate::AssignOp::RShiftAssign)
    };
    (">>>=") => {
        crate::token::Token::AssignOp(crate::AssignOp::ZeroFillRShiftAssign)
    };

    ("++") => {
        crate::token::Token::PlusPlus
    };
    ("--") => {
        crate::token::Token::MinusMinus
    };

    ('=') => {
        crate::token::Token::AssignOp(swc_ecma_ast::AssignOp::Assign)
    };

    ('(') => {
        crate::token::Token::LParen
    };
    (')') => {
        crate::token::Token::RParen
    };
    ('{') => {
        crate::token::Token::LBrace
    };
    ('}') => {
        crate::token::Token::RBrace
    };
    ('[') => {
        crate::token::Token::LBracket
    };
    (']') => {
        crate::token::Token::RBracket
    };

    ("await") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Await))
    };
    ("break") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Break))
    };
    ("case") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Case))
    };
    ("catch") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Catch))
    };
    ("class") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Class))
    };
    ("const") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Const))
    };
    ("continue") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Continue))
    };
    ("debugger") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Debugger))
    };
    ("default") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Default_))
    };
    ("delete") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Delete))
    };
    ("do") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Do))
    };
    ("else") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Else))
    };
    ("export") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Export))
    };
    ("extends") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Extends))
    };
    ("false") => {
        crate::token::Token::Word(crate::token::Word::False)
    };
    ("finally") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Finally))
    };
    ("for") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::For))
    };
    ("function") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Function))
    };
    ("if") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::If))
    };
    ("in") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::In))
    };
    ("instanceof") => {
        crate::token::Token::Word(crate::token::Word::Keyword(
            crate::token::Keyword::InstanceOf,
        ))
    };
    ("import") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Import))
    };
    ("let") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Let))
    };
    ("new") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::New))
    };
    ("null") => {
        crate::token::Token::Word(crate::token::Word::Null)
    };

    ("return") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Return))
    };
    ("super") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Super))
    };
    ("switch") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Switch))
    };
    ("this") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::This))
    };
    ("throw") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Throw))
    };
    ("true") => {
        crate::token::Token::Word(crate::token::Word::True)
    };
    ("try") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Try))
    };
    ("typeof") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::TypeOf))
    };
    ("var") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Var))
    };
    ("void") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Void))
    };
    ("while") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::While))
    };
    ("with") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::With))
    };
    ("yield") => {
        crate::token::Token::Word(crate::token::Word::Keyword(crate::token::Keyword::Yield))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        crate::token::Token::JSXTagStart
    };

    (JSXTagEnd) => {
        crate::token::Token::JSXTagEnd
    };

    ($tt:tt) => {
        crate::token::Token::Word(crate::token::Word::Ident(crate::token::IdentLike::Known(
            known_ident!($tt),
        )))
    };
}

macro_rules! token_including_semi {
    (';') => {
        Token::Semi
    };
    ($t:tt) => {
        tok!($t)
    };
}
