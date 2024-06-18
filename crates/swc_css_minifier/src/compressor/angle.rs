use swc_css_ast::*;
use swc_css_utils::angle_to_deg;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_angle_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        if !self.ctx.in_transform_function {
            return;
        }

        if let Some(span) = component_value
            .as_dimension()
            .and_then(|dimension| dimension.as_angle())
            .filter(|angle| angle.value.value == 0.0)
            .map(|angle| angle.span)
        {
            *component_value = ComponentValue::Number(Box::new(Number {
                span,
                value: 0.0,
                raw: None,
            }));
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
