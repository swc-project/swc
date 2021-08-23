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

        macro_rules! simple {
            ($name:expr,$val:expr) => {{
                let val = Value::Text(Text {
                    span: DUMMY_SP,
                    value: $val.into(),
                });
                self.added.push(Property {
                    span: n.span,
                    name: Text {
                        span: n.name.span,
                        value: $name.into(),
                    },
                    values: vec![val],
                    important: n.important.clone(),
                });
            }};
        }

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
            "appearance" => {
                same_content!("-webkit-appearance");
                same_content!("-moz-appearance");
                same_content!("-ms-appearance");
            }

            "animation" => {
                same_content!("-webkit-animation");
            }

            "animation-duration" => {
                same_content!("-webkit-animation-duration");
            }

            "animation-name" => {
                same_content!("-webkit-animation-name");
            }

            "animation-iteration-count" => {
                same_content!("-webkit-animation-iteration-count");
            }

            "animation-timing-function" => {
                same_content!("-webkit-animation-timing-function");
            }

            "box-decoration-break" => {
                same_content!("-webkit-box-decoration-break");
            }

            "color-adjust" => {
                same_content!("-webkit-print-color-adjust");
            }

            "mask" => {
                same_content!("-webkit-mask");
            }

            "mask-image" => {
                same_content!("-webkit-mask-image");
            }

            "mask-mode" => {
                same_content!("-webkit-mask-mode");
            }

            "mask-clip" => {
                same_content!("-webkit-mask-clip");
            }

            "mask-size" => {
                same_content!("-webkit-mask-size");
            }

            "mask-repeat" => {
                same_content!("-webkit-mask-repeat");
            }

            "mask-origin" => {
                same_content!("-webkit-mask-origin");
            }

            "mask-position" => {
                same_content!("-webkit-mask-position");
            }

            "mask-composite" => {
                same_content!("-webkit-mask-composite");
            }

            "margin-inline-start" => {
                same_content!("-webkit-margin-start");
            }

            "margin-inline-end" => {
                same_content!("-webkit-margin-end");
            }

            "backface-visibility" => {
                same_content!("-webkit-backface-visibility");
            }

            "clip-path" => {
                same_content!("-webkit-clip-path");
            }

            "position" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => match &**value {
                            "sticky" => {
                                same_name!("-webkit-sticky");
                            }

                            _ => {}
                        },
                        _ => {}
                    }
                }
            }

            "user-select" => {
                same_content!("-webkit-user-select");
                same_content!("-moz-user-select");
                same_content!("-ms-user-select");
            }

            "transform" => {
                same_content!("-webkit-transform");
                same_content!("-moz-transform");
                same_content!("-ms-transform");
            }

            "text-decoration" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => match &**value {
                            "none" => {
                                same_content!("-webkit-text-decoration");
                            }

                            _ => {}
                        },

                        _ => {}
                    }
                }
            }

            "text-size-adjust" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => match &**value {
                            "none" => {
                                same_content!("-webkit-text-size-adjust");
                                same_content!("-moz-text-size-adjust");
                                same_content!("-ms-text-size-adjust");
                            }

                            _ => {}
                        },

                        _ => {}
                    }
                }
            }

            "writing-mode" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => match &**value {
                            "none" => {
                                same_content!("-webkit-writing-mode");
                                same_content!("-ms-writing-mode");
                            }

                            "vertical-lr" | "sideways-lr" => {
                                same_content!("-webkit-writing-mode");
                                simple!("-ms-writing-mode", "tb");
                            }

                            "vertical-rl" | "sideways-rl" => {
                                same_content!("-webkit-writing-mode");
                                simple!("-ms-writing-mode", "tb-rl");
                            }

                            "horizontal-tb" => {
                                same_content!("-webkit-writing-mode");
                                simple!("-ms-writing-mode", "lr");
                            }

                            _ => {}
                        },

                        _ => {}
                    }
                }
            }

            "min-width" | "width" | "max-width" | "min-height" | "height" | "max-height"
            | "min-block-size" | "min-inline-size" => {
                if n.values.len() == 1 {
                    match &n.values[0] {
                        Value::Text(Text { value, .. }) => match &**value {
                            "fit-content" => {
                                same_name!("-webkit-fit-content");
                                same_name!("-moz-fit-content");
                            }

                            "max-content" => {
                                same_name!("-webkit-max-content");
                                same_name!("-moz-max-content");
                            }

                            "min-content" => {
                                same_name!("-webkit-min-content");
                                same_name!("-moz-min-content");
                            }

                            "fill-available" => {
                                same_name!("-webkit-fill-available");
                                same_name!("-moz-available");
                            }

                            "stretch" => {
                                same_name!("-webkit-fill-available");
                                same_name!("-moz-available");
                                same_name!("fill-available");
                            }

                            _ => {}
                        },
                        _ => {}
                    }
                }
            }

            _ => {}
        }
    }
}
