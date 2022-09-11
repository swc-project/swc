use swc_atoms::js_word;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_frequency() -> impl VisitMut {
    CompressFrequency {}
}

struct CompressFrequency {}

impl VisitMut for CompressFrequency {
    fn visit_mut_frequency(&mut self, frequency: &mut Frequency) {
        frequency.visit_mut_children_with(self);

        match frequency.unit.value.to_ascii_lowercase() {
            js_word!("hz")
                if frequency.value.value > 0.0 && frequency.value.value % 1000.0 == 0.0 =>
            {
                let new_value = frequency.value.value / 1000.0;

                frequency.value = Number {
                    span: frequency.value.span,
                    value: new_value,
                    raw: None,
                };
                frequency.unit = Ident {
                    span: frequency.unit.span,
                    value: "khz".into(),
                    raw: None,
                };
            }
            js_word!("khz")
                if frequency.value.value == 0.0
                    || (frequency.value.value > 0.0 && frequency.value.value < 0.1) =>
            {
                let new_value = frequency.value.value * 1000.0;

                frequency.value = Number {
                    value: new_value,
                    raw: None,
                    span: frequency.span,
                };
                frequency.unit = Ident {
                    span: frequency.unit.span,
                    value: "hz".into(),
                    raw: None,
                };
            }
            _ => {}
        }
    }
}
