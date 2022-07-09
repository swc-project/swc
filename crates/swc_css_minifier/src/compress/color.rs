use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_utils::NAMED_COLORS;
use swc_css_visit::{VisitMut, VisitMutWith};

use crate::compress::angle::{get_angle_type, to_deg};

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

static ONE_THIRD: f64 = 1.0 / 3.0;
static ONE_SECOND: f64 = 1.0 / 2.0;
static ONE_SIX: f64 = 1.0 / 6.0;
static TWO_THIRD: f64 = 2.0 / 3.0;

fn hsl_to_rgb(hsl: [f64; 3]) -> [f64; 3] {
    let [h, s, l] = hsl;

    let r;
    let g;
    let b;

    if s == 0.0 {
        r = l;
        g = l;
        b = l;
    } else {
        let hue2rgb = |p: f64, q: f64, mut t: f64| -> f64 {
            if t < 0.0 {
                t += 1.0;
            }

            if t > 1.0 {
                t -= 1.0;
            }

            if t < ONE_SIX {
                return p + (q - p) * 6.0 * t;
            }

            if t < ONE_SECOND {
                return q;
            }

            if t < TWO_THIRD {
                return p + (q - p) * (TWO_THIRD - t) * 6.0;
            }

            p
        };

        let q = if l < 0.5 {
            l * (1.0 + s)
        } else {
            l + s - l * s
        };
        let p = 2.0 * l - q;

        r = hue2rgb(p, q, h + ONE_THIRD);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - ONE_THIRD);
    }

    [r * 255.0, g * 255.0, b * 255.0]
}

macro_rules! make_color {
    ($span:expr,$r:expr,$g:expr,$b:expr) => {{
        let hex: u32 = (($r as u32) << 16) | (($g as u32) << 8) | ($b as u32);

        if let Some(name) = get_named_color_by_hex(hex) {
            Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(Ident {
                span: $span,
                value: name.into(),
                raw: name.into(),
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
                value: value.clone().into(),
                raw: value.into(),
            }))
        }
    }};
}

macro_rules! make_color_with_alpha {
    ($span:expr,$r:expr,$g:expr,$b:expr,$a:expr,$t:expr) => {{
        // TODO improve when we will have browserslist
        let is_alpha_hex_supported = false;

        if is_alpha_hex_supported {
            let hex: u32 =
                (($r as u32) << 24) | (($g as u32) << 16) | (($b as u32) << 8) | ($a as u32);

            if let Some(name) = get_named_color_by_hex(hex) {
                Color::AbsoluteColorBase(AbsoluteColorBase::NamedColorOrTransparent(Ident {
                    span: $span,
                    value: name.into(),
                    raw: name.into(),
                }))
            } else {
                let compact = get_short_hex(hex);
                let value = if hex == get_long_hex(compact) {
                    format!("{:04x}", compact)
                } else {
                    format!("{:08x}", hex)
                };

                Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                    span: $span,
                    value: value.clone().into(),
                    raw: value.into(),
                }))
            }
        } else {
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
        }
    }};
}

pub fn compress_color() -> impl VisitMut {
    CompressColor {}
}

struct CompressColor {}

impl CompressColor {
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
                    *color = make_color_with_alpha!(*span, 0.0, 0.0, 0.0, 0.0, true);
                }
                name => {
                    if let Some(value) = NAMED_COLORS.get(name) {
                        *color = make_color!(*span, value.rgb[0], value.rgb[1], value.rgb[2])
                    }
                }
            },
            Color::AbsoluteColorBase(AbsoluteColorBase::HexColor(HexColor {
                span, value, ..
            })) => {
                if let Some(value) = self.get_named_color_by_hex(&*value.to_lowercase()) {
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

                if let (Some(r), Some(g), Some(b), a) = (r, g, b, a) {
                    if let Some(a) = a {
                        *color = make_color_with_alpha!(*span, r, g, b, a.0, a.1);
                    } else {
                        *color = make_color!(*span, r, g, b);
                    }
                }
            }
            Color::AbsoluteColorBase(AbsoluteColorBase::Function(Function {
                span,
                name,
                value,
                ..
            })) if matches!(&*name.value, "hsl" | "hsla") => {
                let hsla: Vec<_> = value
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

                let h = match hsla.get(0) {
                    Some(ComponentValue::Hue(hue)) => {
                        let mut value = match hue {
                            Hue::Number(Number { value, .. }) => *value,
                            Hue::Angle(Angle {
                                value: Number { value, .. },
                                unit: Ident { value: unit, .. },
                                ..
                            }) => {
                                let angel_type = match get_angle_type(&unit.to_lowercase()) {
                                    Some(angel_type) => angel_type,
                                    _ => return,
                                };

                                to_deg(*value, angel_type)
                            }
                        };

                        value %= 360.0;

                        if value < 0.0 {
                            value += 360.0;
                        }

                        Some(value / 360.0)
                    }
                    _ => return,
                };
                let s = match hsla.get(1) {
                    Some(ComponentValue::Percentage(Percentage {
                        value: Number { value, .. },
                        ..
                    })) => Some(*value / 100.0),
                    _ => return,
                };
                let l = match hsla.get(2) {
                    Some(ComponentValue::Percentage(Percentage {
                        value: Number { value, .. },
                        ..
                    })) => Some(*value / 100.0),
                    _ => return,
                };
                let a = match hsla.get(3) {
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

                if let (Some(h), Some(s), Some(l), a) = (h, s, l, a) {
                    let rgb = hsl_to_rgb([h, s, l]);

                    if let Some(a) = a {
                        *color = make_color_with_alpha!(
                            *span,
                            rgb[0].round(),
                            rgb[1].round(),
                            rgb[2].round(),
                            a.0,
                            a.1
                        );
                    } else {
                        *color = make_color!(*span, rgb[0].round(), rgb[1].round(), rgb[2].round());
                    }
                }
            }
            _ => {}
        }
    }
}
