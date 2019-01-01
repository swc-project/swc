macro_rules! tok {
    ('`') => {
        Token::BackQuote
    };
    // (';') => { Token::Semi };
    ('@') => {
        Token::At
    };

    (',') => {
        Token::Comma
    };
    ('?') => {
        Token::QuestionMark
    };
    (':') => {
        Token::Colon
    };
    ("::") => {
        Token::ColonColon
    };
    ('.') => {
        Token::Dot
    };
    ("=>") => {
        Token::Arrow
    };
    ("...") => {
        Token::DotDotDot
    };
    ("${") => {
        Token::DollarLBrace
    };

    ('+') => {
        Token::BinOp(Add)
    };
    ('-') => {
        Token::BinOp(Sub)
    };
    ('*') => {
        Token::BinOp(Mul)
    };
    ('/') => {
        Token::BinOp(Div)
    };
    ("/=") => {
        Token::AssignOp(DivAssign)
    };
    ('%') => {
        Token::BinOp(Mod)
    };
    ('!') => {
        Token::Bang
    };
    ('~') => {
        Token::Tilde
    };
    ('<') => {
        Token::BinOp(Lt)
    };
    ('>') => {
        Token::BinOp(Gt)
    };

    ("++") => {
        Token::PlusPlus
    };
    ("--") => {
        Token::MinusMinus
    };

    ('=') => {
        Token::AssignOp(Assign)
    };

    ('(') => {
        Token::LParen
    };
    (')') => {
        Token::RParen
    };
    ('{') => {
        Token::LBrace
    };
    ('}') => {
        Token::RBrace
    };
    ('[') => {
        Token::LBracket
    };
    (']') => {
        Token::RBracket
    };

    ("async") => {
        Token::Word(Word::Ident(js_word!("async")))
    };
    ("as") => {
        Token::Word(Word::Ident(js_word!("as")))
    };
    ("await") => {
        Token::Word(Keyword(Await))
    };
    ("break") => {
        Token::Word(Keyword(Break))
    };
    ("case") => {
        Token::Word(Keyword(Case))
    };
    ("catch") => {
        Token::Word(Keyword(Catch))
    };
    ("class") => {
        Token::Word(Keyword(Class))
    };
    ("const") => {
        Token::Word(Keyword(Const))
    };
    ("continue") => {
        Token::Word(Keyword(Continue))
    };
    ("debugger") => {
        Token::Word(Keyword(Debugger))
    };
    ("default") => {
        Token::Word(Keyword(Default_))
    };
    ("delete") => {
        Token::Word(Keyword(Delete))
    };
    ("do") => {
        Token::Word(Keyword(Do))
    };
    ("else") => {
        Token::Word(Keyword(Else))
    };
    ("export") => {
        Token::Word(Keyword(Export))
    };
    ("extends") => {
        Token::Word(Keyword(Extends))
    };
    ("false") => {
        Token::Word(False)
    };
    ("finally") => {
        Token::Word(Keyword(Finally))
    };
    ("for") => {
        Token::Word(Keyword(For))
    };
    ("from") => {
        Token::Word(Word::Ident(js_word!("from")))
    };
    ("function") => {
        Token::Word(Keyword(Function))
    };
    ("if") => {
        Token::Word(Keyword(If))
    };
    ("in") => {
        Token::Word(Keyword(In))
    };
    ("import") => {
        Token::Word(Keyword(Import))
    };
    ("let") => {
        Token::Word(Keyword(Let))
    };
    ("new") => {
        Token::Word(Keyword(New))
    };
    ("null") => {
        Token::Word(Null)
    };
    ("of") => {
        Token::Word(Ident(js_word!("of")))
    };
    ("return") => {
        Token::Word(Keyword(Return))
    };
    ("super") => {
        Token::Word(Keyword(Super))
    };
    ("static") => {
        Token::Word(Word::Ident(js_word!("static")))
    };
    ("switch") => {
        Token::Word(Keyword(Switch))
    };
    ("target") => {
        Token::Word(Word::Ident(js_word!("target")))
    };
    ("this") => {
        Token::Word(Keyword(This))
    };
    ("throw") => {
        Token::Word(Keyword(Throw))
    };
    ("true") => {
        Token::Word(True)
    };
    ("try") => {
        Token::Word(Keyword(Try))
    };
    ("typeof") => {
        Token::Word(Keyword(TypeOf))
    };
    ("var") => {
        Token::Word(Keyword(Var))
    };
    ("void") => {
        Token::Word(Keyword(Void))
    };
    ("while") => {
        Token::Word(Keyword(While))
    };
    ("with") => {
        Token::Word(Keyword(With))
    };
    ("yield") => {
        Token::Word(Keyword(Yield))
    };

    // ----------
    // JSX
    // ----------
    (JSXTagStart) => {
        Token::JSXTagStart
    };

    (JSXTagEnd) => {
        Token::JSXTagEnd
    };

    // ----------
    // Typescript
    // ----------
    ("implements") => {
        Token::Word(Word::Ident(js_word!("implements")))
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
