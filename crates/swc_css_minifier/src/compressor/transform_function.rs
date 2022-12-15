use swc_atoms::js_word;
use swc_common::Spanned;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_transform_function(&self, component_value: &mut ComponentValue) {
        match component_value {
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("translate") && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(first),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 0 => {
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("translatey"),
                            raw: None,
                        });
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("translate3d") && function_value.len() == 5 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                ) {
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(third),
                    ) if *first_number == 0 && *second_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("translatez"),
                            raw: None,
                        });
                        *function_value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("scale") && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(
                            first @ ComponentValue::Integer(box Integer {
                                value: first_number,
                                ..
                            }),
                        ),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                    ) if first_number == second_number => {
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(first),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("scalex"),
                            raw: None,
                        });
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("scaley"),
                            raw: None,
                        });
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("scale3d") && function_value.len() == 5 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                ) {
                    (
                        Some(first),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                    ) if *second_number == 1 && *third_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("scalex"),
                            raw: None,
                        });
                        *function_value = vec![first.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                    ) if *first_number == 1 && *third_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("scaley"),
                            raw: None,
                        });
                        *function_value = vec![second.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(third),
                    ) if *first_number == 1 && *second_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("scalez"),
                            raw: None,
                        });
                        *function_value = vec![third.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("matrix3d") && function_value.len() == 31 => {
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
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: fourth_number,
                            ..
                        })),
                        Some(fifth),
                        Some(fifth_comma),
                        Some(sixth),
                        Some(sixth_comma),
                        Some(ComponentValue::Integer(box Integer {
                            value: seventh_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: eighth_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: ninth_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: tenth_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: eleventh_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: twelfth_number,
                            ..
                        })),
                        Some(thirteenth),
                        Some(thirteenth_comma),
                        Some(fourteenth),
                        Some(ComponentValue::Integer(box Integer {
                            value: fifteenth_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: sixteenth_number,
                            ..
                        })),
                    ) if *third_number == 0
                        && *fourth_number == 0
                        && *seventh_number == 0
                        && *eighth_number == 0
                        && *ninth_number == 0
                        && *tenth_number == 0
                        && *eleventh_number == 1
                        && *twelfth_number == 0
                        && *fifteenth_number == 0
                        && *sixteenth_number == 1 =>
                    {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("matrix"),
                            raw: None,
                        });
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
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("rotate3d") && function_value.len() == 7 => {
                match (
                    function_value.get(0),
                    function_value.get(2),
                    function_value.get(4),
                    function_value.get(6),
                ) {
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 1 && *second_number == 0 && *third_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("rotatex"),
                            raw: None,
                        });
                        *function_value = vec![fourth_value.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 0 && *second_number == 1 && *third_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("rotatey"),
                            raw: None,
                        });
                        *function_value = vec![fourth_value.clone()];
                    }
                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                        Some(ComponentValue::Integer(box Integer {
                            value: third_number,
                            ..
                        })),
                        Some(fourth_value),
                    ) if *first_number == 0 && *second_number == 0 && *third_number == 1 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("rotate"),
                            raw: None,
                        });
                        *function_value = vec![fourth_value.clone()];
                    }
                    _ => {}
                }
            }
            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("rotatez") && function_value.len() == 1 => {
                *name = FunctionName::Ident(Ident {
                    span: name.span(),
                    value: js_word!("rotate"),
                    raw: None,
                });
            }

            ComponentValue::Function(box Function {
                name,
                value: function_value,
                ..
            }) if name == &js_word!("skew") && function_value.len() == 3 => {
                match (function_value.get(0), function_value.get(2)) {
                    (
                        Some(first),
                        Some(ComponentValue::Integer(box Integer {
                            value: second_number,
                            ..
                        })),
                    ) if *second_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("skewx"),
                            raw: None,
                        });
                        *function_value = vec![first.clone()];
                    }

                    (
                        Some(ComponentValue::Integer(box Integer {
                            value: first_number,
                            ..
                        })),
                        Some(second),
                    ) if *first_number == 0 => {
                        *name = FunctionName::Ident(Ident {
                            span: name.span(),
                            value: js_word!("skewy"),
                            raw: None,
                        });
                        *function_value = vec![second.clone()];
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
