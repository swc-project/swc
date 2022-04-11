use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

macro_rules! make_6digits_hex {
    ($span:expr,$r:expr,$g:expr,$b:expr) => {{
        let hex: u32 = (($r as u32) << 16) | (($g as u32) << 8) | ($b as u32);
        let value = format!("{:04x}", hex);

        Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
            span: $span,
            value: value.clone().into(),
            raw: value.into(),
        }))
    }};
}

macro_rules! make_8digits_hex {
    ($span:expr,$r:expr,$g:expr,$b:expr,$a:expr) => {{
        let hex: u32 = (($r as u32) << 24) | (($g as u32) << 16) | (($b as u32) << 8) | ($a as u32);
        let value = format!("{:04x}", hex);

        Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
            span: $span,
            value: value.clone().into(),
            raw: value.into(),
        }))
    }};
}

macro_rules! make_legacy_rgba {
    ($span:expr,$r:expr,$g:expr,$b:expr,$a:expr,$t:expr) => {{
        let alpha = match $t {
            true => ComponentValue::AlphaValue(AlphaValue::Number(Number {
                span: DUMMY_SP,
                value: $a,
                raw: $a.to_string().into(),
            })),
            _ => {
                let value = $a * 100.0;

                ComponentValue::AlphaValue(AlphaValue::Percentage(Percentage {
                    span: DUMMY_SP,
                    value: Number {
                        span: DUMMY_SP,
                        value,
                        raw: value.to_string().into(),
                    },
                }))
            }
        };

        Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
            span: $span,
            name: Ident {
                span: DUMMY_SP,
                value: "rgba".into(),
                raw: "rgba".into(),
            },
            value: vec![
                ComponentValue::Number(Number {
                    span: DUMMY_SP,
                    value: $r,
                    raw: $r.to_string().into(),
                }),
                ComponentValue::Delimiter(Delimiter {
                    span: DUMMY_SP,
                    value: DelimiterValue::Comma,
                }),
                ComponentValue::Number(Number {
                    span: DUMMY_SP,
                    value: $g,
                    raw: $g.to_string().into(),
                }),
                ComponentValue::Delimiter(Delimiter {
                    span: DUMMY_SP,
                    value: DelimiterValue::Comma,
                }),
                ComponentValue::Number(Number {
                    span: DUMMY_SP,
                    value: $b,
                    raw: $b.to_string().into(),
                }),
                ComponentValue::Delimiter(Delimiter {
                    span: DUMMY_SP,
                    value: DelimiterValue::Comma,
                }),
                alpha,
            ],
        }))
    }};
}

pub fn compress_color() -> impl VisitMut {
    CompressColor {}
}

struct CompressColor {}

impl CompressColor {
    fn get_hex_by_named_color(&self, hex: &str) -> Option<&'static str> {
        // TODO fix me
        let name = match hex {
            "palegoldenrod" => "eee8aa",
            _ => return None,
        };

        Some(name)
    }

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
}

impl VisitMut for CompressColor {
    fn visit_mut_color(&mut self, color: &mut Color) {
        color.visit_mut_children_with(self);

        match color {
            Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(Ident {
                value,
                span,
                ..
            })) => match &*value.to_lowercase() {
                "transparent" => {
                    // TODO browserslist support
                    let is_long_hex_supported = true;

                    if is_long_hex_supported {
                        *color = make_8digits_hex!(*span, 0, 0, 0, 0);
                    } else {
                        *color = make_legacy_rgba!(*span, 0.0, 0.0, 0.0, 0.0, true);
                    }
                }
                name => {
                    if let Some(value) = self.get_hex_by_named_color(name) {
                        *color = Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                            span: *span,
                            value: value.into(),
                            raw: value.into(),
                        }));
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
                            raw: value.into(),
                        },
                    ));
                }
            }
            Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                span,
                name,
                value,
                ..
            })) if matches!(&*name.value, "rgb" | "rgba") => {
                let rgba: Vec<_> = value
                    .iter()
                    .filter(|n| {
                        !matches!(
                            n,
                            ComponentValue::Delimiter(Delimiter {
                                value: DelimiterValue::Comma | DelimiterValue::Solidus,
                                ..
                            })
                        )
                    })
                    .collect();

                let r = match rgba.get(0) {
                    Some(ComponentValue::Number(Number { value, .. })) => Some(*value),
                    Some(ComponentValue::Percentage(Percentage {
                        value: Number { value, .. },
                        ..
                    })) => Some((2.55 * *value).round()),
                    _ => return,
                };
                let g = match rgba.get(1) {
                    Some(ComponentValue::Number(Number { value, .. })) => Some(*value),
                    Some(ComponentValue::Percentage(Percentage {
                        value: Number { value, .. },
                        ..
                    })) => Some((2.55 * *value).round()),
                    _ => return,
                };
                let b = match rgba.get(2) {
                    Some(ComponentValue::Number(Number { value, .. })) => Some(*value),
                    Some(ComponentValue::Percentage(Percentage {
                        value: Number { value, .. },
                        ..
                    })) => Some((2.55 * *value).round()),
                    _ => return,
                };
                let a = match rgba.get(3) {
                    Some(ComponentValue::AlphaValue(AlphaValue::Number(number))) => {
                        if number.value == 1.0 {
                            None
                        } else {
                            Some((number.value, true))
                        }
                    }
                    Some(ComponentValue::AlphaValue(AlphaValue::Percentage(percentage))) => {
                        if percentage.value.value == 100.0 {
                            None
                        } else {
                            Some((percentage.value.value / 100.0, false))
                        }
                    }
                    None => None,
                    _ => return,
                };

                match (r, g, b, a) {
                    (Some(r), Some(g), Some(b), None) => {
                        *color = make_6digits_hex!(*span, r, g, b);
                    }
                    (Some(r), Some(g), Some(b), Some(a)) => {
                        // TODO improve me after browserslist
                        let is_long_hex_supported = false;

                        if is_long_hex_supported {
                            *color = make_8digits_hex!(*span, r, g, b, a.0);
                        } else {
                            *color = make_legacy_rgba!(*span, r, g, b, a.0, a.1);
                        }
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }
}
