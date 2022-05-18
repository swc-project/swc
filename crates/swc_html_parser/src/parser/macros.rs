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
            crate::parser::Data::Element(Element { tag_name, .. }) => tag_name.as_ref(),
            _ => {
                unreachable!();
            }
        }
    }};
}

macro_rules! get_namespace {
    ($node:expr) => {{
        match $node.data {
            crate::parser::Data::Element(Element { namespace, .. }) => namespace,
            _ => {
                unreachable!();
            }
        }
    }};
}

macro_rules! is_html_element {
    ($node:expr, $tag_names:pat) => {{
        get_namespace!($node) == Namespace::HTML && matches!(get_tag_name!($node), $tag_names)
    }};
}
