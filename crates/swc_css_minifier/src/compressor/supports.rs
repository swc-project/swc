use std::mem::take;

use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    fn is_first_supports_in_parens(&self, supports_condition: &SupportsCondition) -> bool {
        if let Some(SupportsConditionType::SupportsInParens(_)) =
            supports_condition.conditions.first()
        {
            true
        } else {
            false
        }
    }

    fn is_first_or_supports_type(&self, supports_condition: &SupportsCondition) -> bool {
        matches!(
            supports_condition.conditions.get(1),
            Some(SupportsConditionType::Or(_))
        )
    }

    fn is_first_and_supports_type(&self, supports_condition: &SupportsCondition) -> bool {
        matches!(
            supports_condition.conditions.get(1),
            Some(SupportsConditionType::And(_))
        )
    }

    pub(super) fn compress_supports_condition(&mut self, n: &mut SupportsCondition) {
        match n.conditions.get(1) {
            Some(SupportsConditionType::Or(_)) => {
                let need_compress = n.conditions.iter().any(|item| match item {
                    SupportsConditionType::SupportsInParens(
                        SupportsInParens::SupportsCondition(supports_condition),
                    ) if self.is_first_or_supports_type(supports_condition)
                        && self.is_first_supports_in_parens(supports_condition) =>
                    {
                        true
                    }
                    SupportsConditionType::Or(supports_or) => match &*supports_or.condition {
                        SupportsInParens::SupportsCondition(supports_condition)
                            if self.is_first_or_supports_type(supports_condition)
                                && self.is_first_supports_in_parens(supports_condition) =>
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
                        SupportsConditionType::SupportsInParens(
                            SupportsInParens::SupportsCondition(supports_condition),
                        ) if self.is_first_or_supports_type(&supports_condition) => {
                            let mut iter = supports_condition.conditions.into_iter();

                            if let Some(SupportsConditionType::SupportsInParens(
                                supports_in_parens,
                            )) = iter.next()
                            {
                                new_conditions.push(SupportsConditionType::SupportsInParens(
                                    supports_in_parens,
                                ));

                                new_conditions.extend(iter);
                            }
                        }
                        SupportsConditionType::Or(supports_or) => match *supports_or.condition {
                            SupportsInParens::SupportsCondition(supports_condition)
                                if self.is_first_or_supports_type(&supports_condition) =>
                            {
                                let mut iter = supports_condition.conditions.into_iter();

                                if let Some(SupportsConditionType::SupportsInParens(
                                    supports_in_parens,
                                )) = iter.next()
                                {
                                    new_conditions.push(SupportsConditionType::Or(SupportsOr {
                                        span: DUMMY_SP,
                                        keyword: None,
                                        condition: Box::new(supports_in_parens),
                                    }));

                                    new_conditions.extend(iter);
                                }
                            }
                            _ => {
                                new_conditions.push(SupportsConditionType::Or(supports_or));
                            }
                        },
                        _ => {
                            new_conditions.push(item);
                        }
                    }
                }

                n.conditions = new_conditions;
            }
            Some(SupportsConditionType::And(_)) => {
                let need_compress = n.conditions.iter().any(|item| match item {
                    SupportsConditionType::SupportsInParens(
                        SupportsInParens::SupportsCondition(supports_condition),
                    ) if self.is_first_and_supports_type(supports_condition)
                        && self.is_first_supports_in_parens(supports_condition) =>
                    {
                        true
                    }
                    SupportsConditionType::And(supports_and) => match &*supports_and.condition {
                        SupportsInParens::SupportsCondition(supports_condition)
                            if self.is_first_and_supports_type(supports_condition)
                                && self.is_first_supports_in_parens(supports_condition) =>
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
                        SupportsConditionType::SupportsInParens(
                            SupportsInParens::SupportsCondition(supports_condition),
                        ) if self.is_first_and_supports_type(&supports_condition) => {
                            let mut iter = supports_condition.conditions.into_iter();

                            if let Some(SupportsConditionType::SupportsInParens(
                                supports_in_parens,
                            )) = iter.next()
                            {
                                new_conditions.push(SupportsConditionType::SupportsInParens(
                                    supports_in_parens,
                                ));

                                new_conditions.extend(iter);
                            }
                        }
                        SupportsConditionType::And(supports_and) => match *supports_and.condition {
                            SupportsInParens::SupportsCondition(supports_condition)
                                if self.is_first_and_supports_type(&supports_condition) =>
                            {
                                let mut iter = supports_condition.conditions.into_iter();

                                if let Some(SupportsConditionType::SupportsInParens(
                                    supports_in_parens,
                                )) = iter.next()
                                {
                                    new_conditions.push(SupportsConditionType::And(SupportsAnd {
                                        span: DUMMY_SP,
                                        keyword: None,
                                        condition: Box::new(supports_in_parens),
                                    }));

                                    new_conditions.extend(iter);
                                }
                            }
                            _ => {
                                new_conditions.push(SupportsConditionType::And(supports_and));
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

    pub(super) fn compress_supports_in_parens(&mut self, n: &mut SupportsInParens) {
        match n {
            SupportsInParens::SupportsCondition(supports_condition)
                if supports_condition.conditions.len() == 1 =>
            {
                if let Some(SupportsConditionType::SupportsInParens(supports_in_parens)) =
                    supports_condition.conditions.get(0)
                {
                    *n = supports_in_parens.clone();
                }
            }
            _ => {}
        }
    }
}
