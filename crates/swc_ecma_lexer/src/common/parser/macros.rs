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
