use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_alpha_value() -> impl VisitMut {
    CompressAlphaValue { preserve: true }
}

struct CompressAlphaValue {
    preserve: bool,
}

impl VisitMut for CompressAlphaValue {
    fn visit_mut_alpha_value(&mut self, alpha_value: &mut AlphaValue) {
        alpha_value.visit_mut_children_with(self);

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

    fn visit_mut_declaration(&mut self, declaration: &mut Declaration) {
        declaration.visit_mut_children_with(self);

        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match &*value.to_lowercase() {
                "opacity" | "fill-opacity" | "stroke-opacity" | "shape-image-threshold" => {
                    let old_preserve = self.preserve;

                    self.preserve = false;

                    declaration.visit_mut_children_with(self);

                    self.preserve = old_preserve;
                }
                _ => {
                    declaration.visit_mut_children_with(self);
                }
            }
        }
    }

    fn visit_mut_component_value(&mut self, component_value: &mut ComponentValue) {
        component_value.visit_mut_children_with(self);

        if self.preserve {
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
