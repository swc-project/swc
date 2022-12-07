use swc_atoms::js_word;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_easing_function(&mut self, component_value: &mut ComponentValue) {
        match component_value {
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                span,
            }) if name.value.eq_ignore_ascii_case(&js_word!("cubic-bezier"))
                && function_value.len() == 7 =>
            {
                if let (
                    ComponentValue::Number(box Number { value: first, .. }),
                    ComponentValue::Number(box Number { value: second, .. }),
                    ComponentValue::Number(box Number { value: third, .. }),
                    ComponentValue::Number(box Number { value: fourth, .. }),
                ) = (
                    &function_value[0],
                    &function_value[2],
                    &function_value[4],
                    &function_value[6],
                ) {
                    if *first == 0.0 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("linear"),
                            raw: None,
                        }))
                    } else if *first == 0.25 && *second == 0.1 && *third == 0.25 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease"),
                            raw: None,
                        }))
                    } else if *first == 0.42 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease-in"),
                            raw: None,
                        }))
                    } else if *first == 0.0 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease-out"),
                            raw: None,
                        }))
                    } else if *first == 0.42 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease-in-out"),
                            raw: None,
                        }))
                    }
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                span,
            }) if name.value.eq_ignore_ascii_case(&js_word!("steps"))
                && function_value.len() == 3 =>
            {
                match (&function_value[0], &function_value[2]) {
                    (
                        ComponentValue::Number(box Number {
                            value: number_value,
                            ..
                        }),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) if *number_value == 1.0 => match ident_value.to_ascii_lowercase() {
                        js_word!("start") | js_word!("jump-start") => {
                            *component_value = ComponentValue::Ident(Box::new(Ident {
                                span: *span,
                                value: js_word!("step-start"),
                                raw: None,
                            }))
                        }
                        js_word!("end") | js_word!("jump-end") => {
                            *component_value = ComponentValue::Ident(Box::new(Ident {
                                span: *span,
                                value: js_word!("step-end"),
                                raw: None,
                            }))
                        }
                        _ => {}
                    },
                    (
                        ComponentValue::Number(box Number { .. }),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) if ident_value.eq_ignore_ascii_case(&js_word!("jump-start")) => {
                        function_value[2] = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("start"),
                            raw: None,
                        }))
                    }
                    (
                        ComponentValue::Number(number),
                        ComponentValue::Ident(box Ident {
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
