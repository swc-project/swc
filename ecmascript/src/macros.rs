macro_rules! tok {
    ('`') => { Token::BackQuote };
    // (';') => { Token::Semi };
    (',') => { Token::Comma };
    ('?') => { Token::QuestionMark };
    (':') => { Token::Colon };
    ("::") => { Token::ColonColon };
    ('.') => { Token::Dot };
    ("=>") => { Token::Arrow };
    ("...") => { Token::DotDotDot };
    ("${") => { Token::DollarLBrace };

    ('+') => { Token::BinOp(Add) };
    ('-') => { Token::BinOp(Sub) };
    ('*') => { Token::BinOp(Mul) };
    ('/') => { Token::BinOp(Div) };
    ("/=") => { Token::AssignOp(DivAssign) };
    ('%') => { Token::BinOp(Mod) };
    ('!') => { Token::Bang };
    ('~') => { Token::Tilde };
    ('<') => { Token::BinOp(Lt) };
    ('>') => { Token::BinOp(Gt) };

    ("++") => { Token::PlusPlus };
    ("--") => { Token::MinusMinus };

    ('=') => { Token::AssignOp(Assign) };



    ('(') => { Token::LParen };
    (')') => { Token::RParen };
    ('{') => { Token::LBrace };
    ('}') => { Token::RBrace };
    ('[') => { Token::LBracket };
    (']') => { Token::RBracket };


    ("async") => { Token::Word(Word::Ident(js_word!("async"))) };
    ("as") => { Token::Word(Word::Ident(js_word!("as"))) };
    ("await") => { Token::Word(Keyword(Await)) };
    ("case") => { Token::Word(Keyword(Case)) };
    ("catch") => { Token::Word(Keyword(Catch)) };
    ("class") => { Token::Word(Keyword(Class)) };
    ("const") => { Token::Word(Keyword(Const)) };
    ("default") => { Token::Word(Keyword(Default_)) };
    ("delete") => { Token::Word(Keyword(Delete)) };
    ("do") => { Token::Word(Keyword(Do)) };
    ("else") => { Token::Word(Keyword(Else)) };
    ("export") => { Token::Word(Keyword(Export)) };
    ("extends") => { Token::Word(Keyword(Extends)) };
    ("false") => { Token::Word(False) };
    ("finally") => { Token::Word(Keyword(Finally)) };
    ("for") => { Token::Word(Keyword(For)) };
    ("from") => { Token::Word(Word::Ident(js_word!("from"))) };
    ("function") => { Token::Word(Keyword(Function)) };
    ("if") => { Token::Word(Keyword(If)) };
    ("in") => { Token::Word(Keyword(In)) };
    ("import") => { Token::Word(Keyword(Import)) };
    ("let") => { Token::Word(Keyword(Let)) };
    ("new") => { Token::Word(Keyword(New)) };
    ("null") => { Token::Word(Null) };
    ("of") => { Token::Word(Ident(js_word!("of"))) };
    ("return") => { Token::Word(Keyword(Return)) };
    ("super") => { Token::Word(Keyword(Super)) };
    ("static") => { Token::Word(Word::Ident(js_word!("static"))) };
    ("switch") => { Token::Word(Keyword(Switch)) };
    ("target") => { Token::Word(Word::Ident(js_word!("target"))) };
    ("this") => { Token::Word(Keyword(This)) };
    ("throw") => { Token::Word(Keyword(Throw)) };
    ("true") => { Token::Word(True) };
    ("try") => { Token::Word(Keyword(Try)) };
    ("typeof") => { Token::Word(Keyword(TypeOf)) };
    ("var") => { Token::Word(Keyword(Var)) };
    ("void") => { Token::Word(Keyword(Void)) };
    ("while") => { Token::Word(Keyword(While)) };
    ("with") => { Token::Word(Keyword(With)) };
    ("yield") => { Token::Word(Keyword(Yield)) };
}

macro_rules! token_including_semi {
    (';') => { Token::Semi };
    ($t:tt) => { tok!($t) };
}

/// This macro requires macro named 'last_pos' to be in scope.
macro_rules! span {
    ($p:expr, $start:expr) => {
        Span { start: $start, end: last_pos!($p), }
    };
}

/// Takes `(parser, start)`, Returns  |t| { Spanned::from }
macro_rules! into_spanned {
    ($p:expr, $start:expr) => {{
        |val| {
            let start = $start;
            let end = last_pos!($p);
            return ::swc_common::Spanned::from_unspanned(val, Span { start, end });
        }
    }}
}

macro_rules! spanned {
    (
        $p:expr, { $($body:tt)* }
    ) => {{
        let start = cur_pos!($p);
        let val: Result<_, _> = {
            $($body)*
        };
        #[allow(unreachable_code)]
        {
            val.map(into_spanned!($p, start))
        }
    }};
}
