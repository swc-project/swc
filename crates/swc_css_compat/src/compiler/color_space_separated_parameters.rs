use std::mem::take;

use swc_common::DUMMY_SP;
use swc_css_ast::{
    matches_eq_ignore_ascii_case, AbsoluteColorBase, ComponentValue, Delimiter, DelimiterValue,
};

use crate::compiler::Compiler;

impl Compiler {
    pub(crate) fn process_color_space_separated_function_notation(
        &mut self,
        n: &mut AbsoluteColorBase,
    ) {
        if let AbsoluteColorBase::Function(function) = n {
            if !matches_eq_ignore_ascii_case!(function.name.as_str(), "rgb", "rgba", "hsl", "hsla")
            {
                return;
            }

            if function.value.len() != 3 && function.value.len() != 5 {
                return;
            }

            if function.value.iter().any(|n| {
                n.as_delimiter()
                    .filter(|delimiter| delimiter.value.is_comma())
                    .is_some()
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
                    } else if node
                        .as_delimiter()
                        .filter(|delimiter| delimiter.value.is_solidus())
                        .is_some()
                    {
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
