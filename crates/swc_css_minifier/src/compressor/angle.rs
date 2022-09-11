use core::f64::consts::PI;

use swc_atoms::{js_word, JsWord};
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_angle_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        if self.ctx.in_transform_function {
            match &component_value {
                ComponentValue::Dimension(Dimension::Angle(Angle {
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
    }

    pub(super) fn compress_angle(&mut self, angle: &mut Angle) {
        if self.ctx.in_keyframe_block {
            return;
        }

        let from = match get_angle_type(&angle.unit.value.to_ascii_lowercase()) {
            Some(angel_type) => angel_type,
            None => return,
        };

        let deg = to_deg(angle.value.value, from);

        if deg.fract() != 0.0 {
            return;
        }

        let deg = normalize_deg(deg);

        angle.value = Number {
            value: deg,
            raw: None,
            span: angle.span,
        };

        angle.unit = Ident {
            span: angle.unit.span,
            value: "deg".into(),
            raw: None,
        };
    }
}

pub(crate) enum AngleType {
    Deg,
    Grad,
    Rad,
    Turn,
}

pub(crate) fn to_deg(value: f64, from: AngleType) -> f64 {
    match from {
        AngleType::Deg => value,
        AngleType::Grad => value * 180.0 / 200.0,
        AngleType::Turn => value * 360.0,
        AngleType::Rad => value * 180.0 / PI,
    }
}

pub(crate) fn get_angle_type(unit: &JsWord) -> Option<AngleType> {
    match *unit {
        js_word!("deg") => Some(AngleType::Deg),
        js_word!("grad") => Some(AngleType::Grad),
        js_word!("rad") => Some(AngleType::Rad),
        js_word!("turn") => Some(AngleType::Turn),
        _ => None,
    }
}

fn normalize_deg(mut value: f64) -> f64 {
    value = (value % 360.0 + 360.0) % 360.0;

    if value > 350.0 {
        return value - 360.0;
    }

    value
}
