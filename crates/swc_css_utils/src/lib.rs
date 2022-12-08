#![deny(clippy::all)]

use std::{borrow::Cow, char::REPLACEMENT_CHARACTER, str};

use once_cell::sync::Lazy;
use serde::{Deserialize, Serialize};
use swc_atoms::JsWord;
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

        if n.value.eq_str_ignore_ascii_case(self.from) {
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

        if n.name.value.eq_str_ignore_ascii_case(self.from) {
            n.name.value = self.to.into();
            n.name.raw = None;
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

        if n.name.value.eq_str_ignore_ascii_case(self.from) {
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

        if n.name.value.eq_str_ignore_ascii_case(self.from) {
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
                if name.value.eq_str_ignore_ascii_case(self.from) =>
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

pub static NAMED_COLORS: Lazy<AHashMap<JsWord, NamedColor>> = Lazy::new(|| {
    let named_colors: AHashMap<JsWord, NamedColor> =
        serde_json::from_str(include_str!("./named-colors.json"))
            .expect("failed to parse named-colors.json for html entities");

    named_colors
});

#[inline]
fn is_escape_not_required(value: &str, raw: Option<&str>) -> bool {
    if value.is_empty() {
        return true;
    }

    if raw.is_some() && value.contains(REPLACEMENT_CHARACTER) {
        return false;
    }

    if (b'0'..=b'9').contains(&value.as_bytes()[0]) {
        return false;
    }

    if value.len() == 1 && value.as_bytes()[0] == b'-' {
        return false;
    }

    if value.len() >= 2
        && value.as_bytes()[0] == b'-'
        && (b'0'..=b'9').contains(&value.as_bytes()[1])
    {
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
pub fn serialize_ident<'a>(value: &'a str, raw: Option<&str>, minify: bool) -> Cow<'a, str> {
    // Fast-path
    if is_escape_not_required(value, raw) {
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
            // Old browser hacks with `\0` and other - IE
            REPLACEMENT_CHARACTER if raw.is_some() => {
                result.push_str(raw.unwrap());

                return Cow::Owned(result);
            }
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
fn hex_escape(ascii_byte: u8, minify: bool) -> String {
    static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

    if ascii_byte > 0x0f {
        let high = (ascii_byte >> 4) as usize;
        let low = (ascii_byte & 0x0f) as usize;

        if minify {
            unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[high], HEX_DIGITS[low]]) }
                .to_string()
        } else {
            unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' ']) }
                .to_string()
        }
    } else if minify {
        unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[ascii_byte as usize]]) }.to_string()
    } else {
        unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[ascii_byte as usize], b' ']) }
            .to_string()
    }
}
