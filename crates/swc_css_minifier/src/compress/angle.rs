use core::f64::consts::PI;

use swc_atoms::{js_word, JsWord};
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_angle() -> impl VisitMut {
    CompressAngle {
        in_transform_function: false,
        in_keyframe_block: false,
    }
}

struct CompressAngle {
    in_transform_function: bool,
    in_keyframe_block: bool,
}

impl VisitMut for CompressAngle {
    fn visit_mut_keyframe_block(&mut self, keyframe_block: &mut KeyframeBlock) {
        let old_in_keyframe_block = self.in_keyframe_block;

        self.in_keyframe_block = true;

        keyframe_block.visit_mut_children_with(self);

        self.in_keyframe_block = old_in_keyframe_block;
    }

    fn visit_mut_function(&mut self, function: &mut Function) {
        match &function.name {
            Ident { value, .. }
                if matches!(
                    value.to_ascii_lowercase(),
                    js_word!("rotate")
                        | js_word!("skew")
                        | js_word!("skewx")
                        | js_word!("skewy")
                        | js_word!("rotate3d")
                        | js_word!("rotatex")
                        | js_word!("rotatey")
                        | js_word!("rotatez")
                ) =>
            {
                let old_in_block = self.in_transform_function;

                self.in_transform_function = true;

                function.visit_mut_children_with(self);

                self.in_transform_function = old_in_block;
            }
            _ => {
                function.visit_mut_children_with(self);
            }
        }
    }

    fn visit_mut_component_value(&mut self, component_value: &mut ComponentValue) {
        component_value.visit_mut_children_with(self);

        if self.in_transform_function {
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

    fn visit_mut_angle(&mut self, angle: &mut Angle) {
        angle.visit_mut_children_with(self);

        if self.in_keyframe_block {
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
