use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, MediaCondition, MediaConditionAllType,
    MediaConditionType, MediaConditionWithoutOr, MediaConditionWithoutOrType, MediaQuery,
    MediaQueryList,
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
    }

    fn process_media_condition_type(&mut self, cond: &mut MediaConditionType) {
        dbg!(&*cond);
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
            MediaConditionAllType::Not(cond) => {}
            MediaConditionAllType::And(cond) => {}
            MediaConditionAllType::Or(cond) => {}
            MediaConditionAllType::MediaInParens(cond) => {}
        }
    }

    fn process_media_condition_without_or_type(&mut self, cond: &mut MediaConditionWithoutOrType) {
        match cond {
            MediaConditionWithoutOrType::Not(cond) => {}
            MediaConditionWithoutOrType::And(cond) => {}
            MediaConditionWithoutOrType::MediaInParens(cond) => {}
        }
    }
}
