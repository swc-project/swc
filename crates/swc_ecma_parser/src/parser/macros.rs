macro_rules! cur_pos {
    ($p:expr) => {{
        $p.input.cur_pos()
    }};
}

macro_rules! cur {
    ($p:expr, true) => {{
        match $p.input_mut().cur() {
            Some(c) => {
                if *c == Token::Error {
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
