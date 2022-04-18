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

macro_rules! get_tag_name {
    ($node:expr) => {{
        match &$node.data {
            Data::Element(Element { tag_name, .. }) => &**tag_name,
            _ => {
                unreachable!();
            }
        }
    }};
}

macro_rules! get_namespace {
    ($node:expr) => {{
        match $node.data {
            Data::Element(Element { namespace, .. }) => namespace,
            _ => {
                unreachable!();
            }
        }
    }};
}
