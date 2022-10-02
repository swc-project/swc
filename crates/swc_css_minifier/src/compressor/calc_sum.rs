use std::collections::HashMap;

use swc_atoms::js_word;
use swc_css_ast::*;

use super::{unit::*, Compressor};

fn is_calc_function_name(ident: &Ident) -> bool {
    ident.value.to_ascii_lowercase() == js_word!("calc")
        || ident.value.to_ascii_lowercase() == js_word!("-webkit-calc")
        || ident.value.to_ascii_lowercase() == js_word!("-moz-calc")
}

// transform "(simple calc-value)" into "simple calc-value"
fn remove_unnecessary_nesting_from_calc_sum(calc_sum: &mut CalcSum) {
    if calc_sum.expressions.len() == 1 {
        match calc_sum.expressions.get(0).unwrap() {
            CalcProductOrOperator::Product(CalcProduct {
                expressions: calc_product_expressions,
                ..
            }) if calc_product_expressions.len() == 1 => {
                if let CalcValueOrOperator::Value(CalcValue::Sum(CalcSum {
                    expressions: nested_expressions,
                    span: nested_span,
                })) = calc_product_expressions.get(0).unwrap()
                {
                    calc_sum.span = *nested_span;
                    calc_sum.expressions = nested_expressions.to_vec();
                }
            }
            _ => {}
        }
    }
}

fn try_to_extract_into_calc_value(calc_sum: &CalcSum) -> Option<CalcValue> {
    if calc_sum.expressions.len() == 1 {
        return match calc_sum.expressions.get(0).unwrap() {
            CalcProductOrOperator::Product(CalcProduct {
                expressions: calc_product_expressions,
                ..
            }) if calc_product_expressions.len() == 1 => {
                match calc_product_expressions.get(0).unwrap() {
                    CalcValueOrOperator::Value(calc_value) => Some(calc_value.clone()),
                    _ => None,
                }
            }
            _ => None,
        };
    }

    None
}

fn transform_calc_value_into_component_value(calc_value: &CalcValue) -> ComponentValue {
    match &calc_value {
        CalcValue::Number(n) => ComponentValue::Number(n.clone()),
        CalcValue::Dimension(Dimension::Length(l)) => {
            ComponentValue::Dimension(Dimension::Length(Length {
                span: l.span,
                value: l.value.clone(),
                unit: l.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::Angle(a)) => {
            ComponentValue::Dimension(Dimension::Angle(Angle {
                span: a.span,
                value: a.value.clone(),
                unit: a.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::Time(t)) => {
            ComponentValue::Dimension(Dimension::Time(Time {
                span: t.span,
                value: t.value.clone(),
                unit: t.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::Frequency(f)) => {
            ComponentValue::Dimension(Dimension::Frequency(Frequency {
                span: f.span,
                value: f.value.clone(),
                unit: f.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::Resolution(r)) => {
            ComponentValue::Dimension(Dimension::Resolution(Resolution {
                span: r.span,
                value: r.value.clone(),
                unit: r.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::Flex(f)) => {
            ComponentValue::Dimension(Dimension::Flex(Flex {
                span: f.span,
                value: f.value.clone(),
                unit: f.unit.clone(),
            }))
        }
        CalcValue::Dimension(Dimension::UnknownDimension(u)) => {
            ComponentValue::Dimension(Dimension::UnknownDimension(UnknownDimension {
                span: u.span,
                value: u.value.clone(),
                unit: u.unit.clone(),
            }))
        }
        CalcValue::Percentage(p) => ComponentValue::Percentage(Percentage {
            span: p.span,
            value: p.value.clone(),
        }),
        CalcValue::Constant(c) => ComponentValue::Ident(c.clone()),
        CalcValue::Function(f) => ComponentValue::Function(Function {
            span: f.span,
            name: f.name.clone(),
            value: f.value.to_vec(),
        }),
        CalcValue::Sum(_) => {
            unreachable!("CalcValue::Sum cannot be transformed into a ComponentValue")
        }
    }
}

// We want to track the position of data (dimension, percentage, operator...) in
// a Vec<CalcProductOrOperator>
#[derive(Debug, Clone)]
struct IndexedData<T> {
    pos: usize,
    data: T,
}

#[derive(Debug, Clone)]
struct IndexedOperatorAndOperand<T> {
    operator: Option<IndexedData<CalcOperator>>,
    operand: IndexedData<T>,
}

type SumOperation = fn(v1: f64, v2: f64) -> f64;

const SUM_OPERATION_ADD: SumOperation = |v1, v2| v1 + v2;
const SUM_OPERATION_SUBTRACT: SumOperation = |v1, v2| v1 - v2;

struct CalcSumContext {
    number: Option<IndexedOperatorAndOperand<Number>>,
    percentage: Option<IndexedOperatorAndOperand<Percentage>>,
    absolute_length: Option<IndexedOperatorAndOperand<Length>>,
    other_lengths: HashMap<String, IndexedOperatorAndOperand<Length>>,
    angle: Option<IndexedOperatorAndOperand<Angle>>,
    duration: Option<IndexedOperatorAndOperand<Time>>,
    frequency: Option<IndexedOperatorAndOperand<Frequency>>,
    resolution: Option<IndexedOperatorAndOperand<Resolution>>,
    flex: Option<IndexedOperatorAndOperand<Flex>>,
    unknown_dimension: HashMap<String, IndexedOperatorAndOperand<UnknownDimension>>,
    expressions: Vec<CalcProductOrOperator>,
}

impl CalcSumContext {
    pub fn new() -> Self {
        Self {
            number: None,
            percentage: None,
            absolute_length: None,
            other_lengths: HashMap::new(),
            angle: None,
            duration: None,
            frequency: None,
            resolution: None,
            flex: None,
            unknown_dimension: HashMap::new(),
            expressions: vec![],
        }
    }

    pub fn fold(&mut self, calc_sum: &mut CalcSum) {
        self.nested_fold(&None, calc_sum);
        calc_sum.expressions = self.expressions.to_vec();
        remove_unnecessary_nesting_from_calc_sum(calc_sum);
    }

    fn nested_fold(&mut self, surrounding_operator: &Option<CalcOperator>, calc_sum: &mut CalcSum) {
        let mut operator: Option<CalcOperator> =
            CalcSumContext::merge_operators(&surrounding_operator, &None);

        let mut expr_it = calc_sum.expressions.iter_mut();
        while let Some(calc_product_or_operator) = expr_it.next() {
            match calc_product_or_operator {
                CalcProductOrOperator::Product(calc_product) => {
                    fold_calc_product(calc_product);
                    self.push(&operator, calc_product);
                }
                _ => {
                    // We should have an operand
                    return;
                }
            };

            if let Some(CalcProductOrOperator::Operator(op)) = expr_it.next() {
                operator =
                    CalcSumContext::merge_operators(&surrounding_operator, &Some(op.clone()));
            }
        }
    }

    fn merge_operators(
        surrounding_operator: &Option<CalcOperator>,
        nested_operator: &Option<CalcOperator>,
    ) -> Option<CalcOperator> {
        match nested_operator {
            None => (*surrounding_operator).clone(),
            Some(no) => match surrounding_operator {
                None
                | Some(CalcOperator {
                    value: CalcOperatorType::Add,
                    ..
                }) => (*nested_operator).clone(),
                Some(CalcOperator {
                    value: CalcOperatorType::Sub,
                    ..
                }) => Some(CalcOperator {
                    span: no.span,
                    value: if no.value == CalcOperatorType::Sub {
                        CalcOperatorType::Add
                    } else {
                        CalcOperatorType::Sub
                    },
                }),
                _ => unreachable!("Operator value can only be Add or Sub"),
            },
        }
    }

    fn push(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct) {
        if operand.expressions.len() == 1 {
            match operand.expressions.get(0).unwrap() {
                CalcValueOrOperator::Value(CalcValue::Number(n)) => {
                    self.sum_number(&operator, operand, n);
                }
                CalcValueOrOperator::Value(CalcValue::Percentage(p)) => {
                    self.sum_percentage(&operator, operand, p);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Length(l))) => {
                    self.sum_length(&operator, operand, l);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Angle(a))) => {
                    self.sum_angle(&operator, operand, a);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Time(d))) => {
                    self.sum_duration(&operator, operand, d);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Frequency(f))) => {
                    self.sum_frequency(&operator, operand, f);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Resolution(r))) => {
                    self.sum_resolution(&operator, operand, r);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Flex(f))) => {
                    self.sum_flex(&operator, operand, f);
                }
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::UnknownDimension(
                    u,
                ))) => {
                    self.sum_unknown_dimension(&operator, operand, u);
                }
                CalcValueOrOperator::Value(CalcValue::Sum(s)) => {
                    let mut sum = s.clone();
                    self.nested_fold(operator, &mut sum);
                }
                _ => {
                    // Other cases (constant, function...), just push the data
                    if let Some(op) = operator {
                        self.expressions
                            .push(CalcProductOrOperator::Operator(op.clone()));
                    }

                    self.expressions
                        .push(CalcProductOrOperator::Product(operand.clone()));
                }
            }
        } else {
            // The calc product is not "simple", just push the data
            if let Some(op) = operator {
                self.expressions
                    .push(CalcProductOrOperator::Operator(op.clone()));
            }

            self.expressions
                .push(CalcProductOrOperator::Product(operand.clone()));
        }
    }

    fn sum_number(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct, n: &Number) {
        match &mut self.number {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value =
                    CalcSumContext::sum_values(prev_operator, operator, data.value, n.value);

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Number(data.clone())),
                );
            }
            None => self.number = Some(self.new_indexed_data(operator, operand, n.clone())),
        }
    }

    fn sum_percentage(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        p: &Percentage,
    ) {
        match &mut self.percentage {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value.value = CalcSumContext::sum_values(
                    prev_operator,
                    operator,
                    data.value.value,
                    p.value.value,
                );

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Percentage(data.clone())),
                );
            }
            None => self.percentage = Some(self.new_indexed_data(operator, operand, p.clone())),
        }
    }

    fn sum_length(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct, l: &Length) {
        let unit = l.unit.value.to_ascii_lowercase();
        if is_absolute_length(&unit) {
            self.sum_absolute_length(operator, operand, l)
        } else {
            self.sum_other_length(operator, operand, l)
        }
    }

    fn sum_absolute_length(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        l: &Length,
    ) {
        match &mut self.absolute_length {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                let prev_unit = data.unit.value.to_ascii_lowercase();
                let unit = l.unit.value.to_ascii_lowercase();
                if let Some(ratio) = get_absolute_length_ratio(&prev_unit, &unit) {
                    data.value.value = CalcSumContext::sum_values(
                        prev_operator,
                        operator,
                        data.value.value,
                        l.value.value * ratio,
                    );

                    CalcSumContext::switch_sign_if_needed(
                        &mut self.expressions,
                        &mut data.value.value,
                        prev_operator,
                    );
                    CalcSumContext::update_calc_value(
                        &mut self.expressions,
                        *pos,
                        CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Length(
                            data.clone(),
                        ))),
                    );
                }
            }
            None => {
                self.absolute_length = Some(self.new_indexed_data(operator, operand, l.clone()))
            }
        }
    }

    fn sum_other_length(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        l: &Length,
    ) {
        let unit = l.unit.value.to_ascii_lowercase().to_string();
        match &mut self.other_lengths.get_mut(&unit) {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value.value = CalcSumContext::sum_values(
                    prev_operator,
                    operator,
                    data.value.value,
                    l.value.value,
                );

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Length(
                        data.clone(),
                    ))),
                );
            }
            None => {
                let indexed_data: IndexedOperatorAndOperand<Length> =
                    self.new_indexed_data(operator, operand, l.clone());
                self.other_lengths.insert(unit, indexed_data);
            }
        }
    }

    fn sum_angle(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct, a: &Angle) {
        match &mut self.angle {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value.value = CalcSumContext::sum_values(
                    prev_operator,
                    operator,
                    data.value.value,
                    a.value.value,
                );

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Angle(
                        data.clone(),
                    ))),
                );
            }
            None => self.angle = Some(self.new_indexed_data(operator, operand, a.clone())),
        }
    }

    fn sum_duration(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct, d: &Time) {
        match &mut self.duration {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                let prev_unit = data.unit.value.to_ascii_lowercase();
                let unit = d.unit.value.to_ascii_lowercase();
                if let Some(ratio) = get_duration_ratio(&prev_unit, &unit) {
                    data.value.value = CalcSumContext::sum_values(
                        prev_operator,
                        operator,
                        data.value.value,
                        d.value.value * ratio,
                    );

                    CalcSumContext::switch_sign_if_needed(
                        &mut self.expressions,
                        &mut data.value.value,
                        prev_operator,
                    );
                    CalcSumContext::update_calc_value(
                        &mut self.expressions,
                        *pos,
                        CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Time(
                            data.clone(),
                        ))),
                    );
                }
            }
            None => self.duration = Some(self.new_indexed_data(operator, operand, d.clone())),
        }
    }

    fn sum_frequency(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        d: &Frequency,
    ) {
        match &mut self.frequency {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                let prev_unit = data.unit.value.to_ascii_lowercase();
                let unit = d.unit.value.to_ascii_lowercase();
                if let Some(ratio) = get_frequency_ratio(&prev_unit, &unit) {
                    data.value.value = CalcSumContext::sum_values(
                        prev_operator,
                        operator,
                        data.value.value,
                        d.value.value * ratio,
                    );

                    CalcSumContext::switch_sign_if_needed(
                        &mut self.expressions,
                        &mut data.value.value,
                        prev_operator,
                    );
                    CalcSumContext::update_calc_value(
                        &mut self.expressions,
                        *pos,
                        CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Frequency(
                            data.clone(),
                        ))),
                    );
                }
            }
            None => self.frequency = Some(self.new_indexed_data(operator, operand, d.clone())),
        }
    }

    fn sum_resolution(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        r: &Resolution,
    ) {
        match &mut self.resolution {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                let prev_unit = data.unit.value.to_ascii_lowercase();
                let unit = r.unit.value.to_ascii_lowercase();
                if let Some(ratio) = get_resolution_ratio(&prev_unit, &unit) {
                    data.value.value = CalcSumContext::sum_values(
                        prev_operator,
                        operator,
                        data.value.value,
                        r.value.value * ratio,
                    );

                    CalcSumContext::switch_sign_if_needed(
                        &mut self.expressions,
                        &mut data.value.value,
                        prev_operator,
                    );
                    CalcSumContext::update_calc_value(
                        &mut self.expressions,
                        *pos,
                        CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Resolution(
                            data.clone(),
                        ))),
                    );
                }
            }
            None => self.resolution = Some(self.new_indexed_data(operator, operand, r.clone())),
        }
    }

    fn sum_flex(&mut self, operator: &Option<CalcOperator>, operand: &CalcProduct, f: &Flex) {
        match &mut self.flex {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value.value = CalcSumContext::sum_values(
                    prev_operator,
                    operator,
                    data.value.value,
                    f.value.value,
                );

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Flex(data.clone()))),
                );
            }
            None => self.flex = Some(self.new_indexed_data(operator, operand, f.clone())),
        }
    }

    fn sum_unknown_dimension(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        u: &UnknownDimension,
    ) {
        let unit = u.unit.value.to_ascii_lowercase().to_string();
        match &mut self.unknown_dimension.get_mut(&unit) {
            Some(IndexedOperatorAndOperand {
                operator: prev_operator,
                operand: IndexedData { pos, data },
            }) => {
                data.value.value = CalcSumContext::sum_values(
                    prev_operator,
                    operator,
                    data.value.value,
                    u.value.value,
                );

                CalcSumContext::switch_sign_if_needed(
                    &mut self.expressions,
                    &mut data.value.value,
                    prev_operator,
                );
                CalcSumContext::update_calc_value(
                    &mut self.expressions,
                    *pos,
                    CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::UnknownDimension(
                        data.clone(),
                    ))),
                );
            }
            None => {
                let indexed_data: IndexedOperatorAndOperand<UnknownDimension> =
                    self.new_indexed_data(operator, operand, u.clone());
                self.unknown_dimension.insert(unit, indexed_data);
            }
        }
    }

    fn new_indexed_data<T>(
        &mut self,
        operator: &Option<CalcOperator>,
        operand: &CalcProduct,
        data: T,
    ) -> IndexedOperatorAndOperand<T> {
        let mut indexed_operator = None;

        if let Some(op) = operator {
            indexed_operator = Some(IndexedData {
                pos: self.expressions.len(),
                data: op.clone(),
            });
            self.expressions
                .push(CalcProductOrOperator::Operator(op.clone()));
        }

        let pos = self.expressions.len();
        self.expressions
            .push(CalcProductOrOperator::Product(operand.clone()));

        IndexedOperatorAndOperand {
            operator: indexed_operator,
            operand: IndexedData { pos, data },
        }
    }

    fn update_calc_value(
        expressions: &mut Vec<CalcProductOrOperator>,
        index: usize,
        calc_value: CalcValueOrOperator,
    ) {
        if let Some(elem) = expressions.get_mut(index) {
            if let CalcProductOrOperator::Product(CalcProduct { span, .. }) = elem {
                *elem = CalcProductOrOperator::Product(CalcProduct {
                    span: *span,
                    expressions: vec![calc_value],
                })
            }
        }
    }

    fn switch_sign_if_needed(
        expressions: &mut Vec<CalcProductOrOperator>,
        value: &mut f64,
        operator: &mut Option<IndexedData<CalcOperator>>,
    ) {
        if *value < 0.0 {
            if let Some(IndexedData { data, pos }) = operator {
                *value = -*value;
                data.value = if data.value == CalcOperatorType::Add {
                    CalcOperatorType::Sub
                } else {
                    CalcOperatorType::Add
                };

                CalcSumContext::update_operator(expressions, *pos, data.clone());
            }
        }
    }

    fn update_operator(
        expressions: &mut Vec<CalcProductOrOperator>,
        index: usize,
        operator: CalcOperator,
    ) {
        if let Some(elem) = expressions.get_mut(index) {
            *elem = CalcProductOrOperator::Operator(operator);
        }
    }

    fn sum_values(
        operator1: &Option<IndexedData<CalcOperator>>,
        operator2: &Option<CalcOperator>,
        n1: f64,
        n2: f64,
    ) -> f64 {
        match (operator1, operator2) {
            (
                None,
                Some(CalcOperator {
                    value: op_value, ..
                }),
            ) => {
                let sum = if *op_value == CalcOperatorType::Add {
                    SUM_OPERATION_ADD
                } else {
                    SUM_OPERATION_SUBTRACT
                };

                sum(n1, n2)
            }
            (
                Some(op1),
                Some(CalcOperator {
                    value: op2_value, ..
                }),
            ) => {
                let sum = if op1.data.value == *op2_value {
                    SUM_OPERATION_ADD
                } else {
                    SUM_OPERATION_SUBTRACT
                };

                sum(n1, n2)
            }
            _ => unreachable!("The second operator is never None"),
        }
    }
}

fn fold_calc_product(calc_product: &mut CalcProduct) {
    let mut folded_expressions: Vec<CalcValueOrOperator> = vec![];

    let mut prev_operand: Option<CalcValue> = None;
    let mut operator: Option<CalcOperator> = None;
    let mut expr_it = calc_product.expressions.iter_mut();
    while let Some(calc_value) = expr_it.next() {
        let cur_operand: Option<CalcValue> = match calc_value {
            CalcValueOrOperator::Value(CalcValue::Sum(calc_sum)) => {
                CalcSumContext::new().fold(calc_sum);
                let single_value = try_to_extract_into_calc_value(calc_sum);
                if single_value.is_some() {
                    single_value
                } else {
                    Some(CalcValue::Sum(CalcSum {
                        span: calc_sum.span,
                        expressions: calc_sum.expressions.to_vec(),
                    }))
                }
            }
            CalcValueOrOperator::Value(calc_value) => Some(calc_value.clone()),
            _ => None,
        };

        match (&prev_operand, &operator, &cur_operand) {
            (None, None, _) => {
                // First operand
                prev_operand = cur_operand
            }
            (
                Some(operand1),
                Some(CalcOperator {
                    value: CalcOperatorType::Mul,
                    span: op_span,
                }),
                Some(operand2),
            ) => {
                let result = try_to_multiply_calc_values(operand1, operand2);
                if result.is_some() {
                    prev_operand = result;
                } else {
                    folded_expressions.push(CalcValueOrOperator::Value(operand1.clone()));
                    folded_expressions.push(CalcValueOrOperator::Operator(CalcOperator {
                        span: *op_span,
                        value: CalcOperatorType::Mul,
                    }));
                    prev_operand = cur_operand
                }
            }
            _ => {
                // Something is wrong: we should iterate over some (operand, operator, operand)
                // tuples
                return;
            }
        }

        if let Some(CalcValueOrOperator::Operator(op)) = expr_it.next() {
            operator = Some(CalcOperator {
                span: op.span,
                value: op.value,
            });
        } else {
            operator = None;
        }
    }

    if let Some(operand) = prev_operand {
        folded_expressions.push(CalcValueOrOperator::Value(operand));
    }

    calc_product.expressions = folded_expressions;
}

fn try_to_multiply_calc_values(value1: &CalcValue, value2: &CalcValue) -> Option<CalcValue> {
    match (value1, value2) {
        (CalcValue::Number(n), value) | (value, CalcValue::Number(n)) => {
            multiply_number_by_calc_value(n, value)
        }
        _ => None,
    }
}

fn multiply_number_by_calc_value(n: &Number, value: &CalcValue) -> Option<CalcValue> {
    match value {
        CalcValue::Number(n2) => Some(CalcValue::Number(Number {
            value: n.value * n2.value,
            span: n2.span,
            raw: None,
        })),
        CalcValue::Dimension(Dimension::Length(l)) => {
            Some(CalcValue::Dimension(Dimension::Length(Length {
                span: l.span,
                value: Number {
                    value: n.value * l.value.value,
                    span: l.value.span,
                    raw: None,
                },
                unit: l.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::Angle(a)) => {
            Some(CalcValue::Dimension(Dimension::Angle(Angle {
                span: a.span,
                value: Number {
                    value: n.value * a.value.value,
                    span: a.value.span,
                    raw: None,
                },
                unit: a.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::Time(t)) => {
            Some(CalcValue::Dimension(Dimension::Time(Time {
                span: t.span,
                value: Number {
                    value: n.value * t.value.value,
                    span: t.value.span,
                    raw: None,
                },
                unit: t.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::Frequency(f)) => {
            Some(CalcValue::Dimension(Dimension::Frequency(Frequency {
                span: f.span,
                value: Number {
                    value: n.value * f.value.value,
                    span: f.value.span,
                    raw: None,
                },
                unit: f.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::Resolution(r)) => {
            Some(CalcValue::Dimension(Dimension::Resolution(Resolution {
                span: r.span,
                value: Number {
                    value: n.value * r.value.value,
                    span: r.value.span,
                    raw: None,
                },
                unit: r.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::Flex(f)) => {
            Some(CalcValue::Dimension(Dimension::Flex(Flex {
                span: f.span,
                value: Number {
                    value: n.value * f.value.value,
                    span: f.value.span,
                    raw: None,
                },
                unit: f.unit.clone(),
            })))
        }
        CalcValue::Dimension(Dimension::UnknownDimension(u)) => Some(CalcValue::Dimension(
            Dimension::UnknownDimension(UnknownDimension {
                span: u.span,
                value: Number {
                    value: n.value * u.value.value,
                    span: u.value.span,
                    raw: None,
                },
                unit: u.unit.clone(),
            }),
        )),
        CalcValue::Percentage(p) => Some(CalcValue::Percentage(Percentage {
            span: p.span,
            value: Number {
                value: n.value * p.value.value,
                span: p.value.span,
                raw: None,
            },
        })),
        CalcValue::Constant(_) => {
            // TODO handle some constants like "+Infinity", "-Infinity" and "NaN"
            // see https://www.w3.org/TR/css-values-4/#calc-type-checking
            None
        }
        _ => {
            // This expression does not represent a simple value... let's do nothing
            None
        }
    }
}

impl Compressor {
    pub(super) fn compress_calc_sum(&mut self, calc_sum: &mut CalcSum) {
        CalcSumContext::new().fold(calc_sum);
    }

    pub(super) fn compress_calc_sum_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        match &component_value {
            // Transform "calc(calc-sum)" into "simple value" when calc-sum is not a complex
            // expression
            ComponentValue::Function(Function { name, value, .. })
                if is_calc_function_name(&name) && value.len() == 1 =>
            {
                match value.get(0).unwrap() {
                    ComponentValue::CalcSum(CalcSum {
                        expressions: calc_sum_expressions,
                        ..
                    }) if calc_sum_expressions.len() == 1 => {
                        match calc_sum_expressions.get(0).unwrap() {
                            CalcProductOrOperator::Product(CalcProduct {
                                expressions: calc_product_expressions,
                                ..
                            }) if calc_product_expressions.len() == 1 => {
                                match calc_product_expressions.get(0).unwrap() {
                                    CalcValueOrOperator::Value(CalcValue::Sum(_)) => {
                                        // Do nothing, we cannot transform a
                                        // CalcSum into a ComponentValue
                                    }
                                    CalcValueOrOperator::Value(calc_value) => {
                                        *component_value =
                                            transform_calc_value_into_component_value(calc_value);
                                    }
                                    _ => {}
                                }
                            }
                            _ => {}
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
