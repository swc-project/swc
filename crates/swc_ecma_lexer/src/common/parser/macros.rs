/// cur!($parser, required:bool)
macro_rules! cur {
    ($p:expr, true) => {{
        match $p.input_mut().cur() {
            Some(c) => {
                if c.is_error() {
                    let c = $p.input_mut().bump();
                    let err = c.take_error($p.input_mut());
                    return Err(err);
                } else {
                    c
                }
            }
            None => {
                let pos = $p.input().end_pos();
                let span = Span::new(pos, pos);
                let err = crate::error::Error::new(span, crate::error::SyntaxError::Eof);
                return Err(err);
            }
        }
    }};
}

macro_rules! unexpected {
    ($p:expr, $expected:literal) => {{
        let got = $p.input_mut().dump_cur();
        syntax_error!(
            $p,
            $p.input().cur_span(),
            SyntaxError::Unexpected {
                got,
                expected: $expected
            }
        )
    }};
}

macro_rules! expect {
    ($p:expr, $t:expr) => {{
        if !$p.input_mut().eat($t) {
            let span = $p.input().cur_span();
            let cur = $p.input_mut().dump_cur();
            syntax_error!($p, span, SyntaxError::Expected(format!("{:?}", $t), cur))
        }
    }};
}

macro_rules! syntax_error {
    ($p:expr, $err:expr) => {
        syntax_error!($p, $p.input().cur_span(), $err)
    };
    ($p:expr, $span:expr, $err:expr) => {{
        let err = $crate::error::Error::new($span, $err);
        {
            if $p.input_mut().cur().is_some_and(|t| t.is_error()) {
                let c = $p.input_mut().bump();
                let err = c.take_error($p.input_mut());
                $p.emit_error(err);
            }
        }
        if cfg!(feature = "debug") {
            tracing::error!(
                "Syntax error called from {}:{}:{}\nCurrent token = {:?}",
                file!(),
                line!(),
                column!(),
                $p.input_mut().cur()
            );
        }
        return Err(err.into());
    }};
}

macro_rules! peek {
    ($p:expr) => {{
        debug_assert!(
            $p.input().knows_cur(),
            "parser should not call peek() without knowing current token.
Current token is {:?}",
            $p.input_mut().cur(),
        );
        $p.input_mut().peek()
    }};
}

macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            tracing::debug!("{}: {:?}", stringify!($name), $p.input_mut().cur());
        }
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

/// Returns true on eof.
macro_rules! eof {
    ($p:expr) => {
        $p.input_mut().cur().is_none()
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
