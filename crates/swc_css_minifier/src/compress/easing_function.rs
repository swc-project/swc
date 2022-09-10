use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_easing_function() -> impl VisitMut {
    CompressEasingFunction {}
}

struct CompressEasingFunction {}

impl CompressEasingFunction {}

impl VisitMut for CompressEasingFunction {
    fn visit_mut_component_value(&mut self, component_value: &mut ComponentValue) {
        component_value.visit_mut_children_with(self);

        match component_value {
            ComponentValue::Function(Function {
                name,
                value: function_value,
                span,
            }) if name.value.to_ascii_lowercase() == js_word!("cubic-bezier")
                && function_value.len() == 7 =>
            {
                if let (
                    ComponentValue::Number(Number { value: first, .. }),
                    ComponentValue::Number(Number { value: second, .. }),
                    ComponentValue::Number(Number { value: third, .. }),
                    ComponentValue::Number(Number { value: fourth, .. }),
                ) = (
                    &function_value[0],
                    &function_value[2],
                    &function_value[4],
                    &function_value[6],
                ) {
                    if *first == 0.0 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "linear".into(),
                            raw: None,
                        })
                    } else if *first == 0.25 && *second == 0.1 && *third == 0.25 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "easy".into(),
                            raw: None,
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "ease-in".into(),
                            raw: None,
                        })
                    } else if *first == 0.0 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "ease-out".into(),
                            raw: None,
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "ease-in-out".into(),
                            raw: None,
                        })
                    }
                }
            }
            ComponentValue::Function(Function {
                name,
                value: function_value,
                span,
            }) if name.value.to_ascii_lowercase() == js_word!("steps")
                && function_value.len() == 3 =>
            {
                match (&function_value[0], &function_value[2]) {
                    (
                        ComponentValue::Number(Number {
                            value: number_value,
                            ..
                        }),
                        ComponentValue::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) if *number_value == 1.0 => match ident_value.to_ascii_lowercase() {
                        "start" | "jump-start" => {
                            *component_value = ComponentValue::Ident(Ident {
                                span: *span,
                                value: "step-start".into(),
                                raw: None,
                            })
                        }
                        "end" | "jump-end" => {
                            *component_value = ComponentValue::Ident(Ident {
                                span: *span,
                                value: "step-end".into(),
                                raw: None,
                            })
                        }
                        _ => {}
                    },
                    (
                        ComponentValue::Number(Number { .. }),
                        ComponentValue::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) if ident_value.to_ascii_lowercase() == js_word!("jump-start") => {
                        function_value[2] = ComponentValue::Ident(Ident {
                            span: *span,
                            value: "start".into(),
                            raw: None,
                        })
                    }
                    (
                        ComponentValue::Number(number),
                        ComponentValue::Ident(Ident {
                            value: ident_value, ..
                        }),
                    ) => match ident_value.to_ascii_lowercase() {
                        js_word!("end") | js_word!("jump-end") => {
                            *function_value = vec![ComponentValue::Number(number.clone())];
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
