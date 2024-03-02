use swc_css_ast::{
    AbsoluteColorBase, AlphaValue, Angle, ComponentValue, Delimiter, DelimiterValue, FunctionName,
    Hue, Ident, Number, Percentage,
};
use swc_css_utils::{angle_to_deg, hwb_to_rgb, to_rgb255};

use crate::compiler::Compiler;

impl Compiler {
    fn get_hue(&self, hue: Option<&ComponentValue>) -> Option<f64> {
        match hue {
            Some(ComponentValue::Hue(hue)) => {
                let mut value = match &**hue {
                    Hue::Number(Number { value, .. }) => *value,
                    Hue::Angle(Angle {
                        value: Number { value, .. },
                        unit: Ident { value: unit, .. },
                        ..
                    }) => angle_to_deg(*value, unit),
                };

                value %= 360.0;

                if value < 0.0 {
                    value += 360.0;
                }

                Some(value)
            }
            Some(ComponentValue::Ident(ident)) if ident.value.eq_ignore_ascii_case("none") => {
                Some(0.0)
            }
            _ => None,
        }
    }

    fn get_percentage(&self, percentage: Option<&ComponentValue>) -> Option<f64> {
        match percentage {
            Some(ComponentValue::Percentage(percentage)) => {
                let Number { value, .. } = &percentage.value;
                if *value > 100.0 {
                    return Some(1.0);
                } else if *value < 0.0 {
                    return Some(0.0);
                }

                Some(*value / 100.0)
            }
            Some(ComponentValue::Ident(ident)) if ident.value.eq_ignore_ascii_case("none") => {
                Some(0.0)
            }
            _ => None,
        }
    }

    fn get_alpha_value(&self, alpha_value: Option<&ComponentValue>) -> Option<f64> {
        let Some(alpha_value) = alpha_value else {
            return Some(1.0);
        };

        match &alpha_value {
            ComponentValue::AlphaValue(alpha_value) => match &**alpha_value {
                AlphaValue::Number(Number { value, .. }) => {
                    if *value > 1.0 {
                        return Some(1.0);
                    } else if *value < 0.0 {
                        return Some(0.0);
                    }

                    Some(*value)
                }
                AlphaValue::Percentage(Percentage {
                    value: Number { value, .. },
                    ..
                }) => {
                    if *value > 100.0 {
                        return Some(1.0);
                    } else if *value < 0.0 {
                        return Some(0.0);
                    }

                    Some(*value / 100.0)
                }
            },
            ComponentValue::Ident(ident) if ident.value.eq_ignore_ascii_case("none") => Some(0.0),
            _ => None,
        }
    }

    pub(crate) fn process_color_hwb(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            if function.name != "hwb" {
                return;
            }

            let h = match self.get_hue(function.value.first()) {
                Some(value) => value,
                _ => return,
            };
            let w = match self.get_percentage(function.value.get(1)) {
                Some(value) => value,
                _ => return,
            };
            let b = match self.get_percentage(function.value.get(2)) {
                Some(value) => value,
                _ => return,
            };
            let a = match self.get_alpha_value(function.value.get(4)) {
                Some(value) => value,
                _ => return,
            };

            let rgb = to_rgb255(hwb_to_rgb([h, w, b]));

            if a == 1.0 {
                *n = AbsoluteColorBase::Function(swc_css_ast::Function {
                    name: FunctionName::Ident(Ident {
                        value: "rgb".into(),
                        span: Default::default(),
                        raw: None,
                    }),
                    value: vec![
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[0].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: Default::default(),
                        })),
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[1].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: Default::default(),
                        })),
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[2].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                    ],
                    span: Default::default(),
                });
            } else {
                *n = AbsoluteColorBase::Function(swc_css_ast::Function {
                    name: FunctionName::Ident(Ident {
                        value: "rgba".into(),
                        span: Default::default(),
                        raw: None,
                    }),
                    value: vec![
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[0].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: Default::default(),
                        })),
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[1].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: Default::default(),
                        })),
                        ComponentValue::Number(Box::new(Number {
                            value: rgb[2].round(),
                            span: Default::default(),
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: Default::default(),
                        })),
                        ComponentValue::AlphaValue(Box::new(AlphaValue::Number(Number {
                            value: a,
                            span: Default::default(),
                            raw: None,
                        }))),
                    ],
                    span: Default::default(),
                });
            }
        }
    }
}
