use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, MediaAnd, MediaCondition,
    MediaConditionAllType, MediaConditionType, MediaConditionWithoutOr,
    MediaConditionWithoutOrType, MediaFeature, MediaFeatureBoolean, MediaFeatureName,
    MediaInParens, MediaNot, MediaOr, MediaQuery, MediaQueryList,
};

#[derive(Debug, Default)]
pub(super) struct CustomMediaHandler {
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaHandler {
    pub fn store_custom_media(&mut self, n: &mut AtRule) {
        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    pub fn process_media_query_list(&mut self, n: &mut MediaQueryList) {
        let mut new = Vec::with_capacity(n.queries.len());

        for q in n.queries.iter_mut() {
            self.process_media_query(&mut new, q);
        }

        n.queries = new;
    }

    fn process_media_query(&mut self, to: &mut Vec<MediaQuery>, q: &mut MediaQuery) {
        if let Some(cond) = &mut q.condition {
            self.process_media_condition_type(cond);
        }

        to.push(q.take());
    }

    fn process_media_condition_type(&mut self, cond: &mut MediaConditionType) {
        match cond {
            MediaConditionType::All(cond) => self.process_media_condition(cond),
            MediaConditionType::WithoutOr(cond) => self.process_media_condition_without_or(cond),
        }
    }

    fn process_media_condition(&mut self, cond: &mut MediaCondition) {
        for cond in cond.conditions.iter_mut() {
            self.process_media_condition_all_type(cond);
        }
    }

    fn process_media_condition_without_or(&mut self, cond: &mut MediaConditionWithoutOr) {
        for cond in cond.conditions.iter_mut() {
            self.process_media_condition_without_or_type(cond);
        }
    }

    fn process_media_condition_all_type(&mut self, cond: &mut MediaConditionAllType) {
        match cond {
            MediaConditionAllType::Not(cond) => self.process_media_not(cond),
            MediaConditionAllType::And(cond) => self.process_media_and(cond),
            MediaConditionAllType::Or(cond) => self.process_media_or(cond),
            MediaConditionAllType::MediaInParens(cond) => self.process_media_in_parens(cond),
        }
    }

    fn process_media_condition_without_or_type(&mut self, cond: &mut MediaConditionWithoutOrType) {
        match cond {
            MediaConditionWithoutOrType::Not(cond) => self.process_media_not(cond),
            MediaConditionWithoutOrType::And(cond) => self.process_media_and(cond),
            MediaConditionWithoutOrType::MediaInParens(cond) => self.process_media_in_parens(cond),
        }
    }

    fn process_media_not(&mut self, n: &mut MediaNot) {}

    fn process_media_and(&mut self, n: &mut MediaAnd) {}

    fn process_media_or(&mut self, n: &mut MediaOr) {}

    fn process_media_in_parens(&mut self, n: &mut MediaInParens) {
        if let MediaInParens::Feature(box MediaFeature::Boolean(MediaFeatureBoolean {
            name: MediaFeatureName::Ident(name),
            ..
        })) = n
        {
            if let Some(custom_media) = self.medias.iter().find(|m| m.name.value == name.value) {
                // Replace media query with custom media query

                match &custom_media.media {
                    CustomMediaQueryMediaType::Ident(media) => {
                        *name = media.clone();
                    }
                    CustomMediaQueryMediaType::MediaQueryList(_) => {
                        dbg!(&*n);
                    }
                }
            }
        }
    }
}
