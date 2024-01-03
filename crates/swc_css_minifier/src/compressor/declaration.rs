use swc_common::{util::take::Take, Span, DUMMY_SP};
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_declaration(&self, declaration: &mut Declaration) {
        if let DeclarationName::Ident(Ident { value: name, .. }) = &mut declaration.name {
            *name = name.to_ascii_lowercase();

            match &**name {
                "display" if declaration.value.len() > 1 => {
                    let mut outside = None;
                    let mut inside = None;
                    let mut list_item = None;

                    for value in declaration.value.iter() {
                        match value {
                            outside_node @ ComponentValue::Ident(ident)
                                if matches_eq_ignore_ascii_case!(
                                    ident.value,
                                    "block",
                                    "inline",
                                    "run-in"
                                ) =>
                            {
                                outside = Some(outside_node);
                            }
                            inside_node @ ComponentValue::Ident(ident)
                                if matches_eq_ignore_ascii_case!(
                                    ident.value,
                                    "flow",
                                    "flow-root",
                                    "table",
                                    "flex",
                                    "grid",
                                    "ruby"
                                ) =>
                            {
                                inside = Some(inside_node);
                            }
                            list_item_node @ ComponentValue::Ident(ident)
                                if ident.value.eq_ignore_ascii_case("list-item") =>
                            {
                                if let Some(ComponentValue::Ident(ident)) = inside {
                                    if !matches_eq_ignore_ascii_case!(
                                        ident.value,
                                        "flow",
                                        "flow-root"
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
                        (Some(outside), Some(ComponentValue::Ident(inside_ident)), None)
                            if inside_ident.value.eq_ignore_ascii_case("flow") =>
                        {
                            declaration.value = vec![outside.clone()];
                        }
                        // `block flow-root` -> `flow-root`
                        (
                            Some(ComponentValue::Ident(outside_ident)),
                            Some(inside @ ComponentValue::Ident(inside_ident)),
                            None,
                        ) if outside_ident.value.eq_ignore_ascii_case("block")
                            && inside_ident.value.eq_ignore_ascii_case("flow-root") =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline flow-root` -> `inline-block`
                        (
                            Some(ComponentValue::Ident(outside_ident)),
                            Some(ComponentValue::Ident(inside_ident)),
                            None,
                        ) if outside_ident.value.eq_ignore_ascii_case("inline")
                            && inside_ident.value.eq_ignore_ascii_case("flow-root") =>
                        {
                            declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                span: outside_ident.span,
                                value: "inline-block".into(),
                                raw: None,
                            }))];
                        }
                        // `block flow list-item` -> `list-item`
                        (
                            Some(ComponentValue::Ident(outside_ident)),
                            Some(ComponentValue::Ident(inside_ident)),
                            Some(list_item),
                        ) if outside_ident.value.eq_ignore_ascii_case("block")
                            && inside_ident.value.eq_ignore_ascii_case("flow") =>
                        {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `block list-item` -> `list-item`
                        (Some(ComponentValue::Ident(outside_ident)), None, Some(list_item))
                            if outside_ident.value.eq_ignore_ascii_case("block") =>
                        {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `flow list-item` -> `list-item`
                        (None, Some(ComponentValue::Ident(inside_ident)), Some(list_item))
                            if inside_ident.value.eq_ignore_ascii_case("flow") =>
                        {
                            declaration.value = vec![list_item.clone()];
                        }
                        // `inline flow list-item` -> `inline list-item`
                        (
                            Some(outside @ ComponentValue::Ident(outside_ident)),
                            Some(ComponentValue::Ident(inside_ident)),
                            Some(list_item),
                        ) if outside_ident.value.eq_ignore_ascii_case("inline")
                            && inside_ident.value.eq_ignore_ascii_case("flow") =>
                        {
                            declaration.value = vec![outside.clone(), list_item.clone()];
                        }
                        // `block flex` -> `flex`
                        // `block grid` -> `grid`
                        // `block table` -> `table`
                        (
                            Some(ComponentValue::Ident(outside_ident)),
                            Some(inside @ ComponentValue::Ident(inside_ident)),
                            None,
                        ) if outside_ident.value.eq_ignore_ascii_case("block")
                            && matches_eq_ignore_ascii_case!(
                                inside_ident.value,
                                "flex",
                                "grid",
                                "table"
                            ) =>
                        {
                            declaration.value = vec![inside.clone()];
                        }
                        // `inline ruby` -> `ruby`
                        (
                            Some(ComponentValue::Ident(outside_ident)),
                            Some(inside @ ComponentValue::Ident(inside_ident)),
                            None,
                        ) if outside_ident.value.eq_ignore_ascii_case("inline")
                            && inside_ident.value.eq_ignore_ascii_case("ruby") =>
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
                    let top = declaration.value.first();
                    let right = declaration
                        .value
                        .get(1)
                        .or_else(|| declaration.value.first());
                    let bottom = declaration
                        .value
                        .get(2)
                        .or_else(|| declaration.value.first());
                    let left = declaration
                        .value
                        .get(3)
                        .or_else(|| declaration.value.get(1))
                        .or_else(|| declaration.value.first());

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
                    let first = declaration.value.first();
                    let second = declaration.value.get(1);

                    if self.is_same_length_percentage_nodes(first, second)
                        || self.is_same_ident(first, second)
                    {
                        declaration.value.remove(1);
                    }
                }
                "border-style" if declaration.value.len() > 1 => {
                    let top = declaration.value.first();
                    let right = declaration
                        .value
                        .get(1)
                        .or_else(|| declaration.value.first());
                    let bottom = declaration
                        .value
                        .get(2)
                        .or_else(|| declaration.value.first());
                    let left = declaration
                        .value
                        .get(3)
                        .or_else(|| declaration.value.get(1))
                        .or_else(|| declaration.value.first());

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
                    let first = declaration.value.first();
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
                            ComponentValue::Ident(ident)
                                if ident.value.eq_ignore_ascii_case("normal") =>
                            {
                                ComponentValue::Integer(Box::new(Integer {
                                    span: ident.span,
                                    value: 400,
                                    raw: None,
                                }))
                            }
                            ComponentValue::Ident(ident)
                                if ident.value.eq_ignore_ascii_case("bold") =>
                            {
                                ComponentValue::Integer(Box::new(Integer {
                                    span: ident.span,
                                    value: 700,
                                    raw: None,
                                }))
                            }
                            _ => node,
                        })
                        .collect();
                }
                "background-repeat" | "mask-repeat" | "-webkit-mask-repeat"
                    if declaration.value.len() == 2 =>
                {
                    let first = declaration.value.first();
                    let second = declaration.value.get(1);

                    if let (
                        Some(ComponentValue::Ident(first_ident)),
                        Some(ComponentValue::Ident(second_ident)),
                    ) = (first, second)
                    {
                        match (
                            &*first_ident.value.to_ascii_lowercase(),
                            &*second_ident.value.to_ascii_lowercase(),
                        ) {
                            ("repeat", "no-repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                    span: first_ident.span,
                                    value: "repeat-x".into(),
                                    raw: None,
                                }))];
                            }
                            ("no-repeat", "repeat") => {
                                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                                    span: first_ident.span,
                                    value: "repeat-y".into(),
                                    raw: None,
                                }))];
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
                    let first = declaration.value.first();
                    let second = declaration.value.get(1);

                    if self.is_same_ident(first, second) {
                        declaration.value.remove(1);
                    }
                }
                "animation" if !declaration.value.is_empty() => {
                    let first = declaration.value.first().cloned();
                    if let Some(ComponentValue::Str(ident)) = first {
                        declaration.value.remove(0);
                        match &*ident.value.to_ascii_lowercase() {
                            _ if crate::is_css_wide_keyword(&ident.value)
                                || ident.value.eq_ignore_ascii_case("none") =>
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
                "animation-name" => {
                    declaration.value = declaration
                        .value
                        .take()
                        .into_iter()
                        .map(|node| match node {
                            ComponentValue::Str(ref ident) => {
                                let value = ident.value.to_ascii_lowercase();
                                match &*value {
                                    _ if crate::is_css_wide_keyword(&ident.value)
                                        || ident.value.eq_ignore_ascii_case("none") =>
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

            let is_initial = if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                if ident.value.eq_ignore_ascii_case("initial") {
                    Some(ident.span)
                } else {
                    None
                }
            } else {
                None
            };

            if let Some(span) = is_initial {
                self.compress_from_initial(declaration, span);
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
        let Some(node_1) = node_1 else { return false };
        let Some(node_2) = node_2 else { return false };

        match (node_1, node_2) {
            (ComponentValue::Dimension(dimension_1), ComponentValue::Dimension(dimension_2)) => {
                let result_1 = dimension_1
                    .as_length()
                    .map(|length| (&length.value.value, &length.unit.value));

                let result_2 = dimension_2
                    .as_length()
                    .map(|length| (&length.value.value, &length.unit.value));

                result_1.is_some() && result_1 == result_2
            }
            (ComponentValue::Integer(integer_1), ComponentValue::Integer(integer_2)) => {
                integer_1.value == 0 && integer_2.value == 0
            }
            (ComponentValue::Number(number_1), ComponentValue::Number(number_2)) => {
                number_1.value == number_2.value
            }
            _ => false,
        }
    }

    fn is_same_length_percentage_nodes(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        let Some(node_1) = node_1 else { return false };
        let Some(node_2) = node_2 else { return false };

        match (node_1, node_2) {
            (ComponentValue::Dimension(dimension_1), ComponentValue::Dimension(dimension_2)) => {
                let Some(result_1) = dimension_1.as_length() else {
                    return false;
                };

                let Some(result_2) = dimension_2.as_length() else {
                    return false;
                };

                result_1.value.value == result_2.value.value
                    && result_1
                        .unit
                        .value
                        .eq_ignore_ascii_case(&result_2.unit.value)
            }
            (
                ComponentValue::Percentage(percentage_1),
                ComponentValue::Percentage(percentage_2),
            ) => percentage_1.value.value == percentage_2.value.value,
            (ComponentValue::Integer(integer_1), ComponentValue::Integer(integer_2)) => {
                integer_1.value == 0 && integer_2.value == 0
            }
            (ComponentValue::Number(number_1), ComponentValue::Number(number_2)) => {
                number_1.value == number_2.value
            }
            _ => false,
        }
    }

    fn is_same_ident(
        &self,
        node_1: Option<&ComponentValue>,
        node_2: Option<&ComponentValue>,
    ) -> bool {
        let Some(node_1) = node_1 else { return false };
        let Some(node_2) = node_2 else { return false };

        let Some(value_1) = node_1.as_ident().map(|ident| &ident.value) else {
            return false;
        };
        let Some(value_2) = node_2.as_ident().map(|ident| &ident.value) else {
            return false;
        };

        value_1.eq_ignore_ascii_case(value_2)
    }

    fn compress_from_initial(&self, declaration: &mut Declaration, span: Span) {
        let name = if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            value
        } else {
            return;
        };

        match &**name {
            "accent-color"
            | "align-self"
            | "animation-timeline"
            | "aspect-ratio"
            | "block-size"
            | "bottom"
            | "break-after"
            | "break-before"
            | "break-inside"
            | "caret-color"
            | "caret-shape"
            | "clip"
            | "column-count"
            | "column-width"
            | "cursor"
            | "flex-basis"
            | "font-kerning"
            | "font-optical-sizing"
            | "forced-color-adjust"
            | "grid-auto-columns"
            | "grid-auto-rows"
            | "grid-column-end"
            | "grid-column-start"
            | "grid-row-end"
            | "grid-row-start"
            | "height"
            | "hyphenate-character"
            | "image-rendering"
            | "ime-mode"
            | "initial-letter-align"
            | "inline-size"
            | "input-security"
            | "inset"
            | "inset-block"
            | "inset-block-end"
            | "inset-block-start"
            | "inset-inline"
            | "inset-inline-end"
            | "inset-inline-start"
            | "isolation"
            | "justify-self"
            | "left"
            | "line-break"
            | "mask-border-width"
            | "mask-size"
            | "min-height"
            | "min-width"
            | "offset-anchor"
            | "offset-position"
            | "offset-rotate"
            | "overflow-anchor"
            | "overflow-block"
            | "overflow-inline"
            | "overscroll-behavior"
            | "overscroll-behavior-block"
            | "overscroll-behavior-inline"
            | "overscroll-behavior-x"
            | "overscroll-behavior-y"
            | "page-break-after"
            | "page-break-before"
            | "page-break-inside"
            | "pointer-events"
            | "right"
            | "scrollbar-color"
            | "scrollbar-gutter"
            | "scrollbar-width"
            | "scroll-behavior"
            | "scroll-padding"
            | "scroll-padding-block"
            | "scroll-padding-block-start"
            | "scroll-padding-block-end"
            | "scroll-padding-bottom"
            | "scroll-padding-inline"
            | "scroll-padding-inline-start"
            | "scroll-padding-inline-end"
            | "scroll-padding-left"
            | "scroll-padding-right"
            | "scroll-padding-top"
            | "table-layout"
            | "text-align-last"
            | "text-decoration-skip-ink"
            | "text-decoration-thickness"
            | "text-justify"
            | "text-rendering"
            | "text-underline-offset"
            | "text-underline-position"
            | "top"
            | "touch-action"
            | "user-select"
            | "width"
            | "will-change"
            | "z-index" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "auto".into(),
                    raw: None,
                }))];
            }
            "-webkit-line-clamp"
            | "animation-fill-mode"
            | "animation-name"
            | "appearance"
            | "backdrop-filter"
            | "background-image"
            | "border-block-style"
            | "border-block-end-style"
            | "border-block-start-style"
            | "border-bottom-style"
            | "border-image-source"
            | "border-inline-style"
            | "border-inline-end-style"
            | "border-inline-start-style"
            | "border-left-style"
            | "border-right-style"
            | "border-top-style"
            | "box-shadow"
            | "clear"
            | "clip-path"
            | "column-rule-style"
            | "column-span"
            | "contain"
            | "contain-intrinsic-block-size"
            | "contain-intrinsic-height"
            | "contain-intrinsic-inline-size"
            | "contain-intrinsic-width"
            | "counter-increment"
            | "counter-reset"
            | "counter-set"
            | "filter"
            | "float"
            | "font-size-adjust"
            | "grid-template-areas"
            | "grid-template-columns"
            | "grid-template-rows"
            | "hanging-punctuation"
            | "line-clamp"
            | "list-style-image"
            | "margin-trim"
            | "mask-border-source"
            | "mask-image"
            | "max-block-size"
            | "max-height"
            | "max-inline-size"
            | "max-lines"
            | "max-width"
            | "offset-path"
            | "outline-style"
            | "perspective"
            | "resize"
            | "rotate"
            | "scale"
            | "scroll-snap-align"
            | "scroll-snap-coordinate"
            | "scroll-snap-points-x"
            | "scroll-snap-points-y"
            | "scroll-snap-type"
            | "scroll-snap-type-x"
            | "scroll-snap-type-y"
            | "scroll-timeline-name"
            | "shape-outside"
            | "text-combine-upright"
            | "text-decoration-line"
            | "text-emphasis-style"
            | "text-shadow"
            | "text-transform"
            | "transform"
            | "translate" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "none".into(),
                    raw: None,
                }))];
            }
            "align-content"
            | "align-items"
            | "align-tracks"
            | "animation-direction"
            | "background-blend-mode"
            | "color-scheme"
            | "column-gap"
            | "content"
            | "font-feature-settings"
            | "font-language-override"
            | "font-variation-settings"
            | "font-stretch"
            | "font-style"
            | "font-variant"
            | "font-variant-alternates"
            | "font-variant-caps"
            | "font-variant-east-asian"
            | "font-variant-ligatures"
            | "font-variant-numeric"
            | "font-variant-position"
            | "font-weight"
            | "initial-letter"
            | "justify-content"
            | "justify-tracks"
            | "letter-spacing"
            | "line-height"
            | "math-shift"
            | "math-style"
            | "mix-blend-mode"
            | "overflow-wrap"
            | "paint-order"
            | "place-content"
            | "row-gap"
            | "scroll-snap-stop"
            | "unicode-bidi"
            | "white-space"
            | "word-break"
            | "word-spacing"
            | "word-wrap"
            | "grid-row-gap"
            | "grid-column-gap" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "normal".into(),
                    raw: None,
                }))];
            }
            "animation-delay"
            | "animation-duration"
            | "transition-delay"
            | "transition-duration" => {
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
                            value: "s".into(),
                            raw: None,
                        },
                    })))];
            }
            "shape-image-threshold" | "opacity" => {
                declaration.value = vec![ComponentValue::AlphaValue(Box::new(AlphaValue::Number(
                    Number {
                        span,
                        value: 0.0,
                        raw: None,
                    },
                )))];
            }
            "animation-iteration-count" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            "animation-timing-function" | "transition-timing-function" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "ease".into(),
                    raw: None,
                }))];
            }
            "azimuth" | "mask-position" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "center".into(),
                    raw: None,
                }))];
            }
            "background-attachment" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "scroll".into(),
                    raw: None,
                }))];
            }
            "background-position" => {
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
            "background-position-x" | "background-position-y" => {
                declaration.value = vec![ComponentValue::Percentage(Box::new(Percentage {
                    span,
                    value: Number {
                        span: DUMMY_SP,
                        value: 0.0,
                        raw: None,
                    },
                }))];
            }
            "background-repeat" | "mask-repeat" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "repeat".into(),
                    raw: None,
                }))];
            }
            "block-overflow" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "clip".into(),
                    raw: None,
                }))];
            }
            "border-block-width"
            | "border-block-end-width"
            | "border-block-start-width"
            | "border-bottom-width"
            | "border-inline-width"
            | "border-inline-end-width"
            | "border-inline-start-width"
            | "border-left-width"
            | "border-right-width"
            | "border-top-width"
            | "column-rule-width"
            | "font-size"
            | "outline-width" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "medium".into(),
                    raw: None,
                }))];
            }
            "border-top-left-radius"
            | "border-top-right-radius"
            | "border-start-end-radius"
            | "border-start-start-radius"
            | "border-bottom-left-radius"
            | "border-bottom-right-radius"
            | "border-end-end-radius"
            | "border-end-start-radius"
            | "shape-margin"
            | "offset-distance" => {
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
                            value: "px".into(),
                            raw: None,
                        },
                    }),
                ))];
            }
            "padding-block"
            | "padding-block-end"
            | "padding-block-start"
            | "padding-bottom"
            | "padding-inline"
            | "padding-inline-end"
            | "padding-inline-start"
            | "padding-left"
            | "padding-right"
            | "padding-top"
            | "padding"
            | "margin-block"
            | "margin-block-end"
            | "margin-block-start"
            | "margin-bottom"
            | "margin-inline"
            | "margin-inline-end"
            | "margin-inline-start"
            | "margin-left"
            | "margin-right"
            | "margin-top"
            | "margin"
            | "scroll-margin"
            | "scroll-margin-block"
            | "scroll-margin-block-start"
            | "scroll-margin-block-end"
            | "scroll-margin-bottom"
            | "scroll-margin-inline"
            | "scroll-margin-inline-start"
            | "scroll-margin-inline-end"
            | "scroll-margin-left"
            | "scroll-margin-right"
            | "scroll-margin-top"
            | "min-inline-size"
            | "min-block-size"
            | "border-image-outset"
            | "text-indent"
            | "outline-offset"
            | "line-height-step"
            | "border-spacing" => {
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
                            value: "px".into(),
                            raw: None,
                        },
                    },
                )))];
            }
            "flex-direction" | "grid-auto-flow" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "row".into(),
                    raw: None,
                }))];
            }
            "mask-border-slice" | "mask-border-outset" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 0.0,
                    raw: None,
                }))];
            }
            "border-image-slice" => {
                declaration.value = vec![ComponentValue::Percentage(Box::new(Percentage {
                    span,
                    value: Number {
                        span: DUMMY_SP,
                        value: 100.0,
                        raw: None,
                    },
                }))];
            }
            "border-image-width" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            "box-decoration-break" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "slice".into(),
                    raw: None,
                }))];
            }
            "caption-side" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "top".into(),
                    raw: None,
                }))];
            }
            "direction" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "ltr".into(),
                    raw: None,
                }))];
            }
            "empty-cells" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "show".into(),
                    raw: None,
                }))];
            }
            "flex-grow" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 0.0,
                    raw: None,
                }))];
            }
            "flex-shrink" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span,
                    value: 1.0,
                    raw: None,
                }))];
            }
            "flex-wrap" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "nowrap".into(),
                    raw: None,
                }))];
            }
            "hyphens" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "manual".into(),
                    raw: None,
                }))];
            }
            "image-resolution" => {
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
                            value: "dppx".into(),
                            raw: None,
                        },
                    }),
                ))];
            }
            "justify-items" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "legacy".into(),
                    raw: None,
                }))];
            }
            "list-style-type" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "disk".into(),
                    raw: None,
                }))];
            }
            "mask-border-mode" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "alpha".into(),
                    raw: None,
                }))];
            }
            "mask-composite" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "add".into(),
                    raw: None,
                }))];
            }
            "masonry-auto-flow" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "pack".into(),
                    raw: None,
                }))];
            }
            "math-depth" | "order" => {
                declaration.value = vec![ComponentValue::Integer(Box::new(Integer {
                    span,
                    value: 0,
                    raw: None,
                }))];
            }
            "object-fit" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "fill".into(),
                    raw: None,
                }))];
            }
            "overflow-clip-margin" => {
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
                            value: "px".into(),
                            raw: None,
                        },
                    },
                )))];
            }
            "position" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "static".into(),
                    raw: None,
                }))];
            }
            "scroll-timeline-axis" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "block".into(),
                    raw: None,
                }))];
            }
            "tab-size" => {
                declaration.value = vec![ComponentValue::Number(Box::new(Number {
                    span: DUMMY_SP,
                    value: 8.0,
                    raw: None,
                }))];
            }
            "text-decoration-style" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "solid".into(),
                    raw: None,
                }))];
            }
            "text-orientation" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "mixed".into(),
                    raw: None,
                }))];
            }
            "text-overflow" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "clip".into(),
                    raw: None,
                }))];
            }
            "transform-style" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "flat".into(),
                    raw: None,
                }))];
            }
            "transition-property" => {
                declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                    span,
                    value: "all".into(),
                    raw: None,
                }))];
            }
            "orphans" | "widows" => {
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

        match &**name {
            "background-clip" | "mask-clip" | "mask-origin" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("border-box") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "background-color" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("transparent") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "background-origin" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("padding-box") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "background-size" => {
                if let (Some(ComponentValue::Ident(first)), Some(ComponentValue::Ident(second))) =
                    (declaration.value.first(), declaration.value.get(1))
                {
                    if first.value.eq_ignore_ascii_case("auto")
                        && second.value.eq_ignore_ascii_case("auto")
                        && declaration.value.len() == 2
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: first.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "border-block-color"
            | "border-block-start-color"
            | "border-block-end-color"
            | "border-inline-color"
            | "border-inline-start-color"
            | "border-inline-end-color"
            | "border-bottom-color"
            | "border-left-color"
            | "border-right-color"
            | "border-top-color"
            | "column-rule-color"
            | "text-emphasis-color"
            | "text-decoration-color" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("currentcolor") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "border-collapse" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("separate") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "box-sizing" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("content-box") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "color" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("canvastext") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "font-synthesis" => {
                if let (Some(ComponentValue::Ident(first)), Some(ComponentValue::Ident(second))) =
                    (declaration.value.first(), declaration.value.get(1))
                {
                    if first.value.eq_ignore_ascii_case("weight")
                        && second.value.eq_ignore_ascii_case("style")
                        && declaration.value.len() == 2
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: first.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "image-orientation" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("from-image") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "mask-mode" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("match-source")
                        && declaration.value.len() == 1
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "mask-type" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("luminance") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "ruby-align" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("space-around") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "ruby-merge" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("separate") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "ruby-position" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("alternate") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "text-emphasis-position" => {
                if let (Some(ComponentValue::Ident(first)), Some(ComponentValue::Ident(second))) =
                    (declaration.value.first(), declaration.value.get(1))
                {
                    if first.value.eq_ignore_ascii_case("over")
                        && second.value.eq_ignore_ascii_case("right")
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: first.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "transform-box" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("view-box") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "transform-origin" => {
                if let (
                    Some(Percentage {
                        value: Number { value: first, .. },
                        span,
                        ..
                    }),
                    Some(Percentage {
                        value: Number { value: second, .. },
                        ..
                    }),
                    Some(Integer { value: third, .. }),
                ) = (
                    declaration
                        .value
                        .first()
                        .and_then(|x| x.as_percentage())
                        .map(|x| x.as_ref()),
                    declaration
                        .value
                        .get(1)
                        .and_then(|x| x.as_percentage())
                        .map(|x| x.as_ref()),
                    declaration
                        .value
                        .get(2)
                        .and_then(|x| x.as_integer())
                        .map(|x| x.as_ref()),
                ) {
                    if *first == 50.0
                        && *second == 50.0
                        && *third == 0
                        && declaration.value.len() == 3
                    {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "vertical-align" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("baseline") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            "writing-mode" => {
                if let Some(ComponentValue::Ident(ident)) = declaration.value.first() {
                    if ident.value.eq_ignore_ascii_case("horizontal-tb") {
                        declaration.value = vec![ComponentValue::Ident(Box::new(Ident {
                            span: ident.span,
                            value: "initial".into(),
                            raw: None,
                        }))];
                    }
                }
            }
            _ => {}
        }
    }
}
