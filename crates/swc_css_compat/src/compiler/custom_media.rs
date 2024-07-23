use std::mem::take;

use swc_common::{util::take::Take, DUMMY_SP};
use swc_css_ast::{
    AtRule, AtRuleName, AtRulePrelude, CustomMediaQuery, CustomMediaQueryMediaType, Ident,
    MediaCondition, MediaConditionAllType, MediaConditionType, MediaConditionWithoutOr,
    MediaConditionWithoutOrType, MediaFeatureBoolean, MediaFeatureName, MediaInParens, MediaOr,
    MediaQuery, MediaType, Rule,
};

#[derive(Debug, Default)]
pub(super) struct CustomMediaHandler {
    modifier_and_media_type: Option<(Option<Ident>, Option<MediaType>)>,
    medias: Vec<CustomMediaQuery>,
}

impl CustomMediaHandler {
    pub(crate) fn store_custom_media(&mut self, n: &mut AtRule) {
        if let AtRuleName::Ident(..) = &n.name {
            if let Some(AtRulePrelude::CustomMediaPrelude(prelude)) = &mut n.prelude.as_deref_mut()
            {
                self.medias.push(prelude.take());
            }
        }
    }

    pub(crate) fn process_rules(&mut self, n: &mut Vec<Rule>) {
        n.retain(|n| match n {
            Rule::AtRule(n) => {
                if matches!(
                    n.prelude.as_deref(),
                    Some(AtRulePrelude::CustomMediaPrelude(..))
                ) {
                    return false;
                }

                true
            }
            _ => true,
        });
    }

    pub(crate) fn process_media_query(&mut self, n: &mut MediaQuery) {
        // Limited support for `modifier` and `media_type`, it is impossible to lowering
        // syntax for multiple media types, so we handle only case when only one media
        // type exists.
        if let Some((modifier, media_type)) = self.modifier_and_media_type.take() {
            n.modifier = modifier;
            n.media_type = media_type;

            if let Some(condition) = &mut n.condition {
                match &mut **condition {
                    MediaConditionType::WithoutOr(condition) => {
                        if condition.conditions.is_empty() {
                            n.condition = None;
                        }
                    }
                    MediaConditionType::All(condition) => {
                        if condition.conditions.is_empty() {
                            n.condition = None;
                        }
                    }
                }
            }
        }

        self.modifier_and_media_type = None;
    }

    pub(crate) fn process_media_condition(&mut self, media_condition: &mut MediaCondition) {
        let mut remove_rules_list = Vec::new();

        for (i, node) in media_condition.conditions.iter_mut().enumerate() {
            match node {
                MediaConditionAllType::Not(media_not) => {
                    if let Some(new_media_in_parens) =
                        self.process_media_in_parens(&media_not.condition)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            media_not.condition = new_media_in_parens;
                        }
                    }
                }
                MediaConditionAllType::And(media_and) => {
                    if let Some(new_media_in_parens) =
                        self.process_media_in_parens(&media_and.condition)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            media_and.condition = new_media_in_parens;
                        }
                    }
                }
                MediaConditionAllType::Or(media_or) => {
                    if let Some(new_media_in_parens) =
                        self.process_media_in_parens(&media_or.condition)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            media_or.condition = new_media_in_parens;
                        }
                    }
                }
                MediaConditionAllType::MediaInParens(media_in_parens) => {
                    if let Some(new_media_in_parens) = self.process_media_in_parens(media_in_parens)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            *media_in_parens = new_media_in_parens;
                        }
                    }
                }
            }
        }

        if !remove_rules_list.is_empty() {
            let mut need_change_next = false;

            media_condition.conditions = take(&mut media_condition.conditions)
                .into_iter()
                .enumerate()
                .filter_map(|(idx, value)| {
                    if remove_rules_list.contains(&idx) {
                        if idx == 0 {
                            need_change_next = true;
                        }

                        None
                    } else if need_change_next {
                        need_change_next = false;

                        match value {
                            MediaConditionAllType::And(media_and) => {
                                Some(MediaConditionAllType::MediaInParens(media_and.condition))
                            }
                            MediaConditionAllType::Or(media_and) => {
                                Some(MediaConditionAllType::MediaInParens(media_and.condition))
                            }
                            _ => Some(value),
                        }
                    } else {
                        Some(value)
                    }
                })
                .collect::<Vec<_>>();
        }
    }

    pub(crate) fn process_media_condition_without_or(
        &mut self,
        media_condition: &mut MediaConditionWithoutOr,
    ) {
        let mut remove_rules_list = Vec::new();

        for (i, node) in media_condition.conditions.iter_mut().enumerate() {
            match node {
                MediaConditionWithoutOrType::Not(media_not) => {
                    if let Some(new_media_in_parens) =
                        self.process_media_in_parens(&media_not.condition)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            media_not.condition = new_media_in_parens;
                        }
                    }
                }
                MediaConditionWithoutOrType::And(media_and) => {
                    if let Some(new_media_in_parens) =
                        self.process_media_in_parens(&media_and.condition)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            media_and.condition = new_media_in_parens;
                        }
                    }
                }
                MediaConditionWithoutOrType::MediaInParens(media_in_parens) => {
                    if let Some(new_media_in_parens) = self.process_media_in_parens(media_in_parens)
                    {
                        if self.is_empty_media_parens(&new_media_in_parens) {
                            remove_rules_list.push(i);
                        } else {
                            *media_in_parens = new_media_in_parens;
                        }
                    }
                }
            }
        }

        if !remove_rules_list.is_empty() {
            let mut need_change_next = false;

            media_condition.conditions = take(&mut media_condition.conditions)
                .into_iter()
                .enumerate()
                .filter_map(|(idx, value)| {
                    if remove_rules_list.contains(&idx) {
                        if idx == 0 {
                            need_change_next = true;
                        }

                        None
                    } else if need_change_next {
                        need_change_next = false;

                        match value {
                            MediaConditionWithoutOrType::And(media_and) => Some(
                                MediaConditionWithoutOrType::MediaInParens(media_and.condition),
                            ),
                            _ => Some(value),
                        }
                    } else {
                        Some(value)
                    }
                })
                .collect::<Vec<_>>();
        }
    }

    pub(crate) fn process_media_in_parens(&mut self, n: &MediaInParens) -> Option<MediaInParens> {
        if let Some(MediaFeatureBoolean {
            name: MediaFeatureName::ExtensionName(name),
            ..
        }) = n.as_feature().and_then(|feature| feature.as_boolean())
        {
            if let Some(custom_media) = self.medias.iter().find(|m| m.name.value == name.value) {
                let mut new_media_condition = MediaCondition {
                    span: DUMMY_SP,
                    conditions: Vec::new(),
                };

                let queries = match &custom_media.media {
                    CustomMediaQueryMediaType::Ident(_) => {
                        // TODO make me warning, we should keep code as is in such cases
                        unimplemented!(
                            "Boolean logic in @custom-media at-rules is not supported by swc"
                        );
                    }
                    CustomMediaQueryMediaType::MediaQueryList(media_query_list) => {
                        &media_query_list.queries
                    }
                };

                for query in queries {
                    if query.media_type.is_some() || query.modifier.is_some() {
                        // TODO throw a warning on multiple media types
                        self.modifier_and_media_type =
                            Some((query.modifier.clone(), query.media_type.clone()));
                    }

                    if let Some(condition) = &query.condition {
                        match &**condition {
                            MediaConditionType::All(media_condition) => {
                                if new_media_condition.conditions.is_empty() {
                                    if media_condition.conditions.len() == 1 {
                                        let media_in_parens = if let Some(
                                            MediaConditionAllType::MediaInParens(inner),
                                        ) =
                                            media_condition.conditions.first()
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
                                } else if let Some(MediaConditionAllType::MediaInParens(inner)) =
                                    media_condition.conditions.first()
                                {
                                    new_media_condition
                                        .conditions
                                        .push(MediaConditionAllType::Or(MediaOr {
                                            span: DUMMY_SP,
                                            keyword: None,
                                            condition: inner.clone(),
                                        }));
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
                            MediaConditionType::WithoutOr(media_condition) => {
                                let mut media_condition = self
                                    .media_condition_without_or_to_media_condition(media_condition);

                                if new_media_condition.conditions.is_empty() {
                                    let media_in_parens = if matches!(
                                        media_condition.conditions.first(),
                                        Some(MediaConditionAllType::MediaInParens(_))
                                    ) {
                                        match media_condition.conditions.pop() {
                                            Some(MediaConditionAllType::MediaInParens(inner)) => {
                                                inner
                                            }
                                            _ => {
                                                unreachable!();
                                            }
                                        }
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
                                                media_condition,
                                            ),
                                        }));
                                }
                            }
                        }
                    }
                }

                if new_media_condition.conditions.len() == 1
                    && matches!(
                        new_media_condition.conditions.first(),
                        Some(MediaConditionAllType::MediaInParens(_))
                    )
                {
                    let only_one = new_media_condition.conditions.pop().unwrap();

                    if let MediaConditionAllType::MediaInParens(media_in_parens) = only_one {
                        return Some(media_in_parens);
                    }
                }

                return Some(MediaInParens::MediaCondition(new_media_condition));
            }
        }

        None
    }

    fn media_condition_without_or_to_media_condition(
        &self,
        media_condition: &MediaConditionWithoutOr,
    ) -> MediaCondition {
        let mut new_media_condition = MediaCondition {
            span: DUMMY_SP,
            conditions: Vec::new(),
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

    fn is_empty_media_parens(&self, media_in_parens: &MediaInParens) -> bool {
        if let MediaInParens::MediaCondition(MediaCondition { conditions, .. }) = media_in_parens {
            if conditions.is_empty() {
                return true;
            }
        }

        false
    }
}
