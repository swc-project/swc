use swc_atoms::js_word;
use swc_common::util::take::Take;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};
pub fn compress_declaration() -> impl VisitMut {
    CompressDeclaration {}
}

struct CompressDeclaration {}

impl CompressDeclaration {
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

impl VisitMut for CompressDeclaration {
    fn visit_mut_declaration(&mut self, declaration: &mut Declaration) {
        declaration.visit_mut_children_with(self);

        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match value.to_ascii_lowercase() {
                "display" if declaration.value.len() > 1 => {
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
                                if value.to_ascii_lowercase() == "list-item" =>
                            {
                                if let Some(ComponentValue::Ident(Ident { value, .. })) = inside {
                                    if !matches!(&*value.to_ascii_lowercase(), "flow" | "flow-root")
                                    {
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
                        ) if inside_value.to_ascii_lowercase() == "flow" => {
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
                        ) if outside_value.to_ascii_lowercase() == "block"
                            && inside_value.to_ascii_lowercase() == "flow-root" =>
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
                        ) if outside_value.to_ascii_lowercase() == "inline"
                            && inside_value.to_ascii_lowercase() == "flow-root" =>
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
                        ) if outside_value.to_ascii_lowercase() == "block"
                            && inside_value.to_ascii_lowercase() == "flow" =>
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
                        ) if outside_value.to_ascii_lowercase() == "block" => {
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
                        ) if inside_value.to_ascii_lowercase() == "flow" => {
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
                        ) if outside_value.to_ascii_lowercase() == "inline"
                            && inside_value.to_ascii_lowercase() == "flow" =>
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
                        ) if outside_value.to_ascii_lowercase() == "block"
                            && matches!(
                                inside_value.to_ascii_lowercase(),
                                "flex" | "grid" | "table"
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
                        ) if outside_value.to_ascii_lowercase() == "inline"
                            && inside_value.to_ascii_lowercase() == "ruby" =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        _ => {}
                    }
                }
                // TODO handle `auto`
                // TODO compress numbers too
                "padding"
                | "margin"
                | "border-width"
                | "inset"
                | "scroll-margin"
                | "scroll-padding"
                | "mask-border-outset"
                | "border-image-width"
                | "border-image-outset"
                | "border-image-slice"
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
                "padding-inline"
                | "padding-block"
                | "margin-inline"
                | "margin-block"
                | "margin-inline"
                | "inset-inline"
                | "inset-block"
                | "border-inline-width"
                | "border-block-width"
                | "scroll-padding-inline"
                | "scroll-padding-block"
                | "scroll-margin-inline"
                | "scroll-margin-block"
                | "border-top-left-radius"
                | "border-top-right-radius"
                | "border-bottom-right-radius"
                | "border-bottom-left-radius"
                | "border-start-start-radius"
                | "border-start-end-radius"
                | "border-end-start-radius"
                | "border-end-end-radius"
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
                "border-style" if declaration.value.len() > 1 => {
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
                "border-spacing" | "border-image-repeat" if declaration.value.len() == 2 => {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if self.is_same_length_nodes(first, second) {
                        declaration.value.remove(1);
                    }
                }
                "font-weight" => {
                    declaration.value = declaration
                        .value
                        .take()
                        .into_iter()
                        .map(|node| match node {
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_ascii_lowercase() == "normal" =>
                            {
                                ComponentValue::Number(Number {
                                    span,
                                    value: 400.0,
                                    raw: None,
                                })
                            }
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_ascii_lowercase() == "bold" =>
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
                "background-repeat" | "mask-repeat" | "-webkit-mask-repeat"
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
                            ("repeat", "no-repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-x".into(),
                                    raw: None,
                                })];
                            }
                            ("no-repeat", "repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-y".into(),
                                    raw: None,
                                })];
                            }
                            ("repeat", "repeat")
                            | ("space", "space")
                            | ("round", "round")
                            | ("no-repeat", "no-repeat") => {
                                declaration.value.remove(1);
                            }
                            _ => {}
                        }
                    }
                }
                "border-image-repeat"
                | "mask-border-repeat"
                | "-webkit-mask-box-image-repeat"
                | "overscroll-behavior"
                | "scroll-snap-align"
                | "overflow"
                | "place-self"
                | "place-items"
                | "place-content"
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    if self.is_same_ident(first, second) {
                        declaration.value.remove(1);
                    }
                }
                _ => {}
            }
        }
    }
}
