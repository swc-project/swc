use swc_css_ast::*;

pub fn is_calc_function_name(function_name: &FunctionName) -> bool {
    *function_name == "calc" || *function_name == "-webkit-calc" || *function_name == "-moz-calc"
}

pub fn transform_calc_value_into_component_value(calc_value: &CalcValue) -> Option<ComponentValue> {
    match &calc_value {
        CalcValue::Number(n) => Some(ComponentValue::Number(Box::new(n.clone()))),
        CalcValue::Dimension(Dimension::Length(l)) => Some(ComponentValue::Dimension(Box::new(
            Dimension::Length(Length {
                span: l.span,
                value: l.value.clone(),
                unit: l.unit.clone(),
            }),
        ))),
        CalcValue::Dimension(Dimension::Angle(a)) => Some(ComponentValue::Dimension(Box::new(
            Dimension::Angle(Angle {
                span: a.span,
                value: a.value.clone(),
                unit: a.unit.clone(),
            }),
        ))),
        CalcValue::Dimension(Dimension::Time(t)) => {
            Some(ComponentValue::Dimension(Box::new(Dimension::Time(Time {
                span: t.span,
                value: t.value.clone(),
                unit: t.unit.clone(),
            }))))
        }
        CalcValue::Dimension(Dimension::Frequency(f)) => Some(ComponentValue::Dimension(Box::new(
            Dimension::Frequency(Frequency {
                span: f.span,
                value: f.value.clone(),
                unit: f.unit.clone(),
            }),
        ))),
        CalcValue::Dimension(Dimension::Resolution(r)) => Some(ComponentValue::Dimension(
            Box::new(Dimension::Resolution(Resolution {
                span: r.span,
                value: r.value.clone(),
                unit: r.unit.clone(),
            })),
        )),
        CalcValue::Dimension(Dimension::Flex(f)) => {
            Some(ComponentValue::Dimension(Box::new(Dimension::Flex(Flex {
                span: f.span,
                value: f.value.clone(),
                unit: f.unit.clone(),
            }))))
        }
        CalcValue::Dimension(Dimension::UnknownDimension(u)) => Some(ComponentValue::Dimension(
            Box::new(Dimension::UnknownDimension(UnknownDimension {
                span: u.span,
                value: u.value.clone(),
                unit: u.unit.clone(),
            })),
        )),
        CalcValue::Percentage(p) => Some(ComponentValue::Percentage(Box::new(Percentage {
            span: p.span,
            value: p.value.clone(),
        }))),
        CalcValue::Function(f) => Some(ComponentValue::Function(Box::new(Function {
            span: f.span,
            name: f.name.clone(),
            value: f.value.to_vec(),
        }))),
        CalcValue::Constant(_) => {
            // https://www.w3.org/TR/css-values-4/#calc-constants
            // "These keywords are only usable within a calculation"
            // "If used outside of a calculation, they’re treated like any other keyword"
            None
        }
        CalcValue::Sum(_) => {
            // Do nothing, we cannot transform a CalcSum into a ComponentValue
            None
        }
    }
}
