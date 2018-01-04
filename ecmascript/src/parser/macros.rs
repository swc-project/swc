macro_rules! tok {
    ('`') => { Token::BackQuote };
    (';') => { Token::Semi };
    (',') => { Token::Comma };
    ('?') => { Token::QuestionMark };
    (':') => { Token::Colon };
    ('.') => { Token::Dot };

    ('+') => { Token::BinOp(Add) };
    ('-') => { Token::BinOp(Sub) };
    ('*') => { Token::BinOp(Mul) };
    ('/') => { Token::BinOp(Div) };
    ('%') => { Token::BinOp(Mod) };
    ('!') => { Token::Bang };
    ('~') => { Token::Tilde };

    ("++") => { Token::PlusPlus };
    ("--") => { Token::MinusMinus };


    ('(') => { Token::LParen };
    (')') => { Token::RParen };
    ('{') => { Token::LBrace };
    ('}') => { Token::RBrace };
    ('[') => { Token::LBracket };
    (']') => { Token::RBracket };


    ("async") => { Token::Word(Word::Ident(js_word!("async"))) };
    ("await") => { Token::Word(Keyword(Await)) };
    ("case") => { Token::Word(Keyword(Case)) };
    ("catch") => { Token::Word(Keyword(Catch)) };
    ("class") => { Token::Word(Keyword(Class)) };
    ("default") => { Token::Word(Keyword(Default_)) };
    ("delete") => { Token::Word(Keyword(Delete)) };
    ("do") => { Token::Word(Keyword(Do)) };
    ("else") => { Token::Word(Keyword(Else)) };
    ("false") => { Token::Word(False) };
    ("finally") => { Token::Word(Keyword(Finally)) };
    ("function") => { Token::Word(Keyword(Function)) };
    ("if") => { Token::Word(Keyword(If)) };
    ("new") => { Token::Word(Keyword(New)) };
    ("null") => { Token::Word(Null) };
    ("return") => { Token::Word(Keyword(Return)) };
    ("super") => { Token::Word(Keyword(Super)) };
    ("switch") => { Token::Word(Keyword(Switch)) };
    ("target") => { Token::Word(Word::Ident(js_word!("target"))) };
    ("this") => { Token::Word(Keyword(This)) };
    ("throw") => { Token::Word(Keyword(Throw)) };
    ("true") => { Token::Word(True) };
    ("try") => { Token::Word(Keyword(Try)) };
    ("typeof") => { Token::Word(Keyword(TypeOf)) };
    ("void") => { Token::Word(Keyword(Void)) };
    ("while") => { Token::Word(Keyword(While)) };
    ("with") => { Token::Word(Keyword(With)) };
    ("yield") => { Token::Word(Keyword(Yield)) };
}

macro_rules! unexpected {
    ($p:expr) => {{
        unimplemented!("unexpected token: {:?}", cur!($p))
    }};
}

macro_rules! syntax_error {
    ($p:expr, $s:expr) => {{
        let err: PResult<()> = Err(
            Error::Syntax($p.input.cur().cloned(), cur_span!($p), $s)
        );
        err?
    }};
}

/// This does **not** handle automatic semicolon insertion.
macro_rules! is {
    ($p:expr, $t:tt) => {{
        $p.input.is(&tok!($t))
    }};
}

macro_rules! peeked_is {
    ($p:expr, $t:tt) => {
        $p.input.peeked_is(&tok!($t))
    };
}

macro_rules! is_one_of {
    ($p:expr, $($t:tt),+) => {{
        false
        $(
            || is!($p, $t)
        )*
    }};
}

// This will panic if current != token
macro_rules! assert_and_bump {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &tok!($t);
        if !$p.input.is(TOKEN) {
            unreachable!("assertion failed: expected {:?}, got {:?}", TOKEN, $p.input.cur());
        }
        $p.input.bump()
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool
macro_rules! eat {
    ($p:expr, ';') => {{
        debug!($p.logger, "eat_or_inject_semi: cur={:?}", cur!($p));
        $p.input.eat(&Token::Semi) || cur!($p) == None || is!($p, '}')
            || $p.input.had_line_break_before_cur()
    }};

    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &tok!($t);
        $p.input.eat(TOKEN)
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns PResult<()>
macro_rules! expect {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &tok!($t);
        if !eat!($p, $t) {
            syntax_error!($p, SyntaxError::Expected(TOKEN))
        }
    }};
}

macro_rules! cur {
    ($parser:expr) => {
        $parser.input.cur()
    };
}

macro_rules! peek {
    ($p:expr) => {
        $p.input.peek()
    };
}

macro_rules! bump {
    ($parser:expr) => {
        $parser.input.bump()
    };
}

macro_rules! spanned {
    (
        $parser:expr, $($body:tt)*
    ) => {{
        let start = cur_span!($parser).start;
        let val: PResult<_> = {
            $($body)*
        };
        #[allow(unreachable_code)]
        {
            let val = val?;

            let end = prev_span!($parser).end;
            Ok(::swc_common::Spanned::from_unspanned(val, Span { start, end }))
        }
    }};
}

macro_rules! prev_span {
    ($p:expr) => {
        $p.input.last_span()
    };
}

macro_rules! cur_span {
    ($p:expr) => {
        $p.input.cur_span()
    };
}
