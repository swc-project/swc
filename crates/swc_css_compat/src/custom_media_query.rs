use swc_atoms::js_word;
use swc_common::util::take::Take;
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, Ident, MediaAnd,
    MediaCondition, MediaConditionAllType, MediaConditionType, MediaConditionWithoutOr,
    MediaConditionWithoutOrType, MediaFeature, MediaFeatureBoolean, MediaFeatureName,
    MediaInParens, MediaNot, MediaOr, MediaQuery, MediaQueryList, Rule, Stylesheet,
};
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn process_custom_media_query(ss: &mut Stylesheet) {
    ss.visit_mut_with(&mut CustomMediaQueryTransform::default());
}

#[derive(Debug, Default)]
struct CustomMediaQueryTransform {
    medias: Vec<CustomMediaQuery>,

    new_medias: Vec<MediaQuery>,
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

    fn visit_mut_media_query(&mut self, n: &mut MediaQuery) {
        n.visit_mut_children_with(self);

        if let Some(box MediaConditionType::All(cond)) = &n.condition {
            if cond.conditions.is_empty() {
                n.condition = None;
            }
        }
    }

    fn visit_mut_media_query_list(&mut self, n: &mut MediaQueryList) {
        let prev = self.new_medias.take();

        let mut new = Vec::with_capacity(n.queries.len());

        for mut q in n.queries.take() {
            q.visit_mut_with(self);

            if let MediaQuery {
                modifier: None,
                media_type: None,
                keyword: None,
                condition: None,
                ..
            } = q
            {
                continue;
            }

            dbg!(&q);
            new.push(q);

            new.append(&mut self.new_medias);
        }

        n.queries = new;
        self.new_medias = prev;
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
                name.take();

                match &media.media {
                    CustomMediaQueryMediaType::Ident(m) => {
                        *n = MediaInParens::Feature(box MediaFeature::Boolean(
                            MediaFeatureBoolean {
                                span: *bool_span,
                                name: MediaFeatureName::Ident(m.clone()),
                            },
                        ));
                    }
                    CustomMediaQueryMediaType::MediaQueryList(m) => {
                        self.new_medias.extend(m.queries.iter().cloned());
                    }
                }
            }
        }
    }

    fn visit_mut_media_condition_all_types(&mut self, n: &mut Vec<MediaConditionAllType>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            MediaConditionAllType::MediaInParens(feature)
            | MediaConditionAllType::And(MediaAnd {
                condition: feature, ..
            })
            | MediaConditionAllType::Not(MediaNot {
                condition: feature, ..
            })
            | MediaConditionAllType::Or(MediaOr {
                condition: feature, ..
            }) => !is_feature_taken(feature),
        })
    }

    fn visit_mut_media_condition_without_or_types(
        &mut self,
        n: &mut Vec<MediaConditionWithoutOrType>,
    ) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            MediaConditionWithoutOrType::MediaInParens(feature)
            | MediaConditionWithoutOrType::And(MediaAnd {
                condition: feature, ..
            })
            | MediaConditionWithoutOrType::Not(MediaNot {
                condition: feature, ..
            }) => !is_feature_taken(feature),
        })
    }

    fn visit_mut_rules(&mut self, n: &mut Vec<Rule>) {
        n.visit_mut_children_with(self);

        n.retain(|n| match n {
            Rule::AtRule(n) => n.name != *"custom-media",
            _ => true,
        });
    }
}

fn is_feature_taken(feature: &MediaInParens) -> bool {
    matches!(
        feature,
        MediaInParens::Feature(box MediaFeature::Boolean(MediaFeatureBoolean {
            name: MediaFeatureName::Ident(Ident {
                value: js_word!(""),
                ..
            }),
            ..
        }))
    )
}
