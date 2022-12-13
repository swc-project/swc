use swc_css_ast::{AtRule, MediaCondition, MediaConditionWithoutOr, MediaQuery, Rule};
use swc_css_ast::MediaFeature;
use swc_common::{Spanned, DUMMY_SP};
use swc_css_ast::{MediaAnd, MediaCondition, MediaConditionAllType, MediaInParens};
use swc_css_visit::{VisitMut, VisitMutWith};

use self::custom_media::CustomMediaHandler;
use crate::feature::Features;

mod custom_media;
mod media_query_ranges;

/// Compiles a modern CSS file to a CSS file which works with old browsers.
#[derive(Debug)]
pub struct Compiler {
    #[allow(unused)]
    c: Config,
    custom_media: CustomMediaHandler,
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
        n.visit_mut_children_with(self);

        if self.c.process.contains(Features::CUSTOM_MEDIA) {
            self.custom_media.process_rules(n);
    fn visit_mut_media_feature(&mut self, n: &mut MediaFeature) {
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
}
