use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_easing_function(&mut self, component_value: &mut ComponentValue) {
        match component_value {
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                span,
            }) if name == "cubic-bezier" && function_value.len() == 7 => {
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
                            value: "linear".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value, .. }) if *value == 0.25)
                        && matches!(second, ComponentValue::Number(box Number { value, .. }) if *value == 0.1)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.25)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "ease".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value: first, .. }) if *first == 0.42)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Integer(box Integer { value, .. }) if *value == 1)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "ease-in".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Integer(box Integer { value: first, .. }) if *first == 0)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.58)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "ease-out".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(box Number { value: first, .. }) if *first == 0.42)
                        && matches!(second, ComponentValue::Integer(box Integer { value, .. }) if *value == 0)
                        && matches!(third, ComponentValue::Number(box Number { value, .. }) if *value == 0.58)
                        && *fourth == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "ease-in-out".into(),
                            raw: None,
                        }))
                    }
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                span,
            }) if name == "steps" && function_value.len() == 3 => {
                match (&function_value[0], &function_value[2]) {
                    (
                        ComponentValue::Integer(box Integer {
                            value: number_value,
                            ..
                        }),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) if *number_value == 1 => match &*ident_value.to_ascii_lowercase() {
                        "start" | "jump-start" => {
                            *component_value = ComponentValue::Ident(Box::new(Ident {
                                span: *span,
                                value: "step-start".into(),
                                raw: None,
                            }))
                        }
                        "end" | "jump-end" => {
                            *component_value = ComponentValue::Ident(Box::new(Ident {
                                span: *span,
                                value: "step-end".into(),
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
                    ) if ident_value.eq_ignore_ascii_case("jump-start") => {
                        function_value[2] = ComponentValue::Ident(Box::new(Ident {
                            span: *span,
                            value: "start".into(),
                            raw: None,
                        }))
                    }
                    (
                        ComponentValue::Integer(number),
                        ComponentValue::Ident(box Ident {
                            value: ident_value, ..
                        }),
                    ) => match &*ident_value.to_ascii_lowercase() {
                        "end" | "jump-end" => {
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
