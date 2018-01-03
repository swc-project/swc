macro_rules! unexpected {
    (
        $($expected:expr),*
    ) => {{
        unimplemented!("Unexpected token.")
    }};
}

macro_rules! syntax_error {
    ($s:ident) => {{
        return Err(Error::Syntax(SyntaxError::$s))
    }};
}

macro_rules! spanned {
    (
        $parser:expr, $body:block
    ) => {{
        let start = $parser.i.cur_span().start;
        let val: PResult<_> = { $body };
        let val = val?;

        let end = $parser.i.last_span().end;
        Ok(::swc_common::Spanned::from_unspanned(val, Span { start, end }))
    }};
}
