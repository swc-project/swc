macro_rules! trace_cur {
    ($p:expr, $name:ident) => {{
        if cfg!(feature = "debug") {
            tracing::debug!("{}: {:?}", stringify!($name), $p.input.cur());
        }
    }};
}

macro_rules! syntax_error {
    ($p:expr, $span:expr, $err:expr) => {{
        let err = $crate::error::Error::new($span, $err);
        {
            if $p.input_mut().cur().is_some_and(|t| t == &Token::Error) {
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
