use std::f64::consts::PI;

use swc_css_ast::{
    matches_eq, AbsoluteColorBase, AlphaValue, Angle, ComponentValue, Hue, Number, Percentage,
};
use swc_css_utils::{clamp_unit_f64, round_alpha};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_rgb_and_hsl(&mut self, n: &mut AbsoluteColorBase) {
        if let AbsoluteColorBase::Function(function) = n {
            let is_rgb = matches_eq!(function.name, "rgb", "rgba");
            let is_hsl = matches_eq!(function.name, "hsl", "hsla");

            if is_rgb {
                function.value = function
                    .value
                    .drain(..)
                    .map(|n| match n {
                        ComponentValue::Percentage(box Percentage {
                            span,
                            value: Number { value, .. },
                            ..
                        }) => ComponentValue::Number(Box::new(Number {
                            span,
                            value: clamp_unit_f64(value / 100.0) as f64,
                            raw: None,
                        })),
                        _ => n,
                    })
                    .collect();
            } else if is_hsl {
                function.value = function
                    .value
                    .drain(..)
                    .map(|n| match n {
                        ComponentValue::Hue(box Hue::Angle(Angle {
                            span,
                            value: Number { value, .. },
                            unit,
                            ..
                        })) => {
                            let value = match &*unit.value.to_ascii_lowercase() {
                                "deg" => value,
                                "grad" => value * 180.0 / 200.0,
                                "rad" => value * 180.0 / PI,
                                "turn" => value * 360.0,
                                _ => {
                                    unreachable!();
                                }
                            };

                            ComponentValue::Number(Box::new(Number {
                                span,
                                value: value.round(),
                                raw: None,
                            }))
                        }
                        _ => n,
                    })
                    .collect();
            }

            if is_rgb || is_hsl {
                if let Some(ComponentValue::AlphaValue(box alpha_value)) = function.value.last_mut()
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
