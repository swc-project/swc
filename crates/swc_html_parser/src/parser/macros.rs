macro_rules! span {
    ($parser:expr, $start:expr) => {{
        let last_pos = $parser.input.last_pos()?;
        swc_common::Span::new($start, last_pos, Default::default())
    }};
}

macro_rules! bump {
    ($parser:expr) => {
        $parser.input.bump()?.unwrap().token
    };
}
