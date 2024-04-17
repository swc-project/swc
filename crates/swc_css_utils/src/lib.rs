#![deny(clippy::all)]

use std::{borrow::Cow, f64::consts::PI, str};

use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_atoms::{Atom, StaticString};
use swc_common::collections::AHashMap;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub struct IdentReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for IdentReplacer<'_> {
    fn visit_mut_ident(&mut self, n: &mut Ident) {
        n.visit_mut_children_with(self);

        if n.value.eq_ignore_ascii_case(self.from) {
            n.value = self.to.into();
            n.raw = None;
        }
    }
}

pub fn replace_ident<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<IdentReplacer<'aa>>,
{
    node.visit_mut_with(&mut IdentReplacer { from, to });
}

pub struct FunctionNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for FunctionNameReplacer<'_> {
    fn visit_mut_function(&mut self, n: &mut Function) {
        n.visit_mut_children_with(self);

        match &mut n.name {
            FunctionName::Ident(name) if name.value.eq_ignore_ascii_case(self.from) => {
                name.value = self.to.into();
                name.raw = None;
            }
            FunctionName::DashedIdent(name) if name.value.eq_ignore_ascii_case(self.from) => {
                name.value = self.to.into();
                name.raw = None;
            }
            _ => {}
        }
    }
}

pub fn replace_function_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<FunctionNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut FunctionNameReplacer { from, to });
}

pub struct PseudoClassSelectorNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoClassSelectorNameReplacer<'_> {
    fn visit_mut_pseudo_class_selector(&mut self, n: &mut PseudoClassSelector) {
        n.visit_mut_children_with(self);

        if &*n.name.value == self.from {
            n.name.value = self.to.into();
            n.name.raw = None;
        }
    }
}

pub fn replace_pseudo_class_selector_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<PseudoClassSelectorNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoClassSelectorNameReplacer { from, to });
}

pub struct PseudoElementSelectorNameReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoElementSelectorNameReplacer<'_> {
    fn visit_mut_pseudo_element_selector(&mut self, n: &mut PseudoElementSelector) {
        n.visit_mut_children_with(self);

        if &*n.name.value == self.from {
            n.name.value = self.to.into();
            n.name.raw = None;
        }
    }
}

pub fn replace_pseudo_element_selector_name<N>(node: &mut N, from: &str, to: &str)
where
    N: for<'aa> VisitMutWith<PseudoElementSelectorNameReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoElementSelectorNameReplacer { from, to });
}

pub struct PseudoElementOnPseudoClassReplacer<'a> {
    from: &'a str,
    to: &'a str,
}

impl VisitMut for PseudoElementOnPseudoClassReplacer<'_> {
    fn visit_mut_subclass_selector(&mut self, n: &mut SubclassSelector) {
        n.visit_mut_children_with(self);

        match n {
            SubclassSelector::PseudoElement(PseudoElementSelector { name, span, .. })
                if &*name.value == self.from =>
            {
                *n = SubclassSelector::PseudoClass(PseudoClassSelector {
                    span: *span,
                    name: Ident {
                        span: name.span,
                        value: self.to.into(),
                        raw: None,
                    },
                    children: None,
                })
            }
            _ => {}
        }
    }
}

pub fn replace_pseudo_class_selector_on_pseudo_element_selector<N>(
    node: &mut N,
    from: &str,
    to: &str,
) where
    N: for<'aa> VisitMutWith<PseudoElementOnPseudoClassReplacer<'aa>>,
{
    node.visit_mut_with(&mut PseudoElementOnPseudoClassReplacer { from, to });
}

#[derive(Serialize, Deserialize, Debug)]
pub struct NamedColor {
    pub hex: String,
    pub rgb: Vec<u8>,
}

pub static NAMED_COLORS: Lazy<AHashMap<StaticString, NamedColor>> = Lazy::new(|| {
    serde_json::from_str(include_str!("./named-colors.json"))
        .expect("failed to parse named-colors.json for html entities")
});

#[inline]
fn is_escape_not_required(value: &str) -> bool {
    if value.is_empty() {
        return true;
    }

    if value.as_bytes()[0].is_ascii_digit() {
        return false;
    }

    if value.len() == 1 && value.as_bytes()[0] == b'-' {
        return false;
    }

    if value.len() >= 2 && value.as_bytes()[0] == b'-' && value.as_bytes()[1].is_ascii_digit() {
        return false;
    }

    value.chars().all(|c| {
        match c {
            '\x00' => false,
            '\x01'..='\x1f' | '\x7F' => false,
            '-' | '_' => true,
            _ if !c.is_ascii()
                || c.is_ascii_digit()
                || c.is_ascii_uppercase()
                || c.is_ascii_lowercase() =>
            {
                true
            }
            // Otherwise, the escaped character.
            _ => false,
        }
    })
}

// https://drafts.csswg.org/cssom/#serialize-an-identifier
pub fn serialize_ident(value: &str, minify: bool) -> Cow<'_, str> {
    // Fast-path
    if is_escape_not_required(value) {
        return Cow::Borrowed(value);
    }

    let mut result = String::with_capacity(value.len());

    //
    // To escape a character means to create a string of "\" (U+005C), followed by
    // the character.
    //
    // To escape a character as code point means to create a string of "\" (U+005C),
    // followed by the Unicode code point as the smallest possible number of
    // hexadecimal digits in the range 0-9 a-f (U+0030 to U+0039 and U+0061 to
    // U+0066) to represent the code point in base 16, followed by a single SPACE
    // (U+0020).
    //
    // To serialize an identifier means to create a string represented
    // by the concatenation of, for each character of the identifier:
    for (i, c) in value.chars().enumerate() {
        match c {
            // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
            '\x00' => {
                result.push(char::REPLACEMENT_CHARACTER);
            }
            // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F, then the
            // character escaped as code point.
            '\x01'..='\x1f' | '\x7F' => {
                result.push_str(&hex_escape(c as u8, minify));
            }
            // If the character is the first character and is in the range [0-9] (U+0030 to U+0039),
            // then the character escaped as code point.
            '0'..='9' if i == 0 => {
                result.push_str(&hex_escape(c as u8, minify));
            }
            // If the character is the second character and is in the range [0-9] (U+0030 to U+0039)
            // and the first character is a "-" (U+002D), then the character escaped as code point.
            '0'..='9' if i == 1 && &value[0..1] == "-" => {
                result.push_str(&hex_escape(c as u8, minify));
            }
            // If the character is the first character and is a "-" (U+002D), and there is no second
            // character, then the escaped character.
            '-' if i == 0 && value.len() == 1 => {
                result.push_str(&hex_escape(c as u8, minify));
            }
            // If the character is not handled by one of the above rules and is greater than or
            // equal to U+0080, is "-" (U+002D) or "_" (U+005F), or is in one of the ranges [0-9]
            // (U+0030 to U+0039), [A-Z] (U+0041 to U+005A), or \[a-z] (U+0061 to U+007A), then the
            // character itself.
            _ if !c.is_ascii()
                || c == '-'
                || c == '_'
                || c.is_ascii_digit()
                || c.is_ascii_uppercase()
                || c.is_ascii_lowercase() =>
            {
                result.push(c);
            }
            // Otherwise, the escaped character.
            _ => {
                let bytes = [b'\\', c as u8];

                // SAFETY: We know it's valid to convert bytes to &str 'cause it's all valid
                // ASCII
                result.push_str(unsafe { str::from_utf8_unchecked(&bytes) });
            }
        }
    }

    Cow::Owned(result)
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L166
fn hex_escape(ascii_byte: u8, _minify: bool) -> String {
    static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

    if ascii_byte > 0x0f {
        let high = (ascii_byte >> 4) as usize;
        let low = (ascii_byte & 0x0f) as usize;
        unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' ']) }
            .to_string()
    } else {
        unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[ascii_byte as usize], b' ']) }
            .to_string()
    }
}

pub fn hwb_to_rgb(hwb: [f64; 3]) -> [f64; 3] {
    let [h, w, b] = hwb;

    if w + b >= 1.0 {
        let gray = w / (w + b);

        return [gray, gray, gray];
    }

    let mut rgb = hsl_to_rgb([h, 1.0, 0.5]);

    for item in &mut rgb {
        *item *= 1.0 - w - b;
        *item += w;
    }

    [rgb[0], rgb[1], rgb[2]]
}

pub fn hsl_to_rgb(hsl: [f64; 3]) -> [f64; 3] {
    let [h, s, l] = hsl;

    let r;
    let g;
    let b;

    if s == 0.0 {
        r = l;
        g = l;
        b = l;
    } else {
        let f = |n: f64| -> f64 {
            let k = (n + h / 30.0) % 12.0;
            let a = s * f64::min(l, 1.0 - l);

            l - a * f64::min(k - 3.0, 9.0 - k).clamp(-1.0, 1.0)
        };

        r = f(0.0);
        g = f(8.0);
        b = f(4.0);
    }

    [r, g, b]
}

pub fn to_rgb255(abc: [f64; 3]) -> [f64; 3] {
    let mut abc255 = abc;

    for item in &mut abc255 {
        *item *= 255.0;
    }

    abc255
}

pub fn clamp_unit_f64(val: f64) -> u8 {
    (val * 255.).round().clamp(0., 255.) as u8
}

pub fn round_alpha(alpha: f64) -> f64 {
    let mut rounded_alpha = (alpha * 100.).round() / 100.;

    if clamp_unit_f64(rounded_alpha) != clamp_unit_f64(alpha) {
        rounded_alpha = (alpha * 1000.).round() / 1000.;
    }

    rounded_alpha
}

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

pub fn hex_to_rgba(hex: &str) -> (u8, u8, u8, f64) {
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

pub fn angle_to_deg(value: f64, from: &Atom) -> f64 {
    match &*from.to_ascii_lowercase() {
        "deg" => value,
        "grad" => value * 180.0 / 200.0,
        "turn" => value * 360.0,
        "rad" => value * 180.0 / PI,
        _ => {
            unreachable!("Unknown angle type: {:?}", from);
        }
    }
}
