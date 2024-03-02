use swc_atoms::JsWord;
use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_utils::{angle_to_deg, hsl_to_rgb, hwb_to_rgb, to_rgb255, NAMED_COLORS};

use super::Compressor;
use crate::compressor::alpha_value::compress_alpha_value;

fn compress_alpha_in_hex(value: &JsWord) -> Option<&str> {
    let length = value.len();

    if length == 3 || length == 6 {
        return None;
    }

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

fn get_short_hex(v: u32) -> u32 {
    ((v & 0x0ff00000) >> 12) | ((v & 0x00000ff0) >> 4)
}

fn get_long_hex(v: u32) -> u32 {
    ((v & 0xf000) << 16)
        | ((v & 0xff00) << 12)
        | ((v & 0x0ff0) << 8)
        | ((v & 0x00ff) << 4)
        | (v & 0x000f)
}

fn get_named_color_by_hex(v: u32) -> Option<&'static str> {
    // These names are shorter than their hex codes
    let s = match v {
        0x000080 => "navy",
        0x008000 => "green",
        0x008080 => "teal",
        0x4b0082 => "indigo",
        0x800000 => "maroon",
        0x800080 => "purple",
        0x808000 => "olive",
        0x808080 => "gray",
        0xa0522d => "sienna",
        0xa52a2a => "brown",
        0xc0c0c0 => "silver",
        0xcd853f => "peru",
        0xd2b48c => "tan",
        0xda70d6 => "orchid",
        0xdda0dd => "plum",
        0xee82ee => "violet",
        0xf0e68c => "khaki",
        0xf0ffff => "azure",
        0xf5deb3 => "wheat",
        0xf5f5dc => "beige",
        0xfa8072 => "salmon",
        0xfaf0e6 => "linen",
        0xff0000 => "red",
        0xff6347 => "tomato",
        0xff7f50 => "coral",
        0xffa500 => "orange",
        0xffc0cb => "pink",
        0xffd700 => "gold",
        0xffe4c4 => "bisque",
        0xfffafa => "snow",
        0xfffff0 => "ivory",
        _ => return None,
    };

    Some(s)
}

macro_rules! make_color {
    ($span:expr,$r:expr,$g:expr,$b:expr, $a:expr) => {{
        let need_alpha_value = $a != 1.0;

        let r = $r.round();
        let g = $g.round();
        let b = $b.round();

        if need_alpha_value {
            // TODO improve when we will have browserslist
            let is_alpha_hex_supported = false;

            if is_alpha_hex_supported {
                let alpha = (($a * 255.0) as f64).round().max(0.0).min(255.0) as u8;
                let hex: u32 =
                    ((r as u32) << 24) | ((g as u32) << 16) | ((b as u32) << 8) | (alpha as u32);

                let compact = get_short_hex(hex);
                let value = if hex == get_long_hex(compact) {
                    format!("{:04x}", compact)
                } else {
                    format!("{:08x}", hex)
                };

                Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                    span: $span,
                    value: value.into(),
                    raw: None,
                }))
            } else {
                let mut alpha_value = AlphaValue::Number(Number {
                    span: DUMMY_SP,
                    value: $a,
                    raw: None,
                });

                compress_alpha_value(&mut alpha_value);

                Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                    span: $span,
                    name: FunctionName::Ident(Ident {
                        span: DUMMY_SP,
                        value: "rgba".into(),
                        raw: None,
                    }),
                    value: vec![
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: r,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: g,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::Number(Box::new(Number {
                            span: DUMMY_SP,
                            value: b,
                            raw: None,
                        })),
                        ComponentValue::Delimiter(Box::new(Delimiter {
                            span: DUMMY_SP,
                            value: DelimiterValue::Comma,
                        })),
                        ComponentValue::AlphaValue(Box::new(alpha_value)),
                    ],
                }))
            }
        } else {
            let hex: u32 = ((r as u32) << 16) | ((g as u32) << 8) | (b as u32);

            if let Some(name) = get_named_color_by_hex(hex) {
                Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(Ident {
                    span: $span,
                    value: name.into(),
                    raw: None,
                }))
            } else {
                let compact = get_short_hex(hex);
                let value = if hex == get_long_hex(compact) {
                    format!("{:03x}", compact)
                } else {
                    format!("{:06x}", hex)
                };

                Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                    span: $span,
                    value: value.into(),
                    raw: None,
                }))
            }
        }
    }};
}

impl Compressor {
    fn get_named_color_by_hex(&self, hex: &str) -> Option<&'static str> {
        let name = match hex {
            "000080" => "navy",
            "008000" => "green",
            "008080" => "teal",
            "4b0082" => "indigo",
            "800000" => "maroon",
            "800080" => "purple",
            "808000" => "olive",
            "808080" => "gray",
            "a0522d" => "sienna",
            "a52a2a" => "brown",
            "c0c0c0" => "silver",
            "cd853f" => "peru",
            "d2b48c" => "tan",
            "da70d6" => "orchid",
            "dda0dd" => "plum",
            "ee82ee" => "violet",
            "f0e68c" => "khaki",
            "f0ffff" => "azure",
            "f5deb3" => "wheat",
            "f5f5dc" => "beige",
            "fa8072" => "salmon",
            "faf0e6" => "linen",
            "ff0000" => "red",
            "ff6347" => "tomato",
            "ff7f50" => "coral",
            "ffa500" => "orange",
            "ffc0cb" => "pink",
            "ffd700" => "gold",
            "ffe4c4" => "bisque",
            "fffafa" => "snow",
            "fffff0" => "ivory",
            _ => return None,
        };

        Some(name)
    }

    fn get_alpha_value(&self, alpha_value: Option<&&ComponentValue>) -> Option<f64> {
        let Some(alpha_value) = alpha_value else {
            return Some(1.0);
        };

        match &alpha_value {
            ComponentValue::AlphaValue(alpha_value) => match &**alpha_value {
                AlphaValue::Number(Number { value, .. }) => {
                    if *value > 1.0 {
                        return Some(1.0);
                    } else if *value < 0.0 {
                        return Some(0.0);
                    }

                    Some(*value)
                }
                AlphaValue::Percentage(Percentage {
                    value: Number { value, .. },
                    ..
                }) => {
                    if *value > 100.0 {
                        return Some(1.0);
                    } else if *value < 0.0 {
                        return Some(0.0);
                    }

                    Some(*value / 100.0)
                }
            },
            ComponentValue::Ident(ident) if ident.value.eq_ignore_ascii_case("none") => Some(0.0),
            _ => None,
        }
    }

    fn get_hue(&self, hue: Option<&&ComponentValue>) -> Option<f64> {
        match hue {
            Some(ComponentValue::Hue(hue)) => {
                let mut value = match &**hue {
                    Hue::Number(Number { value, .. }) => *value,
                    Hue::Angle(Angle {
                        value: Number { value, .. },
                        unit: Ident { value: unit, .. },
                        ..
                    }) => angle_to_deg(*value, unit),
                };

                value %= 360.0;

                if value < 0.0 {
                    value += 360.0;
                }

                Some(value)
            }
            Some(ComponentValue::Ident(ident)) if ident.value.eq_ignore_ascii_case("none") => {
                Some(0.0)
            }
            _ => None,
        }
    }

    fn get_percentage(&self, percentage: Option<&&ComponentValue>) -> Option<f64> {
        match percentage {
            Some(ComponentValue::Percentage(percentage)) => {
                let Number { value, .. } = &percentage.value;
                if *value > 100.0 {
                    return Some(1.0);
                } else if *value < 0.0 {
                    return Some(0.0);
                }

                Some(*value / 100.0)
            }
            Some(ComponentValue::Ident(ident)) if ident.value.eq_ignore_ascii_case("none") => {
                Some(0.0)
            }
            _ => None,
        }
    }

    fn get_number_or_percentage(
        &self,
        number_or_percentage: Option<&&ComponentValue>,
    ) -> Option<f64> {
        match number_or_percentage {
            Some(ComponentValue::Number(number)) => {
                if number.value > 255.0 {
                    return Some(255.0);
                } else if number.value < 0.0 {
                    return Some(0.0);
                }

                Some(number.value)
            }
            Some(ComponentValue::Percentage(percentage)) => {
                if percentage.value.value > 100.0 {
                    return Some(255.0);
                } else if percentage.value.value < 0.0 {
                    return Some(0.0);
                }

                Some((2.55 * percentage.value.value).round())
            }
            Some(ComponentValue::Ident(ident)) if ident.value.eq_ignore_ascii_case("none") => {
                Some(0.0)
            }
            _ => None,
        }
    }
}

impl Compressor {
    pub(super) fn compress_color(&self, color: &mut Color) {
        match color {
            Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(Ident {
                value,
                span,
                ..
            })) => match value.to_ascii_lowercase() {
                ref s if *s == "transparent" => {
                    *color = make_color!(*span, 0.0_f64, 0.0_f64, 0.0_f64, 0.0_f64);
                }
                name => {
                    if let Some(value) = NAMED_COLORS.get(&name) {
                        *color = make_color!(
                            *span,
                            value.rgb[0] as f64,
                            value.rgb[1] as f64,
                            value.rgb[2] as f64,
                            1.0
                        )
                    }
                }
            },
            Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                span, value, ..
            })) => {
                if let Some(value) = self.get_named_color_by_hex(value) {
                    *color = Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(
                        Ident {
                            span: *span,
                            value: value.into(),
                            raw: None,
                        },
                    ));
                } else if let Some(new_value) = compress_alpha_in_hex(value) {
                    *value = new_value.into();
                }
            }
            Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                span,
                name,
                value,
                ..
            })) if name == "rgb" || name == "rgba" => {
                let rgba: Vec<_> = value
                    .iter()
                    .filter(|n| {
                        !n.as_delimiter()
                            .map(|delimiter| delimiter.value)
                            .map(|v| matches!(v, DelimiterValue::Comma | DelimiterValue::Solidus))
                            .unwrap_or_default()
                    })
                    .collect();

                let r = match self.get_number_or_percentage(rgba.first()) {
                    Some(value) => value,
                    _ => return,
                };
                let g = match self.get_number_or_percentage(rgba.get(1)) {
                    Some(value) => value,
                    _ => return,
                };
                let b = match self.get_number_or_percentage(rgba.get(2)) {
                    Some(value) => value,
                    _ => return,
                };
                let a = match self.get_alpha_value(rgba.get(3)) {
                    Some(value) => value,
                    _ => return,
                };

                *color = make_color!(*span, r, g, b, a);
            }
            Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                span,
                name,
                value,
                ..
            })) if name == "hsl" || name == "hsla" => {
                let hsla: Vec<_> = value
                    .iter()
                    .filter(|n| {
                        !n.as_delimiter()
                            .map(|delimiter| delimiter.value)
                            .map(|v| matches!(v, DelimiterValue::Comma | DelimiterValue::Solidus))
                            .unwrap_or_default()
                    })
                    .collect();

                let h = match self.get_hue(hsla.first()) {
                    Some(value) => value,
                    _ => return,
                };
                let s = match self.get_percentage(hsla.get(1)) {
                    Some(value) => value,
                    _ => return,
                };
                let l = match self.get_percentage(hsla.get(2)) {
                    Some(value) => value,
                    _ => return,
                };
                let a = match self.get_alpha_value(hsla.get(3)) {
                    Some(value) => value,
                    _ => return,
                };

                let rgb = to_rgb255(hsl_to_rgb([h, s, l]));

                *color = make_color!(*span, rgb[0], rgb[1], rgb[2], a);
            }
            Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                span,
                name,
                value,
                ..
            })) if name == "hwb" => {
                let h = match self.get_hue(value.first().as_ref()) {
                    Some(value) => value,
                    _ => return,
                };
                let w = match self.get_percentage(value.get(1).as_ref()) {
                    Some(value) => value,
                    _ => return,
                };
                let b = match self.get_percentage(value.get(2).as_ref()) {
                    Some(value) => value,
                    _ => return,
                };
                let a = match self.get_alpha_value(value.get(4).as_ref()) {
                    Some(value) => value,
                    _ => return,
                };

                let rgb = to_rgb255(hwb_to_rgb([h, w, b]));

                *color = make_color!(*span, rgb[0], rgb[1], rgb[2], a);
            }
            _ => {}
        }
    }
}
