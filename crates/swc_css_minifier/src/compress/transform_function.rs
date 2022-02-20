use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_transform_function() -> impl VisitMut {
    CompressTransformFunction {}
}

struct CompressTransformFunction {}

impl CompressTransformFunction {}

impl VisitMut for CompressTransformFunction {
    fn visit_mut_value(&mut self, value: &mut Value) {
        value.visit_mut_children_with(self);

        match value {
            Value::Function(Function {
                name,
                value: function_value,
                span,
            }) if &*name.value.to_lowercase() == "cubic-bezier" && function_value.len() == 7 => {
                if let (
                    Value::Number(Number { value: first, .. }),
                    Value::Number(Number { value: second, .. }),
                    Value::Number(Number { value: third, .. }),
                    Value::Number(Number { value: fourth, .. }),
                ) = (
                    &function_value[0],
                    &function_value[2],
                    &function_value[4],
                    &function_value[6],
                ) {
                    if *first == 0.0 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "linear".into(),
                            raw: "linear".into(),
                        })
                    } else if *first == 0.25 && *second == 0.1 && *third == 0.25 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "easy".into(),
                            raw: "easy".into(),
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 1.0 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-in".into(),
                            raw: "ease-in".into(),
                        })
                    } else if *first == 0.0 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-out".into(),
                            raw: "ease-out".into(),
                        })
                    } else if *first == 0.42 && *second == 0.0 && *third == 0.58 && *fourth == 1.0 {
                        *value = Value::Ident(Ident {
                            span: *span,
                            value: "ease-in-out".into(),
                            raw: "ease-in-out".into(),
                        })
                    }
                }
            }
            _ => {}
        }
    }
}
