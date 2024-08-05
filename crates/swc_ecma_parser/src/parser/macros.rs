macro_rules! unexpected {
    ($p:expr, $expected:literal) => {{
        let got = $p.input.dump_cur();
        syntax_error!(
            $p,
            $p.input.cur_span(),
            SyntaxError::Unexpected {
                got,
                expected: $expected
            }
        )
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool.
macro_rules! is {
    ($p:expr, BindingIdent) => {{
        let ctx = $p.ctx();
        match $p.input.cur() {
            Some(&Word(ref w)) => !ctx.is_reserved(w),
            _ => false,
        }
    }};

    ($p:expr, IdentRef) => {{
        let ctx = $p.ctx();
        match $p.input.cur() {
            Some(&Word(ref w)) => !ctx.is_reserved(w),
            _ => false,
        }
    }};

    ($p:expr,IdentName) => {{
        match $p.input.cur() {
            Some(&Word(..)) => true,
            _ => false,
        }
    }};

    ($p:expr,Str) => {{
        match $p.input.cur() {
            Some(&Token::Str { .. }) => true,
            _ => false,
        }
    }};

    ($p:expr,Num) => {{
        match $p.input.cur() {
            Some(&Token::Num { .. }) => true,
            _ => false,
        }
    }};

    ($p:expr,Regex) => {{
        match $p.input.cur() {
            Some(&Token::Regex { .. }) => true,
            _ => false,
        }
    }};

    ($p:expr,BigInt) => {{
        match $p.input.cur() {
            Some(&Token::BigInt { .. }) => true,
            _ => false,
        }
    }};

    ($p:expr,';') => {{
        match $p.input.cur() {
            Some(&Token::Semi) | None | Some(&tok!('}')) => true,
            _ => $p.input.had_line_break_before_cur(),
        }
    }};

    ($p:expr, $t:tt) => {
        is_exact!($p, $t)
    };
}

#[allow(unused)]
macro_rules! peeked_is {
    ($p:expr, BindingIdent) => {{
        let ctx = $p.ctx();
        match peek!($p) {
            Some(&Word(ref w)) => !ctx.is_reserved(w),
            _ => false,
        }
    }};

    ($p:expr, IdentRef) => {{
        let ctx = $p.ctx();
        match peek!($p) {
            Some(&Word(ref w)) => !ctx.is_reserved(w),
            _ => false,
        }
    }};

    ($p:expr,IdentName) => {{
        match peek!($p) {
            Some(&Word(..)) => true,
            _ => false,
        }
    }};

    ($p:expr, JSXName) => {{
        match peek!($p) {
            Some(&Token::JSXName { .. }) => true,
            _ => false,
        }
    }};

    ($p:expr, ';') => {{
        compile_error!("peeked_is!(self, ';') is invalid");
    }};

    ($p:expr, $t:tt) => {
        match peek!($p) {
            Some(&token_including_semi!($t)) => true,
            _ => false,
        }
    };
}

/// Returns true on eof.
macro_rules! eof {
    ($p:expr) => {
        cur!($p, false).is_err()
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
        if cfg!(debug_assertions) && !is!($p, $t) {
            unreachable!(
                "assertion failed: expected {:?}, got {:?}",
                TOKEN,
                $p.input.cur()
            );
        }
        let _ = cur!($p, true);
        bump!($p);
    }};
}

/// This handles automatic semicolon insertion.
///
/// Returns bool if token is static, and Option<Token>
///     if token has data like string.
macro_rules! eat {
    ($p:expr, ';') => {{
        if cfg!(feature = "debug") {
            tracing::trace!("eat(';'): cur={:?}", cur!($p, false));
        }
        match $p.input.cur() {
            Some(&Token::Semi) => {
                $p.input.bump();
                true
            }
            None | Some(&tok!('}')) => true,
            _ => $p.input.had_line_break_before_cur(),
        }
    }};

    ($p:expr, $t:tt) => {{
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
        if is_exact!($p, $t) {
            bump!($p);
            true
        } else {
            false
        }
    }};
}

macro_rules! is_exact {
    ($p:expr, $t:tt) => {{
        match $p.input.cur() {
            Some(&token_including_semi!($t)) => true,
            _ => false,
        }
    }};
}

/// This handles automatic semicolon insertion.
macro_rules! expect {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if !eat!($p, $t) {
            let cur = $p.input.dump_cur();
            syntax_error!($p, $p.input.cur_span(), SyntaxError::Expected(TOKEN, cur))
        }
    }};
}

macro_rules! expect_exact {
    ($p:expr, $t:tt) => {{
        const TOKEN: &Token = &token_including_semi!($t);
        if !eat_exact!($p, $t) {
            let cur = $p.input.dump_cur();
            syntax_error!($p, $p.input.cur_span(), SyntaxError::Expected(TOKEN, cur))
        }
    }};
}

macro_rules! store {
    ($p:expr, $t:tt) => {{
        const TOKEN: Token = token_including_semi!($t);

        $p.input.store(TOKEN);
    }};
}

/// cur!($parser, required:bool)
macro_rules! cur {
    ($p:expr, false) => {{
        match $p.input.cur() {
            Some(c) => Ok(c),
            None => {
                let pos = $p.input.end_pos();
                let last = Span::new(pos, pos);

                Err(crate::error::Error::new(
                    last,
                    crate::error::SyntaxError::Eof,
                ))
            }
        }
    }};

    ($p:expr, true) => {{
        match $p.input.cur() {
            Some(c) => match c {
                Token::Error(..) => match $p.input.bump() {
                    $crate::token::Token::Error(e) => {
                        return Err(e);
                    }
                    _ => unreachable!(),
                },

                _ => c,
            },
            None => {
                let pos = $p.input.end_pos();
                let span = Span::new(pos, pos);
                let err = crate::error::Error::new(span, crate::error::SyntaxError::Eof);
                return Err(err);
            }
        }
    }};
}

macro_rules! peek {
    ($p:expr) => {{
        debug_assert!(
            $p.input.knows_cur(),
            "parser should not call peek() without knowing current token.
Current token is {:?}",
            cur!($p, false),
        );

        $p.input.peek()
    }};
}

macro_rules! bump {
    ($p:expr) => {{
        debug_assert!(
            $p.input.knows_cur(),
            "parser should not call bump() without knowing current token"
        );
        $p.input.bump()
    }};
}

macro_rules! cur_pos {
    ($p:expr) => {{
        $p.input.cur_pos()
    }};
}

macro_rules! last_pos {
    ($p:expr) => {
        $p.input.prev_span().hi
    };
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
        if let Expr::Arrow { .. } = *$expr {
            return Ok($expr);
        }
        // }
    }};
}

macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            tracing::debug!("{}: {:?}", stringify!($name), $p.input.cur());
        }
    }};
}

/// This macro requires macro named 'last_pos' to be in scope.
macro_rules! span {
    ($p:expr, $start:expr) => {{
        let start: ::swc_common::BytePos = $start;
        let end: ::swc_common::BytePos = last_pos!($p);
        if cfg!(debug_assertions) && start > end {
            unreachable!(
                "assertion failed: (span.start <= span.end).
 start = {}, end = {}",
                start.0, end.0
            )
        }
        ::swc_common::Span::new(start, end)
    }};
}

macro_rules! make_error {
    ($p:expr, $span:expr, $err:expr) => {{
        crate::error::Error::new($span, $err)
    }};
}

macro_rules! syntax_error {
    ($p:expr, $err:expr) => {
        syntax_error!($p, $p.input.cur_span(), $err)
    };

    ($p:expr, $span:expr, $err:expr) => {{
        let err = make_error!($p, $span, $err);

        {
            let is_err_token = match $p.input.cur() {
                Some(&$crate::token::Token::Error(..)) => true,
                _ => false,
            };
            if is_err_token {
                match $p.input.bump() {
                    $crate::token::Token::Error(e) => {
                        $p.emit_error(e);
                    }
                    _ => unreachable!(),
                }
            }
        }

        if cfg!(feature = "debug") {
            tracing::error!(
                "Syntax error called from {}:{}:{}\nCurrent token = {:?}",
                file!(),
                line!(),
                column!(),
                $p.input.cur()
            );
        }
        return Err(err.into());
    }};
}

macro_rules! debug_tracing {
    ($p:expr, $name:tt) => {{
        #[cfg(feature = "debug")]
        {
            tracing::span!(
                tracing::Level::ERROR,
                $name,
                cur = tracing::field::debug(&$p.input.cur())
            )
            .entered()
        }
    }};
}
