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
                    first,
                    second,
                    third,
                    ComponentValue::Integer(box Integer { value: fourth, .. }),
                ) = (
                    &function_value[0],
                    &function_value[2],
                    &function_value[4],
                    &function_value[6],
                ) {
                    if matches!(first, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Integer(box Integer { value, .. }) if *value == 1)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("linear"),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value, .. }) if *value == 0.25)
                        && matches!(second, ComponentValue::Number(box Number { value, .. }) if *value == 0.1)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.25)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease"),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value: first, .. }) if *first == 0.42)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Integer(box Integer { value, .. }) if *value == 1)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease-in"),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Integer(box Integer { value: first, .. }) if *first == 0)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.58)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: js_word!("ease-out"),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value: first, .. }) if *first == 0.42)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.58)
                        && *fourth == 1
                    {
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
                        ComponentValue::Integer(box Integer {
                            value: number_value,
                            ..
                        }),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) if *number_value == 1 => match ident_value.to_ascii_lowercase() {
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
                        ComponentValue::Integer(box Integer { .. }),
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
                        ComponentValue::Integer(number),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) => match ident_value.to_ascii_lowercase() {
                        js_word!("end") | js_word!("jump-end") => {
                            *function_value = vec![ComponentValue::Integer(number.clone())];
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
