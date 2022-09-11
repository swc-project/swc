use swc_atoms::js_word;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_time(&self, time: &mut Time) {
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
