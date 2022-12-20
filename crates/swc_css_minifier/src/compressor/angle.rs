use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_utils::angle_to_deg;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_angle_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        if self.ctx.in_transform_function {
            match &component_value {
                ComponentValue::Dimension(box Dimension::Angle(Angle {
                    value:
                        Number {
                            value: number_value,
                            ..
                        },
                    span,
                    ..
                })) if *number_value == 0.0 => {
                    *component_value = ComponentValue::Number(Box::new(Number {
                        span: *span,
                        value: 0.0,
                        raw: None,
                    }));
                }
                _ => {}
            }
        }
    }

    pub(super) fn compress_angle(&mut self, angle: &mut Angle) {
        if self.ctx.in_keyframe_block {
            return;
        }

        let deg = angle_to_deg(angle.value.value, &angle.unit.value);

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
            value: js_word!("deg"),
            raw: None,
        };
    }
}

fn normalize_deg(mut value: f64) -> f64 {
    value = (value % 360.0 + 360.0) % 360.0;

    if value > 350.0 {
        return value - 360.0;
    }

    value
}
