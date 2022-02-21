use core::f64::consts::PI;

use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_angle() -> impl VisitMut {
    CompressAngle {
        in_transform_function: false,
    }
}

struct CompressAngle {
    in_transform_function: bool,
}

impl CompressAngle {}

impl VisitMut for CompressAngle {
    fn visit_mut_function(&mut self, function: &mut Function) {
        match &function.name {
            Ident { value, .. }
                if matches!(
                    &*value.to_lowercase(),
                    "rotate"
                        | "skew"
                        | "skewx"
                        | "skewy"
                        | "rotate3d"
                        | "rotatex"
                        | "rotatey"
                        | "rotatez"
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

    fn visit_mut_value(&mut self, value: &mut Value) {
        value.visit_mut_children_with(self);

        if self.in_transform_function {
            match &value {
                Value::Dimension(Dimension::Angle(Angle {
                    value:
                        Number {
                            value: number_value,
                            ..
                        },
                    span,
                    ..
                })) if *number_value == 0.0 => {
                    *value = Value::Number(Number {
                        span: *span,
                        value: 0.0,
                        raw: "0".into(),
                    });
                }
                _ => {}
            }
        }
    }

    fn visit_mut_angle(&mut self, angle: &mut Angle) {
        angle.visit_mut_children_with(self);

        let from = match &*angle.unit.value.to_lowercase() {
            "deg" => AngleType::Deg,
            "grad" => AngleType::Grad,
            "rad" => AngleType::Rad,
            "turn" => AngleType::Turn,
            _ => return,
        };

        let deg = to_deg(angle.value.value, from);

        if deg.fract() != 0.0 {
            return;
        }

        let deg = normalize_deg(deg);

        angle.value = Number {
            value: deg,
            raw: deg.to_string().into(),
            span: angle.span,
        };

        angle.unit = Ident {
            span: angle.unit.span,
            value: "deg".into(),
            raw: "deg".into(),
        };
    }
}

enum AngleType {
    Deg,
    Grad,
    Rad,
    Turn,
}

fn to_deg(value: f64, from: AngleType) -> f64 {
    match from {
        AngleType::Deg => value,
        AngleType::Grad => value * 180.0 / 200.0,
        AngleType::Turn => value * 360.0,
        AngleType::Rad => value * 180.0 / PI,
    }
}

fn normalize_deg(mut value: f64) -> f64 {
    value = (value % 360.0 + 360.0) % 360.0;

    if value > 350.0 {
        return value - 360.0;
    }

    value
}
