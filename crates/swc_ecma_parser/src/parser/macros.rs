#[allow(unused)]
macro_rules! peeked_is {
    ($p:expr, BindingIdent) => {{
        let ctx = $p.ctx();
        peek!($p).is_some_and(|t| t.is_word() && !t.is_reserved(ctx))
    }};

    ($p:expr, IdentRef) => {{
        let ctx = $p.ctx();
        peek!($p).is_some_and(|t| t.is_word() && !t.is_reserved(ctx))
    }};

    ($p:expr,IdentName) => {{
        peek!($p).is_some_and(|t| t.is_word())
    }};

    ($p:expr, JSXName) => {{
        match peek!($p) {
            Some(Token::JSXName) => true,
            _ => false,
        }
    }};

    ($p:expr, Str) => {{
        match peek!($p) {
            Some(Token::Str) => true,
            _ => false,
        }
    }};

    ($p:expr, ';') => {{
        compile_error!("peeked_is!(self, ';') is invalid");
    }};

    ($p:expr, $t:tt) => {
        match peek!($p) {
            Some($crate::token_including_semi!($t)) => true,
            _ => false,
        }
    };
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
