use swc_atoms::js_word;
use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_declaration(&self, declaration: &mut Declaration) {
        if let DeclarationName::Ident(Ident { value: name, .. }) = &declaration.name {
            match *name {
                js_word!("display") if declaration.value.len() > 1 => {
                    let mut outside = None;
                    let mut inside = None;
                    let mut list_item = None;

                    for value in declaration.value.iter() {
                        match value {
                            outside_node @ ComponentValue::Ident(box Ident { value, .. })
                                if matches_eq_ignore_ascii_case!(
                                    value,
                                    js_word!("block"),
                                    js_word!("inline"),
                                    js_word!("run-in")
                                ) =>
                            {
                                outside = Some(outside_node);
                            }
                            inside_node @ ComponentValue::Ident(box Ident { value, .. })
                                if matches_eq_ignore_ascii_case!(
                                    value,
                                    js_word!("flow"),
                                    js_word!("flow-root"),
                                    js_word!("table"),
                                    js_word!("flex"),
                                    js_word!("grid"),
                                    js_word!("ruby")
                                ) =>
                            {
                                inside = Some(inside_node);
                            }
                            list_item_node @ ComponentValue::Ident(box Ident { value, .. })
                                if value.eq_ignore_ascii_case(&js_word!("list-item")) =>
                            {
                                if let Some(ComponentValue::Ident(box Ident { value, .. })) = inside
                                {
                                    if !matches_eq_ignore_ascii_case!(
                                        value,
                                        js_word!("flow"),
                                        js_word!("flow-root")
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
                            Some(ComponentValue::Ident(box Ident {
                                value: inside_value,
                                ..
                            })),
                            None,
                        ) if inside_value.eq_ignore_ascii_case(&js_word!("flow")) => {
                            declaration.value = vec![outside.clone()];
                        }
                        // `block flow-root` -> `flow-root`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(box Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("block"))
                            && inside_value.eq_ignore_ascii_case(&js_word!("flow-root")) =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline flow-root` -> `inline-block`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                span,
                                ..
                            })),
                            Some(ComponentValue::Ident(box Ident {
                                value: inside_value,
                                ..
                            })),
                            None,
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("inline"))
                            && inside_value.eq_ignore_ascii_case(&js_word!("flow-root")) =>
                        {
                            declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                span: *span,
                                value: js_word!("inline-block"),
                                raw: None,
                            }))];
                        }
                        // `block flow list-item` -> `list-item`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(ComponentValue::Ident(box Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("block"))
                            && inside_value.eq_ignore_ascii_case(&js_word!("flow")) =>
                        {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `block list-item` -> `list-item`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                ..
                            })),
                            None,
                            Some(list_item),
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("block")) => {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `flow list-item` -> `list-item`
                        (
                            None,
                            Some(ComponentValue::Ident(box Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if inside_value.eq_ignore_ascii_case(&js_word!("flow")) => {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `inline flow list-item` -> `inline list-item`
                        (
                            Some(
                                outside @ ComponentValue::Ident(box Ident {
                                    value: outside_value,
                                    ..
                                }),
                            ),
                            Some(ComponentValue::Ident(box Ident {
                                value: inside_value,
                                ..
                            })),
                            Some(list_item),
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("inline"))
                            && inside_value.eq_ignore_ascii_case(&js_word!("flow")) =>
                        {
                            declaration.value = vec![outside.clone(), list_item.clone()];
                        }
                        // `block flex` -> `flex`
                        // `block grid` -> `grid`
                        // `block table` -> `table`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(box Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("block"))
                            && matches_eq_ignore_ascii_case!(
                                inside_value,
                                js_word!("flex"),
                                js_word!("grid"),
                                js_word!("table")
                            ) =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline ruby` -> `ruby`
                        (
                            Some(ComponentValue::Ident(box Ident {
                                value: outside_value,
                                ..
                            })),
                            Some(
                                inside @ ComponentValue::Ident(box Ident {
                                    value: inside_value,
                                    ..
                                }),
                            ),
                            None,
                        ) if outside_value.eq_ignore_ascii_case(&js_word!("inline"))
                            && inside_value.eq_ignore_ascii_case(&js_word!("ruby")) =>
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
                            ComponentValue::Ident(box Ident { value, span, .. })
                                if value.eq_ignore_ascii_case(&js_word!("normal")) =>
                            {
                                ComponentValue::Integer(Box::new(Integer {
                                    span,
                                    value: 400,
                                    raw: None,
                                }))
                            }
                            ComponentValue::Ident(box Ident { value, span, .. })
                                if value.eq_ignore_ascii_case(&js_word!("bold")) =>
                            {
                                ComponentValue::Integer(Box::new(Integer {
                                    span,
                                    value: 700,
                                    raw: None,
                                }))
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
                        Some(ComponentValue::Ident(box Ident {
                            span,
                            value: first_value,
                            ..
                        })),
                        Some(ComponentValue::Ident(box Ident {
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
                                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                    span: *span,
                                    value: js_word!("repeat-x"),
                                    raw: None,
                                }))];
                            }
                            (js_word!("no-repeat"), js_word!("repeat")) => {
                                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                    span: *span,
                                    value: js_word!("repeat-y"),
                                    raw: None,
                                }))];
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
                            _ if crate::is_css_wide_keyword(&ident.value)
                                || ident.value.eq_ignore_ascii_case(&js_word!("none")) =>
                            {
                                declaration.value.insert(0, ComponentValue::Str(ident));
                            }
                            to_be_identify => {
                                declaration.value.insert(
                                    0,
                                    if self.is_ident_shorter_than_str(to_be_identify) {
                                        ComponentValue::Ident(Box::new(Ident {
                                            span: ident.span,
                                            value: to_be_identify.into(),
                                            raw: None,
                                        }))
                                    } else {
                                        ComponentValue::Str(Box::new(Str {
                                            span: ident.span,
                                            value: to_be_identify.into(),
                                            raw: None,
                                        }))
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
                                    _ if crate::is_css_wide_keyword(&ident.value)
                                        || ident.value.eq_ignore_ascii_case(&js_word!("none")) =>
                                    {
                                        node
                                    }
                                    to_be_identify => {
                                        if self.is_ident_shorter_than_str(to_be_identify) {
                                            ComponentValue::Ident(Box::new(Ident {
                                                span: ident.span,
                                                value: to_be_identify.into(),
                                                raw: None,
                                            }))
                                        } else {
                                            ComponentValue::Str(Box::new(Str {
                                                span: ident.span,
                                                value: to_be_identify.into(),
                                                raw: None,
                                            }))
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

            let is_initial = if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                declaration.value.get(0)
            {
                if value.eq_ignore_ascii_case(&js_word!("initial")) {
                    Some(span)
                } else {
                    None
                }
            } else {
                None
            };

            if let Some(span) = is_initial {
                self.compress_from_initial(declaration, *span);
            }
            // TODO `browserslist` support
            // else {
            // self.compress_to_initial(declaration);
            // }
        }
    }

    fn is_same_length_nodes(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        match (node_1, node_2) {
            (
                Some(ComponentValue::Dimension(box Dimension::Length(Length {
                    value: value_1,
                    unit: unit_1,
                    ..
                }))),
                Some(ComponentValue::Dimension(box Dimension::Length(Length {
                    value: value_2,
                    unit: unit_2,
                    ..
                }))),
            ) if value_1.value == value_2.value
                && unit_1.value.eq_ignore_ascii_case(&unit_2.value) =>
            {
                true
            }
            (
                Some(ComponentValue::Integer(box Integer { value: 0, .. })),
                Some(ComponentValue::Integer(box Integer { value: 0, .. })),
            ) => true,
            (
                Some(ComponentValue::Number(box Number {
                    value: first_number,
                    ..
                })),
                Some(ComponentValue::Number(box Number {
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
                Some(ComponentValue::Dimension(box Dimension::Length(Length {
                    value: value_1,
                    unit: unit_1,
                    ..
                }))),
                Some(ComponentValue::Dimension(box Dimension::Length(Length {
                    value: value_2,
                    unit: unit_2,
                    ..
                }))),
            ) if value_1.value == value_2.value
                && unit_1.value.eq_ignore_ascii_case(&unit_2.value) =>
            {
                true
            }
            (
                Some(ComponentValue::Percentage(box Percentage { value: value_1, .. })),
                Some(ComponentValue::Percentage(box Percentage { value: value_2, .. })),
            ) if value_1.value == value_2.value => true,
            (
                Some(ComponentValue::Integer(box Integer { value: 0, .. })),
                Some(ComponentValue::Integer(box Integer { value: 0, .. })),
            ) => true,
            (
                Some(ComponentValue::Number(box Number {
                    value: first_number,
                    ..
                })),
                Some(ComponentValue::Number(box Number {
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
                 Some(ComponentValue::Ident(box Ident { value: value_1, .. })),
                Some(ComponentValue::Ident(box Ident { value: value_2, .. })),
            ) if value_1.eq_ignore_ascii_case(value_2))
    }

    fn compress_from_initial(&self, declaration: &mut Declaration, span: Span) {
        let name = if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            value
        } else {
            return;
        };

        match *name {
            js_word!("accent-color")
            | js_word!("align-self")
            | js_word!("animation-timeline")
            | js_word!("aspect-ratio")
            | js_word!("block-size")
            | js_word!("bottom")
            | js_word!("break-after")
            | js_word!("break-before")
            | js_word!("break-inside")
            | js_word!("caret-color")
            | js_word!("caret-shape")
            | js_word!("clip")
            | js_word!("column-count")
            | js_word!("column-width")
            | js_word!("cursor")
            | js_word!("flex-basis")
            | js_word!("font-kerning")
            | js_word!("font-optical-sizing")
            | js_word!("forced-color-adjust")
            | js_word!("grid-auto-columns")
            | js_word!("grid-auto-rows")
            | js_word!("grid-column-end")
            | js_word!("grid-column-start")
            | js_word!("grid-row-end")
            | js_word!("grid-row-start")
            | js_word!("height")
            | js_word!("hyphenate-character")
            | js_word!("image-rendering")
            | js_word!("ime-mode")
            | js_word!("initial-letter-align")
            | js_word!("inline-size")
            | js_word!("input-security")
            | js_word!("inset")
            | js_word!("inset-block")
            | js_word!("inset-block-end")
            | js_word!("inset-block-start")
            | js_word!("inset-inline")
            | js_word!("inset-inline-end")
            | js_word!("inset-inline-start")
            | js_word!("isolation")
            | js_word!("justify-self")
            | js_word!("left")
            | js_word!("line-break")
            | js_word!("mask-border-width")
            | js_word!("mask-size")
            | js_word!("min-height")
            | js_word!("min-width")
            | js_word!("offset-anchor")
            | js_word!("offset-position")
            | js_word!("offset-rotate")
            | js_word!("overflow-anchor")
            | js_word!("overflow-block")
            | js_word!("overflow-inline")
            | js_word!("overscroll-behavior")
            | js_word!("overscroll-behavior-block")
            | js_word!("overscroll-behavior-inline")
            | js_word!("overscroll-behavior-x")
            | js_word!("overscroll-behavior-y")
            | js_word!("page-break-after")
            | js_word!("page-break-before")
            | js_word!("page-break-inside")
            | js_word!("pointer-events")
            | js_word!("right")
            | js_word!("scrollbar-color")
            | js_word!("scrollbar-gutter")
            | js_word!("scrollbar-width")
            | js_word!("scroll-behavior")
            | js_word!("scroll-padding")
            | js_word!("scroll-padding-block")
            | js_word!("scroll-padding-block-start")
            | js_word!("scroll-padding-block-end")
            | js_word!("scroll-padding-bottom")
            | js_word!("scroll-padding-inline")
            | js_word!("scroll-padding-inline-start")
            | js_word!("scroll-padding-inline-end")
            | js_word!("scroll-padding-left")
            | js_word!("scroll-padding-right")
            | js_word!("scroll-padding-top")
            | js_word!("table-layout")
            | js_word!("text-align-last")
            | js_word!("text-decoration-skip-ink")
            | js_word!("text-decoration-thickness")
            | js_word!("text-justify")
            | js_word!("text-rendering")
            | js_word!("text-underline-offset")
            | js_word!("text-underline-position")
            | js_word!("top")
            | js_word!("touch-action")
            | js_word!("user-select")
            | js_word!("width")
            | js_word!("will-change")
            | js_word!("z-index") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("auto"),
                    raw: None,
                }))];
            }
            js_word!("-webkit-line-clamp")
            | js_word!("animation-fill-mode")
            | js_word!("animation-name")
            | js_word!("appearance")
            | js_word!("backdrop-filter")
            | js_word!("background-image")
            | js_word!("border-block-style")
            | js_word!("border-block-end-style")
            | js_word!("border-block-start-style")
            | js_word!("border-bottom-style")
            | js_word!("border-image-source")
            | js_word!("border-inline-style")
            | js_word!("border-inline-end-style")
            | js_word!("border-inline-start-style")
            | js_word!("border-left-style")
            | js_word!("border-right-style")
            | js_word!("border-top-style")
            | js_word!("box-shadow")
            | js_word!("clear")
            | js_word!("clip-path")
            | js_word!("column-rule-style")
            | js_word!("column-span")
            | js_word!("contain")
            | js_word!("contain-intrinsic-block-size")
            | js_word!("contain-intrinsic-height")
            | js_word!("contain-intrinsic-inline-size")
            | js_word!("contain-intrinsic-width")
            | js_word!("counter-increment")
            | js_word!("counter-reset")
            | js_word!("counter-set")
            | js_word!("filter")
            | js_word!("float")
            | js_word!("font-size-adjust")
            | js_word!("grid-template-areas")
            | js_word!("grid-template-columns")
            | js_word!("grid-template-rows")
            | js_word!("hanging-punctuation")
            | js_word!("line-clamp")
            | js_word!("list-style-image")
            | js_word!("margin-trim")
            | js_word!("mask-border-source")
            | js_word!("mask-image")
            | js_word!("max-block-size")
            | js_word!("max-height")
            | js_word!("max-inline-size")
            | js_word!("max-lines")
            | js_word!("max-width")
            | js_word!("offset-path")
            | js_word!("outline-style")
            | js_word!("perspective")
            | js_word!("resize")
            | js_word!("rotate")
            | js_word!("scale")
            | js_word!("scroll-snap-align")
            | js_word!("scroll-snap-coordinate")
            | js_word!("scroll-snap-points-x")
            | js_word!("scroll-snap-points-y")
            | js_word!("scroll-snap-type")
            | js_word!("scroll-snap-type-x")
            | js_word!("scroll-snap-type-y")
            | js_word!("scroll-timeline-name")
            | js_word!("shape-outside")
            | js_word!("text-combine-upright")
            | js_word!("text-decoration-line")
            | js_word!("text-emphasis-style")
            | js_word!("text-shadow")
            | js_word!("text-transform")
            | js_word!("transform")
            | js_word!("translate") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("none"),
                    raw: None,
                }))];
            }
            js_word!("align-content")
            | js_word!("align-items")
            | js_word!("align-tracks")
            | js_word!("animation-direction")
            | js_word!("background-blend-mode")
            | js_word!("color-scheme")
            | js_word!("column-gap")
            | js_word!("content")
            | js_word!("font-feature-settings")
            | js_word!("font-language-override")
            | js_word!("font-variation-settings")
            | js_word!("font-stretch")
            | js_word!("font-style")
            | js_word!("font-variant")
            | js_word!("font-variant-alternates")
            | js_word!("font-variant-caps")
            | js_word!("font-variant-east-asian")
            | js_word!("font-variant-ligatures")
            | js_word!("font-variant-numeric")
            | js_word!("font-variant-position")
            | js_word!("font-weight")
            | js_word!("initial-letter")
            | js_word!("justify-content")
            | js_word!("justify-tracks")
            | js_word!("letter-spacing")
            | js_word!("line-height")
            | js_word!("math-shift")
            | js_word!("math-style")
            | js_word!("mix-blend-mode")
            | js_word!("overflow-wrap")
            | js_word!("paint-order")
            | js_word!("place-content")
            | js_word!("row-gap")
            | js_word!("scroll-snap-stop")
            | js_word!("unicode-bidi")
            | js_word!("white-space")
            | js_word!("word-break")
            | js_word!("word-spacing")
            | js_word!("word-wrap")
            | js_word!("grid-row-gap")
            | js_word!("grid-column-gap") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("normal"),
                    raw: None,
                }))];
            }
            js_word!("animation-delay")
            | js_word!("animation-duration")
            | js_word!("transition-delay")
            | js_word!("transition-duration") => {
                declaration.value =
                    vec![ComponentValue::Dimension(Box::new(Dimension::Time(Time {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                        unit: Ident {
                            span: DUMMY_SP,
                            value: js_word!("s"),
                            raw: None,
                        },
                    })))];
            }
            js_word!("shape-image-threshold") | js_word!("opacity") => {
                declaration.value = vec![ComponentValue::AlphaValue(Box::new(AlphaValue::Number(
                    Number {
                        span,
                        value: 0.0,
                        raw: None,
                    },
                )))];
            }
            js_word!("animation-iteration-count") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            js_word!("animation-timing-function") | js_word!("transition-timing-function") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("ease"),
                    raw: None,
                }))];
            }
            js_word!("azimuth") | js_word!("mask-position") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("center"),
                    raw: None,
                }))];
            }
            js_word!("background-attachment") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("scroll"),
                    raw: None,
                }))];
            }
            js_word!("background-position") => {
                declaration.value = vec![
                    ComponentValue::Percentage(Box::new(Percentage {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                    })),
                    ComponentValue::Percentage(Box::new(Percentage {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                    })),
                ];
            }
            js_word!("background-position-x") | js_word!("background-position-y") => {
                declaration.value = vec![ComponentValue::Percentage(Box::new(Percentage {
                    span,
                    value: Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    },
                }))];
            }
            js_word!("background-repeat") | js_word!("mask-repeat") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("repeat"),
                    raw: None,
                }))];
            }
            js_word!("block-overflow") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("clip"),
                    raw: None,
                }))];
            }
            js_word!("border-block-width")
            | js_word!("border-block-end-width")
            | js_word!("border-block-start-width")
            | js_word!("border-bottom-width")
            | js_word!("border-inline-width")
            | js_word!("border-inline-end-width")
            | js_word!("border-inline-start-width")
            | js_word!("border-left-width")
            | js_word!("border-right-width")
            | js_word!("border-top-width")
            | js_word!("column-rule-width")
            | js_word!("font-size")
            | js_word!("outline-width") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("medium"),
                    raw: None,
                }))];
            }
            js_word!("border-top-left-radius")
            | js_word!("border-top-right-radius")
            | js_word!("border-start-end-radius")
            | js_word!("border-start-start-radius")
            | js_word!("border-bottom-left-radius")
            | js_word!("border-bottom-right-radius")
            | js_word!("border-end-end-radius")
            | js_word!("border-end-start-radius")
            | js_word!("shape-margin")
            | js_word!("offset-distance") => {
                declaration.value = vec![ComponentValue::LengthPercentage(Box::new(
                    LengthPercentage::Length(Length {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                        unit: Ident {
                            span: DUMMY_SP,
                            value: js_word!("px"),
                            raw: None,
                        },
                    }),
                ))];
            }
            js_word!("padding-block")
            | js_word!("padding-block-end")
            | js_word!("padding-block-start")
            | js_word!("padding-bottom")
            | js_word!("padding-inline")
            | js_word!("padding-inline-end")
            | js_word!("padding-inline-start")
            | js_word!("padding-left")
            | js_word!("padding-right")
            | js_word!("padding-top")
            | js_word!("padding")
            | js_word!("margin-block")
            | js_word!("margin-block-end")
            | js_word!("margin-block-start")
            | js_word!("margin-bottom")
            | js_word!("margin-inline")
            | js_word!("margin-inline-end")
            | js_word!("margin-inline-start")
            | js_word!("margin-left")
            | js_word!("margin-right")
            | js_word!("margin-top")
            | js_word!("margin")
            | js_word!("scroll-margin")
            | js_word!("scroll-margin-block")
            | js_word!("scroll-margin-block-start")
            | js_word!("scroll-margin-block-end")
            | js_word!("scroll-margin-bottom")
            | js_word!("scroll-margin-inline")
            | js_word!("scroll-margin-inline-start")
            | js_word!("scroll-margin-inline-end")
            | js_word!("scroll-margin-left")
            | js_word!("scroll-margin-right")
            | js_word!("scroll-margin-top")
            | js_word!("min-inline-size")
            | js_word!("min-block-size")
            | js_word!("border-image-outset")
            | js_word!("text-indent")
            | js_word!("outline-offset")
            | js_word!("line-height-step")
            | js_word!("border-spacing") => {
                declaration.value = vec![ComponentValue::Dimension(Box::new(Dimension::Length(
                    Length {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                        unit: Ident {
                            span: DUMMY_SP,
                            value: js_word!("px"),
                            raw: None,
                        },
                    },
                )))];
            }
            js_word!("flex-direction") | js_word!("grid-auto-flow") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("row"),
                    raw: None,
                }))];
            }
            js_word!("mask-border-slice") | js_word!("mask-border-outset") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 0.0,
                    raw: None,
                }))];
            }
            js_word!("border-image-slice") => {
                declaration.value = vec![ComponentValue::Percentage(Box::new(Percentage {
                    span,
                    value: Number {
                        span: DUMMY_SP,
                        value: 100.0,
                        raw: None,
                    },
                }))];
            }
            js_word!("border-image-width") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            js_word!("box-decoration-break") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("slice"),
                    raw: None,
                }))];
            }
            js_word!("caption-side") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("top"),
                    raw: None,
                }))];
            }
            js_word!("direction") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("ltr"),
                    raw: None,
                }))];
            }
            js_word!("empty-cells") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("show"),
                    raw: None,
                }))];
            }
            js_word!("flex-grow") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 0.0,
                    raw: None,
                }))];
            }
            js_word!("flex-shrink") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            js_word!("flex-wrap") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("nowrap"),
                    raw: None,
                }))];
            }
            js_word!("hyphens") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("manual"),
                    raw: None,
                }))];
            }
            js_word!("image-resolution") => {
                declaration.value = vec![ComponentValue::Dimension(Box::new(
                    Dimension::Resolution(Resolution {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 1.0,
                            raw: None,
                        },
                        unit: Ident {
                            span: DUMMY_SP,
                            value: js_word!("dppx"),
                            raw: None,
                        },
                    }),
                ))];
            }
            js_word!("justify-items") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("legacy"),
                    raw: None,
                }))];
            }
            js_word!("list-style-type") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("disk"),
                    raw: None,
                }))];
            }
            js_word!("mask-border-mode") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("alpha"),
                    raw: None,
                }))];
            }
            js_word!("mask-composite") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("add"),
                    raw: None,
                }))];
            }
            js_word!("masonry-auto-flow") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("pack"),
                    raw: None,
                }))];
            }
            js_word!("math-depth") | js_word!("order") => {
                declaration.value = vec![ComponentValue::Integer(Box::new(Integer {
                    span,
                    value: 0,
                    raw: None,
                }))];
            }
            js_word!("object-fit") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("fill"),
                    raw: None,
                }))];
            }
            js_word!("overflow-clip-margin") => {
                declaration.value = vec![ComponentValue::Dimension(Box::new(Dimension::Length(
                    Length {
                        span,
                        value: Number {
                            span: DUMMY_SP,
                            value: 0.0,
                            raw: None,
                        },
                        unit: Ident {
                            span: DUMMY_SP,
                            value: js_word!("px"),
                            raw: None,
                        },
                    },
                )))];
            }
            js_word!("position") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("static"),
                    raw: None,
                }))];
            }
            js_word!("scroll-timeline-axis") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("block"),
                    raw: None,
                }))];
            }
            js_word!("tab-size") => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span: DUMMY_SP,
                    value: 8.0,
                    raw: None,
                }))];
            }
            js_word!("text-decoration-style") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("solid"),
                    raw: None,
                }))];
            }
            js_word!("text-orientation") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("mixed"),
                    raw: None,
                }))];
            }
            js_word!("text-overflow") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("clip"),
                    raw: None,
                }))];
            }
            js_word!("transform-style") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("flat"),
                    raw: None,
                }))];
            }
            js_word!("transition-property") => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: js_word!("all"),
                    raw: None,
                }))];
            }
            js_word!("orphans") | js_word!("widows") => {
                declaration.value = vec![ComponentValue::Integer(Box::new(Integer {
                    span,
                    value: 2,
                    raw: None,
                }))];
            }
            _ => {}
        }
    }

    fn _compress_to_initial(&self, declaration: &mut Declaration) {
        let name = if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            value
        } else {
            return;
        };

        match *name {
            js_word!("background-clip") | js_word!("mask-clip") | js_word!("mask-origin") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("border-box")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("background-color") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("transparent")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("background-origin") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("padding-box")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("background-size") => {
                if let (
                    Some(ComponentValue::Ident(box Ident {
                        value: first, span, ..
                    })),
                    Some(ComponentValue::Ident(box Ident { value: second, .. })),
                ) = (declaration.value.get(0), declaration.value.get(1))
                {
                    if first.eq_ignore_ascii_case(&js_word!("auto"))
                        && second.eq_ignore_ascii_case(&js_word!("auto"))
                        && declaration.value.len() == 2
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("border-block-color")
            | js_word!("border-block-start-color")
            | js_word!("border-block-end-color")
            | js_word!("border-inline-color")
            | js_word!("border-inline-start-color")
            | js_word!("border-inline-end-color")
            | js_word!("border-bottom-color")
            | js_word!("border-left-color")
            | js_word!("border-right-color")
            | js_word!("border-top-color")
            | js_word!("column-rule-color")
            | js_word!("text-emphasis-color")
            | js_word!("text-decoration-color") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("currentcolor")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("border-collapse") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("separate")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("box-sizing") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("content-box")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("color") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("canvastext")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("font-synthesis") => {
                if let (
                    Some(ComponentValue::Ident(box Ident {
                        value: first, span, ..
                    })),
                    Some(ComponentValue::Ident(box Ident { value: second, .. })),
                ) = (declaration.value.get(0), declaration.value.get(1))
                {
                    if first.eq_ignore_ascii_case(&js_word!("weight"))
                        && second.eq_ignore_ascii_case(&js_word!("style"))
                        && declaration.value.len() == 2
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("image-orientation") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("from-image")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("mask-mode") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("match-source"))
                        && declaration.value.len() == 1
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("mask-type") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("luminance")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("ruby-align") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("space-around")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("ruby-merge") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("separate")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("ruby-position") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("alternate")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("text-emphasis-position") => {
                if let (
                    Some(ComponentValue::Ident(box Ident {
                        value: first, span, ..
                    })),
                    Some(ComponentValue::Ident(box Ident { value: second, .. })),
                ) = (declaration.value.get(0), declaration.value.get(1))
                {
                    if first.eq_ignore_ascii_case(&js_word!("over"))
                        && second.eq_ignore_ascii_case(&js_word!("right"))
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("transform-box") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("view-box")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("transform-origin") => {
                if let (
                    Some(ComponentValue::Percentage(box Percentage {
                        value: Number { value: first, .. },
                        span,
                        ..
                    })),
                    Some(ComponentValue::Percentage(box Percentage {
                        value: Number { value: second, .. },
                        ..
                    })),
                    Some(ComponentValue::Integer(box Integer { value: third, .. })),
                ) = (
                    declaration.value.get(0),
                    declaration.value.get(1),
                    declaration.value.get(2),
                ) {
                    if *first == 50.0
                        && *second == 50.0
                        && *third == 0
                        && declaration.value.len() == 3
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("vertical-align") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("baseline")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            js_word!("writing-mode") => {
                if let Some(ComponentValue::Ident(box Ident { value, span, .. })) =
                    declaration.value.get(0)
                {
                    if value.eq_ignore_ascii_case(&js_word!("horizontal-tb")) {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("initial"),
                            raw: None,
                        }))];
                    }
                }
            }
            _ => {}
        }
    }
}
