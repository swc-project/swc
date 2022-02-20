use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_easing_function() -> impl VisitMut {
    CompressEasingFunction {}
}

struct CompressEasingFunction {}

impl CompressEasingFunction {}

impl VisitMut for CompressEasingFunction {
    fn visit_mut_value(&mut self, value: &mut Value) {
        value.visit_mut_children_with(self);

        match value {
            Value::Function(Function {
                name,
                value: function_value,
                span,
            }) if &*name.value.to_lowercase() == "cubic-bezier" && function_value.len() == 7 => {
                if let (
                    Value::Number(Number { value: first, .. }),
                    Value::Number(Number { value: second, .. }),
                    Value::Number(Number { value: third, .. }),
                    Value::Number(Number { value: fourth, .. }),
                ) = (
                    &function_value[0],
                    &function_value[2],
                    &function_value[4],
                    &function_value[6],
                ) {
                    if *first == 0.0 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "linear".into(),
                            raw: "linear".into(),
                        })
                    } else if *first == 0.25 && *second == 0.1 && *third == 0.25 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "easy".into(),
                            raw: "easy".into(),
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-in".into(),
                            raw: "ease-in".into(),
                        })
                    } else if *first == 0.0 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-out".into(),
                            raw: "ease-out".into(),
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-in-out".into(),
                            raw: "ease-in-out".into(),
                        })
                    }
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                span,
            }) if &*name.value.to_lowercase() == "steps" && function_value.len() == 3 => {
                match (&function_value[0], &function_value[2]) {
                    (
                        Value::Number(Number {
                            value: number_value,
                            ..
                        }),
                        Value::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) if *number_value == 1.0 => match &*ident_value.to_lowercase() {
                        "start" | "jump-start" => {
                            *value = Value::Ident(Ident {
                                span: *span,
                                value: "step-start".into(),
                                raw: "step-start".into(),
                            })
                        }
                        "end" | "jump-end" => {
                            *value = Value::Ident(Ident {
                                span: *span,
                                value: "step-end".into(),
                                raw: "step-end".into(),
                            })
                        }
                        _ => {}
                    },
                    (
                        Value::Number(Number { .. }),
                        Value::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) if ident_value.to_lowercase() == "jump-start" => {
                        function_value[2] = Value::Ident(Ident {
                            span: *span,
                            value: "start".into(),
                            raw: "start".into(),
                        })
                    }
                    (
                        Value::Number(number),
                        Value::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) => match &*ident_value.to_lowercase() {
                        "end" | "jump-end" => {
                            *function_value = vec![Value::Number(number.clone())];
                        }
                        _ => {}
                    },
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
