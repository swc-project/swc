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
    ("break") => { Token::Word(Keyword(Break)) };
    ("case") => { Token::Word(Keyword(Case)) };
    ("catch") => { Token::Word(Keyword(Catch)) };
    ("class") => { Token::Word(Keyword(Class)) };
    ("const") => { Token::Word(Keyword(Const)) };
    ("continue") => { Token::Word(Keyword(Continue)) };
    ("debugger") => { Token::Word(Keyword(Debugger)) };
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
    ($p:expr, $start:expr) => {{
        let start: ::swc_common::BytePos = $start;
        let end: ::swc_common::BytePos = last_pos!($p);
        if cfg!(debug_assertions) && start > end {
            unreachable!("assertion failed: (span.start <= span.end).
 start = {}, end = {}", start.0, end.0)
        }
        ::swc_common::Span::new(start, end, Default::default())
    }};
}

macro_rules! spanned {
    (
        $p:expr, { $($body:tt)* }
    ) => {{
        let start = { cur_pos!($p) };
        let val: Result<_, _> = {
            $($body)*
        };
        {
            match val {
                Ok(val) => {
                    let span = span!($p, start);
                    let val = ::swc_common::Spanned::from_unspanned(val, span);
                    Ok(val)
                },
                Err(err) => Err(err),
            }
        }
    }};
}

macro_rules! syntax_error {
    ($p:expr, $err:expr) => {
        syntax_error!($p, $p.input.cur_span(), $err)
    };

    ($p:expr, $span:expr, $err:expr) => {{
        let err = $crate::error::ErrorToDiag {
            handler: $p.session.handler,
            span: $span,
            error: $err,
        };
        let res: Result<!, _> = Err(err);
        res?
    }};
}
