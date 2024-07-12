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
            crate::parser::Data::Element { tag_name, .. } => &**tag_name,
            _ => {
                unreachable!();
            }
        }
    }};
}

macro_rules! get_namespace {
    ($node:expr) => {{
        match $node.data {
            crate::parser::Data::Element { namespace, .. } => namespace,
            _ => {
                unreachable!();
            }
        }
    }};
}

macro_rules! get_document_mode {
    ($node:expr) => {{
        match &$node.data {
            crate::parser::Data::Document { mode, .. } => *mode.borrow(),
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

macro_rules! is_mathml_element {
    ($node:expr, $tag_names:pat) => {{
        get_namespace!($node) == Namespace::MATHML && matches!(get_tag_name!($node), $tag_names)
    }};
}

macro_rules! is_svg_element {
    ($node:expr, $tag_names:pat) => {{
        get_namespace!($node) == Namespace::SVG && matches!(get_tag_name!($node), $tag_names)
    }};
}

macro_rules! is_html_element_with_tag_name {
    ($node:expr, $tag_name:expr) => {{
        get_namespace!($node) == Namespace::HTML && get_tag_name!($node) == $tag_name
    }};
}
