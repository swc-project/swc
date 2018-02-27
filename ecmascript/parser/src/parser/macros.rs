macro_rules! unexpected {
    ($p:expr) => {{
        // unimplemented!("Unexpected token")
        syntax_error!($p, $p.input.cur_span(), SyntaxError::Unexpected)
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool.
macro_rules! is {
    ($p:expr, BindingIdent) => {{
        let ctx = $p.ctx();
        match cur!($p) {
            Ok(&Word(ref w)) => !ctx.is_reserved_word(&w.clone().into()),
            _ => false,
        }
    }};

    ($p:expr, IdentRef) => {{
        let ctx = $p.ctx();
        match cur!($p) {
            Ok(&Word(ref w)) => !ctx.is_reserved_word(&w.clone().into()),
            _ => false,
        }
    }};

    ($p:expr, IdentName) => {{
        match cur!($p) {
            Ok(&Word(..)) => true,
            _ => false,
        }
    }};

    ($p:expr, ';') => {{
        $p.input.is(&Token::Semi) || eof!($p) || is!($p, '}')
            || $p.input.had_line_break_before_cur()
    }};


    ($p:expr, $t:tt) => {
        $p.input.is(&tok!($t))
    };
}

/// Returns true on eof.
macro_rules! eof {
    ($p:expr) => { cur!($p).is_err() };
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
        debug!($p.session.logger, "eat(';'): cur={:?}", cur!($p));
        $p.input.eat(&Token::Semi) || eof!($p) || is!($p, '}')
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
            syntax_error!($p, $p.input.cur_span(), SyntaxError::Expected(TOKEN))
        }
    }};
}

macro_rules! expect_exact {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if !eat_exact!($p, $t) {
            syntax_error!($p, $p.input.cur_span(), SyntaxError::Expected(TOKEN))
        }
    }};
}

macro_rules! cur {
    ($p:expr) => {{
        let pos = $p.input.last_pos();
        let last = Span::new(pos, pos, Default::default());
        let is_err_token = match $p.input.cur() {
            Some(&$crate::token::Token::Error(..)) => { true },
            _ => false,
        };
        if is_err_token {
            match $p.input.bump() {
                $crate::token::Token::Error(e) => {
                    let err: Result<!, _> = Err($crate::error::ErrorToDiag {
                        handler: &$p.session.handler,
                        span: e.span,
                        error: e.error,
                    });
                    err?
                }
                _ => unreachable!(),
            }
        }

        match $p.input.cur() {
            Some(c) => Ok(c),
            None => Err($crate::error::Eof {
                last,
                handler: &$p.session.handler,
            }),
        }
    }};
}

macro_rules! peek {
    ($p:expr) => {{
        assert!(
            $p.input.knows_cur(),
            "parser should not call peek() without knowing current token.
Current token is {:?}",
            cur!($p),
        );

        let pos = cur_pos!($p);
        let last = Span::new(pos, pos, Default::default());
        match $p.input.peek() {
            Some(c) => Ok(c),
            None => Err($crate::error::Eof {
                //TODO: Use whole span
                last,
                handler: &$p.session.handler,
            }),
        }
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
    ($p:expr) => {{
        let pos = $p.input.cur_pos();
        pos
    }}
}

macro_rules! last_pos {
    ($p:expr) => { $p.input.prev_span().hi() };
}

macro_rules! return_if_arrow {
    ($p:expr, $expr:expr) => {{
        // FIXME:
        //
        //

        // let is_cur = match $p.state.potential_arrow_start {
        //     Some(start) => $expr.span.lo() == start,
        //     None => false
        // };
        // if is_cur {
            match $expr.node {
                ExprKind::Arrow{..} => return Ok($expr),
                _ => {},
            }
        // }
    }};
}
