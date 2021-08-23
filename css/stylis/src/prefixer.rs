use std::mem::take;
use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn prefixer() -> impl VisitMut {
    Prefixer::default()
}

#[derive(Default)]
struct Prefixer {
    added: Vec<Property>,
}

impl VisitMut for Prefixer {
    fn visit_mut_properties(&mut self, props: &mut Vec<Property>) {
        let mut new = vec![];
        for mut n in take(props) {
            n.visit_mut_with(self);
            new.extend(self.added.drain(..));
            new.push(n);
        }

        *props = new;
    }

    fn visit_mut_property(&mut self, n: &mut Property) {
        n.visit_mut_children_with(self);

        macro_rules! same_content {
            ($name:expr) => {{
                self.added.push(Property {
                    span: n.span,
                    name: Text {
                        span: n.name.span,
                        value: $name.into(),
                    },
                    values: n.values.clone(),
                    important: n.important.clone(),
                });
            }};
        }

        macro_rules! same_name {
            ($name:expr) => {{
                let val = Text {
                    span: DUMMY_SP,
                    value: $name.into(),
                };

                self.added.push(Property {
                    span: n.span,
                    name: n.name.clone(),
                    values: vec![Value::Text(val)],
                    important: n.important.clone(),
                });
            }};
        }

        match &*n.name.value {
            "width" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => {
                            //
                            if &*value == "fit-content" {
                                same_name!("-webkit-fit-content");
                                same_name!("-moz-fit-content");
                            }
                        }
                        _ => {}
                    }
                }
            }

            _ => {}
        }
    }
}
