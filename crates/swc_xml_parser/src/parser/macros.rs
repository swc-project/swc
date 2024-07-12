macro_rules! span {
    ($parser:expr, $start:expr) => {{
        let last_pos = $parser.input.last_pos()?;
        swc_common::Span::new($start, last_pos)
    }};
}

macro_rules! bump {
    ($parser:expr) => {
        $parser.input.bump()?.unwrap().token
    };
}

macro_rules! get_tag_name {
    ($node:expr) => {{
        match &$node.data {
            crate::parser::Data::Element { tag_name, .. } => tag_name.as_ref(),
            _ => {
                unreachable!();
            }
        }
    }};
}
