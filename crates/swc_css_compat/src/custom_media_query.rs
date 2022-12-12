use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, MediaAnd, MediaCondition,
    MediaConditionAllType, MediaConditionType, MediaConditionWithoutOr, MediaFeature,
    MediaFeatureBoolean, MediaFeatureName, MediaInParens, MediaNot, MediaOr, MediaQuery,
    MediaQueryList, Rule, Stylesheet,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn process_custom_media_query(ss: &mut Stylesheet) {
    ss.visit_mut_with(&mut CustomMediaQueryTransform::default());
}

#[derive(Debug, Default)]
struct CustomMediaQueryTransform {
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaQueryTransform {
    fn expand_media_query(&self, to: &mut Vec<MediaQuery>, q: MediaQuery) {
        if let MediaQuery {
            modifier: None,
            media_type: None,
            keyword: None,
            condition: Some(cond),
            ..
        } = q
        {
            self.expand_media_condition_type(to, cond);
            return;
        }

        to.push(q);
    }

    fn expand_media_condition_type(&self, to: &mut Vec<MediaQuery>, cond: Box<MediaConditionType>) {
        match *cond {
            MediaConditionType::All(cond) => {
                self.expand_media_condition(to, cond);
            }
            MediaConditionType::WithoutOr(cond) => {
                self.expand_media_condition_without_or(to, cond);
            }
        }
    }

    fn expand_media_condition(&self, to: &mut Vec<MediaQuery>, cond: MediaCondition) {
        for cond in cond.conditions {
            self.expand_media_condition_all_type(to, cond);
        }
    }

    fn expand_media_condition_without_or(
        &self,
        to: &mut Vec<MediaQuery>,
        cond: MediaConditionWithoutOr,
    ) {
    }

    fn expand_media_condition_all_type(
        &self,
        to: &mut Vec<MediaQuery>,
        cond: MediaConditionAllType,
    ) {
        match cond {
            MediaConditionAllType::Not(cond) => self.expand_media_not(to, cond),
            MediaConditionAllType::And(cond) => self.expand_media_and(to, cond),
            MediaConditionAllType::Or(cond) => self.expand_media_or(to, cond),
            MediaConditionAllType::MediaInParens(cond) => self.expand_media_in_parens(to, cond),
        }
    }

    fn expand_media_not(&self, to: &mut Vec<MediaQuery>, cond: MediaNot) {}

    fn expand_media_and(&self, to: &mut Vec<MediaQuery>, cond: MediaAnd) {}

    fn expand_media_or(&self, to: &mut Vec<MediaQuery>, cond: MediaOr) {}

    fn expand_media_in_parens(&self, to: &mut Vec<MediaQuery>, cond: MediaInParens) {}
}

impl VisitMut for CustomMediaQueryTransform {
    fn visit_mut_at_rule(&mut self, n: &mut AtRule) {
        n.visit_mut_children_with(self);

        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    fn visit_mut_media_query_list(&mut self, n: &mut MediaQueryList) {
        n.visit_mut_children_with(self);

        let mut new = Vec::with_capacity(n.queries.len());

        for q in n.queries.take() {
            self.expand_media_query(&mut new, q);
        }

        n.queries = new;
    }

    fn visit_mut_media_in_parens(&mut self, n: &mut MediaInParens) {
        n.visit_mut_children_with(self);

        if let MediaInParens::Feature(box MediaFeature::Boolean(MediaFeatureBoolean {
            name: MediaFeatureName::Ident(name),
            span: bool_span,
        })) = n
        {
            //
            if let Some(media) = self.medias.iter().find(|m| m.name.value == name.value) {
                match &media.media {
                    CustomMediaQueryMediaType::Ident(m) => {
                        *n = MediaInParens::Feature(box MediaFeature::Boolean(
                            MediaFeatureBoolean {
                                span: *bool_span,
                                name: MediaFeatureName::Ident(m.clone()),
                            },
                        ));
                    }
                    CustomMediaQueryMediaType::MediaQueryList(m) => {}
                }
            }
        }
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            Rule::AtRule(n) => n.name != *"custom-media",
            _ => true,
        });
    }
}
