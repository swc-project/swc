use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_declaration() -> impl VisitMut {
    CompressDeclaration {}
}

struct CompressDeclaration {}

impl CompressDeclaration {
    fn is_same_dimension_length_nodes(
        &mut self,
        node_1: Option<&Value>,
        node_2: Option<&Value>,
    ) -> bool {
        if let Some(Value::Dimension(Dimension::Length(Length {
            value: value_1,
            unit: unit_1,
            ..
        }))) = node_1
        {
            if let Some(Value::Dimension(Dimension::Length(Length {
                value: value_2,
                unit: unit_2,
                ..
            }))) = node_2
            {
                if value_1.value == value_2.value
                    && unit_1.value.to_lowercase() == unit_2.value.to_lowercase()
                {
                    return true;
                }
            }
        }

        false
    }
}

impl VisitMut for CompressDeclaration {
    fn visit_mut_declaration(&mut self, declaration: &mut Declaration) {
        declaration.visit_mut_children_with(self);

        if let DeclarationName::Ident(Ident { value, .. }) = &declaration.name {
            match &*value.to_lowercase() {
                "padding" | "margin" | "inset" if declaration.value.len() > 1 => {
                    let top = declaration.value.get(0);
                    let right = declaration
                        .value
                        .get(1)
                        .or_else(|| declaration.value.get(0));
                    let bottom = declaration
                        .value
                        .get(2)
                        .or_else(|| declaration.value.get(0));
                    let left = declaration
                        .value
                        .get(3)
                        .or_else(|| declaration.value.get(1))
                        .or_else(|| declaration.value.get(0));

                    if self.is_same_dimension_length_nodes(left, right) {
                        if self.is_same_dimension_length_nodes(bottom, top) {
                            if self.is_same_dimension_length_nodes(right, top) {
                                declaration.value = vec![top.unwrap().clone()];
                            } else {
                                declaration.value =
                                    vec![top.unwrap().clone(), right.unwrap().clone()];
                            }
                        } else {
                            declaration.value = vec![
                                top.unwrap().clone(),
                                right.unwrap().clone(),
                                bottom.unwrap().clone(),
                            ];
                        }
                    }
                }
                "font-weight" => {
                    declaration.value = declaration
                        .value
                        .iter()
                        .map(|node| match node {
                            Value::Ident(Ident { value, span, .. })
                                if value.to_lowercase() == "normal" =>
                            {
                                Value::Number(Number {
                                    span: *span,
                                    value: 400.0,
                                    raw: "400".into(),
                                })
                            }
                            Value::Ident(Ident { value, span, .. })
                                if value.to_lowercase() == "bold" =>
                            {
                                Value::Number(Number {
                                    span: *span,
                                    value: 700.0,
                                    raw: "700".into(),
                                })
                            }
                            _ => node.clone(),
                        })
                        .collect();
                }
                _ => {}
            }
        }
    }
}
