use swc_atoms::js_word;
use swc_common::DUMMY_SP;
use swc_css_ast::{
    AbsoluteColorBase, AlphaValue, Color, ComponentValue, Delimiter, DelimiterValue, Function,
    Ident, Number,
};

use crate::compiler::{utils::round_alpha, Compiler};

#[inline]
fn from_hex(c: u8) -> u8 {
    match c {
        b'0'..=b'9' => c - b'0',
        b'a'..=b'f' => c - b'a' + 10,
        b'A'..=b'F' => c - b'A' + 10,
        _ => {
            unreachable!();
        }
    }
}

fn shorten_hex_color(value: &str) -> Option<&str> {
    let length = value.len();
    let chars = value.as_bytes();

    if length == 8
        && (chars[6] == b'f' || chars[6] == b'F')
        && (chars[7] == b'f' || chars[7] == b'F')
    {
        return Some(&value[0..6]);
    } else if length == 4 && chars[3] == b'f' || chars[3] == b'F' {
        return Some(&value[0..3]);
    }

    None
}

fn hex_to_rgba(hex: &str) -> (u8, u8, u8, f64) {
    let hex = hex.as_bytes();

    match hex.len() {
        8 => {
            let r = from_hex(hex[0]) * 16 + from_hex(hex[1]);
            let g = from_hex(hex[2]) * 16 + from_hex(hex[3]);
            let b = from_hex(hex[4]) * 16 + from_hex(hex[5]);
            let a = (from_hex(hex[6]) * 16 + from_hex(hex[7])) as f64 / 255.0;

            (r, g, b, a)
        }
        4 => {
            let r = from_hex(hex[0]) * 17;
            let g = from_hex(hex[1]) * 17;
            let b = from_hex(hex[2]) * 17;
            let a = (from_hex(hex[3]) * 17) as f64 / 255.0;

            (r, g, b, a)
        }

        _ => {
            unreachable!()
        }
    }
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
                    name: Ident {
                        span: DUMMY_SP,
                        value: js_word!("rgba"),
                        raw: None,
                    },
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
