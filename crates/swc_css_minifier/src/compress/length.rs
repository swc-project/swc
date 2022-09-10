use swc_atoms::{js_word, JsWord};
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
    fn convert(&mut self, value: f64, from_unit: JsWord, to_unit: JsWord) -> f64 {
        match to_unit {
            js_word!("cm") => match from_unit {
                js_word!("cm") => value,
                js_word!("mm") => value / 10.0,
                js_word!(js_word!("q")) => value / 40.0,
                js_word!("in") => 2.54 * value,
                js_word!("pc") => 2.54 / 6.0 * value,
                js_word!("pt") => 2.54 / 72.0 * value,
                js_word!("px") => 2.54 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            js_word!("mm") => match from_unit {
                js_word!("cm") => 10.0 * value,
                js_word!("mm") => value,
                js_word!("q") => value / 4.0,
                js_word!("in") => 25.4 * value,
                js_word!("pc") => 25.4 / 6.0 * value,
                js_word!("pt") => 25.4 / 72.0 * value,
                js_word!("px") => 25.4 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            js_word!("q") => match from_unit {
                js_word!("cm") => 40.0 * value,
                js_word!("mm") => 4.0 * value,
                js_word!("q") => value,
                js_word!("in") => 101.6 * value,
                js_word!("pc") => 101.6 / 6.0 * value,
                js_word!("pt") => 101.6 / 72.0 * value,
                js_word!("px") => 101.6 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            js_word!("in") => match from_unit {
                js_word!("cm") => value / 2.54,
                js_word!("mm") => value / 25.4,
                js_word!("q") => value / 101.6,
                js_word!("in") => value,
                js_word!("pc") => value / 6.0,
                js_word!("pt") => value / 72.0,
                js_word!("px") => value / 96.0,
                _ => {
                    unreachable!()
                }
            },
            js_word!("pc") => match from_unit {
                js_word!("cm") => 6.0 / 2.54 * value,
                js_word!("mm") => 6.0 / 25.4 * value,
                js_word!("q") => 6.0 / 101.6 * value,
                js_word!("in") => 6.0 * value,
                js_word!("pc") => value,
                js_word!("pt") => 6.0 / 72.0 * value,
                js_word!("px") => 6.0 / 96.0 * value,
                _ => {
                    unreachable!()
                }
            },
            js_word!("pt") => match from_unit {
                js_word!("cm") => 72.0 / 2.54 * value,
                js_word!("mm") => 72.0 / 25.4 * value,
                js_word!("q") => 72.0 / 101.6 * value,
                js_word!("in") => 72.0 * value,
                js_word!("pc") => 12.0 * value,
                js_word!("pt") => value,
                js_word!("px") => 0.75 * value,
                _ => {
                    unreachable!()
                }
            },
            js_word!("px") => match from_unit {
                js_word!("cm") => 96.0 / 2.54 * value,
                js_word!("mm") => 96.0 / 25.4 * value,
                js_word!("q") => 96.0 / 101.6 * value,
                js_word!("in") => 96.0 * value,
                js_word!("pc") => 16.0 * value,
                js_word!("pt") => 96.0 / 72.0 * value,
                js_word!("px") => value,
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
            js_word!("cm") => {
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
            js_word!("mm") => {
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
            js_word!("q") => {
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
            js_word!("pc") => {
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
            js_word!("pt") => {
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
