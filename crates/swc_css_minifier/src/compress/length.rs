use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_length() -> impl VisitMut {
    CompressLength {
        in_math_function: false,
    }
}

struct CompressLength {
    in_math_function: bool,
}

impl VisitMut for CompressLength {
    fn visit_mut_calc_sum(&mut self, function: &mut CalcSum) {
        let old_in_math_function = self.in_math_function;

        self.in_math_function = true;

        function.visit_mut_children_with(self);

        self.in_math_function = old_in_math_function;
    }

    fn visit_mut_value(&mut self, value: &mut Value) {
        value.visit_mut_children_with(self);

        if self.in_math_function {
            return;
        }

        match &value {
            Value::Dimension(Dimension::Length(Length {
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
