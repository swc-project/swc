use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_length() -> impl VisitMut {
    CompressLength {
        in_math_function: false,
    }
}

struct CompressLength {
    in_math_function: bool,
}

impl CompressLength {
    fn convert(&mut self, value: f64, from_unit: &str, to_unit: &str) -> f64 {
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

impl VisitMut for CompressLength {
    fn visit_mut_calc_sum(&mut self, function: &mut CalcSum) {
        let old_in_math_function = self.in_math_function;

        self.in_math_function = true;

        function.visit_mut_children_with(self);

        self.in_math_function = old_in_math_function;
    }

    fn visit_mut_component_value(&mut self, component_value: &mut ComponentValue) {
        component_value.visit_mut_children_with(self);

        if self.in_math_function {
            return;
        }

        match &component_value {
            ComponentValue::Dimension(Dimension::Length(Length {
                value:
                    Number {
                        value: number_value,
                        ..
                    },
                span,
                ..
            })) if *number_value == 0.0 => {
                *component_value = ComponentValue::Number(Number {
                    span: *span,
                    value: 0.0,
                    raw: None,
                });
            }
            _ => {}
        }
    }

    fn visit_mut_length(&mut self, length: &mut Length) {
        length.visit_mut_children_with(self);

        let from = length.unit.value.to_ascii_lowercase();
        let value = length.value.value;

        match from {
            "cm" => {
                if value % 2.54 == 0.0 {
                    let new_value = self.convert(value, from, "in");

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
                    let new_value = self.convert(value, from, "mm");

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
                    let new_value = self.convert(value, from, "in");

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
                    let new_value = self.convert(value, from, "cm");

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
                    let new_value = self.convert(value, from, "cm");

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
                    let new_value = self.convert(value, from, "in");

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
                    let new_value = self.convert(value, from, "in");

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
                    let new_value = self.convert(value, from, "in");

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
                    let new_value = self.convert(value, from, "pc");

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
                    let new_value = self.convert(value, from, "px");

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
