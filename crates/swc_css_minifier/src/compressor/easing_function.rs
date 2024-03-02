use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_easing_function(&mut self, component_value: &mut ComponentValue) {
        match component_value {
            ComponentValue::Function(function)
                if function.name == "cubic-bezier" && function.value.len() == 7 =>
            {
                if let (first, second, third, ComponentValue::Integer(fourth)) = (
                    &function.value[0],
                    &function.value[2],
                    &function.value[4],
                    &function.value[6],
                ) {
                    if matches!(first, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(second, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(third, ComponentValue::Integer(integer) if integer.value == 1)
                        && fourth.value == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "linear".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(number) if number.value == 0.25)
                        && matches!(second, ComponentValue::Number(number) if number.value == 0.1)
                        && matches!(third, ComponentValue::Number(number) if number.value == 0.25)
                        && fourth.value == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "ease".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(number) if number.value == 0.42)
                        && matches!(second, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(third, ComponentValue::Integer(integer) if integer.value == 1)
                        && fourth.value == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "ease-in".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(second, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(third, ComponentValue::Number(number) if number.value == 0.58)
                        && fourth.value == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "ease-out".into(),
                            raw: None,
                        }))
                    } else if matches!(first, ComponentValue::Number(number) if number.value == 0.42)
                        && matches!(second, ComponentValue::Integer(integer) if integer.value == 0)
                        && matches!(third, ComponentValue::Number(number) if number.value == 0.58)
                        && fourth.value == 1
                    {
                        *component_value = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "ease-in-out".into(),
                            raw: None,
                        }))
                    }
                }
            }
            ComponentValue::Function(function)
                if function.name == "steps" && function.value.len() == 3 =>
            {
                match (&function.value[0], &function.value[2]) {
                    (ComponentValue::Integer(integer), ComponentValue::Ident(ident))
                        if integer.value == 1 =>
                    {
                        match &*ident.value.to_ascii_lowercase() {
                            "start" | "jump-start" => {
                                *component_value = ComponentValue::Ident(Box::new(Ident {
                                    span: function.span,
                                    value: "step-start".into(),
                                    raw: None,
                                }))
                            }
                            "end" | "jump-end" => {
                                *component_value = ComponentValue::Ident(Box::new(Ident {
                                    span: function.span,
                                    value: "step-end".into(),
                                    raw: None,
                                }))
                            }
                            _ => {}
                        }
                    }
                    (ComponentValue::Integer(..), ComponentValue::Ident(ident))
                        if ident.value.eq_ignore_ascii_case("jump-start") =>
                    {
                        function.value[2] = ComponentValue::Ident(Box::new(Ident {
                            span: function.span,
                            value: "start".into(),
                            raw: None,
                        }))
                    }
                    (ComponentValue::Integer(number), ComponentValue::Ident(ident)) => {
                        match &*ident.value.to_ascii_lowercase() {
                            "end" | "jump-end" => {
                                function.value = vec![ComponentValue::Integer(number.clone())];
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
