use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::{
    AbsoluteColorBase, AlphaValue, Color, ComponentValue, Delimiter, DelimiterValue, Function,
    FunctionName, Ident, Number,
};
use swc_css_utils::{hex_to_rgba, round_alpha};

use crate::compiler::Compiler;

fn shorten_hex_color(value: &str) -> Option<&str> {
    let length = value.len();
    let chars = value.as_bytes();

    if length == 8 && chars[6] == b'f' && chars[7] == b'f' {
        return Some(&value[0..6]);
    } else if length == 4 && chars[3] == b'f' {
        return Some(&value[0..3]);
    }

    None
}

impl Compiler {
    pub(crate) fn process_color_hex_alpha(&mut self, n: &mut ComponentValue) {
        if let ComponentValue::Color(box Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(
            hex_color,
        ))) = n
        {
            if hex_color.value.len() != 4 && hex_color.value.len() != 8 {
                return;
            }

            if let Some(shortened) = shorten_hex_color(&hex_color.value) {
                hex_color.value = shortened.into();
                hex_color.raw = None;

                return;
            }

            let rgba = hex_to_rgba(&hex_color.value);

            *n = ComponentValue::Color(Box::new(Color::AbsoluteColorBase(
                AbsoluteColorBase::Function(Function {
                    span: hex_color.span,
                    name: FunctionName::Ident(Ident {
                        span: DUMMY_SP,
                        value: js_word!("rgba"),
                        raw: None,
                    }),
                    value: vec![
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: rgba.0 as f64,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: rgba.1 as f64,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: rgba.2 as f64,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::AlphaValue(Box::new(AlphaValue::Number(Number {
                            span: DUMMY_SP,
                            value: round_alpha(rgba.3),
                            raw: None,
                        }))),
                    ],
                }),
            )));
        }
    }
}
