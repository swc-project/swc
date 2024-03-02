use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    fn convert_length(&mut self, value: f64, from_unit: &str, to_unit: &str) -> f64 {
        match to_unit {
            "cm" => match from_unit {
                "cm" => value,
                "mm" => value / 10.0,
                "q" => value / 40.0,
                "in" => 2.54 * value,
                "pc" => 2.54 / 6.0 * value,
                "pt" => 2.54 / 72.0 * value,
                "px" => 2.54 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            "mm" => match from_unit {
                "cm" => 10.0 * value,
                "mm" => value,
                "q" => value / 4.0,
                "in" => 25.4 * value,
                "pc" => 25.4 / 6.0 * value,
                "pt" => 25.4 / 72.0 * value,
                "px" => 25.4 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            "q" => match from_unit {
                "cm" => 40.0 * value,
                "mm" => 4.0 * value,
                "q" => value,
                "in" => 101.6 * value,
                "pc" => 101.6 / 6.0 * value,
                "pt" => 101.6 / 72.0 * value,
                "px" => 101.6 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            "in" => match from_unit {
                "cm" => value / 2.54,
                "mm" => value / 25.4,
                "q" => value / 101.6,
                "in" => value,
                "pc" => value / 6.0,
                "pt" => value / 72.0,
                "px" => value / 96.0,
                _ => {
                    unreachable!()
                }
            },
            "pc" => match from_unit {
                "cm" => 6.0 / 2.54 * value,
                "mm" => 6.0 / 25.4 * value,
                "q" => 6.0 / 101.6 * value,
                "in" => 6.0 * value,
                "pc" => value,
                "pt" => 6.0 / 72.0 * value,
                "px" => 6.0 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            "pt" => match from_unit {
                "cm" => 72.0 / 2.54 * value,
                "mm" => 72.0 / 25.4 * value,
                "q" => 72.0 / 101.6 * value,
                "in" => 72.0 * value,
                "pc" => 12.0 * value,
                "pt" => value,
                "px" => 0.75 * value,
                _ => {
                    unreachable!()
                }
            },
            "px" => match from_unit {
                "cm" => 96.0 / 2.54 * value,
                "mm" => 96.0 / 25.4 * value,
                "q" => 96.0 / 101.6 * value,
                "in" => 96.0 * value,
                "pc" => 16.0 * value,
                "pt" => 96.0 / 72.0 * value,
                "px" => value,
                _ => {
                    unreachable!()
                }
            },
            _ => {
                unreachable!()
            }
        }
    }
}

impl Compressor {
    pub(super) fn length_to_zero(&mut self, n: &mut Length) -> Option<Number> {
        match &n {
            Length {
                value:
                    Number {
                        value: number_value,
                        ..
                    },
                span,
                ..
            } if *number_value == 0.0 => Some(Number {
                span: *span,
                value: 0.0,
                raw: None,
            }),
            _ => None,
        }
    }

    pub(super) fn compress_component_value_for_length(&mut self, n: &mut ComponentValue) {
        if self.ctx.in_math_function {
            return;
        }

        let length = match n {
            ComponentValue::Dimension(dimension) => dimension.as_mut_length(),
            ComponentValue::LengthPercentage(length_percentage) => {
                length_percentage.as_mut_length()
            }
            _ => None,
        };

        let Some(number) = length.and_then(|length| self.length_to_zero(length)) else {
            return;
        };

        *n = ComponentValue::Number(Box::new(number));
    }

    pub(super) fn compress_length(&mut self, length: &mut Length) {
        let value = length.value.value;

        match &*length.unit.value {
            "cm" => {
                if value % 2.54 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "in");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "in".into(),
                        raw: None,
                    };
                } else if value <= 0.1 {
                    let new_value = self.convert_length(value, &length.unit.value, "mm");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "mm".into(),
                        raw: None,
                    };
                }
            }
            "mm" => {
                if value % 25.4 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "in");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "in".into(),
                        raw: None,
                    };
                } else if value % 10.0 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "cm");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "cm".into(),
                        raw: None,
                    };
                }
            }
            "q" => {
                if value > 80.0 && value % 40.0 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "cm");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "cm".into(),
                        raw: None,
                    };
                } else if value % 101.6 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "in");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "in".into(),
                        raw: None,
                    };
                }
            }
            "pc" => {
                if value % 6.0 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "in");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "in".into(),
                        raw: None,
                    };
                }
            }
            "pt" => {
                if value % 72.0 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "in");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "in".into(),
                        raw: None,
                    };
                } else if value % 12.0 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "pc");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "pc".into(),
                        raw: None,
                    };
                } else if value % 0.75 == 0.0 {
                    let new_value = self.convert_length(value, &length.unit.value, "px");

                    length.value = Number {
                        span: length.value.span,
                        value: new_value,
                        raw: None,
                    };
                    length.unit = Ident {
                        span: length.unit.span,
                        value: "px".into(),
                        raw: None,
                    };
                }
            }
            _ => {}
        }
    }
}
