use core::f64::consts::PI;
use std::mem::take;

use once_cell::sync::Lazy;
use preset_env_base::{query::targets_to_versions, version::Version, BrowserData, Versions};
use swc_common::{
    collections::{AHashMap, AHashSet},
    EqIgnoreSpan, DUMMY_SP,
};
use swc_css_ast::*;
use swc_css_utils::{
    replace_function_name, replace_ident, replace_pseudo_class_selector_name,
    replace_pseudo_class_selector_on_pseudo_element_selector, replace_pseudo_element_selector_name,
};
use swc_css_visit::{VisitMut, VisitMutWith};

use crate::options::Options;

static PREFIXES_AND_BROWSERS: Lazy<AHashMap<String, [BrowserData<Option<Version>>; 2]>> =
    Lazy::new(|| {
        let map: AHashMap<String, [BrowserData<Option<Version>>; 2]> =
            serde_json::from_str(include_str!("../data/prefixes_and_browsers.json"))
                .expect("failed to parse json");

        map.into_iter()
            .map(|(property, versions)| {
                (
                    property,
                    [
                        versions[0].map_value(|version| version),
                        versions[1].map_value(|version| version),
                    ],
                )
            })
            .collect()
    });

macro_rules! zip {
    ($x: expr) => ($x);
    ($x: expr, $($y: expr), +) => ($x.iter().zip(zip!($($y), +)))
}

fn should_enable(
    target: Versions,
    low_versions: Versions,
    high_versions: Versions,
    default: bool,
) -> bool {
    if zip!(target, low_versions, high_versions).all(|((_, target_version), ((_, l), (_, h)))| {
        target_version.is_none() && l.is_none() && h.is_none()
    }) {
        return default;
    }

    zip!(target, low_versions, high_versions).any(
        |(
            (target_name, maybe_target_version),
            ((_, maybe_low_version), (_, maybe_high_version)),
        )| {
            maybe_target_version.map_or(false, |target_version| {
                let low_or_fallback_version = maybe_low_version.or_else(|| match target_name {
                    // Fall back to Chrome versions if Android browser data
                    // is missing from the feature data. It appears the
                    // Android browser has aligned its versioning with Chrome.
                    "android" => low_versions.chrome,
                    _ => None,
                });

                if let Some(low_or_fallback_version) = low_or_fallback_version {
                    if target_version >= low_or_fallback_version {
                        let high_or_fallback_version = maybe_high_version.or(match target_name {
                            // Fall back to Chrome versions if Android browser data
                            // is missing from the feature data. It appears the
                            // Android browser has aligned its versioning with Chrome.
                            "android" => high_versions.chrome,
                            _ => None,
                        });

                        if let Some(high_or_fallback_version) = high_or_fallback_version {
                            target_version <= high_or_fallback_version
                        } else {
                            true
                        }
                    } else {
                        false
                    }
                } else {
                    false
                }
            })
        },
    )
}

pub fn should_prefix(property: &str, target: Versions, default: bool) -> bool {
    if target.is_any_target() {
        return true;
    }

    let versions = PREFIXES_AND_BROWSERS.get(property);

    if let Some(versions) = versions {
        return should_enable(target, versions[0], versions[1], false);
    }

    default
}

pub fn prefixer(options: Options) -> impl VisitMut {
    let env: Versions = targets_to_versions(options.env).expect("failed to parse targets");

    Prefixer {
        env,
        ..Default::default()
    }
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
                    raw: None,
                }),
            ]);

            n.value = new_value;

            n.name.value = self.to.into();
            n.name.raw = None;
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

        if let ComponentValue::Str(Str { span, value, .. }) = n {
            *n = ComponentValue::Url(Url {
                span: *span,
                name: Ident {
                    span: DUMMY_SP,
                    value: "url".into(),
                    raw: None,
                },
                value: Some(UrlValue::Str(Str {
                    span: DUMMY_SP,
                    value: value.as_ref().into(),
                    raw: None,
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
            n.name.raw = None;
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
            n.name.raw = None;

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
                                get_old_direction(first_value),
                                get_old_direction(second_value),
                            ) {
                                let new_value = vec![
                                    ComponentValue::Ident(Ident {
                                        span: *first_span,
                                        value: new_first_direction.into(),
                                        raw: None,
                                    }),
                                    ComponentValue::Ident(Ident {
                                        span: *second_span,
                                        value: new_second_direction.into(),
                                        raw: None,
                                    }),
                                ];

                                n.value.splice(0..3, new_value);
                            }
                        }
                        (Some(ComponentValue::Ident(Ident { value, span, .. })), Some(_)) => {
                            if let Some(new_direction) = get_old_direction(value) {
                                let new_value = vec![ComponentValue::Ident(Ident {
                                    span: *span,
                                    value: new_direction.into(),
                                    raw: None,
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
                            raw: None,
                        });
                    } else if angle == 90.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "left".into(),
                            raw: None,
                        });
                    } else if angle == 180.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "top".into(),
                            raw: None,
                        });
                    } else if angle == 270.0 {
                        n.value[0] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "right".into(),
                            raw: None,
                        });
                    } else {
                        let new_value = ((450.0 - angle).abs() % 360.0 * 1000.0).round() / 1000.0;

                        n.value[0] = ComponentValue::Dimension(Dimension::Angle(Angle {
                            span: *span,
                            value: Number {
                                span: value.span,
                                value: new_value,
                                raw: None,
                            },
                            unit: Ident {
                                span: unit.span,
                                value: "deg".into(),
                                raw: None,
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
                    raw: None,
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
                        raw: None,
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
            raw: None,
        })
    }};
}

#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum Prefix {
    Webkit,
    Moz,
    O,
    Ms,
}

#[derive(Default)]
struct Prefixer {
    env: Versions,
    in_keyframe_block: bool,
    simple_block: Option<SimpleBlock>,
    rule_prefix: Option<Prefix>,
    added_top_rules: Vec<(Prefix, Rule)>,
    added_at_rules: Vec<(Prefix, AtRule)>,
    added_qualified_rules: Vec<(Prefix, QualifiedRule)>,
    added_declarations: Vec<Declaration>,
}

impl Prefixer {
    fn add_at_rule(&mut self, prefix: Prefix, at_rule: &AtRule) {
        if self.simple_block.is_none() {
            self.added_top_rules
                .push((prefix, Rule::AtRule(at_rule.clone())));
        } else {
            self.added_at_rules.push((prefix, at_rule.clone()));
        }
    }
}

impl VisitMut for Prefixer {
    fn visit_mut_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        let mut new_rules = Vec::with_capacity(stylesheet.rules.len());
        let original_rules = stylesheet.rules.clone();

        for mut rule in take(&mut stylesheet.rules) {
            rule.visit_mut_children_with(self);

            for mut added_rule in take(&mut self.added_top_rules) {
                let need_skip = original_rules
                    .iter()
                    .any(|existing_rule| added_rule.1.eq_ignore_span(existing_rule));

                if need_skip {
                    continue;
                }

                let old_rule_prefix = self.rule_prefix.take();

                self.rule_prefix = Some(added_rule.0);

                added_rule.1.visit_mut_children_with(self);

                new_rules.push(added_rule.1);

                self.rule_prefix = old_rule_prefix;
            }

            new_rules.push(rule);
        }

        stylesheet.rules = new_rules;
    }

    // TODO handle declarations in `@media`/`@support`
    fn visit_mut_at_rule(&mut self, at_rule: &mut AtRule) {
        let original_simple_block = at_rule.block.clone();

        at_rule.visit_mut_children_with(self);

        match &at_rule.name {
            AtRuleName::Ident(Ident { value, .. })
                if value.as_ref().eq_ignore_ascii_case("viewport") =>
            {
                if should_prefix("@-o-viewport", self.env, false) {
                    self.add_at_rule(
                        Prefix::Ms,
                        &AtRule {
                            span: DUMMY_SP,
                            name: AtRuleName::Ident(Ident {
                                span: DUMMY_SP,
                                value: "-ms-viewport".into(),
                                raw: None,
                            }),
                            prelude: at_rule.prelude.clone(),
                            block: original_simple_block.clone(),
                        },
                    );
                }

                if should_prefix("@-ms-viewport", self.env, false) {
                    self.add_at_rule(
                        Prefix::O,
                        &AtRule {
                            span: DUMMY_SP,
                            name: AtRuleName::Ident(Ident {
                                span: DUMMY_SP,
                                value: "-o-viewport".into(),
                                raw: None,
                            }),
                            prelude: at_rule.prelude.clone(),
                            block: original_simple_block,
                        },
                    );
                }
            }
            AtRuleName::Ident(Ident { value, .. })
                if value.as_ref().eq_ignore_ascii_case("keyframes") =>
            {
                if should_prefix("@-webkit-keyframes", self.env, false) {
                    self.add_at_rule(
                        Prefix::Webkit,
                        &AtRule {
                            span: DUMMY_SP,
                            name: AtRuleName::Ident(Ident {
                                span: DUMMY_SP,
                                value: "-webkit-keyframes".into(),
                                raw: None,
                            }),
                            prelude: at_rule.prelude.clone(),
                            block: original_simple_block.clone(),
                        },
                    );
                }

                if should_prefix("@-moz-keyframes", self.env, false) {
                    self.add_at_rule(
                        Prefix::Moz,
                        &AtRule {
                            span: DUMMY_SP,
                            name: AtRuleName::Ident(Ident {
                                span: DUMMY_SP,
                                value: "-moz-keyframes".into(),
                                raw: None,
                            }),
                            prelude: at_rule.prelude.clone(),
                            block: original_simple_block.clone(),
                        },
                    );
                }

                if should_prefix("@-o-keyframes", self.env, false) {
                    self.add_at_rule(
                        Prefix::O,
                        &AtRule {
                            span: DUMMY_SP,
                            name: AtRuleName::Ident(Ident {
                                span: DUMMY_SP,
                                value: "-o-keyframes".into(),
                                raw: None,
                            }),
                            prelude: at_rule.prelude.clone(),
                            block: original_simple_block,
                        },
                    );
                }
            }
            _ => {}
        }
    }

    fn visit_mut_media_query_list(&mut self, media_query_list: &mut MediaQueryList) {
        media_query_list.visit_mut_children_with(self);
        let mut new_queries = Vec::with_capacity(media_query_list.queries.len());

        let mut new = Vec::with_capacity(media_query_list.queries.len());

        for n in take(&mut media_query_list.queries) {
            // TODO avoid duplicates
            if should_prefix("-webkit-min-device-pixel-ratio", self.env, false) {
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

                if !n.eq_ignore_span(&new_webkit_value) {
                    new.push(new_webkit_value);
                }
            if n != new_webkit_value {
                new_queries.push(new_webkit_value);
            }

            if should_prefix("min--moz-device-pixel-ratio", self.env, false) {
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

                if !n.eq_ignore_span(&new_moz_value) {
                    new.push(new_moz_value);
                }
            if n != new_moz_value {
                new_queries.push(new_moz_value);
            }

            // TODO opera support

            new_queries.push(n);
        }

        media_query_list.queries = new_queries;
    }

    fn visit_mut_qualified_rule(&mut self, n: &mut QualifiedRule) {
        let original_simple_block = n.block.clone();

        n.visit_mut_children_with(self);

        if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
            let mut new_webkit_prelude = n.prelude.clone();

            if should_prefix(":-webkit-autofill", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_webkit_prelude,
                    "autofill",
                    "-webkit-autofill",
                );
            }

            if should_prefix(":-webkit-any-link", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_webkit_prelude,
                    "any-link",
                    "-webkit-any-link",
                );
            }

            if should_prefix(":-webkit-full-screen", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_webkit_prelude,
                    "fullscreen",
                    "-webkit-full-screen",
                );
            }

            if should_prefix("::-webkit-file-upload-button", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_webkit_prelude,
                    "file-selector-button",
                    "-webkit-file-upload-button",
                );
            }

            if should_prefix("::-webkit-backdrop", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_webkit_prelude,
                    "backdrop",
                    "-webkit-backdrop",
                );
            }

            if should_prefix("::-webkit-file-upload-button", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_webkit_prelude,
                    "placeholder",
                    "-webkit-input-placeholder",
                );
            }

            if !n.prelude.eq_ignore_span(&new_webkit_prelude) {
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

            if should_prefix(":-moz-read-only", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_moz_prelude,
                    "read-only",
                    "-moz-read-only",
                );
            }

            if should_prefix(":-moz-read-write", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_moz_prelude,
                    "read-write",
                    "-moz-read-write",
                );
            }

            if should_prefix(":-moz-any-link", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_moz_prelude,
                    "any-link",
                    "-moz-any-link",
                );
            }

            if should_prefix(":-moz-full-screen", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_moz_prelude,
                    "fullscreen",
                    "-moz-full-screen",
                );
            }

            if should_prefix("::-moz-selection", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_moz_prelude,
                    "selection",
                    "-moz-selection",
                );
            }

            if should_prefix(":-moz-placeholder", self.env, false) {
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

            if should_prefix("::-moz-placeholder", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_moz_prelude,
                    "placeholder",
                    "-moz-placeholder",
                );
            }

            if !n.prelude.eq_ignore_span(&new_moz_prelude) {
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

            if should_prefix(":-ms-fullscreen", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_ms_prelude,
                    "fullscreen",
                    "-ms-fullscreen",
                );
            }

            if should_prefix(":-ms-input-placeholder", self.env, false) {
                replace_pseudo_class_selector_name(
                    &mut new_ms_prelude,
                    "placeholder-shown",
                    "-ms-input-placeholder",
                );
            }

            if should_prefix("::-ms-browse", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_ms_prelude,
                    "file-selector-button",
                    "-ms-browse",
                );
            }

            if should_prefix("::-ms-backdrop", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_ms_prelude,
                    "backdrop",
                    "-ms-backdrop",
                );
            }

            if should_prefix(":-ms-input-placeholder", self.env, false) {
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

            if should_prefix("::-ms-input-placeholder", self.env, false) {
                replace_pseudo_element_selector_name(
                    &mut new_ms_prelude,
                    "placeholder",
                    "-ms-input-placeholder",
                );
            }

            if !n.prelude.eq_ignore_span(&new_ms_prelude) {
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
            if should_prefix("-webkit-filter()", self.env, false) {
                replace_function_name(&mut webkit_value, "filter", "-webkit-filter");
            }

            if should_prefix("-webkit-image-set()", self.env, false) {
                replace_image_set_function_on_legacy_variant(
                    &mut webkit_value,
                    "image-set",
                    "-webkit-image-set",
                );
            }

            if should_prefix("-webkit-calc()", self.env, false) {
                replace_function_name(&mut webkit_value, "calc", "-webkit-calc");
            }

            if should_prefix("-webkit-cross-fade()", self.env, false) {
                replace_cross_fade_function_on_legacy_variant(
                    &mut webkit_value,
                    "cross-fade",
                    "-webkit-cross-fade",
                );
            }

            if should_prefix("-webkit-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut webkit_value,
                    "linear-gradient",
                    "-webkit-linear-gradient",
                );
            }

            if should_prefix("-webkit-repeating-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut webkit_value,
                    "repeating-linear-gradient",
                    "-webkit-repeating-linear-gradient",
                );
            }

            if should_prefix("-webkit-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut webkit_value,
                    "radial-gradient",
                    "-webkit-radial-gradient",
                );
            }

            if should_prefix("-webkit-repeating-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut webkit_value,
                    "repeating-radial-gradient",
                    "-webkit-repeating-radial-gradient",
                );
            }
        }

        let mut moz_value = n.value.clone();

        if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
            if should_prefix("-moz-element()", self.env, false) {
                replace_function_name(&mut moz_value, "element", "-moz-element");
            }

            if should_prefix("-moz-calc()", self.env, false) {
                replace_function_name(&mut moz_value, "calc", "-moz-calc");
            }

            if should_prefix("-moz-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut moz_value,
                    "linear-gradient",
                    "-moz-linear-gradient",
                );
            }

            if should_prefix("-moz-repeating-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut moz_value,
                    "repeating-linear-gradient",
                    "-moz-repeating-linear-gradient",
                );
            }

            if should_prefix("-moz-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut moz_value,
                    "radial-gradient",
                    "-moz-radial-gradient",
                );
            }

            if should_prefix("-moz-repeating-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut moz_value,
                    "repeating-radial-gradient",
                    "-moz-repeating-radial-gradient",
                );
            }
        }

        let mut o_value = n.value.clone();

        if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
            if should_prefix("-o-repeating-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut o_value,
                    "linear-gradient",
                    "-o-linear-gradient",
                );
            }

            if should_prefix("-o-repeating-linear-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut o_value,
                    "repeating-linear-gradient",
                    "-o-repeating-linear-gradient",
                );
            }

            if should_prefix("-o-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut o_value,
                    "radial-gradient",
                    "-o-radial-gradient",
                );
            }

            if should_prefix("-o-repeating-radial-gradient()", self.env, false) {
                replace_gradient_function_on_legacy_variant(
                    &mut o_value,
                    "repeating-radial-gradient",
                    "-o-repeating-radial-gradient",
                );
            }
        }

        let mut ms_value = n.value.clone();

        let declarations = Lazy::new(|| {
            let simple_block = self.simple_block.as_ref().unwrap();
            let mut declarations = Vec::with_capacity(simple_block.value.len());

            for n in simple_block.value.iter() {
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

            declarations
        });

        let properties = Lazy::new(|| {
            let mut properties: AHashSet<&str> = AHashSet::default();

            for declaration in declarations.iter() {
                if let DeclarationName::Ident(ident) = &declaration.name {
                    properties.insert(&ident.value);
                }
            }

            properties
        });

        // TODO avoid insert moz/etc prefixes for `appearance: -webkit-button;`
        // TODO avoid duplication insert
        macro_rules! add_declaration {
            ($prefix:expr,$property:expr, $value:expr) => {{
                if should_prefix($property, self.env, true) {
                    // Use only specific prefix in prefixed at-rules or rule, i.e.
                    // don't use `-moz` prefix for properties in `@-webkit-keyframes` at-rule
                    if self.rule_prefix == Some($prefix) || self.rule_prefix.is_none() {
                        // Check we don't have prefixed property
                        if !properties.contains(&$property) {
                            let name = DeclarationName::Ident(Ident {
                                span: DUMMY_SP,
                                value: $property.into(),
                                raw: None,
                            });

                            if let Some(value) = $value {
                                self.added_declarations.push(Declaration {
                                    span: n.span,
                                    name,
                                    value,
                                    important: n.important.clone(),
                                });
                            } else {
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
                    }
                }
            }};
        }

        let property_name = &*name.to_lowercase();

        match property_name {
            "appearance" => {
                add_declaration!(Prefix::Webkit, "-webkit-appearance", None);
                add_declaration!(Prefix::Moz, "-moz-appearance", None);
                add_declaration!(Prefix::Ms, "-ms-appearance", None);
            }

            "animation" => {
                let need_prefix = n.value.iter().all(|n| match n {
                    ComponentValue::Ident(Ident { value, .. }) => {
                        !matches!(&*value.to_lowercase(), "reverse" | "alternate-reverse")
                    }
                    _ => true,
                });

                if need_prefix {
                    add_declaration!(Prefix::Webkit, "-webkit-animation", None);
                    add_declaration!(Prefix::Moz, "-moz-animation", None);
                    add_declaration!(Prefix::O, "-o-animation", None);
                }
            }

            "animation-name" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-name", None);
                add_declaration!(Prefix::Moz, "-moz-animation-name", None);
                add_declaration!(Prefix::O, "-o-animation-name", None);
            }

            "animation-duration" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-duration", None);
                add_declaration!(Prefix::Moz, "-moz-animation-duration", None);
                add_declaration!(Prefix::O, "-o-animation-duration", None);
            }

            "animation-delay" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-delay", None);
                add_declaration!(Prefix::Moz, "-moz-animation-delay", None);
                add_declaration!(Prefix::O, "-o-animation-delay", None);
            }

            "animation-direction" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "alternate-reverse" | "reverse" => {}

                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-animation-direction", None);
                            add_declaration!(Prefix::Moz, "-moz-animation-direction", None);
                            add_declaration!(Prefix::O, "-o-animation-direction", None);
                        }
                    }
                }
            }

            "animation-fill-mode" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-fill-mode", None);
                add_declaration!(Prefix::Moz, "-moz-animation-fill-mode", None);
                add_declaration!(Prefix::O, "-o-animation-fill-mode", None);
            }

            "animation-iteration-count" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-iteration-count", None);
                add_declaration!(Prefix::Moz, "-moz-animation-iteration-count", None);
                add_declaration!(Prefix::O, "-o-animation-iteration-count", None);
            }

            "animation-play-state" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-play-state", None);
                add_declaration!(Prefix::Moz, "-moz-animation-play-state", None);
                add_declaration!(Prefix::O, "-o-animation-play-state", None);
            }

            "animation-timing-function" => {
                add_declaration!(Prefix::Webkit, "-webkit-animation-timing-function", None);
                add_declaration!(Prefix::Moz, "-moz-animation-timing-function", None);
                add_declaration!(Prefix::O, "-o-animation-timing-function", None);
            }

            "background-clip" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "text" {
                        add_declaration!(Prefix::Webkit, "-webkit-background-clip", None);
                    }
                }
            }

            "box-decoration-break" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-decoration-break", None);
            }

            "box-sizing" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-sizing", None);
                add_declaration!(Prefix::Moz, "-moz-box-sizing", None);
            }

            "color-adjust" => {
                add_declaration!(Prefix::Webkit, "-webkit-print-color-adjust", None);
            }

            "print-color-adjust" => {
                add_declaration!(Prefix::Moz, "color-adjust", None);
                add_declaration!(Prefix::Webkit, "-webkit-print-color-adjust", None);
            }

            "columns" => {
                add_declaration!(Prefix::Webkit, "-webkit-columns", None);
                add_declaration!(Prefix::Moz, "-moz-columns", None);
            }

            "column-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-width", None);
                add_declaration!(Prefix::Moz, "-moz-column-width", None);
            }

            "column-gap" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-gap", None);
                add_declaration!(Prefix::Moz, "-moz-column-gap", None);
            }

            "column-rule" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule", None);
                add_declaration!(Prefix::Moz, "-moz-column-rule", None);
            }

            "column-rule-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-color", None);
                add_declaration!(Prefix::Moz, "-moz-column-rule-color", None);
            }

            "column-rule-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-width", None);
                add_declaration!(Prefix::Moz, "-moz-column-rule-width", None);
            }

            "column-count" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-count", None);
                add_declaration!(Prefix::Moz, "-moz-column-count", None);
            }

            "column-rule-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-rule-style", None);
                add_declaration!(Prefix::Moz, "-moz-column-rule-style", None);
            }

            "column-span" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-span", None);
                add_declaration!(Prefix::Moz, "-moz-column-span", None);
            }

            "column-fill" => {
                add_declaration!(Prefix::Webkit, "-webkit-column-fill", None);
                add_declaration!(Prefix::Moz, "-moz-column-fill", None);
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
                            raw: None,
                        }))
                    }
                    Some(ComponentValue::Ident(Ident { value, span, .. }))
                        if value.as_ref().eq_ignore_ascii_case("auto") =>
                    {
                        Some(ComponentValue::Integer(Integer {
                            span: *span,
                            value: 1,
                            raw: None,
                        }))
                    }
                    Some(any) => Some(any.clone()),
                    None => None,
                };

                if let Some(spec_2009_value) = &spec_2009_value {
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-flex",
                        Some(vec![spec_2009_value.clone()])
                    );
                } else {
                    add_declaration!(Prefix::Webkit, "-webkit-box-flex", None);
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex", None);

                if let Some(spec_2009_value) = &spec_2009_value {
                    add_declaration!(
                        Prefix::Moz,
                        "-moz-box-flex",
                        Some(vec![spec_2009_value.clone()])
                    );
                } else {
                    add_declaration!(Prefix::Webkit, "-moz-box-flex", None);
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
                                raw: None,
                            },
                            unit: Ident {
                                span: DUMMY_SP,
                                value: "px".into(),
                                raw: None,
                            },
                        }));
                    }

                    add_declaration!(Prefix::Ms, "-ms-flex", Some(value));
                } else {
                    add_declaration!(Prefix::Ms, "-ms-flex", None);
                }
            }

            "flex-grow" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-flex", None);
                add_declaration!(Prefix::Webkit, "-webkit-flex-grow", None);
                add_declaration!(Prefix::Moz, "-moz-box-flex", None);
                add_declaration!(Prefix::Ms, "-ms-flex-positive", None);
            }

            "flex-shrink" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-shrink", None);
                add_declaration!(Prefix::Ms, "-ms-flex-negative", None);
            }

            "flex-basis" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-basis", None);
                add_declaration!(Prefix::Ms, "-ms-flex-preferred-size", None);
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
                        Some(vec![str_to_ident!(orient)])
                    );
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-direction",
                        Some(vec![str_to_ident!(direction)])
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex-direction", None);

                if let Some((orient, direction)) = old_values {
                    add_declaration!(
                        Prefix::Moz,
                        "-moz-box-orient",
                        Some(vec![str_to_ident!(orient)])
                    );
                    add_declaration!(
                        Prefix::Webkit,
                        "-moz-box-direction",
                        Some(vec![str_to_ident!(direction)])
                    );
                }

                add_declaration!(Prefix::Ms, "-ms-flex-direction", None);
            }

            "flex-wrap" => {
                add_declaration!(Prefix::Webkit, "-webkit-flex-wrap", None);
                add_declaration!(Prefix::Ms, "-ms-flex-wrap", None);
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
                        Some(vec![str_to_ident!(orient)])
                    );
                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-direction",
                        Some(vec![str_to_ident!(direction)])
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-flex-flow", None);

                if let Some((orient, direction)) = old_values {
                    add_declaration!(
                        Prefix::Moz,
                        "-moz-box-orient",
                        Some(vec![str_to_ident!(orient)])
                    );
                    add_declaration!(
                        Prefix::Moz,
                        "-moz-box-direction",
                        Some(vec![str_to_ident!(direction)])
                    );
                }

                add_declaration!(Prefix::Ms, "-ms-flex-flow", None);
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
                        Some(old_spec_webkit_new_value)
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-justify-content", None);

                if need_old_spec
                    && (self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none())
                {
                    let mut old_spec_moz_value = moz_value.clone();

                    replace_ident(&mut old_spec_moz_value, "flex-start", "start");
                    replace_ident(&mut old_spec_moz_value, "flex-end", "end");
                    replace_ident(&mut old_spec_moz_value, "space-between", "justify");

                    add_declaration!(Prefix::Moz, "-moz-box-pack", Some(old_spec_moz_value));
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut old_spec_ms_value = ms_value.clone();

                    replace_ident(&mut old_spec_ms_value, "flex-start", "start");
                    replace_ident(&mut old_spec_ms_value, "flex-end", "end");
                    replace_ident(&mut old_spec_ms_value, "space-between", "justify");
                    replace_ident(&mut old_spec_ms_value, "space-around", "distribute");

                    add_declaration!(Prefix::Ms, "-ms-flex-pack", Some(old_spec_ms_value));
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
                            Some(vec![str_to_ident!(old_spec_num.to_string())])
                        );
                    }
                    _ => {
                        add_declaration!(Prefix::Webkit, "-webkit-box-ordinal-group", None);
                    }
                }

                add_declaration!(Prefix::Webkit, "-webkit-order", None);

                match old_spec_num {
                    Some(old_spec_num) if n.value.len() == 1 => {
                        add_declaration!(
                            Prefix::Moz,
                            "-moz-box-ordinal-group",
                            Some(vec![str_to_ident!(old_spec_num.to_string())])
                        );
                    }
                    _ => {
                        add_declaration!(Prefix::Webkit, "-moz-box-ordinal-group", None);
                    }
                }

                add_declaration!(Prefix::Ms, "-ms-flex-order", None);
            }

            "align-items" => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    let mut old_spec_webkit_new_value = webkit_value.clone();

                    replace_ident(&mut old_spec_webkit_new_value, "flex-end", "end");
                    replace_ident(&mut old_spec_webkit_new_value, "flex-start", "start");

                    add_declaration!(
                        Prefix::Webkit,
                        "-webkit-box-align",
                        Some(old_spec_webkit_new_value)
                    );
                }

                add_declaration!(Prefix::Webkit, "-webkit-align-items", None);

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    let mut old_spec_moz_value = moz_value.clone();

                    replace_ident(&mut old_spec_moz_value, "flex-end", "end");
                    replace_ident(&mut old_spec_moz_value, "flex-start", "start");

                    add_declaration!(Prefix::Moz, "-moz-box-align", Some(old_spec_moz_value));
                }

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut old_spec_ms_value = ms_value.clone();

                    replace_ident(&mut old_spec_ms_value, "flex-end", "end");
                    replace_ident(&mut old_spec_ms_value, "flex-start", "start");

                    add_declaration!(Prefix::Ms, "-ms-flex-align", Some(old_spec_ms_value));
                }
            }

            "align-self" => {
                add_declaration!(Prefix::Webkit, "-webkit-align-self", None);

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut spec_2012_ms_value = ms_value.clone();

                    replace_ident(&mut spec_2012_ms_value, "flex-end", "end");
                    replace_ident(&mut spec_2012_ms_value, "flex-start", "start");

                    add_declaration!(Prefix::Ms, "-ms-flex-item-align", Some(spec_2012_ms_value));
                }
            }

            "align-content" => {
                add_declaration!(Prefix::Webkit, "-webkit-align-content", None);

                if self.rule_prefix == Some(Prefix::Ms) || self.rule_prefix.is_none() {
                    let mut spec_2012_ms_value = ms_value.clone();

                    replace_ident(&mut spec_2012_ms_value, "flex-end", "end");
                    replace_ident(&mut spec_2012_ms_value, "flex-start", "start");
                    replace_ident(&mut spec_2012_ms_value, "space-between", "justify");
                    replace_ident(&mut spec_2012_ms_value, "space-around", "distribute");

                    add_declaration!(Prefix::Ms, "-ms-flex-line-pack", Some(spec_2012_ms_value));
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
                        add_declaration!(
                            Prefix::Ms,
                            "-ms-interpolation-mode",
                            Some(old_spec_ms_value)
                        );
                    }
                }
            }

            "filter" => match &n.value[0] {
                ComponentValue::Ident(Ident { value, .. })
                    if value.as_ref().eq_ignore_ascii_case("progid") => {}
                ComponentValue::Function(Function { name, .. })
                    if name.value.as_ref().eq_ignore_ascii_case("alpha") => {}
                _ => {
                    add_declaration!(Prefix::Webkit, "-webkit-filter", None);
                }
            },

            "backdrop-filter" => {
                add_declaration!(Prefix::Webkit, "-webkit-backdrop-filter", None);
            }

            "mask-clip" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-clip", None);
            }

            // Fix me https://github.com/postcss/autoprefixer/blob/main/lib/hacks/mask-composite.js
            "mask-composite" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-composite", None);
            }

            "mask-image" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-image", None);
            }

            "mask-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-origin", None);
            }

            "mask-repeat" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-repeat", None);
            }

            "mask-border-repeat" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-border-repeat", None);
            }

            "mask-border-source" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-border-source", None);
            }

            "mask" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask", None);
            }

            "mask-position" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-position", None);
            }

            "mask-size" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-size", None);
            }

            "mask-border" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image", None);
            }

            "mask-border-outset" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-outset", None);
            }

            "mask-border-width" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-width", None);
            }

            "mask-border-slice" => {
                add_declaration!(Prefix::Webkit, "-webkit-mask-box-image-slice", None);
            }

            "border-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-start", None);
                add_declaration!(Prefix::Moz, "-moz-border-start", None);
            }

            "border-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-end", None);
                add_declaration!(Prefix::Moz, "-moz-border-end", None);
            }

            "margin-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-start", None);
                add_declaration!(Prefix::Moz, "-moz-margin-start", None);
            }

            "margin-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-end", None);
                add_declaration!(Prefix::Moz, "-moz-margin-end", None);
            }

            "padding-inline-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-start", None);
                add_declaration!(Prefix::Moz, "-moz-padding-start", None);
            }

            "padding-inline-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-end", None);
                add_declaration!(Prefix::Moz, "-moz-padding-end", None);
            }

            "border-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-before", None);
            }

            "border-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-after", None);
            }

            "margin-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-before", None);
            }

            "margin-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-margin-after", None);
            }

            "padding-block-start" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-before", None);
            }

            "padding-block-end" => {
                add_declaration!(Prefix::Webkit, "-webkit-padding-after", None);
            }

            "backface-visibility" => {
                add_declaration!(Prefix::Webkit, "-webkit-backface-visibility", None);
                add_declaration!(Prefix::Moz, "-moz-backface-visibility", None);
            }

            "clip-path" => {
                add_declaration!(Prefix::Webkit, "-webkit-clip-path", None);
            }

            "position" if n.value.len() == 1 => {
                if self.rule_prefix == Some(Prefix::Webkit) || self.rule_prefix.is_none() {
                    replace_ident(&mut webkit_value, "sticky", "-webkit-sticky");
                }
            }

            "user-select" => {
                add_declaration!(Prefix::Webkit, "-webkit-user-select", None);
                add_declaration!(Prefix::Moz, "-moz-user-select", None);

                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "contain" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-user-select",
                                Some(vec![str_to_ident!("element")])
                            );
                        }
                        "all" => {}
                        _ => {
                            add_declaration!(Prefix::Ms, "-ms-user-select", None);
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

                add_declaration!(Prefix::Webkit, "-webkit-transform", None);
                add_declaration!(Prefix::Moz, "-moz-transform", None);

                if !has_3d_function {
                    if !self.in_keyframe_block {
                        add_declaration!(Prefix::Ms, "-ms-transform", None);
                    }

                    add_declaration!(Prefix::O, "-o-transform", None);
                }
            }

            "transform-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-transform-origin", None);
                add_declaration!(Prefix::Moz, "-moz-transform-origin", None);

                if !self.in_keyframe_block {
                    add_declaration!(Prefix::Ms, "-ms-transform-origin", None);
                }

                add_declaration!(Prefix::O, "-o-transform-origin", None);
            }

            "transform-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-transform-style", None);
                add_declaration!(Prefix::Moz, "-moz-transform-style", None);
            }

            "perspective" => {
                add_declaration!(Prefix::Webkit, "-webkit-perspective", None);
                add_declaration!(Prefix::Moz, "-moz-perspective", None);
            }

            "perspective-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-perspective-origin", None);
                add_declaration!(Prefix::Moz, "-moz-perspective-origin", None);
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
                            add_declaration!(Prefix::Webkit, "-webkit-text-decoration", None);
                            add_declaration!(Prefix::Moz, "-moz-text-decoration", None);
                        }
                    }
                } else {
                    add_declaration!(Prefix::Webkit, "-webkit-text-decoration", None);
                    add_declaration!(Prefix::Moz, "-moz-text-decoration", None);
                }
            }

            "text-decoration-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-style", None);
                add_declaration!(Prefix::Moz, "-moz-text-decoration-style", None);
            }

            "text-decoration-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-color", None);
                add_declaration!(Prefix::Moz, "-moz-text-decoration-color", None);
            }

            "text-decoration-line" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-line", None);
                add_declaration!(Prefix::Moz, "-moz-text-decoration-line", None);
            }

            "text-decoration-skip" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-decoration-skip", None);
            }

            "text-decoration-skip-ink" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-text-decoration-skip",
                                Some(vec![str_to_ident!("ink")])
                            );
                        }
                        _ => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-text-decoration-skip-ink",
                                None
                            );
                        }
                    }
                }
            }

            "text-size-adjust" if n.value.len() == 1 => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    if &*value.to_lowercase() == "none" {
                        add_declaration!(Prefix::Webkit, "-webkit-text-size-adjust", None);
                        add_declaration!(Prefix::Moz, "-moz-text-size-adjust", None);
                        add_declaration!(Prefix::Ms, "-ms-text-size-adjust", None);
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

                add_declaration!(Prefix::Webkit, "-webkit-transition", None);

                if self.rule_prefix == Some(Prefix::Moz) || self.rule_prefix.is_none() {
                    replace_ident(&mut moz_value, "transform", "-moz-transform");
                }

                add_declaration!(Prefix::Moz, "-moz-transition", None);

                if self.rule_prefix == Some(Prefix::O) || self.rule_prefix.is_none() {
                    replace_ident(&mut o_value, "transform", "-o-transform");
                }

                add_declaration!(Prefix::O, "-o-transition", None);
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

                add_declaration!(Prefix::Webkit, "-webkit-transition-property", None);
                add_declaration!(Prefix::Moz, "-moz-transition-timing-function", None);
                add_declaration!(Prefix::O, "-o-transition-timing-function", None);
            }

            "transition-duration" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-duration", None);
                add_declaration!(Prefix::Moz, "-moz-transition-duration", None);
                add_declaration!(Prefix::O, "-o-transition-duration", None);
            }

            "transition-delay" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-delay", None);
                add_declaration!(Prefix::Moz, "-moz-transition-delay", None);
                add_declaration!(Prefix::O, "-o-transition-delay", None);
            }

            "transition-timing-function" => {
                add_declaration!(Prefix::Webkit, "-webkit-transition-timing-function", None);
                add_declaration!(Prefix::Moz, "-moz-transition-timing-function", None);
                add_declaration!(Prefix::O, "-o-transition-timing-function", None);
            }

            "writing-mode" if n.value.len() == 1 => {
                let direction = match declarations.iter().rev().find(|declaration| {
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
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode", None);

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("tb-lr")])
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("bt-lr")])
                                    );
                                }
                                _ => {}
                            }
                        }

                        "vertical-rl" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode", None);

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("tb-rl")])
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("bt-rl")])
                                    );
                                }
                                _ => {}
                            }
                        }

                        "horizontal-tb" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode", None);

                            match direction {
                                Some("ltr") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("lr-tb")])
                                    );
                                }
                                Some("rtl") => {
                                    add_declaration!(
                                        Prefix::Ms,
                                        "-ms-writing-mode",
                                        Some(vec![str_to_ident!("rl-tb")])
                                    );
                                }
                                _ => {}
                            }
                        }

                        "sideways-rl" | "sideways-lr" => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode", None);
                        }

                        _ => {
                            add_declaration!(Prefix::Webkit, "-webkit-writing-mode", None);
                            add_declaration!(Prefix::Ms, "-ms-writing-mode", None);
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

                    add_declaration!(Prefix::Ms, "-ms-touch-action", Some(new_ms_value));
                }

                add_declaration!(Prefix::Ms, "-ms-touch-action", None);
            }

            "text-orientation" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-orientation", None);
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
                add_declaration!(Prefix::Ms, "-ms-text-spacing", None);
            }

            "text-emphasis" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis", None);
            }

            "text-emphasis-position" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-position", None);
            }

            "text-emphasis-style" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-style", None);
            }

            "text-emphasis-color" => {
                add_declaration!(Prefix::Webkit, "-webkit-text-emphasis-color", None);
            }

            "flow-into" => {
                add_declaration!(Prefix::Webkit, "-webkit-flow-into", None);
                add_declaration!(Prefix::Ms, "-ms-flow-into", None);
            }

            "flow-from" => {
                add_declaration!(Prefix::Webkit, "-webkit-flow-from", None);
                add_declaration!(Prefix::Ms, "-ms-flow-from", None);
            }

            "region-fragment" => {
                add_declaration!(Prefix::Webkit, "-webkit-region-fragment", None);
                add_declaration!(Prefix::Ms, "-ms-region-fragment", None);
            }

            "scroll-snap-type" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-type", None);
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-type", None);
            }

            "scroll-snap-coordinate" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-coordinate", None);
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-coordinate", None);
            }

            "scroll-snap-destination" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-destination", None);
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-destination", None);
            }

            "scroll-snap-points-x" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-points-x", None);
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-points-x", None);
            }

            "scroll-snap-points-y" => {
                add_declaration!(Prefix::Webkit, "-webkit-scroll-snap-points-y", None);
                add_declaration!(Prefix::Ms, "-ms-scroll-snap-points-y", None);
            }

            "text-align-last" => {
                add_declaration!(Prefix::Moz, "-moz-text-align-last", None);
            }

            "text-overflow" => {
                add_declaration!(Prefix::O, "-o-text-overflow", None);
            }

            "shape-margin" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-margin", None);
            }

            "shape-outside" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-outside", None);
            }

            "shape-image-threshold" => {
                add_declaration!(Prefix::Webkit, "-webkit-shape-image-threshold", None);
            }

            "object-fit" => {
                add_declaration!(Prefix::O, "-o-object-fit", None);
            }

            "object-position" => {
                add_declaration!(Prefix::O, "-o-object-position", None);
            }

            "tab-size" => {
                add_declaration!(Prefix::Moz, "-moz-tab-size", None);
                add_declaration!(Prefix::O, "-o-tab-size", None);
            }

            "hyphens" => {
                add_declaration!(Prefix::Webkit, "-webkit-hyphens", None);
                add_declaration!(Prefix::Moz, "-moz-hyphens", None);
                add_declaration!(Prefix::Ms, "-ms-hyphens", None);
            }

            "border-image" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-image", None);
                add_declaration!(Prefix::Moz, "-moz-border-image", None);
                add_declaration!(Prefix::O, "-o-border-image", None);
            }

            "font-kerning" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-kerning", None);
            }

            "font-feature-settings" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-feature-settings", None);
                add_declaration!(Prefix::Moz, "-moz-font-feature-settings", None);
            }

            "font-variant-ligatures" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-variant-ligatures", None);
                add_declaration!(Prefix::Moz, "-moz-font-variant-ligatures", None);
            }

            "font-language-override" => {
                add_declaration!(Prefix::Webkit, "-webkit-font-language-override", None);
                add_declaration!(Prefix::Moz, "-moz-font-language-override", None);
            }

            "background-origin" => {
                add_declaration!(Prefix::Webkit, "-webkit-background-origin", None);
                add_declaration!(Prefix::Moz, "-moz-background-origin", None);
                add_declaration!(Prefix::O, "-o-background-origin", None);
            }

            "background-size" => {
                add_declaration!(Prefix::Webkit, "-webkit-background-size", None);
                add_declaration!(Prefix::Moz, "-moz-background-size", None);
                add_declaration!(Prefix::O, "-o-background-size", None);
            }

            "overscroll-behavior" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-scroll-chaining",
                                Some(vec![str_to_ident!("chained")])
                            );
                        }
                        "none" | "contain" => {
                            add_declaration!(
                                Prefix::Ms,
                                "-ms-scroll-chaining",
                                Some(vec![str_to_ident!("none")])
                            );
                        }
                        _ => {
                            add_declaration!(Prefix::Ms, "-ms-scroll-chaining", None);
                        }
                    }
                } else {
                    add_declaration!(Prefix::Ms, "-ms-scroll-chaining", None);
                }
            }

            "box-shadow" => {
                add_declaration!(Prefix::Webkit, "-webkit-box-shadow", None);
                add_declaration!(Prefix::Moz, "-moz-box-shadow", None);
            }

            "forced-color-adjust" => {
                add_declaration!(Prefix::Ms, "-ms-high-contrast-adjust", None);
            }

            "break-inside" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-inside", None);
                        }
                        _ => {}
                    }
                }
            }

            "break-before" => {
                if let ComponentValue::Ident(Ident { value, .. }) = &n.value[0] {
                    match &*value.to_lowercase() {
                        "auto" | "avoid" => {
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-before", None);
                        }
                        "column" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-column-break-before",
                                Some(vec![str_to_ident!("always")])
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
                            add_declaration!(Prefix::Webkit, "-webkit-column-break-after", None);
                        }
                        "column" => {
                            add_declaration!(
                                Prefix::Webkit,
                                "-webkit-column-break-after",
                                Some(vec![str_to_ident!("always")])
                            );
                        }
                        _ => {}
                    }
                }
            }

            "border-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-radius", None);
                add_declaration!(Prefix::Moz, "-moz-border-radius", None);
            }

            "border-top-left-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-top-left-radius", None);
                add_declaration!(Prefix::Moz, "-moz-border-radius-topleft", None);
            }

            "border-top-right-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-top-right-radius", None);
                add_declaration!(Prefix::Moz, "-moz-border-radius-topright", None);
            }

            "border-bottom-right-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-bottom-right-radius", None);
                add_declaration!(Prefix::Moz, "-moz-border-radius-bottomright", None);
            }

            "border-bottom-left-radius" => {
                add_declaration!(Prefix::Webkit, "-webkit-border-bottom-left-radius", None);
                add_declaration!(Prefix::Moz, "-moz-border-radius-bottomleft", None);
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
