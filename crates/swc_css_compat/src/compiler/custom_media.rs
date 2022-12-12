use swc_common::{util::take::Take, DUMMY_SP};
use swc_css_ast::{
    AtRule, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, MediaCondition,
    MediaConditionAllType, MediaConditionType, MediaConditionWithoutOr,
    MediaConditionWithoutOrType, MediaFeature, MediaFeatureBoolean, MediaFeatureName,
    MediaInParens, MediaOr,
};

#[derive(Debug, Default)]
pub(super) struct CustomMediaHandler {
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaHandler {
    pub(crate) fn store_custom_media(&mut self, n: &mut AtRule) {
        if n.name == *"custom-media" {
            if let Some(box AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude {
                self.medias.push(prelude.take());
            }
        }
    }

    pub(crate) fn process_media_in_parens(&mut self, n: &mut MediaInParens) {
        if let MediaInParens::Feature(box MediaFeature::Boolean(MediaFeatureBoolean {
            name: MediaFeatureName::Ident(name),
            ..
        })) = n
        {
            if let Some(custom_media) = self.medias.iter().find(|m| m.name.value == name.value) {
                let mut new_media_condition = MediaCondition {
                    span: DUMMY_SP,
                    conditions: vec![],
                };

                let queries = match &custom_media.media {
                    CustomMediaQueryMediaType::Ident(_) => {
                        // TODO make me warning, we should keep code as is in such cases
                        unimplemented!(
                            "Boolean logic in @custom-media rules is not supported by swc"
                        );
                    }
                    CustomMediaQueryMediaType::MediaQueryList(media_query_list) => {
                        &media_query_list.queries
                    }
                };

                for query in queries {
                    for condition in &query.condition {
                        match &**condition {
                            MediaConditionType::All(media_condition) => {
                                if new_media_condition.conditions.is_empty() {
                                    if media_condition.conditions.len() == 1 {
                                        let media_in_parens = if let Some(
                                            MediaConditionAllType::MediaInParens(inner),
                                        ) =
                                            media_condition.conditions.get(0)
                                        {
                                            inner.clone()
                                        } else {
                                            MediaInParens::MediaCondition(media_condition.clone())
                                        };

                                        new_media_condition.conditions.push(
                                            MediaConditionAllType::MediaInParens(media_in_parens),
                                        );
                                    } else {
                                        new_media_condition.conditions.push(
                                            MediaConditionAllType::MediaInParens(
                                                MediaInParens::MediaCondition(
                                                    media_condition.clone(),
                                                ),
                                            ),
                                        );
                                    }
                                } else {
                                    if let Some(MediaConditionAllType::MediaInParens(inner)) =
                                        media_condition.conditions.get(0)
                                    {
                                        new_media_condition.conditions.push(
                                            MediaConditionAllType::Or(MediaOr {
                                                span: DUMMY_SP,
                                                keyword: None,
                                                condition: inner.clone(),
                                            }),
                                        );
                                    } else {
                                        new_media_condition.conditions.push(
                                            MediaConditionAllType::Or(MediaOr {
                                                span: DUMMY_SP,
                                                keyword: None,
                                                condition: MediaInParens::MediaCondition(
                                                    media_condition.clone(),
                                                ),
                                            }),
                                        );
                                    }
                                }
                            }
                            MediaConditionType::WithoutOr(media_condition) => {
                                let media_condition = self
                                    .media_condition_without_or_to_media_condition(media_condition);

                                if new_media_condition.conditions.is_empty() {
                                    let media_in_parens =
                                        if let Some(MediaConditionAllType::MediaInParens(inner)) =
                                            media_condition.conditions.get(0)
                                        {
                                            inner.clone()
                                        } else {
                                            MediaInParens::MediaCondition(media_condition)
                                        };

                                    new_media_condition.conditions.push(
                                        MediaConditionAllType::MediaInParens(media_in_parens),
                                    );
                                } else {
                                    new_media_condition
                                        .conditions
                                        .push(MediaConditionAllType::Or(MediaOr {
                                            span: DUMMY_SP,
                                            keyword: None,
                                            condition: MediaInParens::MediaCondition(
                                                media_condition.clone(),
                                            ),
                                        }));
                                }
                            }
                        }
                    }
                }

                if new_media_condition.conditions.len() == 1 {
                    if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                        new_media_condition.conditions.get(0)
                    {
                        *n = media_in_parens.clone();
                    } else {
                        *n = MediaInParens::MediaCondition(new_media_condition);
                    }
                } else {
                    *n = MediaInParens::MediaCondition(new_media_condition);
                }
            }
        }
    }

    fn media_condition_without_or_to_media_condition(
        &self,
        media_condition: &MediaConditionWithoutOr,
    ) -> MediaCondition {
        let mut new_media_condition = MediaCondition {
            span: DUMMY_SP,
            conditions: vec![],
        };

        for n in &media_condition.conditions {
            let condition = match n {
                MediaConditionWithoutOrType::MediaInParens(n) => {
                    MediaConditionAllType::MediaInParens(n.clone())
                }
                MediaConditionWithoutOrType::And(n) => MediaConditionAllType::And(n.clone()),
                MediaConditionWithoutOrType::Not(n) => MediaConditionAllType::Not(n.clone()),
            };

            new_media_condition.conditions.push(condition);
        }

        new_media_condition
    }
}
