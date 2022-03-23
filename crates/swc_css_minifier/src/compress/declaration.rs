use swc_common::{util::take::Take, EqIgnoreSpan};
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};
pub fn compress_declaration() -> impl VisitMut {
    CompressDeclaration {}
}

struct CompressDeclaration {}

impl CompressDeclaration {
    fn is_same_dimension_length_nodes(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        if let Some(ComponentValue::Dimension(Dimension::Length(Length {
            value: value_1,
            unit: unit_1,
            ..
        }))) = node_1
        {
            if let Some(ComponentValue::Dimension(Dimension::Length(Length {
                value: value_2,
                unit: unit_2,
                ..
            }))) = node_2
            {
                if value_1.value == value_2.value
                    && unit_1.value.to_lowercase() == unit_2.value.to_lowercase()
                {
                    return true;
                }
            }
        }

        false
    }
}

impl VisitMut for CompressDeclaration {
    fn visit_mut_declaration(&mut self, declaration: &mut Declaration) {
        declaration.visit_mut_children_with(self);

        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match &*value.to_lowercase() {
                "display" if declaration.value.len() > 1 => {
                    let mut outside = None;
                    let mut inside = None;
                    let mut list_item = None;

                    for value in declaration.value.iter() {
                        match value {
                            outside_node @ ComponentValue::Ident(Ident { value, .. })
                                if matches!(
                                    &*value.to_lowercase(),
                                    "block" | "inline" | "run-in"
                                ) =>
                            {
                                outside = Some(outside_node);
                            }
                            inside_node @ ComponentValue::Ident(Ident { value, .. })
                                if matches!(
                                    &*value.to_lowercase(),
                                    "flow" | "flow-root" | "table" | "flex" | "grid" | "ruby"
                                ) =>
                            {
                                inside = Some(inside_node);
                            }
                            list_item_node @ ComponentValue::Ident(Ident { value, .. })
                                if &*value.to_lowercase() == "list-item" =>
                            {
                                if let Some(ComponentValue::Ident(Ident { value, .. })) = inside {
                                    if !matches!(&*value.to_lowercase(), "flow" | "flow-root") {
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
                        ) if &*inside_value.to_lowercase() == "flow" => {
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
                        ) if &*outside_value.to_lowercase() == "block"
                            && &*inside_value.to_lowercase() == "flow-root" =>
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
                        ) if &*outside_value.to_lowercase() == "inline"
                            && &*inside_value.to_lowercase() == "flow-root" =>
                        {
                            declaration.value = vec![ComponentValue::Ident(Ident {
                                span: *span,
                                value: "inline-block".into(),
                                raw: "inline-block".into(),
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
                        ) if &*outside_value.to_lowercase() == "block"
                            && &*inside_value.to_lowercase() == "flow" =>
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
                        ) if &*outside_value.to_lowercase() == "block" => {
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
                        ) if &*inside_value.to_lowercase() == "flow" => {
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
                        ) if &*outside_value.to_lowercase() == "inline"
                            && &*inside_value.to_lowercase() == "flow" =>
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
                        ) if &*outside_value.to_lowercase() == "block"
                            && matches!(
                                &*inside_value.to_lowercase(),
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
                        ) if &*outside_value.to_lowercase() == "inline"
                            && inside_value.to_lowercase() == "ruby" =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        _ => {}
                    }
                }
                "padding" | "margin" | "inset" | "scroll-margin" | "scroll-padding"
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

                    if self.is_same_dimension_length_nodes(left, right) {
                        if self.is_same_dimension_length_nodes(bottom, top) {
                            if self.is_same_dimension_length_nodes(right, top) {
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
                "font-weight" => {
                    declaration.value = declaration
                        .value
                        .take()
                        .into_iter()
                        .map(|node| match node {
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_lowercase() == "normal" =>
                            {
                                ComponentValue::Number(Number {
                                    span,
                                    value: 400.0,
                                    raw: "400".into(),
                                })
                            }
                            ComponentValue::Ident(Ident { value, span, .. })
                                if value.to_lowercase() == "bold" =>
                            {
                                ComponentValue::Number(Number {
                                    span,
                                    value: 700.0,
                                    raw: "700".into(),
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
                        match (&*first_value.to_lowercase(), &*second_value.to_lowercase()) {
                            ("repeat", "no-repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-x".into(),
                                    raw: "repeat-x".into(),
                                })];
                            }
                            ("no-repeat", "repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: "repeat-y".into(),
                                    raw: "repeat-y".into(),
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
                "overscroll-behavior" if declaration.value.len() == 2 => {
                    let first = declaration.value.get(0);
                    let second = declaration.value.get(1);

                    match (first, second) {
                        (
                            Some(ComponentValue::Ident(first_ident)),
                            Some(ComponentValue::Ident(second_ident)),
                        ) if first_ident.eq_ignore_span(second_ident) => {
                            declaration.value.remove(1);
                        }
                        _ => {}
                    }
                }
                _ => {}
            }
        }
    }
}
