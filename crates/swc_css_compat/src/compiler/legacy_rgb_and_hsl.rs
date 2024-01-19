use std::f64::consts::PI;

use swc_css_ast::{
    matches_eq_ignore_ascii_case, AbsoluteColorBase, AlphaValue, Angle, ComponentValue, Number,
    Percentage,
};
use swc_css_utils::{clamp_unit_f64, round_alpha};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_rgb_and_hsl(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            let is_rgb = matches_eq_ignore_ascii_case!(function.name.as_str(), "rgb", "rgba");
            let is_hsl = matches_eq_ignore_ascii_case!(function.name.as_str(), "hsl", "hsla");

            if is_rgb {
                function.value = function
                    .value
                    .drain(..)
                    .map(|n| match n {
                        ComponentValue::Percentage(percentage) => {
                            let Percentage {
                                span,
                                value: Number { value, .. },
                                ..
                            } = &*percentage;

                            ComponentValue::Number(Box::new(Number {
                                span: *span,
                                value: clamp_unit_f64(value / 100.0) as f64,
                                raw: None,
                            }))
                        }
                        _ => n,
                    })
                    .collect();
            } else if is_hsl {
                function.value = function
                    .value
                    .drain(..)
                    .map(|n| {
                        if let Some(Angle {
                            span,
                            value: Number { value, .. },
                            unit,
                            ..
                        }) = n.as_hue().and_then(|hue| hue.as_angle())
                        {
                            let value = match &*unit.value.to_ascii_lowercase() {
                                "deg" => *value,
                                "grad" => value * 180.0 / 200.0,
                                "rad" => value * 180.0 / PI,
                                "turn" => value * 360.0,
                                _ => {
                                    unreachable!();
                                }
                            };

                            ComponentValue::Number(Box::new(Number {
                                span: *span,
                                value: value.round(),
                                raw: None,
                            }))
                        } else {
                            n
                        }
                    })
                    .collect();
            }

            if is_rgb || is_hsl {
                if let Some(alpha_value) = function
                    .value
                    .last_mut()
                    .and_then(|component_value| component_value.as_mut_alpha_value())
                    .map(|alpha_value| alpha_value.as_mut())
                {
                    if let AlphaValue::Percentage(Percentage {
                        span,
                        value: Number { value: a, .. },
                        ..
                    }) = alpha_value
                    {
                        *alpha_value = AlphaValue::Number(Number {
                            span: *span,
                            value: round_alpha(*a / 100.0),
                            raw: None,
                        });
                    }
                }
            }
        }
    }
}
