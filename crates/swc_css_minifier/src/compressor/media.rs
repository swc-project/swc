use std::mem::take;

use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_media_condition(&mut self, n: &mut MediaCondition) {
        match n.conditions.get(1) {
            Some(MediaConditionAllType::Or(_)) => {
                let mut new_conditions = Vec::with_capacity(n.conditions.len());

                for item in take(&mut n.conditions) {
                    match item {
                        MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                            media_condition,
                        )) if matches!(
                            media_condition.conditions.get(1),
                            Some(MediaConditionAllType::Or(_))
                        ) =>
                        {
                            let mut iter = media_condition.conditions.into_iter();

                            if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                                iter.next()
                            {
                                new_conditions
                                    .push(MediaConditionAllType::MediaInParens(media_in_parens));

                                new_conditions.extend(iter);
                            }
                        }
                        MediaConditionAllType::Or(media_or) => match media_or.condition {
                            MediaInParens::MediaCondition(media_condition)
                                if matches!(
                                    media_condition.conditions.get(1),
                                    Some(MediaConditionAllType::Or(_))
                                ) =>
                            {
                                let mut iter = media_condition.conditions.into_iter();

                                if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                                    iter.next()
                                {
                                    new_conditions.push(MediaConditionAllType::Or(MediaOr {
                                        span: DUMMY_SP,
                                        keyword: None,
                                        condition: media_in_parens,
                                    }));

                                    new_conditions.extend(iter);
                                }
                            }
                            _ => {
                                new_conditions.push(MediaConditionAllType::Or(media_or));
                            }
                        },
                        _ => {
                            new_conditions.push(item);
                        }
                    }
                }

                n.conditions = new_conditions;
            }
            Some(MediaConditionAllType::And(_)) => {
                let mut new_conditions = Vec::with_capacity(n.conditions.len());

                for item in take(&mut n.conditions) {
                    match item {
                        MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                            media_condition,
                        )) if matches!(
                            media_condition.conditions.get(1),
                            Some(MediaConditionAllType::And(_))
                        ) =>
                        {
                            let mut iter = media_condition.conditions.into_iter();

                            if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                                iter.next()
                            {
                                new_conditions
                                    .push(MediaConditionAllType::MediaInParens(media_in_parens));

                                new_conditions.extend(iter);
                            }
                        }
                        MediaConditionAllType::And(media_and) => match media_and.condition {
                            MediaInParens::MediaCondition(media_condition)
                                if matches!(
                                    media_condition.conditions.get(1),
                                    Some(MediaConditionAllType::And(_))
                                ) =>
                            {
                                let mut iter = media_condition.conditions.into_iter();

                                if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                                    iter.next()
                                {
                                    new_conditions.push(MediaConditionAllType::And(MediaAnd {
                                        span: DUMMY_SP,
                                        keyword: None,
                                        condition: media_in_parens,
                                    }));

                                    new_conditions.extend(iter);
                                }
                            }
                            _ => {
                                new_conditions.push(MediaConditionAllType::And(media_and));
                            }
                        },
                        _ => {
                            new_conditions.push(item);
                        }
                    }
                }

                n.conditions = new_conditions;
            }
            _ => {}
        }
    }

    pub(super) fn compress_media_condition_without_or(&mut self, n: &mut MediaConditionWithoutOr) {
        if let Some(MediaConditionWithoutOrType::And(_)) = n.conditions.get(1) {
            let mut new_conditions = Vec::with_capacity(n.conditions.len());

            for item in take(&mut n.conditions) {
                match item {
                    MediaConditionWithoutOrType::MediaInParens(MediaInParens::MediaCondition(
                        media_condition,
                    )) if matches!(
                        media_condition.conditions.get(1),
                        Some(MediaConditionAllType::And(_))
                    ) =>
                    {
                        let mut iter = media_condition.conditions.into_iter();

                        if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                            iter.next()
                        {
                            new_conditions
                                .push(MediaConditionWithoutOrType::MediaInParens(media_in_parens));

                            for new_item in iter {
                                match new_item {
                                    MediaConditionAllType::Not(media_not) => {
                                        new_conditions
                                            .push(MediaConditionWithoutOrType::Not(media_not));
                                    }
                                    MediaConditionAllType::And(media_and) => {
                                        new_conditions
                                            .push(MediaConditionWithoutOrType::And(media_and));
                                    }
                                    MediaConditionAllType::MediaInParens(media_in_parens) => {
                                        new_conditions.push(
                                            MediaConditionWithoutOrType::MediaInParens(
                                                media_in_parens,
                                            ),
                                        );
                                    }
                                    _ => {
                                        unreachable!();
                                    }
                                }
                            }
                        }
                    }
                    MediaConditionWithoutOrType::And(media_and) => match media_and.condition {
                        MediaInParens::MediaCondition(media_condition)
                            if matches!(
                                media_condition.conditions.get(1),
                                Some(MediaConditionAllType::And(_))
                            ) =>
                        {
                            let mut iter = media_condition.conditions.into_iter();

                            if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                                iter.next()
                            {
                                new_conditions.push(MediaConditionWithoutOrType::And(MediaAnd {
                                    span: DUMMY_SP,
                                    keyword: None,
                                    condition: media_in_parens,
                                }));

                                for new_item in iter {
                                    match new_item {
                                        MediaConditionAllType::Not(media_not) => {
                                            new_conditions
                                                .push(MediaConditionWithoutOrType::Not(media_not));
                                        }
                                        MediaConditionAllType::And(media_and) => {
                                            new_conditions
                                                .push(MediaConditionWithoutOrType::And(media_and));
                                        }
                                        MediaConditionAllType::MediaInParens(media_in_parens) => {
                                            new_conditions.push(
                                                MediaConditionWithoutOrType::MediaInParens(
                                                    media_in_parens,
                                                ),
                                            );
                                        }
                                        _ => {
                                            unreachable!();
                                        }
                                    }
                                }
                            }
                        }
                        _ => {
                            new_conditions.push(MediaConditionWithoutOrType::And(media_and));
                        }
                    },
                    _ => {
                        new_conditions.push(item);
                    }
                }
            }

            n.conditions = new_conditions;
        }
    }

    pub(super) fn compress_media_in_parens(&mut self, n: &mut MediaInParens) {
        match n {
            MediaInParens::MediaCondition(media_condition)
                if media_condition.conditions.len() == 1 =>
            {
                if let Some(MediaConditionAllType::MediaInParens(media_in_parens)) =
                    media_condition.conditions.get(0)
                {
                    *n = media_in_parens.clone();
                }
            }
            _ => {}
        }
    }
}
