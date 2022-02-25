use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_transform_function() -> impl VisitMut {
    CompressTransformFunction {}
}

struct CompressTransformFunction {}

impl CompressTransformFunction {}

impl VisitMut for CompressTransformFunction {
    fn visit_mut_value(&mut self, value: &mut Value) {
        value.visit_mut_children_with(self);

        match value {
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "translate" && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(first),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 0.0 => {
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "translateY".into(),
                            raw: "translateY".into(),
                        };
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "translate3d" && function_value.len() == 5 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                ) {
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(third),
                    ) if *first_number == 0.0 && *second_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "translateZ".into(),
                            raw: "translateZ".into(),
                        };
                        *function_value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "scale" && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(
                            first @ Value::Number(Number {
                                value: first_number,
                                ..
                            }),
                        ),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                    ) if first_number == second_number => {
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(first),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "scaleX".into(),
                            raw: "scaleX".into(),
                        };
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "scaleY".into(),
                            raw: "scaleY".into(),
                        };
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "scale3d" && function_value.len() == 5 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                ) {
                    (
                        Some(first),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                    ) if *second_number == 1.0 && *third_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "scaleX".into(),
                            raw: "scaleX".into(),
                        };
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                    ) if *first_number == 1.0 && *third_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "scaleY".into(),
                            raw: "scaleY".into(),
                        };
                        *function_value = vec![second.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(third),
                    ) if *first_number == 1.0 && *second_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "scaleZ".into(),
                            raw: "scaleZ".into(),
                        };
                        *function_value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "matrix3d" && function_value.len() == 31 => {
                match (
                    function_value.get(0),
                    function_value.get(1),
                    function_value.get(2),
                    function_value.get(3),
                    function_value.get(4),
                    function_value.get(6),
                    function_value.get(8),
                    function_value.get(9),
                    function_value.get(10),
                    function_value.get(11),
                    function_value.get(12),
                    function_value.get(14),
                    function_value.get(16),
                    function_value.get(18),
                    function_value.get(20),
                    function_value.get(22),
                    function_value.get(24),
                    function_value.get(25),
                    function_value.get(26),
                    function_value.get(28),
                    function_value.get(30),
                ) {
                    (
                        Some(first),
                        Some(first_comma),
                        Some(second),
                        Some(second_comma),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: fourth_number,
                            ..
                        })),
                        Some(fifth),
                        Some(fifth_comma),
                        Some(sixth),
                        Some(sixth_comma),
                        Some(Value::Number(Number {
                            value: seventh_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: eighth_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: ninth_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: tenth_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: eleventh_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: twelfth_number,
                            ..
                        })),
                        Some(thirteenth),
                        Some(thirteenth_comma),
                        Some(fourteenth),
                        Some(Value::Number(Number {
                            value: fifteenth_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: sixteenth_number,
                            ..
                        })),
                    ) if *third_number == 0.0
                        && *fourth_number == 0.0
                        && *seventh_number == 0.0
                        && *eighth_number == 0.0
                        && *ninth_number == 0.0
                        && *tenth_number == 0.0
                        && *eleventh_number == 1.0
                        && *twelfth_number == 0.0
                        && *fifteenth_number == 0.0
                        && *sixteenth_number == 1.0 =>
                    {
                        *name = Ident {
                            span: name.span,
                            value: "matrix".into(),
                            raw: "matrix".into(),
                        };
                        *function_value = vec![
                            first.clone(),
                            first_comma.clone(),
                            second.clone(),
                            second_comma.clone(),
                            fifth.clone(),
                            fifth_comma.clone(),
                            sixth.clone(),
                            sixth_comma.clone(),
                            thirteenth.clone(),
                            thirteenth_comma.clone(),
                            fourteenth.clone(),
                        ];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "rotate3d" && function_value.len() == 7 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                    function_value.get(6),
                ) {
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 1.0 && *second_number == 0.0 && *third_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "rotateX".into(),
                            raw: "rotateX".into(),
                        };
                        *function_value = vec![fourth_value.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 0.0 && *second_number == 1.0 && *third_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "rotateY".into(),
                            raw: "rotateY".into(),
                        };
                        *function_value = vec![fourth_value.clone()];
                    }
                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                        Some(Value::Number(Number {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 0.0 && *second_number == 0.0 && *third_number == 1.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "rotate".into(),
                            raw: "rotate".into(),
                        };
                        *function_value = vec![fourth_value.clone()];
                    }
                    _ => {}
                }
            }
            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "rotatez" && function_value.len() == 1 => {
                *name = Ident {
                    span: name.span,
                    value: "rotate".into(),
                    raw: "rotate".into(),
                };
            }

            Value::Function(Function {
                name,
                value: function_value,
                ..
            }) if &*name.value.to_lowercase() == "skew" && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(first),
                        Some(Value::Number(Number {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "skewX".into(),
                            raw: "skewX".into(),
                        };
                        *function_value = vec![first.clone()];
                    }

                    (
                        Some(Value::Number(Number {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 0.0 => {
                        *name = Ident {
                            span: name.span,
                            value: "skewY".into(),
                            raw: "skewY".into(),
                        };
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
