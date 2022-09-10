use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_time() -> impl VisitMut {
    CompressTime {}
}

struct CompressTime {}

impl VisitMut for CompressTime {
    fn visit_mut_time(&mut self, time: &mut Time) {
        time.visit_mut_children_with(self);

        match time.unit.value.to_ascii_lowercase() {
            js_word!("ms") if time.value.value == 0.0 || time.value.value >= 100.0 => {
                let new_value = time.value.value / 1000.0;

                time.value = Number {
                    span: time.value.span,
                    value: new_value,
                    raw: None,
                };
                time.unit = Ident {
                    span: time.unit.span,
                    value: "s".into(),
                    raw: None,
                };
            }
            js_word!("s") if time.value.value > 0.0 && time.value.value < 0.1 => {
                let new_value = time.value.value * 1000.0;

                time.value = Number {
                    value: new_value,
                    raw: None,
                    span: time.span,
                };
                time.unit = Ident {
                    span: time.unit.span,
                    value: "ms".into(),
                    raw: None,
                };
            }
            _ => {}
        }
    }
}
