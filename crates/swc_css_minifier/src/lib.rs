use core::f64::consts::PI;

use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn minify(stylesheet: &mut Stylesheet) {
    stylesheet.visit_mut_with(&mut compress_empty_qualified_rule());
    stylesheet.visit_mut_with(&mut compress_time());
    stylesheet.visit_mut_with(&mut compress_angle());
}

fn compress_empty_qualified_rule() -> impl VisitMut {
    CompressEmptyQualifiedRule {}
}

struct CompressEmptyQualifiedRule {}

impl VisitMut for CompressEmptyQualifiedRule {
    fn visit_mut_stylesheet(&mut self, stylesheet: &mut Stylesheet) {
        stylesheet.visit_mut_children_with(self);

        stylesheet.rules.retain(|rule| {
            if let Rule::QualifiedRule(QualifiedRule { block, .. }) = rule {
                if block.value.is_empty() {
                    return false;
                }
            }

            true
        });
    }
}

fn compress_time() -> impl VisitMut {
    CompressTime {}
}

struct CompressTime {}

impl VisitMut for CompressTime {
    fn visit_mut_time(&mut self, time: &mut Time) {
        time.visit_mut_children_with(self);

        match &*time.unit.value.to_lowercase() {
            "ms" if time.value.value == 0.0 || time.value.value >= 100.0 => {
                let new_value = time.value.value / 1000.0;

                time.value = Number {
                    span: time.value.span,
                    value: new_value,
                    raw: new_value.to_string().into(),
                };
                time.unit = Ident {
                    span: time.unit.span,
                    value: "s".into(),
                    raw: "s".into(),
                };
            }
            "s" if time.value.value > 0.0 && time.value.value < 0.1 => {
                let new_value = time.value.value * 1000.0;

                time.value = Number {
                    value: new_value,
                    raw: new_value.to_string().into(),
                    span: time.span,
                };
                time.unit = Ident {
                    span: time.unit.span,
                    value: "ms".into(),
                    raw: "ms".into(),
                };
            }
            _ => {}
        }
    }
}

fn compress_angle() -> impl VisitMut {
    CompressAngle {}
}

struct CompressAngle {}

impl CompressAngle {}

impl VisitMut for CompressAngle {
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

    return value;
}
