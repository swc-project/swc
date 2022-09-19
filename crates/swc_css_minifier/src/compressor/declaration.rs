use swc_atoms::js_word;
use swc_common::util::take::Take;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_declaration(&self, declaration: &mut Declaration) {
        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match value.to_ascii_lowercase() {
                js_word!("display") if declaration.value.len() > 1 => {
                    let mut outside = None;
                    let mut inside = None;
                    let mut list_item = None;

                    for value in declaration.value.iter() {
                        match value {
                            outside_node @ ComponentValue::Ident(Ident { value, .. })
                                if matches!(
                                    value.to_ascii_lowercase(),
                                    js_word!("block") | js_word!("inline") | js_word!("run-in")
                                ) =>
                            {
                                outside = Some(outside_node);
                            }
                            inside_node @ ComponentValue::Ident(Ident { value, .. })
                                if matches!(
                                    value.to_ascii_lowercase(),
                                    js_word!("flow")
                                        | js_word!("flow-root")
                                        | js_word!("table")
                                        | js_word!("flex")
                                        | js_word!("grid")
                                        | js_word!("ruby")
                                ) =>
                            {
                                inside = Some(inside_node);
                            }
                            list_item_node @ ComponentValue::Ident(Ident { value, .. })
                                if value.to_ascii_lowercase() == js_word!("list-item") =>
                            {
                                if let Some(ComponentValue::Ident(Ident { value, .. })) = inside {
                                    if !matches!(
                                        value.to_ascii_lowercase(),
                                        js_word!("flow") | js_word!("flow-root")
                                    ) {
                                        continue;
                                    }
                                }

                                list_item = Some(list_item_node)
                            }
                            _ => {}
                        }
                    }

                    match (outside, inside, list_item) {
                        // `block flow` -> `block`
                        // `inline flow` -> `inline`
                        // `run-in flow` -> `run-in`
                        (
                            Some(outside),
                            Some(ComponentValue::Ident(Ident {
                                value: inside_value,
                                ..
                            })),
                            None,
                        ) if inside_value.to_ascii_lowercase() == js_word!("flow") => {
                            declaration.value = vec![outside.clone()];
                        }
                        // `block flow-root` -> `flow-root`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.to_ascii_lowercase() == js_word!("block")
                            && inside_value.to_ascii_lowercase() == js_word!("flow-root") =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline flow-root` -> `inline-block`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                span,
                                ..
                            })),
                            Some(ComponentValue::Ident(Ident {
                                value: inside_value,
                                ..
                            })),
                            None,
                        ) if outside_value.to_ascii_lowercase() == js_word!("inline")
                            && inside_value.to_ascii_lowercase() == js_word!("flow-root") =>
                        {
                            declaration.value = vec![ComponentValue::Ident(Ident {
                                span: *span,
                                value: "inline-block".into(),
                                raw: None,
                            })];
                        }
                        // `block flow list-item` -> `list-item`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(ComponentValue::Ident(Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if outside_value.to_ascii_lowercase() == js_word!("block")
                            && inside_value.to_ascii_lowercase() == js_word!("flow") =>
                        {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `block list-item` -> `list-item`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                ..
                            })),
                            None,
                            Some(list_item),
                        ) if outside_value.to_ascii_lowercase() == js_word!("block") => {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `flow list-item` -> `list-item`
                        (
                            None,
                            Some(ComponentValue::Ident(Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if inside_value.to_ascii_lowercase() == js_word!("flow") => {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `inline flow list-item` -> `inline list-item`
                        (
                            Some(
                                outside @ ComponentValue::Ident(Ident {
                                    value: outside_value,
                                    ..
                                }),
                            ),
                            Some(ComponentValue::Ident(Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if outside_value.to_ascii_lowercase() == js_word!("inline")
                            && inside_value.to_ascii_lowercase() == js_word!("flow") =>
                        {
                            declaration.value = vec![outside.clone(), list_item.clone()];
                        }
                        // `block flex` -> `flex`
                        // `block grid` -> `grid`
                        // `block table` -> `table`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.to_ascii_lowercase() == js_word!("block")
                            && matches!(
                                inside_value.to_ascii_lowercase(),
                                js_word!("flex") | js_word!("grid") | js_word!("table")
                            ) =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline ruby` -> `ruby`
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.to_ascii_lowercase() == js_word!("inline")
                            && inside_value.to_ascii_lowercase() == js_word!("ruby") =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        _ => {}
                    }
                }
                // TODO handle `auto`
                // TODO compress numbers too
                js_word!("padding")
                | js_word!("margin")
                | js_word!("border-width")
                | js_word!("inset")
                | js_word!("scroll-margin")
                | js_word!("scroll-padding")
                | js_word!("mask-border-outset")
                | js_word!("border-image-width")
                | js_word!("border-image-outset")
                | js_word!("border-image-slice")
                    if declaration.value.len() > 1 =>
                {
                    let top = declaration.value.get(0);
                    let right = declaration
                        .value
                        .get(1)
                        .or_else(|| declaration.value.get(0));
                    let bottom = declaration
                        .value
                        .get(2)
                        .or_else(|| declaration.value.get(0));
                    let left = declaration
                        .value
                        .get(3)
                        .or_else(|| declaration.value.get(1))
                        .or_else(|| declaration.value.get(0));

                    if self.is_same_length_percentage_nodes(left, right) {
                        if self.is_same_length_percentage_nodes(bottom, top) {
                            if self.is_same_length_percentage_nodes(right, top) {
                                declaration.value = vec![top.unwrap().clone()];
                            } else {
                                declaration.value =
                                    vec![top.unwrap().clone(), right.unwrap().clone()];
                            }
                        } else {
                            declaration.value = vec![
                                top.unwrap().clone(),
                                right.unwrap().clone(),
                                bottom.unwrap().clone(),
                            ];
                        }
                    }
                }
                js_word!("padding-inline")
                | js_word!("padding-block")
                | js_word!("margin-inline")
                | js_word!("margin-block")
                | js_word!("margin-inline")
                | js_word!("inset-inline")
                | js_word!("inset-block")
                | js_word!("border-inline-width")
                | js_word!("border-block-width")
                | js_word!("scroll-padding-inline")
                | js_word!("scroll-padding-block")
                | js_word!("scroll-margin-inline")
                | js_word!("scroll-margin-block")
                | js_word!("border-top-left-radius")
                | js_word!("border-top-right-radius")
                | js_word!("border-bottom-right-radius")
                | js_word!("border-bottom-left-radius")
                | js_word!("border-start-start-radius")
                | js_word!("border-start-end-radius")
                | js_word!("border-end-start-radius")
                | js_word!("border-end-end-radius")
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if self.is_same_length_percentage_nodes(first, second)
                        || self.is_same_ident(first, second)
                    {
                        declaration.value.remove(1);
                    }
                }
                js_word!("border-style") if declaration.value.len() > 1 => {
                    let top = declaration.value.get(0);
                    let right = declaration
                        .value
                        .get(1)
                        .or_else(|| declaration.value.get(0));
                    let bottom = declaration
                        .value
                        .get(2)
                        .or_else(|| declaration.value.get(0));
                    let left = declaration
                        .value
                        .get(3)
                        .or_else(|| declaration.value.get(1))
                        .or_else(|| declaration.value.get(0));

                    if self.is_same_ident(left, right) {
                        if self.is_same_ident(bottom, top) {
                            if self.is_same_ident(right, top) {
                                declaration.value = vec![top.unwrap().clone()];
                            } else {
                                declaration.value =
                                    vec![top.unwrap().clone(), right.unwrap().clone()];
                            }
                        } else {
                            declaration.value = vec![
                                top.unwrap().clone(),
                                right.unwrap().clone(),
                                bottom.unwrap().clone(),
                            ];
                        }
                    }
                }
                js_word!("border-spacing") | js_word!("border-image-repeat")
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if self.is_same_length_nodes(first, second) {
                        declaration.value.remove(1);
                    }
                }
                js_word!("font-weight") => {
                    declaration.value = declaration
                        .value
                        .take()
                        .into_iter()
                        .map(|node| match node {
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_ascii_lowercase() == js_word!("normal") =>
                            {
                                ComponentValue::Number(Number {
                                    span,
                                    value: 400.0,
                                    raw: None,
                                })
                            }
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_ascii_lowercase() == js_word!("bold") =>
                            {
                                ComponentValue::Number(Number {
                                    span,
                                    value: 700.0,
                                    raw: None,
                                })
                            }
                            _ => node,
                        })
                        .collect();
                }
                js_word!("background-repeat")
                | js_word!("mask-repeat")
                | js_word!("-webkit-mask-repeat")
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if let (
                        Some(ComponentValue::Ident(Ident {
                            span,
                            value: first_value,
                            ..
                        })),
                        Some(ComponentValue::Ident(Ident {
                            value: second_value,
                            ..
                        })),
                    ) = (first, second)
                    {
                        match (
                            first_value.to_ascii_lowercase(),
                            second_value.to_ascii_lowercase(),
                        ) {
                            (js_word!("repeat"), js_word!("no-repeat")) => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-x".into(),
                                    raw: None,
                                })];
                            }
                            (js_word!("no-repeat"), js_word!("repeat")) => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-y".into(),
                                    raw: None,
                                })];
                            }
                            (js_word!("repeat"), js_word!("repeat"))
                            | (js_word!("space"), js_word!("space"))
                            | (js_word!("round"), js_word!("round"))
                            | (js_word!("no-repeat"), js_word!("no-repeat")) => {
                                declaration.value.remove(1);
                            }
                            _ => {}
                        }
                    }
                }
                js_word!("border-image-repeat")
                | js_word!("mask-border-repeat")
                | js_word!("-webkit-mask-box-image-repeat")
                | js_word!("overscroll-behavior")
                | js_word!("scroll-snap-align")
                | js_word!("overflow")
                | js_word!("place-self")
                | js_word!("place-items")
                | js_word!("place-content")
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if self.is_same_ident(first, second) {
                        declaration.value.remove(1);
                    }
                }
                js_word!("animation") if !declaration.value.is_empty() => {
                    let first = declaration.value.get(0).cloned();
                    if let Some(ComponentValue::Str(ident)) = first {
                        declaration.value.remove(0);
                        match &*ident.value.to_ascii_lowercase() {
                            _ if crate::is_css_wide_keywords(&ident.value) => {
                                declaration.value.insert(0, ComponentValue::Str(ident));
                            }
                            to_be_identify => {
                                declaration.value.insert(
                                    0,
                                    if let Some(escaped) =
                                        crate::escape::try_escape_if_shorter(to_be_identify)
                                    {
                                        ComponentValue::Ident(Ident {
                                            span: ident.span,
                                            value: escaped.into(),
                                            raw: None,
                                        })
                                    } else {
                                        ComponentValue::Str(Str {
                                            span: ident.span,
                                            value: to_be_identify.into(),
                                            raw: None,
                                        })
                                    },
                                );
                            }
                        }
                    }
                }
                js_word!("animation-name") => {
                    declaration.value = declaration
                        .value
                        .take()
                        .into_iter()
                        .map(|node| match node {
                            ComponentValue::Str(ref ident) => {
                                let value = ident.value.to_ascii_lowercase();
                                match &*value {
                                    _ if crate::is_css_wide_keywords(&ident.value) => node,
                                    to_be_identify => {
                                        if let Some(escaped) =
                                            crate::escape::try_escape_if_shorter(to_be_identify)
                                        {
                                            ComponentValue::Ident(Ident {
                                                span: ident.span,
                                                value: escaped.into(),
                                                raw: None,
                                            })
                                        } else {
                                            ComponentValue::Str(Str {
                                                span: ident.span,
                                                value: to_be_identify.into(),
                                                raw: None,
                                            })
                                        }
                                    }
                                }
                            }
                            _ => node,
                        })
                        .collect();
                }
                _ => {}
            }
        }
    }

    fn is_same_length_nodes(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        match (node_1, node_2) {
            (
                Some(ComponentValue::Dimension(Dimension::Length(Length {
                    value: value_1,
                    unit: unit_1,
                    ..
                }))),
                Some(ComponentValue::Dimension(Dimension::Length(Length {
                    value: value_2,
                    unit: unit_2,
                    ..
                }))),
            ) if value_1.value == value_2.value
                && unit_1.value.to_ascii_lowercase() == unit_2.value.to_ascii_lowercase() =>
            {
                true
            }
            (
                Some(ComponentValue::Integer(Integer { value: 0, .. })),
                Some(ComponentValue::Integer(Integer { value: 0, .. })),
            ) => true,
            (
                Some(ComponentValue::Number(Number {
                    value: first_number,
                    ..
                })),
                Some(ComponentValue::Number(Number {
                    value: second_number,
                    ..
                })),
            ) if first_number == second_number => true,
            _ => false,
        }
    }

    fn is_same_length_percentage_nodes(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        match (node_1, node_2) {
            (
                Some(ComponentValue::Dimension(Dimension::Length(Length {
                    value: value_1,
                    unit: unit_1,
                    ..
                }))),
                Some(ComponentValue::Dimension(Dimension::Length(Length {
                    value: value_2,
                    unit: unit_2,
                    ..
                }))),
            ) if value_1.value == value_2.value
                && unit_1.value.to_ascii_lowercase() == unit_2.value.to_ascii_lowercase() =>
            {
                true
            }
            (
                Some(ComponentValue::Percentage(Percentage { value: value_1, .. })),
                Some(ComponentValue::Percentage(Percentage { value: value_2, .. })),
            ) if value_1.value == value_2.value => true,
            (
                Some(ComponentValue::Integer(Integer { value: 0, .. })),
                Some(ComponentValue::Integer(Integer { value: 0, .. })),
            ) => true,
            (
                Some(ComponentValue::Number(Number {
                    value: first_number,
                    ..
                })),
                Some(ComponentValue::Number(Number {
                    value: second_number,
                    ..
                })),
            ) if first_number == second_number => true,
            _ => false,
        }
    }

    fn is_same_ident(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        matches!((node_1, node_2), (
                 Some(ComponentValue::Ident(Ident { value: value_1, .. })),
                Some(ComponentValue::Ident(Ident { value: value_2, .. })),
            ) if value_1.to_ascii_lowercase() == value_2.to_ascii_lowercase())
    }
}
