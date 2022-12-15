use std::mem::take;

use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;
use crate::{
    compressor::math::{is_calc_function_name, transform_calc_value_into_component_value},
    util::dedup,
};

impl Compressor {
    fn is_first_media_in_parens(&self, media_condition: &MediaCondition) -> bool {
        if let Some(MediaConditionAllType::MediaInParens(_)) = media_condition.conditions.first() {
            true
        } else {
            false
        }
    }

    fn is_first_or_media_type(&self, media_condition: &MediaCondition) -> bool {
        matches!(
            media_condition.conditions.get(1),
            Some(MediaConditionAllType::Or(_))
        )
    }

    fn is_first_and_media_type(&self, media_condition: &MediaCondition) -> bool {
        matches!(
            media_condition.conditions.get(1),
            Some(MediaConditionAllType::And(_))
        )
    }

    pub(super) fn compress_media_query_list(&mut self, media_query_list: &mut MediaQueryList) {
        dedup(&mut media_query_list.queries);
    }

    pub(super) fn compress_media_condition(&mut self, n: &mut MediaCondition) {
        match n.conditions.get(1) {
            Some(MediaConditionAllType::Or(_)) => {
                let need_compress = n.conditions.iter().any(|item| match item {
                    MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                        media_condition,
                    )) if self.is_first_or_media_type(media_condition)
                        && self.is_first_media_in_parens(media_condition) =>
                    {
                        true
                    }
                    MediaConditionAllType::Or(media_or) => match &media_or.condition {
                        MediaInParens::MediaCondition(media_condition)
                            if self.is_first_or_media_type(media_condition)
                                && self.is_first_media_in_parens(media_condition) =>
                        {
                            true
                        }
                        _ => false,
                    },
                    _ => false,
                });

                if !need_compress {
                    return;
                }

                let mut new_conditions = Vec::with_capacity(n.conditions.len());

                for item in take(&mut n.conditions) {
                    match item {
                        MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                            media_condition,
                        )) if self.is_first_or_media_type(&media_condition)
                            && self.is_first_media_in_parens(&media_condition) =>
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
                                if self.is_first_or_media_type(&media_condition)
                                    && self.is_first_media_in_parens(&media_condition) =>
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
                let need_compress = n.conditions.iter().any(|item| match item {
                    MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                        media_condition,
                    )) if self.is_first_and_media_type(media_condition)
                        && self.is_first_media_in_parens(media_condition) =>
                    {
                        true
                    }
                    MediaConditionAllType::And(media_and) => match &media_and.condition {
                        MediaInParens::MediaCondition(media_condition)
                            if self.is_first_and_media_type(media_condition)
                                && self.is_first_media_in_parens(media_condition) =>
                        {
                            true
                        }
                        _ => false,
                    },
                    _ => false,
                });

                if !need_compress {
                    return;
                }

                let mut new_conditions = Vec::with_capacity(n.conditions.len());

                for item in take(&mut n.conditions) {
                    match item {
                        MediaConditionAllType::MediaInParens(MediaInParens::MediaCondition(
                            media_condition,
                        )) if self.is_first_and_media_type(&media_condition)
                            && self.is_first_media_in_parens(&media_condition) =>
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
                                if self.is_first_and_media_type(&media_condition)
                                    && self.is_first_media_in_parens(&media_condition) =>
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
            let need_compress = n.conditions.iter().any(|item| match item {
                MediaConditionWithoutOrType::MediaInParens(MediaInParens::MediaCondition(
                    media_condition,
                )) if self.is_first_and_media_type(media_condition)
                    && self.is_first_media_in_parens(media_condition) =>
                {
                    true
                }
                MediaConditionWithoutOrType::And(media_and) => match &media_and.condition {
                    MediaInParens::MediaCondition(media_condition)
                        if self.is_first_and_media_type(media_condition)
                            && self.is_first_media_in_parens(media_condition) =>
                    {
                        true
                    }
                    _ => false,
                },
                _ => false,
            });

            if !need_compress {
                return;
            }

            let mut new_conditions = Vec::with_capacity(n.conditions.len());

            for item in take(&mut n.conditions) {
                match item {
                    MediaConditionWithoutOrType::MediaInParens(MediaInParens::MediaCondition(
                        media_condition,
                    )) if self.is_first_and_media_type(&media_condition)
                        && self.is_first_media_in_parens(&media_condition) =>
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
                            if self.is_first_and_media_type(&media_condition)
                                && self.is_first_media_in_parens(&media_condition) =>
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

    pub(super) fn compress_calc_sum_in_media_feature_value(&mut self, n: &mut MediaFeatureValue) {
        match n {
            MediaFeatureValue::Function(Function { name, value, .. })
                if is_calc_function_name(name) && value.len() == 1 =>
            {
                match &value[0] {
                    ComponentValue::CalcSum(box CalcSum {
                        expressions: calc_sum_expressions,
                        ..
                    }) if calc_sum_expressions.len() == 1 => match &calc_sum_expressions[0] {
                        CalcProductOrOperator::Product(CalcProduct {
                            expressions: calc_product_expressions,
                            ..
                        }) if calc_product_expressions.len() == 1 => {
                            if let CalcValueOrOperator::Value(calc_value) =
                                &calc_product_expressions[0]
                            {
                                match transform_calc_value_into_component_value(calc_value) {
                                    Some(ComponentValue::Function(function)) => {
                                        *n = MediaFeatureValue::Function(*function);
                                    }
                                    Some(ComponentValue::Dimension(dimension)) => {
                                        *n = MediaFeatureValue::Dimension(*dimension);
                                    }
                                    Some(ComponentValue::Number(number)) => {
                                        *n = MediaFeatureValue::Number(*number);
                                    }
                                    _ => {}
                                }
                            }
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
            _ => {}
        }
    }

    pub(super) fn compress_media_feature_value_length(&mut self, n: &mut MediaFeatureValue) {
        if let MediaFeatureValue::Dimension(Dimension::Length(length)) = n {
            if let Some(number) = self.length_to_zero(length) {
                *n = MediaFeatureValue::Number(number)
            }
        }
    }

    pub(super) fn compress_media_feature(&mut self, n: &mut MediaFeature) {
        match n {
            MediaFeature::Plain(MediaFeaturePlain {
                span,
                name: MediaFeatureName::Ident(name),
                value: box MediaFeatureValue::Number(value),
            }) => {
                if matches!(
                    name.value,
                    js_word!("min-color")
                        | js_word!("min-color-index")
                        | js_word!("min-monochrome")
                ) && value.value == 1.0
                {
                    *n = MediaFeature::Boolean(MediaFeatureBoolean {
                        span: *span,
                        name: MediaFeatureName::Ident(Ident {
                            span: name.span,
                            value: (*name.value).chars().skip(4).collect::<String>().into(),
                            raw: None,
                        }),
                    });
                }
            }
            MediaFeature::Range(range) => {
                if let MediaFeatureValue::Ident(name) = &*range.left {
                    if matches!(
                        name.value,
                        js_word!("color") | js_word!("color-index") | js_word!("monochrome")
                    ) && matches!(&*range.right, MediaFeatureValue::Number(number) if number.value == 1.0)
                        && range.comparison == MediaFeatureRangeComparison::Ge
                    {
                        *n = MediaFeature::Boolean(MediaFeatureBoolean {
                            span: range.span,
                            name: MediaFeatureName::Ident(name.clone()),
                        });
                    }
                } else if let MediaFeatureValue::Ident(name) = &*range.right {
                    if matches!(
                        name.value,
                        js_word!("color") | js_word!("color-index") | js_word!("monochrome")
                    ) && matches!(&*range.left, MediaFeatureValue::Number(number) if number.value == 1.0)
                        && range.comparison == MediaFeatureRangeComparison::Le
                    {
                        *n = MediaFeature::Boolean(MediaFeatureBoolean {
                            span: range.span,
                            name: MediaFeatureName::Ident(name.clone()),
                        });
                    }
                }
            }
            _ => {}
        }
    }
}
