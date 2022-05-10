use core::f64::consts::PI;
use std::mem::take;

use swc_common::{EqIgnoreSpan, DUMMY_SP};
use swc_css_ast::*;
use swc_css_utils::{
    replace_function_name, replace_ident, replace_pseudo_class_selector_name,
    replace_pseudo_class_selector_on_pseudo_element_selector, replace_pseudo_element_selector_name,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn prefixer() -> impl VisitMut {
    Prefixer::default()
}

pub struct CrossFadeFunctionReplacerOnLegacyVariant<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for CrossFadeFunctionReplacerOnLegacyVariant<'_> {
    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            let mut transparency_values = vec![];

            for group in n.value.split_mut(|n| {
                matches!(
                    n,
                    ComponentValue::Delimiter(Delimiter {
                        value: DelimiterValue::Comma,
                        ..
                    })
                )
            }) {
                if transparency_values.len() >= 2 {
                    return;
                }

                let mut transparency_value = None;

                for n in group {
                    match n {
                        ComponentValue::Percentage(Percentage {
                            value: Number { value, .. },
                            ..
                        }) => {
                            if transparency_value.is_some() {
                                return;
                            }

                            transparency_value = Some(*value / 100.0);
                        }
                        ComponentValue::Number(Number { value, .. }) => {
                            if transparency_value.is_some() {
                                return;
                            }

                            transparency_value = Some(*value);
                        }
                        ComponentValue::Integer(Integer { value, .. }) => {
                            if transparency_value.is_some() {
                                return;
                            }

                            transparency_value = Some((*value) as f64);
                        }
                        _ => {}
                    }
                }

                transparency_values.push(transparency_value);
            }

            if transparency_values.len() != 2 {
                return;
            }

            let transparency_value = match (transparency_values[0], transparency_values[1]) {
                (None, None) => 0.5,
                (Some(number), None) => number,
                (None, Some(number)) => 1.0 - number,
                (Some(first), Some(second)) if first + second == 1.0 => first,
                _ => {
                    return;
                }
            };

            let mut new_value: Vec<ComponentValue> = n
                .value
                .iter()
                .filter(|n| {
                    !matches!(
                        n,
                        ComponentValue::Percentage(_)
                            | ComponentValue::Number(_)
                            | ComponentValue::Integer(_)
                    )
                })
                .cloned()
                .collect();

            new_value.extend(vec![
                ComponentValue::Delimiter(Delimiter {
                    span: DUMMY_SP,
                    value: DelimiterValue::Comma,
                }),
                ComponentValue::Number(Number {
                    span: DUMMY_SP,
                    value: transparency_value,
                    raw: transparency_value.to_string().into(),
                }),
            ]);

            n.value = new_value;

            n.name.value = self.to.into();
            n.name.raw = self.to.into();
        }
    }
}

pub fn replace_cross_fade_function_on_legacy_variant<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<CrossFadeFunctionReplacerOnLegacyVariant<'aa>>,
{
    node.visit_mut_with(&mut CrossFadeFunctionReplacerOnLegacyVariant { from, to });
}

pub struct ImageSetFunctionReplacerOnLegacyVariant<'a> {
    from: &'a str,
    to: &'a str,
    in_function: bool,
}

impl VisitMut for ImageSetFunctionReplacerOnLegacyVariant<'_> {
    fn visit_mut_component_value(&mut self, n: &mut ComponentValue) {
        n.visit_mut_children_with(self);

        if !self.in_function {
            return;
        }

        if let ComponentValue::Str(Str { value, raw, span }) = n {
            *n = ComponentValue::Url(Url {
                span: *span,
                name: Ident {
                    span: DUMMY_SP,
                    value: "url".into(),
                    raw: "url".into(),
                },
                value: Some(UrlValue::Str(Str {
                    span: DUMMY_SP,
                    value: value.as_ref().into(),
                    raw: raw.as_ref().into(),
                })),
                modifiers: Some(vec![]),
            })
        }
    }

    fn visit_mut_function(&mut self, n: &mut Function) {
        let old_in_function = self.in_function;

        self.in_function = true;

        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            n.name.value = self.to.into();
            n.name.raw = self.to.into();
        }

        self.in_function = old_in_function;
    }
}

pub fn replace_image_set_function_on_legacy_variant<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<ImageSetFunctionReplacerOnLegacyVariant<'aa>>,
{
    node.visit_mut_with(&mut ImageSetFunctionReplacerOnLegacyVariant {
        from,
        to,
        in_function: false,
    });
}

pub struct LinearGradientFunctionReplacerOnLegacyVariant<'a> {
    from: &'a str,
    to: &'a str,
}

// TODO ` -webkit-mask-image` need duplicate with original property for better
// TODO improve for very old browsers https://github.com/postcss/autoprefixer/blob/main/lib/hacks/gradient.js#L233
impl VisitMut for LinearGradientFunctionReplacerOnLegacyVariant<'_> {
    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        if &*n.name.value.to_lowercase() == self.from {
            n.name.value = self.to.into();
            n.name.raw = self.to.into();

            let first = n.value.get(0);

            match first {
                Some(ComponentValue::Ident(Ident { value, .. }))
                    if value.as_ref().eq_ignore_ascii_case("to") =>
                {
                    fn get_old_direction(direction: &str) -> Option<&str> {
                        match direction {
                            "top" => Some("bottom"),
                            "left" => Some("right"),
                            "bottom" => Some("top"),
                            "right" => Some("left"),
                            _ => None,
                        }
                    }

                    match (n.value.get(1), n.value.get(2)) {
                        (
                            Some(ComponentValue::Ident(Ident {
                                value: first_value,
                                span: first_span,
                                ..
                            })),
                            Some(ComponentValue::Ident(Ident {
                                value: second_value,
                                span: second_span,
                                ..
                            })),
                        ) => {
                            if let (Some(new_first_direction), Some(new_second_direction)) = (
                                get_old_direction(&*first_value),
                                get_old_direction(&*second_value),
                            ) {
                                let new_value = vec![
                                    ComponentValue::Ident(Ident {
                                        span: *first_span,
                                        value: new_first_direction.into(),
                                        raw: new_first_direction.into(),
                                    }),
                                    ComponentValue::Ident(Ident {
                                        span: *second_span,
                                        value: new_second_direction.into(),
                                        raw: new_second_direction.into(),
                                    }),
                                ];

                                n.value.splice(0..3, new_value);
                            }
                        }
                        (Some(ComponentValue::Ident(Ident { value, span, .. })), Some(_)) => {
                            if let Some(new_direction) = get_old_direction(&*value) {
                                let new_value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: new_direction.into(),
                                    raw: new_direction.into(),
                                })];

                                n.value.splice(0..2, new_value);
                            }
                        }
                        _ => {}
                    }
                }
                Some(ComponentValue::Dimension(Dimension::Angle(Angle {
                    value,
                    unit,
                    span,
                    ..
                }))) => {
                    let angle = match &*unit.value {
                        "deg" => (value.value % 360.0 + 360.0) % 360.0,
                        "grad" => value.value * 180.0 / 200.0,
                        "rad" => value.value * 180.0 / PI,
                        "turn" => value.value * 360.0,
                        _ => {
                            return;
                        }
                    };

                    if angle == 0.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "bottom".into(),
                            raw: "bottom".into(),
                        });
                    } else if angle == 90.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "left".into(),
                            raw: "left".into(),
                        });
                    } else if angle == 180.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "top".into(),
                            raw: "top".into(),
                        });
                    } else if angle == 270.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "right".into(),
                            raw: "right".into(),
                        });
                    } else {
                        let new_value = ((450.0 - angle).abs() % 360.0 * 1000.0).round() / 1000.0;

                        n.value[0] = ComponentValue::Dimension(Dimension::Angle(Angle {
                            span: *span,
                            value: Number {
                                span: value.span,
                                value: new_value,
                                raw: new_value.to_string().into(),
                            },
                            unit: Ident {
                                span: unit.span,
                                value: "deg".into(),
                                raw: "deg".into(),
                            },
                        }));
                    }
                }
                Some(_) | None => {}
            }

            if matches!(self.from, "radial-gradient" | "repeating-radial-gradient") {
                let at_index = n.value.iter().position(|n| match n {
                    ComponentValue::Ident(Ident { value, .. })
                        if value.as_ref().eq_ignore_ascii_case("at") =>
                    {
                        true
                    }
                    _ => false,
                });
                let first_comma_index = n.value.iter().position(|n| {
                    matches!(
                        n,
                        ComponentValue::Delimiter(Delimiter {
                            value: DelimiterValue::Comma,
                            ..
                        })
                    )
                });

                if let (Some(at_index), Some(first_comma_index)) = (at_index, first_comma_index) {
                    let mut new_value = vec![];

                    new_value.append(&mut n.value[at_index + 1..first_comma_index].to_vec());
                    new_value.append(&mut vec![ComponentValue::Delimiter(Delimiter {
                        span: DUMMY_SP,
                        value: DelimiterValue::Comma,
                    })]);
                    new_value.append(&mut n.value[0..at_index].to_vec());

                    n.value.splice(0..first_comma_index, new_value);
                }
            }
        }
    }
}

pub fn replace_gradient_function_on_legacy_variant<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<LinearGradientFunctionReplacerOnLegacyVariant<'aa>>,
{
    node.visit_mut_with(&mut LinearGradientFunctionReplacerOnLegacyVariant { from, to });
}

pub struct MediaFeatureResolutionReplacerOnLegacyVariant<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for MediaFeatureResolutionReplacerOnLegacyVariant<'_> {
    fn visit_mut_media_feature_plain(&mut self, n: &mut MediaFeaturePlain) {
        n.visit_mut_children_with(self);

        if let MediaFeatureValue::Dimension(Dimension::Resolution(Resolution {
            span: resolution_span,
            value: resolution_value,
            unit: resolution_unit,
        })) = &n.value
        {
            let MediaFeatureName::Ident(Ident {
                value: feature_name_value,
                span: feature_name_span,
                ..
            }) = &n.name;

            if &*feature_name_value.to_lowercase() == self.from {
                n.name = MediaFeatureName::Ident(Ident {
                    span: *feature_name_span,
                    value: self.to.into(),
                    raw: self.to.into(),
                });

                let left = match &*resolution_unit.value.to_lowercase() {
                    "dpi" => (resolution_value.value / 96.0 * 100.0).round() / 100.0,
                    "dpcm" => (((resolution_value.value * 2.54) / 96.0) * 100.0).round() / 100.0,
                    _ => resolution_value.value,
                };

                n.value = MediaFeatureValue::Ratio(Ratio {
                    span: *resolution_span,
                    left: Number {
                        span: resolution_value.span,
                        value: left,
                        raw: left.to_string().into(),
                    },
                    right: None,
                });
            }
        }
    }
}

pub fn replace_media_feature_resolution_on_legacy_variant<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<MediaFeatureResolutionReplacerOnLegacyVariant<'aa>>,
{
    node.visit_mut_with(&mut MediaFeatureResolutionReplacerOnLegacyVariant { from, to });
}

macro_rules! str_to_ident {
    ($val:expr) => {{
        ComponentValue::Ident(Ident {
            span: DUMMY_SP,
            value: $val.into(),
            raw: $val.into(),
        })
    }};
}

#[derive(Default)]
struct Prefixer {
    in_keyframe_block: bool,
    simple_block: Option<SimpleBlock>,
    rule_prefix: Option<Prefix>,
    added_top_rules: Vec<(Prefix, Rule)>,
    added_at_rules: Vec<(Prefix, AtRule)>,
    added_qualified_rules: Vec<(Prefix, QualifiedRule)>,
    added_declarations: Vec<Declaration>,
}

#[derive(Clone, Debug, PartialEq)]
pub enum Prefix {
    Webkit,
    Moz,
    O,
    Ms,
}

impl VisitMut for Prefixer {
    fn visit_mut_stylesheet(&mut self, n: &mut Stylesheet) {
        let mut new = vec![];

        for mut n in take(&mut n.rules) {
            n.visit_mut_children_with(self);

            for mut n in take(&mut self.added_top_rules) {
                let old_rule_prefix = self.rule_prefix.take();

                self.rule_prefix = Some(n.0);

                n.1.visit_mut_children_with(self);

                new.push(n.1);

                self.rule_prefix = old_rule_prefix;
            }

            new.push(n);
        }

        // Avoid duplicate prefixed at-rules
        new.dedup_by(|a, b| match (a, b) {
            (Rule::AtRule(a), Rule::AtRule(b)) => a.eq_ignore_span(b),
            _ => false,
        });

        n.rules = new;
    }

    // TODO handle declarations in `@media`/`@support`
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        let original_simple_block = n.block.clone();

        n.visit_mut_children_with(self);

        match &n.name {
            AtRuleName::Ident(Ident { value, .. })
                if value.as_ref().eq_ignore_ascii_case("viewport") =>
            {
                let ms_at_rule = AtRule {
                    span: DUMMY_SP,
                    name: AtRuleName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "-ms-viewport".into(),
                        raw: "-ms-viewport".into(),
                    }),
                    prelude: n.prelude.clone(),
                    block: original_simple_block.clone(),
                };

                let o_at_rule = AtRule {
                    span: DUMMY_SP,
                    name: AtRuleName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "-o-viewport".into(),
                        raw: "-o-viewport".into(),
                    }),
                    prelude: n.prelude.clone(),
                    block: original_simple_block,
                };

                if self.simple_block.is_none() {
                    self.added_top_rules
                        .push((Prefix::Ms, Rule::AtRule(ms_at_rule)));
                    self.added_top_rules
                        .push((Prefix::O, Rule::AtRule(o_at_rule)));
                } else {
                    self.added_at_rules.push((Prefix::Ms, ms_at_rule));
                    self.added_at_rules.push((Prefix::O, o_at_rule));
                }
            }
            AtRuleName::Ident(Ident { value, .. })
                if value.as_ref().eq_ignore_ascii_case("keyframes") =>
            {
                let webkit_at_rule = AtRule {
                    span: DUMMY_SP,
                    name: AtRuleName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "-webkit-keyframes".into(),
                        raw: "-webkit-keyframes".into(),
                    }),
                    prelude: n.prelude.clone(),
                    block: original_simple_block.clone(),
                };

                let moz_at_rule = AtRule {
                    span: DUMMY_SP,
                    name: AtRuleName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "-moz-keyframes".into(),
                        raw: "-moz-keyframes".into(),
                    }),
                    prelude: n.prelude.clone(),
                    block: original_simple_block.clone(),
                };

                let o_at_rule = AtRule {
                    span: DUMMY_SP,
                    name: AtRuleName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "-o-keyframes".into(),
                        raw: "-o-keyframes".into(),
                    }),
                    prelude: n.prelude.clone(),
                    block: original_simple_block,
                };

                if self.simple_block.is_none() {
                    self.added_top_rules
                        .push((Prefix::Webkit, Rule::AtRule(webkit_at_rule)));
                    self.added_top_rules
                        .push((Prefix::Moz, Rule::AtRule(moz_at_rule)));
                    self.added_top_rules
                        .push((Prefix::O, Rule::AtRule(o_at_rule)));
                } else {
                    self.added_at_rules.push((Prefix::Webkit, webkit_at_rule));
                    self.added_at_rules.push((Prefix::Moz, moz_at_rule));
                    self.added_at_rules.push((Prefix::O, o_at_rule));
                }
            }
            _ => {}
        }
    }

    fn visit_mut_media_query_list(&mut self, media_query_list: &mut MediaQueryList) {
        let mut new = vec![];

        for mut n in take(&mut media_query_list.queries) {
            n.visit_mut_children_with(self);

            let mut new_webkit_value = n.clone();

            replace_media_feature_resolution_on_legacy_variant(
                &mut new_webkit_value,
                "min-resolution",
                "-webkit-min-device-pixel-ratio",
            );
            replace_media_feature_resolution_on_legacy_variant(
                &mut new_webkit_value,
                "max-resolution",
                "-webkit-max-device-pixel-ratio",
            );

            if n != new_webkit_value {
                new.push(new_webkit_value);
            }

            let mut new_moz_value = n.clone();

            replace_media_feature_resolution_on_legacy_variant(
                &mut new_moz_value,
                "min-resolution",
                "min--moz-device-pixel-ratio",
            );
            replace_media_feature_resolution_on_legacy_variant(
                &mut new_moz_value,
                "max-resolution",
                "max--moz-device-pixel-ratio",
            );

            if n != new_moz_value {
                new.push(new_moz_value);
            }

            // TODO opera support

            new.push(n);
        }

        media_query_list.queries = new;
    }

    fn visit_mut_qualified_rule(&mut self, n: &mut QualifiedRule) {
        if let QualifiedRulePrelude::Invalid(_) = n.prelude {
            n.visit_mut_children_with(self);

            return;
        }

        let original_simple_block = n.block.clone();

        n.visit_mut_children_with(self);

        if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
            let mut new_webkit_prelude = n.prelude.clone();

            replace_pseudo_class_selector_name(
                &mut new_webkit_prelude,
                "autofill",
                "-webkit-autofill",
            );
            replace_pseudo_class_selector_name(
                &mut new_webkit_prelude,
                "any-link",
                "-webkit-any-link",
            );
            replace_pseudo_class_selector_name(
                &mut new_webkit_prelude,
                "fullscreen",
                "-webkit-full-screen",
            );
            replace_pseudo_element_selector_name(
                &mut new_webkit_prelude,
                "file-selector-button",
                "-webkit-file-upload-button",
            );
            replace_pseudo_element_selector_name(
                &mut new_webkit_prelude,
                "backdrop",
                "-webkit-backdrop",
            );
            replace_pseudo_element_selector_name(
                &mut new_webkit_prelude,
                "placeholder",
                "-webkit-input-placeholder",
            );

            if n.prelude != new_webkit_prelude {
                let qualified_rule = QualifiedRule {
                    span: DUMMY_SP,
                    prelude: new_webkit_prelude,
                    block: original_simple_block.clone(),
                };

                if self.simple_block.is_none() {
                    self.added_top_rules
                        .push((Prefix::Webkit, Rule::QualifiedRule(qualified_rule)));
                } else {
                    self.added_qualified_rules
                        .push((Prefix::Webkit, qualified_rule));
                }
            }
        }

        if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
            let mut new_moz_prelude = n.prelude.clone();

            replace_pseudo_class_selector_name(&mut new_moz_prelude, "read-only", "-moz-read-only");
            replace_pseudo_class_selector_name(
                &mut new_moz_prelude,
                "read-write",
                "-moz-read-write",
            );
            replace_pseudo_class_selector_name(&mut new_moz_prelude, "any-link", "-moz-any-link");
            replace_pseudo_class_selector_name(
                &mut new_moz_prelude,
                "fullscreen",
                "-moz-full-screen",
            );
            replace_pseudo_class_selector_name(
                &mut new_moz_prelude,
                "placeholder-shown",
                "-moz-placeholder-shown",
            );
            replace_pseudo_element_selector_name(
                &mut new_moz_prelude,
                "selection",
                "-moz-selection",
            );

            {
                let mut new_moz_prelude_with_previous = new_moz_prelude.clone();

                replace_pseudo_class_selector_on_pseudo_element_selector(
                    &mut new_moz_prelude_with_previous,
                    "placeholder",
                    "-moz-placeholder",
                );

                if new_moz_prelude_with_previous != new_moz_prelude {
                    let qualified_rule = QualifiedRule {
                        span: DUMMY_SP,
                        prelude: new_moz_prelude_with_previous,
                        block: original_simple_block.clone(),
                    };

                    if self.simple_block.is_none() {
                        self.added_top_rules
                            .push((Prefix::Moz, Rule::QualifiedRule(qualified_rule)));
                    } else {
                        self.added_qualified_rules
                            .push((Prefix::Moz, qualified_rule));
                    }
                }
            }

            replace_pseudo_element_selector_name(
                &mut new_moz_prelude,
                "placeholder",
                "-moz-placeholder",
            );

            if n.prelude != new_moz_prelude {
                let qualified_rule = QualifiedRule {
                    span: DUMMY_SP,
                    prelude: new_moz_prelude,
                    block: original_simple_block.clone(),
                };

                if self.simple_block.is_none() {
                    self.added_top_rules
                        .push((Prefix::Moz, Rule::QualifiedRule(qualified_rule)));
                } else {
                    self.added_qualified_rules
                        .push((Prefix::Moz, qualified_rule));
                }
            }
        }

        if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
            let mut new_ms_prelude = n.prelude.clone();

            replace_pseudo_class_selector_name(&mut new_ms_prelude, "fullscreen", "-ms-fullscreen");
            replace_pseudo_class_selector_name(
                &mut new_ms_prelude,
                "placeholder-shown",
                "-ms-input-placeholder",
            );
            replace_pseudo_element_selector_name(
                &mut new_ms_prelude,
                "file-selector-button",
                "-ms-browse",
            );
            replace_pseudo_element_selector_name(&mut new_ms_prelude, "backdrop", "-ms-backdrop");

            {
                let mut new_ms_prelude_with_previous = new_ms_prelude.clone();

                replace_pseudo_class_selector_on_pseudo_element_selector(
                    &mut new_ms_prelude_with_previous,
                    "placeholder",
                    "-ms-input-placeholder",
                );

                if new_ms_prelude_with_previous != new_ms_prelude {
                    let qualified_rule = QualifiedRule {
                        span: DUMMY_SP,
                        prelude: new_ms_prelude_with_previous,
                        block: original_simple_block.clone(),
                    };

                    if self.simple_block.is_none() {
                        self.added_top_rules
                            .push((Prefix::Ms, Rule::QualifiedRule(qualified_rule)));
                    } else {
                        self.added_qualified_rules
                            .push((Prefix::Ms, qualified_rule));
                    }
                }
            }

            replace_pseudo_element_selector_name(
                &mut new_ms_prelude,
                "placeholder",
                "-ms-input-placeholder",
            );

            if n.prelude != new_ms_prelude {
                let qualified_rule = QualifiedRule {
                    span: DUMMY_SP,
                    prelude: new_ms_prelude,
                    block: original_simple_block,
                };

                if self.simple_block.is_none() {
                    self.added_top_rules
                        .push((Prefix::Ms, Rule::QualifiedRule(qualified_rule)));
                } else {
                    self.added_qualified_rules
                        .push((Prefix::Ms, qualified_rule));
                }
            }
        }
    }

    fn visit_mut_keyframe_block(&mut self, n: &mut KeyframeBlock) {
        let old_in_keyframe_block = self.in_keyframe_block;

        self.in_keyframe_block = true;

        n.visit_mut_children_with(self);

        self.in_keyframe_block = old_in_keyframe_block;
    }

    fn visit_mut_simple_block(&mut self, simple_block: &mut SimpleBlock) {
        let old_simple_block = self.simple_block.take();

        self.simple_block = Some(simple_block.clone());

        let mut new = vec![];

        for mut n in take(&mut simple_block.value) {
            n.visit_mut_children_with(self);

            match n {
                ComponentValue::DeclarationOrAtRule(_) => {
                    new.extend(
                        self.added_declarations
                            .drain(..)
                            .map(StyleBlock::Declaration)
                            .map(ComponentValue::StyleBlock),
                    );

                    for mut n in take(&mut self.added_at_rules) {
                        let old_rule_prefix = self.rule_prefix.take();

                        self.rule_prefix = Some(n.0);

                        n.1.visit_mut_children_with(self);

                        new.push(ComponentValue::StyleBlock(StyleBlock::AtRule(n.1)));

                        self.rule_prefix = old_rule_prefix;
                    }
                }
                ComponentValue::Rule(_) => {
                    for mut n in take(&mut self.added_qualified_rules) {
                        let old_rule_prefix = self.rule_prefix.take();

                        self.rule_prefix = Some(n.0);

                        n.1.visit_mut_children_with(self);

                        new.push(ComponentValue::StyleBlock(StyleBlock::QualifiedRule(n.1)));

                        self.rule_prefix = old_rule_prefix;
                    }

                    for mut n in take(&mut self.added_at_rules) {
                        let old_rule_prefix = self.rule_prefix.take();

                        self.rule_prefix = Some(n.0);

                        n.1.visit_mut_children_with(self);

                        new.push(ComponentValue::StyleBlock(StyleBlock::AtRule(n.1)));

                        self.rule_prefix = old_rule_prefix;
                    }
                }
                ComponentValue::StyleBlock(_) => {
                    new.extend(
                        self.added_declarations
                            .drain(..)
                            .map(StyleBlock::Declaration)
                            .map(ComponentValue::StyleBlock),
                    );

                    for mut n in take(&mut self.added_qualified_rules) {
                        let old_rule_prefix = self.rule_prefix.take();

                        self.rule_prefix = Some(n.0);

                        n.1.visit_mut_children_with(self);

                        new.push(ComponentValue::StyleBlock(StyleBlock::QualifiedRule(n.1)));

                        self.rule_prefix = old_rule_prefix;
                    }

                    for mut n in take(&mut self.added_at_rules) {
                        let old_rule_prefix = self.rule_prefix.take();

                        self.rule_prefix = Some(n.0);

                        n.1.visit_mut_children_with(self);

                        new.push(ComponentValue::StyleBlock(StyleBlock::AtRule(n.1)));

                        self.rule_prefix = old_rule_prefix;
                    }
                }
                _ => {}
            }

            new.push(n);
        }

        simple_block.value = new;

        self.simple_block = old_simple_block;
    }

    fn visit_mut_declaration(&mut self, n: &mut Declaration) {
        n.visit_mut_children_with(self);

        if self.simple_block.is_none() {
            return;
        }

        if n.value.is_empty() {
            return;
        }

        let is_dashed_ident = match n.name {
            DeclarationName::Ident(_) => false,
            DeclarationName::DashedIdent(_) => true,
        };

        if is_dashed_ident {
            return;
        }

        let name = match &n.name {
            DeclarationName::Ident(ident) => &ident.value,
            _ => {
                unreachable!();
            }
        };

        // TODO make it lazy?
        let mut webkit_value = n.value.clone();

        if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
            replace_function_name(&mut webkit_value, "filter", "-webkit-filter");
            replace_image_set_function_on_legacy_variant(
                &mut webkit_value,
                "image-set",
                "-webkit-image-set",
            );
            replace_function_name(&mut webkit_value, "calc", "-webkit-calc");
            replace_cross_fade_function_on_legacy_variant(
                &mut webkit_value,
                "cross-fade",
                "-webkit-cross-fade",
            );

            replace_gradient_function_on_legacy_variant(
                &mut webkit_value,
                "linear-gradient",
                "-webkit-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut webkit_value,
                "repeating-linear-gradient",
                "-webkit-repeating-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut webkit_value,
                "radial-gradient",
                "-webkit-radial-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut webkit_value,
                "repeating-radial-gradient",
                "-webkit-repeating-radial-gradient",
            );
        }

        let mut moz_value = n.value.clone();

        if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
            replace_function_name(&mut moz_value, "element", "-moz-element");
            replace_function_name(&mut moz_value, "calc", "-moz-calc");
            replace_gradient_function_on_legacy_variant(
                &mut moz_value,
                "linear-gradient",
                "-moz-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut moz_value,
                "repeating-linear-gradient",
                "-moz-repeating-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut moz_value,
                "radial-gradient",
                "-moz-radial-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut moz_value,
                "repeating-radial-gradient",
                "-moz-repeating-linear-gradient",
            );
        }

        let mut o_value = n.value.clone();

        if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
            replace_gradient_function_on_legacy_variant(
                &mut o_value,
                "linear-gradient",
                "-o-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut o_value,
                "repeating-linear-gradient",
                "-o-repeating-linear-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut o_value,
                "radial-gradient",
                "-o-radial-gradient",
            );
            replace_gradient_function_on_legacy_variant(
                &mut o_value,
                "repeating-radial-gradient",
                "-o-repeating-radial-gradient",
            );
        }

        let mut ms_value = n.value.clone();

        // TODO lazy
        let mut declarations = vec![];

        if let Some(SimpleBlock { value, .. }) = &self.simple_block {
            for n in value.iter() {
                match n {
                    ComponentValue::DeclarationOrAtRule(DeclarationOrAtRule::Declaration(
                        declaration,
                    )) => declarations.push(declaration),
                    ComponentValue::StyleBlock(StyleBlock::Declaration(declaration)) => {
                        declarations.push(declaration)
                    }
                    _ => {}
                }
            }
        }

        // TODO lazy
        let property_names: Vec<&str> = declarations
            .iter()
            .filter(|declaration| {
                !matches!(
                    declaration,
                    Declaration {
                        name: DeclarationName::DashedIdent(_),
                        ..
                    }
                )
            })
            .map(|declaration| match declaration {
                Declaration {
                    name: DeclarationName::Ident(ident),
                    ..
                } => &*ident.value,
                _ => {
                    unreachable!();
                }
            })
            .collect();

        // TODO avoid insert moz/etc prefixes for `appearance: -webkit-button;`
        // TODO avoid duplication insert
        macro_rules! add_declaration {
            ($prefix:expr,$name:expr) => {{
                // Use only specific prefix in prefixed at-rules or rule, i.e.
                // don't use `-moz` prefix for properties in `@-webkit-keyframes` at-rule
                if self.rule_prefix == Some($prefix) || self.rule_prefix.is_none() {
                    // Check we don't have prefixed property
                    if !property_names.contains(&$name) {
                        let name = DeclarationName::Ident(Ident {
                            span: DUMMY_SP,
                            value: $name.into(),
                            raw: $name.into(),
                        });
                        let new_value = match $prefix {
                            Prefix::Webkit => webkit_value.clone(),
                            Prefix::Moz => moz_value.clone(),
                            Prefix::O => o_value.clone(),
                            Prefix::Ms => ms_value.clone(),
                        };

                        self.added_declarations.push(Declaration {
                            span: n.span,
                            name,
                            value: new_value,
                            important: n.important.clone(),
                        });
                    }
                }
            }};

            ($prefix:expr,$name:expr,$value:expr) => {{
                // Use only specific prefix in prefixed at-rules or rule, i.e.
                // don't use `-moz` prefix for properties in `@-webkit-keyframes` at-rule
                if self.rule_prefix == Some($prefix) || self.rule_prefix.is_none() {
                    // Check we don't have prefixed property
                    if !property_names.contains(&$name) {
                        let name = DeclarationName::Ident(Ident {
                            span: DUMMY_SP,
                            value: $name.into(),
                            raw: $name.into(),
                        });

                        self.added_declarations.push(Declaration {
                            span: n.span,
                            name,
                            value: $value,
                            important: n.important.clone(),
                        });
                    }
                }
            }};
        }

        let property_name = &*name.to_lowercase();

        match property_name {
            "appearance" => {
                add_declaration!(Prefix::Webkit, "-webkit-appearance");
                add_declaration!(Prefix::Moz, "-moz-appearance");
                add_declaration!(Prefix::Ms, "-ms-appearance");
            }

            "animation" => {
                let need_prefix = n.value.iter().all(|n| match n {
                    ComponentValue::Ident(Ident { value, .. }) => {
                        !matches!(&*value.to_lowercase(), "reverse" | "alternate-reverse")
                    }
                    _ => true,
                });

                if need_prefix {
                    add_declaration!(Prefix::Webkit, "-webkit-animation");
                    add_declaration!(Prefix::Moz, "-moz-animation");
                    add_declaration!(Prefix::O, "-o-animation");
                }
            }

            "animation-name" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-name");
                add_declaration!(Prefix::Moz, "-moz-animation-name");
                add_declaration!(Prefix::O, "-o-animation-name");
            }

            "animation-duration" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-duration");
                add_declaration!(Prefix::Moz, "-moz-animation-duration");
                add_declaration!(Prefix::O, "-o-animation-duration");
            }

            "animation-delay" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-delay");
                add_declaration!(Prefix::Moz, "-moz-animation-delay");
                add_declaration!(Prefix::O, "-o-animation-delay");
            }

            "animation-direction" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "alternate-reverse" | "reverse" => {}

                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-animation-direction");
                            add_declaration!(Prefix::Moz, "-moz-animation-direction");
                            add_declaration!(Prefix::O, "-o-animation-direction");
                        }
                    }
                }
            }

            "animation-fill-mode" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-fill-mode");
                add_declaration!(Prefix::Moz, "-moz-animation-fill-mode");
                add_declaration!(Prefix::O, "-o-animation-fill-mode");
            }

            "animation-iteration-count" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-iteration-count");
                add_declaration!(Prefix::Moz, "-moz-animation-iteration-count");
                add_declaration!(Prefix::O, "-o-animation-iteration-count");
            }

            "animation-play-state" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-play-state");
                add_declaration!(Prefix::Moz, "-moz-animation-play-state");
                add_declaration!(Prefix::O, "-o-animation-play-state");
            }

            "animation-timing-function" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-timing-function");
                add_declaration!(Prefix::Moz, "-moz-animation-timing-function");
                add_declaration!(Prefix::O, "-o-animation-timing-function");
            }

            "background-clip" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "text" {
                        add_declaration!(Prefix::Webkit, "-webkit-background-clip");
                    }
                }
            }

            "box-decoration-break" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-decoration-break");
            }

            "box-sizing" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-sizing");
                add_declaration!(Prefix::Moz, "-moz-box-sizing");
            }

            "color-adjust" => {
                add_declaration!(Prefix::Webkit, "-webkit-print-color-adjust");
            }

            "print-color-adjust" => {
                add_declaration!(Prefix::Moz, "color-adjust");
                add_declaration!(Prefix::Webkit, "-webkit-print-color-adjust");
            }

            "columns" => {
                add_declaration!(Prefix::Webkit, "-webkit-columns");
                add_declaration!(Prefix::Moz, "-moz-columns");
            }

            "column-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-width");
                add_declaration!(Prefix::Moz, "-moz-column-width");
            }

            "column-gap" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-gap");
                add_declaration!(Prefix::Moz, "-moz-column-gap");
            }

            "column-rule" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule");
                add_declaration!(Prefix::Moz, "-moz-column-rule");
            }

            "column-rule-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-color");
                add_declaration!(Prefix::Moz, "-moz-column-rule-color");
            }

            "column-rule-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-width");
                add_declaration!(Prefix::Moz, "-moz-column-rule-width");
            }

            "column-count" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-count");
                add_declaration!(Prefix::Moz, "-moz-column-count");
            }

            "column-rule-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-style");
                add_declaration!(Prefix::Moz, "-moz-column-rule-style");
            }

            "column-span" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-span");
                add_declaration!(Prefix::Moz, "-moz-column-span");
            }

            "column-fill" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-fill");
                add_declaration!(Prefix::Moz, "-moz-column-fill");
            }

            "cursor" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "zoom-in", "-webkit-zoom-in");
                    replace_ident(&mut webkit_value, "zoom-out", "-webkit-zoom-out");
                    replace_ident(&mut webkit_value, "grab", "-webkit-grab");
                    replace_ident(&mut webkit_value, "grabbing", "-webkit-grabbing");
                }

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "zoom-in", "-moz-zoom-in");
                    replace_ident(&mut moz_value, "zoom-out", "-moz-zoom-out");
                    replace_ident(&mut moz_value, "grab", "-moz-grab");
                    replace_ident(&mut moz_value, "grabbing", "-moz-grabbing");
                }
            }

            "display" if n.value.len() == 1 => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    let mut old_spec_webkit_value = webkit_value.clone();

                    replace_ident(&mut old_spec_webkit_value, "flex", "-webkit-box");
                    replace_ident(
                        &mut old_spec_webkit_value,
                        "inline-flex",
                        "-webkit-inline-box",
                    );

                    if n.value != old_spec_webkit_value {
                        self.added_declarations.push(Declaration {
                            span: n.span,
                            name: n.name.clone(),
                            value: old_spec_webkit_value,
                            important: n.important.clone(),
                        });
                    }
                }

                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "flex", "-webkit-flex");
                    replace_ident(&mut webkit_value, "inline-flex", "-webkit-inline-flex");
                }

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "flex", "-moz-box");
                    replace_ident(&mut moz_value, "inline-flex", "-moz-inline-box");
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    replace_ident(&mut ms_value, "flex", "-ms-flexbox");
                    replace_ident(&mut ms_value, "inline-flex", "-ms-inline-flexbox");
                }
            }

            "flex" => {
                let spec_2009_value = match n.value.get(0) {
                    Some(ComponentValue::Ident(Ident { value, span, .. }))
                        if value.as_ref().eq_ignore_ascii_case("none") =>
                    {
                        Some(ComponentValue::Integer(Integer {
                            span: *span,
                            value: 0,
                            raw: "0".into(),
                        }))
                    }
                    Some(ComponentValue::Ident(Ident { value, span, .. }))
                        if value.as_ref().eq_ignore_ascii_case("auto") =>
                    {
                        Some(ComponentValue::Integer(Integer {
                            span: *span,
                            value: 1,
                            raw: "1".into(),
                        }))
                    }
                    Some(any) => Some(any.clone()),
                    None => None,
                };

                if let Some(spec_2009_value) = &spec_2009_value {
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-flex",
                        vec![spec_2009_value.clone()]
                    );
                } else {
                    add_declaration!(Prefix::Webkit, "-webkit-box-flex");
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex");

                if let Some(spec_2009_value) = &spec_2009_value {
                    add_declaration!(Prefix::Moz, "-moz-box-flex", vec![spec_2009_value.clone()]);
                } else {
                    add_declaration!(Prefix::Webkit, "-moz-box-flex");
                }

                if n.value.len() == 3 {
                    let mut value = ms_value.clone();

                    if let Some(ComponentValue::Integer(Integer { value: 0, span, .. })) =
                        value.get(2)
                    {
                        value[2] = ComponentValue::Dimension(Dimension::Length(Length {
                            span: *span,
                            value: Number {
                                span: DUMMY_SP,
                                value: 0.0,
                                raw: "0".into(),
                            },
                            unit: Ident {
                                span: DUMMY_SP,
                                value: "px".into(),
                                raw: "px".into(),
                            },
                        }));
                    }

                    add_declaration!(Prefix::Ms, "-ms-flex", value);
                } else {
                    add_declaration!(Prefix::Ms, "-ms-flex");
                }
            }

            "flex-grow" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-flex");
                add_declaration!(Prefix::Webkit, "-webkit-flex-grow");
                add_declaration!(Prefix::Moz, "-moz-box-flex");
                add_declaration!(Prefix::Ms, "-ms-flex-positive");
            }

            "flex-shrink" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-shrink");
                add_declaration!(Prefix::Ms, "-ms-flex-negative");
            }

            "flex-basis" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-basis");
                add_declaration!(Prefix::Ms, "-ms-flex-preferred-size");
            }

            "flex-direction" => {
                let old_values = match n.value.get(0) {
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if value.as_ref().eq_ignore_ascii_case("row") =>
                    {
                        Some(("horizontal", "normal"))
                    }
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if value.as_ref().eq_ignore_ascii_case("column") =>
                    {
                        Some(("vertical", "normal"))
                    }
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if value.as_ref().eq_ignore_ascii_case("row-reverse") =>
                    {
                        Some(("horizontal", "reverse"))
                    }
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if value.as_ref().eq_ignore_ascii_case("column-reverse") =>
                    {
                        Some(("vertical", "reverse"))
                    }
                    Some(_) | None => None,
                };

                if let Some((orient, direction)) = old_values {
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-orient",
                        vec![str_to_ident!(orient)]
                    );
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-direction",
                        vec![str_to_ident!(direction)]
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex-direction");

                if let Some((orient, direction)) = old_values {
                    add_declaration!(Prefix::Moz, "-moz-box-orient", vec![str_to_ident!(orient)]);
                    add_declaration!(
                        Prefix::Webkit,
                        "-moz-box-direction",
                        vec![str_to_ident!(direction)]
                    );
                }

                add_declaration!(Prefix::Ms, "-ms-flex-direction");
            }

            "flex-wrap" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-wrap");
                add_declaration!(Prefix::Ms, "-ms-flex-wrap");
            }

            "flex-flow" => {
                let is_single_flex_wrap = match n.value.get(0) {
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if n.value.len() == 1
                            && matches!(
                                &*value.to_lowercase(),
                                "wrap" | "nowrap" | "wrap-reverse"
                            ) =>
                    {
                        true
                    }
                    _ => false,
                };

                let old_values = match is_single_flex_wrap {
                    true => None,
                    _ => {
                        let get_old_values = |index: usize| match n.value.get(index) {
                            Some(ComponentValue::Ident(Ident { value, .. }))
                                if value.as_ref().eq_ignore_ascii_case("row") =>
                            {
                                Some(("horizontal", "normal"))
                            }
                            Some(ComponentValue::Ident(Ident { value, .. }))
                                if value.as_ref().eq_ignore_ascii_case("column") =>
                            {
                                Some(("vertical", "normal"))
                            }
                            Some(ComponentValue::Ident(Ident { value, .. }))
                                if value.as_ref().eq_ignore_ascii_case("row-reverse") =>
                            {
                                Some(("horizontal", "reverse"))
                            }
                            Some(ComponentValue::Ident(Ident { value, .. }))
                                if value.as_ref().eq_ignore_ascii_case("column-reverse") =>
                            {
                                Some(("vertical", "reverse"))
                            }
                            Some(_) | None => None,
                        };

                        get_old_values(0).or_else(|| get_old_values(1))
                    }
                };

                if let Some((orient, direction)) = old_values {
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-orient",
                        vec![str_to_ident!(orient)]
                    );
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-direction",
                        vec![str_to_ident!(direction)]
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex-flow");

                if let Some((orient, direction)) = old_values {
                    add_declaration!(Prefix::Moz, "-moz-box-orient", vec![str_to_ident!(orient)]);
                    add_declaration!(
                        Prefix::Moz,
                        "-moz-box-direction",
                        vec![str_to_ident!(direction)]
                    );
                }

                add_declaration!(Prefix::Ms, "-ms-flex-flow");
            }

            "justify-content" => {
                let need_old_spec = match n.value.get(0) {
                    Some(ComponentValue::Ident(Ident { value, .. }))
                        if value.as_ref().eq_ignore_ascii_case("space-around") =>
                    {
                        false
                    }
                    _ => true,
                };

                if need_old_spec
                    && (self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none())
                {
                    let mut old_spec_webkit_new_value = webkit_value.clone();

                    replace_ident(&mut old_spec_webkit_new_value, "flex-start", "start");
                    replace_ident(&mut old_spec_webkit_new_value, "flex-end", "end");
                    replace_ident(&mut old_spec_webkit_new_value, "space-between", "justify");

                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-pack",
                        old_spec_webkit_new_value
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-justify-content");

                if need_old_spec
                    && (self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none())
                {
                    let mut old_spec_moz_value = moz_value.clone();

                    replace_ident(&mut old_spec_moz_value, "flex-start", "start");
                    replace_ident(&mut old_spec_moz_value, "flex-end", "end");
                    replace_ident(&mut old_spec_moz_value, "space-between", "justify");

                    add_declaration!(Prefix::Moz, "-moz-box-pack", old_spec_moz_value);
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut old_spec_ms_value = ms_value.clone();

                    replace_ident(&mut old_spec_ms_value, "flex-start", "start");
                    replace_ident(&mut old_spec_ms_value, "flex-end", "end");
                    replace_ident(&mut old_spec_ms_value, "space-between", "justify");
                    replace_ident(&mut old_spec_ms_value, "space-around", "distribute");

                    add_declaration!(Prefix::Ms, "-ms-flex-pack", old_spec_ms_value);
                }
            }

            "order" => {
                let old_spec_num = match n.value.get(0) {
                    Some(ComponentValue::Integer(Integer { value, .. })) => Some(value + 1),
                    _ => None,
                };

                match old_spec_num {
                    Some(old_spec_num) if n.value.len() == 1 => {
                        add_declaration!(
                            Prefix::Webkit,
                            "-webkit-box-ordinal-group",
                            vec![str_to_ident!(old_spec_num.to_string())]
                        );
                    }
                    _ => {
                        add_declaration!(Prefix::Webkit, "-webkit-box-ordinal-group");
                    }
                }

                add_declaration!(Prefix::Webkit, "-webkit-order");

                match old_spec_num {
                    Some(old_spec_num) if n.value.len() == 1 => {
                        add_declaration!(
                            Prefix::Moz,
                            "-moz-box-ordinal-group",
                            vec![str_to_ident!(old_spec_num.to_string())]
                        );
                    }
                    _ => {
                        add_declaration!(Prefix::Webkit, "-moz-box-ordinal-group");
                    }
                }

                add_declaration!(Prefix::Ms, "-ms-flex-order");
            }

            "align-items" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    let mut old_spec_webkit_new_value = webkit_value.clone();

                    replace_ident(&mut old_spec_webkit_new_value, "flex-end", "end");
                    replace_ident(&mut old_spec_webkit_new_value, "flex-start", "start");

                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-align",
                        old_spec_webkit_new_value
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-align-items");

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    let mut old_spec_moz_value = moz_value.clone();

                    replace_ident(&mut old_spec_moz_value, "flex-end", "end");
                    replace_ident(&mut old_spec_moz_value, "flex-start", "start");

                    add_declaration!(Prefix::Moz, "-moz-box-align", old_spec_moz_value);
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut old_spec_ms_value = ms_value.clone();

                    replace_ident(&mut old_spec_ms_value, "flex-end", "end");
                    replace_ident(&mut old_spec_ms_value, "flex-start", "start");

                    add_declaration!(Prefix::Ms, "-ms-flex-align", old_spec_ms_value);
                }
            }

            "align-self" => {
                add_declaration!(Prefix::Webkit, "-webkit-align-self");

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut spec_2012_ms_value = ms_value.clone();

                    replace_ident(&mut spec_2012_ms_value, "flex-end", "end");
                    replace_ident(&mut spec_2012_ms_value, "flex-start", "start");

                    add_declaration!(Prefix::Ms, "-ms-flex-item-align", spec_2012_ms_value);
                }
            }

            "align-content" => {
                add_declaration!(Prefix::Webkit, "-webkit-align-content");

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut spec_2012_ms_value = ms_value.clone();

                    replace_ident(&mut spec_2012_ms_value, "flex-end", "end");
                    replace_ident(&mut spec_2012_ms_value, "flex-start", "start");
                    replace_ident(&mut spec_2012_ms_value, "space-between", "justify");
                    replace_ident(&mut spec_2012_ms_value, "space-around", "distribute");

                    add_declaration!(Prefix::Ms, "-ms-flex-line-pack", spec_2012_ms_value);
                }
            }

            "image-rendering" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    // Fallback to nearest-neighbor algorithm
                    replace_ident(&mut webkit_value, "pixelated", "-webkit-optimize-contrast");
                    replace_ident(
                        &mut webkit_value,
                        "crisp-edges",
                        "-webkit-optimize-contrast",
                    );
                }

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    // Fallback to nearest-neighbor algorithm
                    replace_ident(&mut moz_value, "pixelated", "-moz-crisp-edges");
                    replace_ident(&mut moz_value, "crisp-edges", "-moz-crisp-edges");
                }

                if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
                    replace_ident(&mut o_value, "pixelated", "-o-pixelated");
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut old_spec_ms_value = ms_value.clone();

                    replace_ident(&mut old_spec_ms_value, "pixelated", "nearest-neighbor");

                    if ms_value != old_spec_ms_value {
                        add_declaration!(Prefix::Ms, "-ms-interpolation-mode", old_spec_ms_value);
                    }
                }
            }

            "filter" => match &n.value[0] {
                ComponentValue::Ident(Ident { value, .. })
                    if value.as_ref().eq_ignore_ascii_case("progid") => {}
                ComponentValue::Function(Function { name, .. })
                    if name.value.as_ref().eq_ignore_ascii_case("alpha") => {}
                _ => {
                    add_declaration!(Prefix::Webkit, "-webkit-filter");
                }
            },

            "backdrop-filter" => {
                add_declaration!(Prefix::Webkit, "-webkit-backdrop-filter");
            }

            "mask-clip" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-clip");
            }

            // Fix me https://github.com/postcss/autoprefixer/blob/main/lib/hacks/mask-composite.js
            "mask-composite" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-composite");
            }

            "mask-image" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-image");
            }

            "mask-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-origin");
            }

            "mask-repeat" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-repeat");
            }

            "mask-border-repeat" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-border-repeat");
            }

            "mask-border-source" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-border-source");
            }

            "mask" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask");
            }

            "mask-position" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-position");
            }

            "mask-size" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-size");
            }

            "mask-border" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image");
            }

            "mask-border-outset" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-outset");
            }

            "mask-border-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-width");
            }

            "mask-border-slice" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-slice");
            }

            "border-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-start");
                add_declaration!(Prefix::Moz, "-moz-border-start");
            }

            "border-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-end");
                add_declaration!(Prefix::Moz, "-moz-border-end");
            }

            "margin-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-start");
                add_declaration!(Prefix::Moz, "-moz-margin-start");
            }

            "margin-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-end");
                add_declaration!(Prefix::Moz, "-moz-margin-end");
            }

            "padding-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-start");
                add_declaration!(Prefix::Moz, "-moz-padding-start");
            }

            "padding-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-end");
                add_declaration!(Prefix::Moz, "-moz-padding-end");
            }

            "border-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-before");
            }

            "border-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-after");
            }

            "margin-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-before");
            }

            "margin-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-after");
            }

            "padding-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-before");
            }

            "padding-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-after");
            }

            "backface-visibility" => {
                add_declaration!(Prefix::Webkit, "-webkit-backface-visibility");
                add_declaration!(Prefix::Moz, "-moz-backface-visibility");
            }

            "clip-path" => {
                add_declaration!(Prefix::Webkit, "-webkit-clip-path");
            }

            "position" if n.value.len() == 1 => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "sticky", "-webkit-sticky");
                }
            }

            "user-select" => {
                add_declaration!(Prefix::Webkit, "-webkit-user-select");
                add_declaration!(Prefix::Moz, "-moz-user-select");

                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "contain" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-user-select",
                                vec![str_to_ident!("element")]
                            );
                        }
                        "all" => {}
                        _ => {
                            add_declaration!(Prefix::Ms, "-ms-user-select");
                        }
                    }
                }
            }

            "transform" => {
                let has_3d_function = n.value.iter().any(|n| match n {
                    ComponentValue::Function(Function { name, .. })
                        if matches!(
                            &*name.value.to_ascii_lowercase(),
                            "matrix3d"
                                | "translate3d"
                                | "translatez"
                                | "scale3d"
                                | "scalez"
                                | "rotate3d"
                                | "rotatex"
                                | "rotatey"
                                | "rotatez"
                                | "perspective"
                        ) =>
                    {
                        true
                    }
                    _ => false,
                });

                add_declaration!(Prefix::Webkit, "-webkit-transform");
                add_declaration!(Prefix::Moz, "-moz-transform");

                if !has_3d_function {
                    if !self.in_keyframe_block {
                        add_declaration!(Prefix::Ms, "-ms-transform");
                    }

                    add_declaration!(Prefix::O, "-o-transform");
                }
            }

            "transform-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-transform-origin");
                add_declaration!(Prefix::Moz, "-moz-transform-origin");

                if !self.in_keyframe_block {
                    add_declaration!(Prefix::Ms, "-ms-transform-origin");
                }

                add_declaration!(Prefix::O, "-o-transform-origin");
            }

            "transform-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-transform-style");
                add_declaration!(Prefix::Moz, "-moz-transform-style");
            }

            "perspective" => {
                add_declaration!(Prefix::Webkit, "-webkit-perspective");
                add_declaration!(Prefix::Moz, "-moz-perspective");
            }

            "perspective-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-perspective-origin");
                add_declaration!(Prefix::Moz, "-moz-perspective-origin");
            }

            "text-decoration" => {
                if n.value.len() == 1 {
                    match &n.value[0] {
                        ComponentValue::Ident(Ident { value, .. })
                            if matches!(
                                &*value.to_lowercase(),
                                "none"
                                    | "underline"
                                    | "overline"
                                    | "line-through"
                                    | "blink"
                                    | "inherit"
                                    | "initial"
                                    | "revert"
                                    | "unset"
                            ) => {}
                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-text-decoration");
                            add_declaration!(Prefix::Moz, "-moz-text-decoration");
                        }
                    }
                } else {
                    add_declaration!(Prefix::Webkit, "-webkit-text-decoration");
                    add_declaration!(Prefix::Moz, "-moz-text-decoration");
                }
            }

            "text-decoration-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-style");
                add_declaration!(Prefix::Moz, "-moz-text-decoration-style");
            }

            "text-decoration-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-color");
                add_declaration!(Prefix::Moz, "-moz-text-decoration-color");
            }

            "text-decoration-line" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-line");
                add_declaration!(Prefix::Moz, "-moz-text-decoration-line");
            }

            "text-decoration-skip" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-skip");
            }

            "text-decoration-skip-ink" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-text-decoration-skip",
                                vec![str_to_ident!("ink")]
                            );
                        }
                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-text-decoration-skip-ink");
                        }
                    }
                }
            }

            "text-size-adjust" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "none" {
                        add_declaration!(Prefix::Webkit, "-webkit-text-size-adjust");
                        add_declaration!(Prefix::Moz, "-moz-text-size-adjust");
                        add_declaration!(Prefix::Ms, "-ms-text-size-adjust");
                    }
                }
            }

            // TODO improve me for `filter` values https://github.com/postcss/autoprefixer/blob/main/test/cases/transition.css#L6
            // TODO https://github.com/postcss/autoprefixer/blob/main/lib/transition.js
            "transition" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "transform", "-webkit-transform");
                    replace_ident(&mut webkit_value, "filter", "-webkit-filter");
                }

                add_declaration!(Prefix::Webkit, "-webkit-transition");

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "transform", "-moz-transform");
                }

                add_declaration!(Prefix::Moz, "-moz-transition");

                if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
                    replace_ident(&mut o_value, "transform", "-o-transform");
                }

                add_declaration!(Prefix::O, "-o-transition");
            }

            "transition-property" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "transform", "-webkit-transform");
                }

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "transform", "-moz-transform");
                }

                if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
                    replace_ident(&mut o_value, "transform", "-o-transform");
                }

                add_declaration!(Prefix::Webkit, "-webkit-transition-property");
                add_declaration!(Prefix::Moz, "-moz-transition-timing-function");
                add_declaration!(Prefix::O, "-o-transition-timing-function");
            }

            "transition-duration" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-duration");
                add_declaration!(Prefix::Moz, "-moz-transition-duration");
                add_declaration!(Prefix::O, "-o-transition-duration");
            }

            "transition-delay" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-delay");
                add_declaration!(Prefix::Moz, "-moz-transition-delay");
                add_declaration!(Prefix::O, "-o-transition-delay");
            }

            "transition-timing-function" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-timing-function");
                add_declaration!(Prefix::Moz, "-moz-transition-timing-function");
                add_declaration!(Prefix::O, "-o-transition-timing-function");
            }

            "writing-mode" if n.value.len() == 1 => {
                let direction = match declarations.into_iter().rev().find(|declaration| {
                    matches!(declaration, Declaration {
                              name: DeclarationName::Ident(Ident { value, .. }),
                                ..
                            } if value.as_ref().eq_ignore_ascii_case("direction"))
                }) {
                    Some(Declaration { value, .. }) => match value.get(0) {
                        Some(ComponentValue::Ident(Ident { value, .. }))
                            if value.as_ref().eq_ignore_ascii_case("rtl") =>
                        {
                            Some("rtl")
                        }
                        _ => Some("ltr"),
                    },
                    _ => Some("ltr"),
                };

                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "vertical-lr" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode");

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("tb-lr")]
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("bt-lr")]
                                    );
                                }
                                _ => {}
                            }
                        }

                        "vertical-rl" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode");

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("tb-rl")]
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("bt-rl")]
                                    );
                                }
                                _ => {}
                            }
                        }

                        "horizontal-tb" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode");

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("lr-tb")]
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        vec![str_to_ident!("rl-tb")]
                                    );
                                }
                                _ => {}
                            }
                        }

                        "sideways-rl" | "sideways-lr" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode");
                        }

                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode");
                            add_declaration!(Prefix::Ms, "-ms-writing-mode");
                        }
                    }
                }
            }

            "width"
            | "min-width"
            | "max-width"
            | "height"
            | "min-height"
            | "max-height"
            | "inline-size"
            | "min-inline-size"
            | "max-inline-size"
            | "block-size"
            | "min-block-size"
            | "max-block-size"
            | "grid"
            | "grid-template"
            | "grid-template-rows"
            | "grid-template-columns"
            | "grid-auto-columns"
            | "grid-auto-rows" => {
                let is_grid_property = matches!(
                    property_name,
                    "grid"
                        | "grid-template"
                        | "grid-template-rows"
                        | "grid-template-columns"
                        | "grid-auto-columns"
                        | "grid-auto-rows"
                );

                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "fit-content", "-webkit-fit-content");
                    replace_ident(&mut webkit_value, "max-content", "-webkit-max-content");
                    replace_ident(&mut webkit_value, "min-content", "-webkit-min-content");
                    replace_ident(
                        &mut webkit_value,
                        "fill-available",
                        "-webkit-fill-available",
                    );
                    replace_ident(&mut webkit_value, "fill", "-webkit-fill-available");
                    replace_ident(&mut webkit_value, "stretch", "-webkit-fill-available");
                }

                if !is_grid_property
                    && (self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none())
                {
                    replace_ident(&mut moz_value, "fit-content", "-moz-fit-content");
                    replace_ident(&mut moz_value, "max-content", "-moz-max-content");
                    replace_ident(&mut moz_value, "min-content", "-moz-min-content");
                    replace_ident(&mut moz_value, "fill-available", "-moz-available");
                    replace_ident(&mut moz_value, "fill", "-moz-available");
                    replace_ident(&mut moz_value, "stretch", "-moz-available");
                }
            }

            "touch-action" => {
                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut new_ms_value = ms_value.clone();

                    replace_ident(&mut new_ms_value, "pan-x", "-ms-pan-x");
                    replace_ident(&mut new_ms_value, "pan-y", "-ms-pan-y");
                    replace_ident(&mut new_ms_value, "double-tap-zoom", "-ms-double-tap-zoom");
                    replace_ident(&mut new_ms_value, "manipulation", "-ms-manipulation");
                    replace_ident(&mut new_ms_value, "none", "-ms-none");
                    replace_ident(&mut new_ms_value, "pinch-zoom", "-ms-pinch-zoom");

                    add_declaration!(Prefix::Ms, "-ms-touch-action", new_ms_value);
                }

                add_declaration!(Prefix::Ms, "-ms-touch-action");
            }

            "text-orientation" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-orientation");
            }

            "unicode-bidi" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "isolate", "-moz-isolate");
                    replace_ident(&mut moz_value, "isolate-override", "-moz-isolate-override");
                    replace_ident(&mut moz_value, "plaintext", "-moz-plaintext");

                    replace_ident(&mut webkit_value, "isolate", "-webkit-isolate");
                    replace_ident(
                        &mut webkit_value,
                        "isolate-override",
                        "-webpack-isolate-override",
                    );
                    replace_ident(&mut webkit_value, "plaintext", "-webpack-plaintext");
                }
            }

            "text-spacing" => {
                add_declaration!(Prefix::Ms, "-ms-text-spacing");
            }

            "text-emphasis" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-spacing");
            }

            "text-emphasis-position" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-position");
            }

            "text-emphasis-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-style");
            }

            "text-emphasis-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-color");
            }

            "flow-into" => {
                add_declaration!(Prefix::Webkit, "-webkit-flow-into");
                add_declaration!(Prefix::Ms, "-ms-flow-into");
            }

            "flow-from" => {
                add_declaration!(Prefix::Webkit, "-webkit-flow-from");
                add_declaration!(Prefix::Ms, "-ms-flow-from");
            }

            "region-fragment" => {
                add_declaration!(Prefix::Webkit, "-webkit-region-fragment");
                add_declaration!(Prefix::Ms, "-ms-region-fragment");
            }

            "scroll-snap-type" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-type");
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-type");
            }

            "scroll-snap-coordinate" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-coordinate");
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-coordinate");
            }

            "scroll-snap-destination" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-destination");
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-destination");
            }

            "scroll-snap-points-x" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-points-x");
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-points-x");
            }

            "scroll-snap-points-y" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-points-y");
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-points-y");
            }

            "text-align-last" => {
                add_declaration!(Prefix::Moz, "-moz-text-align-last");
            }

            "text-overflow" => {
                add_declaration!(Prefix::O, "-o-text-overflow");
            }

            "shape-margin" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-margin");
            }

            "shape-outside" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-outside");
            }

            "shape-image-threshold" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-image-threshold");
            }

            "object-fit" => {
                add_declaration!(Prefix::O, "-o-object-fit");
            }

            "object-position" => {
                add_declaration!(Prefix::O, "-o-object-position");
            }

            "tab-size" => {
                add_declaration!(Prefix::Moz, "-moz-tab-size");
                add_declaration!(Prefix::O, "-o-tab-size");
            }

            "hyphens" => {
                add_declaration!(Prefix::Webkit, "-webkit-hyphens");
                add_declaration!(Prefix::Moz, "-moz-hyphens");
                add_declaration!(Prefix::Ms, "-ms-hyphens");
            }

            "border-image" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-image");
                add_declaration!(Prefix::Moz, "-moz-border-image");
                add_declaration!(Prefix::O, "-o-border-image");
            }

            "font-kerning" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-kerning");
            }

            "font-feature-settings" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-feature-settings");
                add_declaration!(Prefix::Moz, "-moz-font-feature-settings");
            }

            "font-variant-ligatures" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-variant-ligatures");
                add_declaration!(Prefix::Moz, "-moz-font-variant-ligatures");
            }

            "font-language-override" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-language-override");
                add_declaration!(Prefix::Moz, "-moz-font-language-override");
            }

            "background-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-background-origin");
                add_declaration!(Prefix::Moz, "-moz-background-origin");
                add_declaration!(Prefix::O, "-o-background-origin");
            }

            "background-size" => {
                add_declaration!(Prefix::Webkit, "-webkit-background-size");
                add_declaration!(Prefix::Moz, "-moz-background-size");
                add_declaration!(Prefix::O, "-o-background-size");
            }

            "overscroll-behavior" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-scroll-chaining",
                                vec![str_to_ident!("chained")]
                            );
                        }
                        "none" | "contain" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-scroll-chaining",
                                vec![str_to_ident!("none")]
                            );
                        }
                        _ => {
                            add_declaration!(Prefix::Ms, "-ms-scroll-chaining");
                        }
                    }
                } else {
                    add_declaration!(Prefix::Ms, "-ms-scroll-chaining");
                }
            }

            "box-shadow" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-shadow");
                add_declaration!(Prefix::Moz, "-moz-box-shadow");
            }

            "forced-color-adjust" => {
                add_declaration!(Prefix::Ms, "-ms-high-contrast-adjust");
            }

            "break-inside" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-inside");
                        }
                        _ => {}
                    }
                }
            }

            "break-before" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-before");
                        }
                        "column" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-column-break-before",
                                vec![str_to_ident!("always")]
                            );
                        }
                        _ => {}
                    }
                }
            }

            "break-after" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-after");
                        }
                        "column" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-column-break-after",
                                vec![str_to_ident!("always")]
                            );
                        }
                        _ => {}
                    }
                }
            }

            "border-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-radius");
                add_declaration!(Prefix::Moz, "-moz-border-radius");
            }

            "border-top-left-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-top-left-radius");
                add_declaration!(Prefix::Moz, "-moz-border-radius-topleft");
            }

            "border-top-right-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-top-right-radius");
                add_declaration!(Prefix::Moz, "-moz-border-radius-topright");
            }

            "border-bottom-right-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-bottom-right-radius");
                add_declaration!(Prefix::Moz, "-moz-border-radius-bottomright");
            }

            "border-bottom-left-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-bottom-left-radius");
                add_declaration!(Prefix::Moz, "-moz-border-radius-bottomleft");
            }

            // TODO add `grid` support https://github.com/postcss/autoprefixer/tree/main/lib/hacks (starting with grid)
            // TODO fix me https://github.com/postcss/autoprefixer/blob/main/test/cases/custom-prefix.out.css
            _ => {}
        }

        if n.value != webkit_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: webkit_value,
                important: n.important.clone(),
            });
        }

        if n.value != moz_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: moz_value,
                important: n.important.clone(),
            });
        }

        if n.value != o_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: o_value,
                important: n.important.clone(),
            });
        }

        if n.value != ms_value {
            self.added_declarations.push(Declaration {
                span: n.span,
                name: n.name.clone(),
                value: ms_value,
                important: n.important.clone(),
            });
        }
    }
}
