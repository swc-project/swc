use swc_common::DUMMY_SP;
use swc_css_ast::*;

use super::Compressor;

impl Compressor {
    pub(super) fn compress_alpha_value(&mut self, alpha_value: &mut AlphaValue) {
        match alpha_value {
            AlphaValue::Percentage(Percentage {
                value: number,
                span,
                ..
            }) if number.value % 10.0 == 0.0 => {
                let new_value = number.value / 100.0;

                *alpha_value = AlphaValue::Number(Number {
                    span: *span,
                    value: new_value,
                    raw: None,
                });
            }
            AlphaValue::Number(Number { value, span, .. }) if *value < 0.1 => {
                let new_value = *value * 100.0;

                *alpha_value = AlphaValue::Percentage(Percentage {
                    span: *span,
                    value: Number {
                        span: DUMMY_SP,
                        value: new_value,
                        raw: None,
                    },
                });
            }
            _ => {}
        }
    }

    pub(super) fn compress_alpha_value_in_component_value(
        &mut self,
        component_value: &mut ComponentValue,
    ) {
        if self.ctx.preserve_alpha_value {
            return;
        }

        match component_value {
            ComponentValue::Percentage(Percentage {
                span,
                value: number,
            }) if number.value % 10.0 == 0.0 => {
                let new_value = number.value / 100.0;

                *component_value = ComponentValue::Number(Number {
                    span: *span,
                    value: new_value,
                    raw: None,
                });
            }
            _ => {}
        }
    }
}
