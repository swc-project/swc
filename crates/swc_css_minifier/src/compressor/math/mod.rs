use swc_atoms::js_word;
use swc_css_ast::*;

pub fn is_calc_function_name(ident: &Ident) -> bool {
    ident.value.to_ascii_lowercase() == js_word!("calc")
        || ident.value.to_ascii_lowercase() == js_word!("-webkit-calc")
        || ident.value.to_ascii_lowercase() == js_word!("-moz-calc")
}

pub fn transform_calc_value_into_component_value(calc_value: &CalcValue) -> ComponentValue {
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
        CalcValue::Function(f) => ComponentValue::Function(Function {
            span: f.span,
            name: f.name.clone(),
            value: f.value.to_vec(),
        }),
        CalcValue::Constant(_) => {
            unreachable!("CalcValue::Constant cannot be transformed into a ComponentValue per spec")
        }
        CalcValue::Sum(_) => {
            unreachable!("CalcValue::Sum cannot be transformed into a ComponentValue")
        }
    }
}
