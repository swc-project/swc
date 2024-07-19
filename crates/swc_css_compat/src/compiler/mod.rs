use swc_common::{util::take::Take, Spanned, DUMMY_SP};
use swc_css_ast::{
    AbsoluteColorBase, AtRule, ComponentValue, CompoundSelector, MediaAnd, MediaCondition,
    MediaConditionAllType, MediaConditionWithoutOr, MediaInParens, MediaQuery, Rule,
    SupportsCondition,
};
use swc_css_visit::{VisitMut, VisitMutWith};

use self::custom_media::CustomMediaHandler;
use crate::feature::Features;

mod color_alpha_parameter;
mod color_hex_alpha;
mod color_hwb;
mod color_space_separated_parameters;
mod custom_media;
mod legacy_rgb_and_hsl;
mod media_query_ranges;
mod nesting;
mod selector_not;

/// Compiles a modern CSS file to a CSS file which works with old browsers.
#[derive(Debug)]
pub struct Compiler {
    #[allow(unused)]
    c: Config,
    custom_media: CustomMediaHandler,
    in_supports_condition: bool,
}

#[derive(Debug)]
pub struct Config {
    /// The list of features to **process**.
    pub process: Features,
}

impl Compiler {
    pub fn new(config: Config) -> Self {
        Self {
            c: config,
            custom_media: Default::default(),
            in_supports_condition: Default::default(),
        }
    }
}

impl VisitMut for Compiler {
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.store_custom_media(n);
        }
    }

    fn visit_mut_supports_condition(&mut self, n: &mut SupportsCondition) {
        let old_in_support_condition = self.in_supports_condition;

        self.in_supports_condition = true;

        n.visit_mut_children_with(self);

        self.in_supports_condition = old_in_support_condition;
    }

    fn visit_mut_media_query(&mut self, n: &mut MediaQuery) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.process_media_query(n);
        }
    }

    fn visit_mut_media_condition(&mut self, n: &mut MediaCondition) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.process_media_condition(n);
        }
    }

    fn visit_mut_media_condition_without_or(&mut self, n: &mut MediaConditionWithoutOr) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.process_media_condition_without_or(n);
        }
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        if self.c.process.contains(Features::NESTING) {
            let mut new = Vec::new();

            for n in n.take() {
                match n {
                    Rule::QualifiedRule(mut n) => {
                        let mut rules = self.extract_nested_rules(&mut n);

                        rules.visit_mut_with(self);

                        new.push(Rule::QualifiedRule(n));
                        new.extend(rules);
                    }
                    _ => {
                        new.push(n);
                    }
                }
            }

            *n = new;
        } else {
            n.visit_mut_children_with(self);
        }

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.process_rules(n);
        }
    }

    fn visit_mut_media_in_parens(&mut self, n: &mut MediaInParens) {
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::MEDIA_QUERY_RANGES) {
            if let MediaInParens::Feature(media_feature) = n {
                if let Some(legacy_media_feature) = self.get_legacy_media_feature(media_feature) {
                    match legacy_media_feature {
                        (legacy_media_feature, None) => {
                            *media_feature = Box::new(legacy_media_feature);
                        }
                        (left, Some(right)) => {
                            *n = MediaInParens::MediaCondition(MediaCondition {
                                span: n.span(),
                                conditions: vec![
                                    MediaConditionAllType::MediaInParens(*Box::new(
                                        MediaInParens::Feature(Box::new(left)),
                                    )),
                                    MediaConditionAllType::And(MediaAnd {
                                        span: DUMMY_SP,
                                        keyword: None,
                                        condition: MediaInParens::Feature(Box::new(right)),
                                    }),
                                ],
                            });
                        }
                    }
                }
            }
        }
    }

    fn visit_mut_compound_selector(&mut self, n: &mut CompoundSelector) {
        n.visit_mut_children_with(self);

        if self.in_supports_condition {
            return;
        }

        if self.c.process.contains(Features::SELECTOR_NOT) {
            self.process_selector_not(n);
        }
    }

    fn visit_mut_component_value(&mut self, n: &mut ComponentValue) {
        n.visit_mut_children_with(self);

        if self.in_supports_condition {
            return;
        }

        if self.c.process.contains(Features::COLOR_HEX_ALPHA) {
            self.process_color_hex_alpha(n);
        }
    }

    fn visit_mut_absolute_color_base(&mut self, n: &mut AbsoluteColorBase) {
        n.visit_mut_children_with(self);

        if self.in_supports_condition {
            return;
        }

        // TODO handle color functions in custom variables under the option
        // TODO implement the `preserve` option to preserve the original color

        let process = self.c.process;

        if process.contains(Features::COLOR_SPACE_SEPARATED_PARAMETERS) {
            self.process_color_space_separated_function_notation(n);
        }

        if process.contains(Features::COLOR_ALPHA_PARAMETER) {
            self.process_color_alpha_parameter(n);
        }

        if process.contains(Features::COLOR_LEGACY_RGB_AND_HSL) {
            self.process_rgb_and_hsl(n);
        }

        if process.contains(Features::COLOR_HWB) {
            self.process_color_hwb(n);
        }
    }
}
