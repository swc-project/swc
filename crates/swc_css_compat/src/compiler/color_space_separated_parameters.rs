use std::mem::take;

use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::{matches_eq, AbsoluteColorBase, ComponentValue, Delimiter, DelimiterValue};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_color_space_separated_function_notation(
        &mut self,
        n: &mut AbsoluteColorBase,
    ) {
        if let AbsoluteColorBase::Function(function) = n {
            if !matches_eq!(
                function.name,
                js_word!("rgb"),
                js_word!("rgba"),
                js_word!("hsl"),
                js_word!("hsla")
            ) {
                return;
            }

            if function.value.len() != 3 && function.value.len() != 5 {
                return;
            }

            if function.value.iter().any(|n| {
                matches!(
                    n,
                    ComponentValue::Delimiter(box Delimiter {
                        value: DelimiterValue::Comma,
                        ..
                    })
                )
            }) {
                return;
            }

            let new_value: Vec<ComponentValue> = take(&mut function.value)
                .into_iter()
                .enumerate()
                .flat_map(|(idx, node)| {
                    if matches!(idx, 0 | 1) {
                        vec![
                            node,
                            ComponentValue::Delimiter(Box::new(Delimiter {
                                value: DelimiterValue::Comma,
                                span: DUMMY_SP,
                            })),
                        ]
                    } else if matches!(
                        node,
                        ComponentValue::Delimiter(box Delimiter {
                            value: DelimiterValue::Solidus,
                            ..
                        })
                    ) {
                        vec![ComponentValue::Delimiter(Box::new(Delimiter {
                            value: DelimiterValue::Comma,
                            span: DUMMY_SP,
                        }))]
                    } else {
                        vec![node]
                    }
                })
                .collect::<Vec<_>>();

            function.value = new_value;
        }
    }
}
