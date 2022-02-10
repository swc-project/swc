use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn minify(stylesheet: &mut Stylesheet) {
    stylesheet.visit_mut_with(&mut compress_empty_qualified_rule());
    stylesheet.visit_mut_with(&mut compress_time());
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
                if block.value.len() == 0 {
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

        match &*time.unit.value {
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
