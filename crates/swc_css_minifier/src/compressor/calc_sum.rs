use swc_atoms::js_word;
use swc_common::Span;
use swc_css_ast::*;

use super::Compressor;

// transform "(simple calc-value)" into "simple calc-value"
fn remove_unnecessary_nesting_from_calc_sum(calc_sum: &mut CalcSum) {
    if calc_sum.expressions.len() == 1 {
        match calc_sum.expressions.get(0).unwrap() {
            CalcProductOrOperator::Product(CalcProduct {
                expressions: calc_product_expressions,
                ..
            }) if calc_product_expressions.len() == 1 => {
                match calc_product_expressions.get(0).unwrap() {
                    CalcValueOrOperator::Value(CalcValue::Sum(CalcSum {
                        expressions: nested_expressions,
                        span: nested_span,
                    })) => {
                        calc_sum.span = *nested_span;
                        calc_sum.expressions = nested_expressions.to_vec();
                    }
                    _ => {}
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
                    CalcValueOrOperator::Value(calc_value) => Some(copy_calc_value(&calc_value)),
                    _ => None,
                }
            }
            _ => None,
        };
    }

    None
}

fn copy_ident(i: &Ident) -> Ident {
    Ident {
        span: i.span,
        value: i.value.clone(),
        raw: None,
    }
}

fn copy_number(n: &Number) -> Number {
    Number {
        span: n.span,
        value: n.value,
        raw: None,
    }
}

fn copy_calc_value(calc_value: &CalcValue) -> CalcValue {
    return match &calc_value {
        CalcValue::Number(n) => CalcValue::Number(copy_number(n)),
        CalcValue::Dimension(Dimension::Length(l)) => {
            CalcValue::Dimension(Dimension::Length(Length {
                span: l.span,
                value: copy_number(&l.value),
                unit: copy_ident(&l.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Angle(a)) => {
            CalcValue::Dimension(Dimension::Angle(Angle {
                span: a.span,
                value: copy_number(&a.value),
                unit: copy_ident(&a.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Time(t)) => CalcValue::Dimension(Dimension::Time(Time {
            span: t.span,
            value: copy_number(&t.value),
            unit: copy_ident(&t.unit),
        })),
        CalcValue::Dimension(Dimension::Frequency(f)) => {
            CalcValue::Dimension(Dimension::Frequency(Frequency {
                span: f.span,
                value: copy_number(&f.value),
                unit: copy_ident(&f.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Resolution(r)) => {
            CalcValue::Dimension(Dimension::Resolution(Resolution {
                span: r.span,
                value: copy_number(&r.value),
                unit: copy_ident(&r.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Flex(f)) => CalcValue::Dimension(Dimension::Flex(Flex {
            span: f.span,
            value: copy_number(&f.value),
            unit: copy_ident(&f.unit),
        })),
        CalcValue::Dimension(Dimension::UnknownDimension(u)) => {
            CalcValue::Dimension(Dimension::UnknownDimension(UnknownDimension {
                span: u.span,
                value: copy_number(&u.value),
                unit: copy_ident(&u.unit),
            }))
        }
        CalcValue::Percentage(p) => CalcValue::Percentage(Percentage {
            span: p.span,
            value: copy_number(&p.value),
        }),
        CalcValue::Constant(c) => CalcValue::Constant(copy_ident(c)),
        CalcValue::Function(f) => CalcValue::Function(Function {
            span: f.span,
            name: copy_ident(&f.name),
            value: f.value.to_vec(),
        }),
        CalcValue::Sum(s) => CalcValue::Sum(CalcSum {
            span: s.span,
            expressions: s.expressions.to_vec(),
        }),
    };
}

fn transform_calc_value_into_component_value(calc_value: &CalcValue) -> ComponentValue {
    return match &calc_value {
        CalcValue::Number(n) => ComponentValue::Number(copy_number(n)),
        CalcValue::Dimension(Dimension::Length(l)) => {
            ComponentValue::Dimension(Dimension::Length(Length {
                span: l.span,
                value: copy_number(&l.value),
                unit: copy_ident(&l.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Angle(a)) => {
            ComponentValue::Dimension(Dimension::Angle(Angle {
                span: a.span,
                value: copy_number(&a.value),
                unit: copy_ident(&a.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Time(t)) => {
            ComponentValue::Dimension(Dimension::Time(Time {
                span: t.span,
                value: copy_number(&t.value),
                unit: copy_ident(&t.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Frequency(f)) => {
            ComponentValue::Dimension(Dimension::Frequency(Frequency {
                span: f.span,
                value: copy_number(&f.value),
                unit: copy_ident(&f.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Resolution(r)) => {
            ComponentValue::Dimension(Dimension::Resolution(Resolution {
                span: r.span,
                value: copy_number(&r.value),
                unit: copy_ident(&r.unit),
            }))
        }
        CalcValue::Dimension(Dimension::Flex(f)) => {
            ComponentValue::Dimension(Dimension::Flex(Flex {
                span: f.span,
                value: copy_number(&f.value),
                unit: copy_ident(&f.unit),
            }))
        }
        CalcValue::Dimension(Dimension::UnknownDimension(u)) => {
            ComponentValue::Dimension(Dimension::UnknownDimension(UnknownDimension {
                span: u.span,
                value: copy_number(&u.value),
                unit: copy_ident(&u.unit),
            }))
        }
        CalcValue::Percentage(p) => ComponentValue::Percentage(Percentage {
            span: p.span,
            value: copy_number(&p.value),
        }),
        CalcValue::Constant(c) => ComponentValue::Ident(copy_ident(c)),
        CalcValue::Function(f) => ComponentValue::Function(Function {
            span: f.span,
            name: copy_ident(&f.name),
            value: f.value.to_vec(),
        }),
        CalcValue::Sum(_) => {
            unreachable!("CalcValue::Sum cannot be transformed into a ComponentValue")
        }
    };
}

fn fold_calc_sum(calc_sum: &mut CalcSum) {
    // TODO we should sort the operands by unit to handle this:
    // "4px + 3% + 5px + 10%" = "9px + 13%"

    let mut folded_expressions: Vec<CalcProductOrOperator> = vec![];

    let mut prev_operand: Option<CalcProduct> = None;
    let mut operator: Option<CalcOperator> = None;
    let mut expr_it = calc_sum.expressions.iter_mut();
    while let Some(calc_product) = expr_it.next() {
        let cur_operand: Option<CalcProduct> = match calc_product {
            CalcProductOrOperator::Product(calc_product) => {
                fold_calc_product(calc_product);
                Some(CalcProduct {
                    span: calc_product.span,
                    expressions: calc_product.expressions.to_vec(),
                })
            }
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
                    value: op_value,
                    span: op_span,
                }),
                Some(operand2),
            ) => {
                let result = try_to_sum_calc_products(
                    operand1,
                    operand2,
                    if *op_value == CalcOperatorType::Add {
                        SUM_OPERATION_ADD
                    } else {
                        SUM_OPERATION_SUBTRACT
                    },
                );
                if result.is_some() {
                    prev_operand = result;
                } else {
                    folded_expressions.push(CalcProductOrOperator::Product(CalcProduct {
                        span: operand1.span,
                        expressions: operand1.expressions.to_vec(),
                    }));
                    folded_expressions.push(CalcProductOrOperator::Operator(CalcOperator {
                        span: *op_span,
                        value: *op_value,
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

        if let Some(CalcProductOrOperator::Operator(op)) = expr_it.next() {
            operator = Some(CalcOperator {
                span: op.span,
                value: op.value,
            });
        } else {
            operator = None;
        }
    }

    if prev_operand.is_some() {
        folded_expressions.push(CalcProductOrOperator::Product(prev_operand.unwrap()));
    }

    calc_sum.expressions = folded_expressions;

    remove_unnecessary_nesting_from_calc_sum(calc_sum);
}

type SumOperation = fn(v1: f64, v2: f64) -> f64;

const SUM_OPERATION_ADD: SumOperation = |v1, v2| v1 + v2;
const SUM_OPERATION_SUBTRACT: SumOperation = |v1, v2| v1 - v2;

fn try_to_sum_calc_products(
    value1: &CalcProduct,
    value2: &CalcProduct,
    sum: SumOperation,
) -> Option<CalcProduct> {
    if value1.expressions.len() == 1 && value2.expressions.len() == 1 {
        return match (
            value1.expressions.get(0).unwrap(),
            value2.expressions.get(0).unwrap(),
        ) {
            (
                CalcValueOrOperator::Value(CalcValue::Number(n1)),
                CalcValueOrOperator::Value(CalcValue::Number(n2)),
            ) => Some(CalcProduct {
                span: value1.span,
                expressions: vec![CalcValueOrOperator::Value(CalcValue::Number(Number {
                    span: n1.span,
                    value: sum(n1.value, n2.value),
                    raw: None,
                }))],
            }),
            (
                CalcValueOrOperator::Value(CalcValue::Percentage(p1)),
                CalcValueOrOperator::Value(CalcValue::Percentage(p2)),
            ) => Some(CalcProduct {
                span: value1.span,
                expressions: vec![CalcValueOrOperator::Value(CalcValue::Percentage(
                    Percentage {
                        span: p1.span,
                        value: Number {
                            span: p1.value.span,
                            value: sum(p1.value.value, p2.value.value),
                            raw: None,
                        },
                    },
                ))],
            }),
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Length(l1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Length(l2))),
            ) => try_to_sum_lengths(&value1.span, &l1, &l2, sum),
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Time(t1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Time(t2))),
            ) => try_to_sum_times(&value1.span, &t1, &t2, sum),
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Frequency(f1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Frequency(f2))),
            ) => try_to_sum_frequencies(&value1.span, &f1, &f2, sum),
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Resolution(r1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Resolution(r2))),
            ) => try_to_sum_resolutions(&value1.span, &r1, &r2, sum),
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Angle(a1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Angle(a2))),
            ) if a1.unit.value.to_ascii_lowercase() == a2.unit.value.to_ascii_lowercase() => {
                Some(CalcProduct {
                    span: value1.span,
                    expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
                        Dimension::Angle(Angle {
                            span: a1.span,
                            value: Number {
                                span: a1.value.span,
                                value: sum(a1.value.value, a2.value.value),
                                raw: None,
                            },
                            unit: copy_ident(&a1.unit),
                        }),
                    ))],
                })
            }
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Flex(f1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::Flex(f2))),
            ) if f1.unit.value.to_ascii_lowercase() == f2.unit.value.to_ascii_lowercase() => {
                Some(CalcProduct {
                    span: value1.span,
                    expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
                        Dimension::Flex(Flex {
                            span: f1.span,
                            value: Number {
                                span: f1.value.span,
                                value: sum(f1.value.value, f2.value.value),
                                raw: None,
                            },
                            unit: copy_ident(&f1.unit),
                        }),
                    ))],
                })
            }
            (
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::UnknownDimension(u1))),
                CalcValueOrOperator::Value(CalcValue::Dimension(Dimension::UnknownDimension(u2))),
            ) if u1.unit.value.to_ascii_lowercase() == u2.unit.value.to_ascii_lowercase() => {
                Some(CalcProduct {
                    span: value1.span,
                    expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
                        Dimension::UnknownDimension(UnknownDimension {
                            span: u1.span,
                            value: Number {
                                span: u1.value.span,
                                value: sum(u1.value.value, u2.value.value),
                                raw: None,
                            },
                            unit: copy_ident(&u1.unit),
                        }),
                    ))],
                })
            }
            _ => {
                // TODO handle some constants like "+Infinity", "-Infinity" and "NaN"
                // see https://www.w3.org/TR/css-values-4/#calc-type-checking

                // Unsupported operation
                None
            }
        };
    }

    None
}

fn try_to_sum_lengths(
    span: &Span,
    l1: &Length,
    l2: &Length,
    sum: SumOperation,
) -> Option<CalcProduct> {
    // See the ratio: https://www.w3.org/TR/css-values-4/#absolute-lengths
    let result: Option<(Ident, f64)> = match (
        l1.unit.value.to_ascii_lowercase(),
        l2.unit.value.to_ascii_lowercase(),
    ) {
        // Same units
        (u1, u2) if u1 == u2 => Some((copy_ident(&l1.unit), sum(l1.value.value, l2.value.value))),
        // mm <-> cm
        (js_word!("mm"), js_word!("cm")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 10.0),
        )),
        (js_word!("cm"), js_word!("mm")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 10.0, l2.value.value),
        )),
        // q <-> cm
        (js_word!("q"), js_word!("cm")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 40.0),
        )),
        (js_word!("cm"), js_word!("q")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 40.0, l2.value.value),
        )),
        // q <-> mm
        (js_word!("q"), js_word!("mm")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 4.0),
        )),
        (js_word!("mm"), js_word!("q")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 4.0, l2.value.value),
        )),
        // px <-> in
        (js_word!("px"), js_word!("in")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 96.0),
        )),
        (js_word!("in"), js_word!("px")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 96.0, l2.value.value),
        )),
        // pc <-> in
        (js_word!("pc"), js_word!("in")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 6.0),
        )),
        (js_word!("in"), js_word!("pc")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 6.0, l2.value.value),
        )),
        // pt <-> in
        (js_word!("pt"), js_word!("in")) => Some((
            copy_ident(&l1.unit),
            sum(l1.value.value, l2.value.value * 72.0),
        )),
        (js_word!("in"), js_word!("pt")) => Some((
            copy_ident(&l2.unit),
            sum(l1.value.value * 72.0, l2.value.value),
        )),
        _ => None,
    };

    result.map(|res| CalcProduct {
        span: *span,
        expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
            Dimension::Length(Length {
                span: l1.span,
                value: Number {
                    span: l1.value.span,
                    value: res.1,
                    raw: None,
                },
                unit: res.0,
            }),
        ))],
    })
}

fn try_to_sum_times(span: &Span, t1: &Time, t2: &Time, sum: SumOperation) -> Option<CalcProduct> {
    // See the ratio: https://www.w3.org/TR/css-values-4/#absolute-lengths
    let result: Option<(Ident, f64)> = match (
        t1.unit.value.to_ascii_lowercase(),
        t2.unit.value.to_ascii_lowercase(),
    ) {
        // Same units
        (u1, u2) if u1 == u2 => Some((copy_ident(&t1.unit), sum(t1.value.value, t2.value.value))),
        // ms <-> s
        (js_word!("ms"), js_word!("s")) => Some((
            copy_ident(&t1.unit),
            sum(t1.value.value, t2.value.value * 1000.0),
        )),
        (js_word!("s"), js_word!("ms")) => Some((
            copy_ident(&t2.unit),
            sum(t1.value.value * 1000.0, t2.value.value),
        )),
        _ => None,
    };

    result.map(|res| CalcProduct {
        span: *span,
        expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
            Dimension::Time(Time {
                span: t1.span,
                value: Number {
                    span: t1.value.span,
                    value: res.1,
                    raw: None,
                },
                unit: res.0,
            }),
        ))],
    })
}

fn try_to_sum_frequencies(
    span: &Span,
    f1: &Frequency,
    f2: &Frequency,
    sum: SumOperation,
) -> Option<CalcProduct> {
    // See the ratio: https://www.w3.org/TR/css-values-4/#absolute-lengths
    let result: Option<(Ident, f64)> = match (
        f1.unit.value.to_ascii_lowercase(),
        f2.unit.value.to_ascii_lowercase(),
    ) {
        // Same units
        (u1, u2) if u1 == u2 => Some((copy_ident(&f1.unit), sum(f1.value.value, f2.value.value))),
        // Hz <-> kHz
        (js_word!("hz"), js_word!("khz")) => Some((
            copy_ident(&f1.unit),
            sum(f1.value.value, f2.value.value * 1000.0),
        )),
        (js_word!("khz"), js_word!("hz")) => Some((
            copy_ident(&f2.unit),
            sum(f1.value.value * 1000.0, f2.value.value),
        )),
        _ => None,
    };

    result.map(|res| CalcProduct {
        span: *span,
        expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
            Dimension::Frequency(Frequency {
                span: f1.span,
                value: Number {
                    span: f1.value.span,
                    value: res.1,
                    raw: None,
                },
                unit: res.0,
            }),
        ))],
    })
}

fn try_to_sum_resolutions(
    span: &Span,
    r1: &Resolution,
    r2: &Resolution,
    sum: SumOperation,
) -> Option<CalcProduct> {
    // See the ratio: https://www.w3.org/TR/css-values-4/#absolute-lengths
    let result: Option<(Ident, f64)> = match (
        r1.unit.value.to_ascii_lowercase(),
        r2.unit.value.to_ascii_lowercase(),
    ) {
        // Same units
        (u1, u2) if u1 == u2 => Some((copy_ident(&r1.unit), sum(r1.value.value, r2.value.value))),
        // Hz <-> kHz
        (js_word!("dpi"), js_word!("dppx")) => Some((
            copy_ident(&r1.unit),
            sum(r1.value.value, r2.value.value * 96.0),
        )),
        (js_word!("dppx"), js_word!("dpi")) => Some((
            copy_ident(&r2.unit),
            sum(r1.value.value * 96.0, r2.value.value),
        )),
        _ => None,
    };

    result.map(|res| CalcProduct {
        span: *span,
        expressions: vec![CalcValueOrOperator::Value(CalcValue::Dimension(
            Dimension::Resolution(Resolution {
                span: r1.span,
                value: Number {
                    span: r1.value.span,
                    value: res.1,
                    raw: None,
                },
                unit: res.0,
            }),
        ))],
    })
}

fn fold_calc_product(calc_product: &mut CalcProduct) {
    let mut folded_expressions: Vec<CalcValueOrOperator> = vec![];

    let mut prev_operand: Option<CalcValue> = None;
    let mut operator: Option<CalcOperator> = None;
    let mut expr_it = calc_product.expressions.iter_mut();
    while let Some(calc_value) = expr_it.next() {
        let cur_operand: Option<CalcValue> = match calc_value {
            CalcValueOrOperator::Value(CalcValue::Sum(calc_sum)) => {
                fold_calc_sum(calc_sum);
                let single_value = try_to_extract_into_calc_value(&calc_sum);
                if single_value.is_some() {
                    single_value
                } else {
                    Some(CalcValue::Sum(CalcSum {
                        span: calc_sum.span,
                        expressions: calc_sum.expressions.to_vec(),
                    }))
                }
            }
            CalcValueOrOperator::Value(calc_value) => Some(copy_calc_value(calc_value)),
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
                    folded_expressions.push(CalcValueOrOperator::Value(copy_calc_value(operand1)));
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

    if prev_operand.is_some() {
        folded_expressions.push(CalcValueOrOperator::Value(prev_operand.unwrap()));
    }

    calc_product.expressions = folded_expressions;
}

fn try_to_multiply_calc_values(value1: &CalcValue, value2: &CalcValue) -> Option<CalcValue> {
    return match (value1, value2) {
        (CalcValue::Number(n), value) | (value, CalcValue::Number(n)) => {
            multiply_number_by_calc_value(n, value)
        }
        _ => None,
    };
}

fn multiply_number_by_calc_value(n: &Number, value: &CalcValue) -> Option<CalcValue> {
    return match value {
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
                unit: copy_ident(&l.unit),
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
                unit: copy_ident(&a.unit),
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
                unit: copy_ident(&t.unit),
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
                unit: copy_ident(&f.unit),
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
                unit: copy_ident(&r.unit),
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
                unit: copy_ident(&f.unit),
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
                unit: copy_ident(&u.unit),
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
    };
}

impl Compressor {
    pub(super) fn compress_calc_sum(&mut self, calc_sum: &mut CalcSum) {
        fold_calc_sum(calc_sum);
    }

    pub(super) fn compress_calc_sum_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        match &component_value {
            // Transform "calc(calc-sum)" into "simple value" when calc-sum is not a complex
            // expression
            ComponentValue::Function(Function { name, value, .. })
                if name.value.to_ascii_lowercase() == js_word!("calc") && value.len() == 1 =>
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
