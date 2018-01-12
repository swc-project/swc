macro_rules! unexpected {
    ($p:expr) => {{
        let pos = cur_pos!($p);
        let cur = cur!($p);
        unimplemented!("unexpected token: {:?} at {:?}", cur, pos);
    }};
}

macro_rules! syntax_error {
    ($p:expr, $s:expr) => {{
        let err = Error::Syntax($p.input.cur().cloned(), cur_pos!($p), $s, file!(), line!());
        error!($p.logger, "failed to parse: {:?}", err);
        let res: PResult<!> = Err(err);
        res?
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool.
macro_rules! is {
    ($p:expr, BindingIdent) => {{
        match cur!($p) {
            // TODO: Exclude some keywords
            Some(&Word(ref w)) => !w.is_reserved_word($p.ctx.strict),
            _ => false,
        }
    }};

    ($p:expr, IdentRef) => {{
        match cur!($p) {
            // TODO: Exclude some keywords
            Some(&Word(ref w)) => !w.is_reserved_word($p.ctx.strict),
            _ => false,
        }
    }};

    ($p:expr, IdentName) => {{
        match cur!($p) {
            Some(&Word(..)) => true,
            _ => false,
        }
    }};

    ($p:expr, ';') => {{
        $p.input.is(&Token::Semi) || cur!($p) == None || is!($p, '}')
            || $p.input.had_line_break_before_cur()
    }};


    ($p:expr, $t:tt) => {
        $p.input.is(&tok!($t))
    };
}

/// Returns true on eof.
macro_rules! eof {
    ($p:expr) => {
        cur!($p) == None
    };
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
        bump!($p);
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool if token is static, and Option<Token>
///     if token has data like string.
macro_rules! eat {
    ($p:expr, ';') => {{
        debug!($p.logger, "eat(';'): cur={:?}", cur!($p));
        $p.input.eat(&Token::Semi) || cur!($p) == None || is!($p, '}')
            || $p.input.had_line_break_before_cur()
    }};

    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &tok!($t);
        if is!($p, $t) {
            bump!($p);
            true
        } else {
            false
        }
    }};
}

macro_rules! eat_exact {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if $p.input.is(TOKEN) {
            bump!($p);
            true
        } else {
            false
        }
    }};
}

/// This handles automatic semicolon insertion.
///
macro_rules! expect {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if !eat!($p, $t) {
            syntax_error!($p, SyntaxError::Expected(TOKEN))
        }
    }};
}

macro_rules! expect_exact {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if !eat_exact!($p, $t) {
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
    ($p:expr) => {{
        assert!(
            $p.input.knows_cur(),
            "parser should not call peek() without knowing current token.
Current token is {:?}", cur!($p)
        );
        $p.input.peek()
    }};
}

macro_rules! bump {
    ($p:expr) => {{
        assert!(
            $p.input.knows_cur(),
            "parser should not call bump() without knowing current token"
        );
        $p.input.bump()
    }};
}

macro_rules! cur_pos {
    ($p:expr) => { $p.input.cur_pos() }
}

macro_rules! last_pos {
    ($p:expr) => { $p.input.last_pos()};
}

macro_rules! return_if_arrow {
    ($p:expr, $expr:expr) => {{
        let is_cur = match $p.state.potential_arrow_start {
            Some(start) => $expr.span.start == start,
            None => false
        };
        if is_cur {
            match $expr.node {
                ExprKind::Arrow{..} => return Ok($expr),
                _ => {},
            }
        }
    }};
}
