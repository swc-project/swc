#![deny(clippy::all)]

use std::str;

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

        if &*n.value.to_lowercase() == self.from {
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

        if &*n.name.value.to_lowercase() == self.from {
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

        if &*n.name.value.to_lowercase() == self.from {
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

        if &*n.name.value.to_lowercase() == self.from {
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
                if &*name.value.to_lowercase() == self.from =>
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

// https://drafts.csswg.org/cssom/#serialize-an-identifier
pub fn serialize_ident(value: &str, minify: bool) -> String {
    let mut result = String::with_capacity(value.len());
    let mut first = None;

    // To serialize an identifier means to create a string represented
    // by the concatenation of, for each character of the identifier:
    for (i, c) in value.chars().enumerate() {
        if i == 0 {
            first = Some(c);
        }

        // If the character is the first character and is a "-" (U+002D),
        // and there is no second character, then the escaped character.
        // Note: That's means a single dash string "-" return as escaped dash,
        // so move the condition out of the main loop
        if value.len() == 1 && first == Some('-') {
            result.push_str("\\-");

            return result;
        }

        let code = c as u32;

        // If the character is NULL (U+0000), then the REPLACEMENT CHARACTER (U+FFFD).
        if code == 0x0000 {
            result.push(char::REPLACEMENT_CHARACTER);

            continue;
        }

        if
        // If the character is in the range [\1-\1f] (U+0001 to U+001F) or is U+007F ...
        // Note: Do not compare with 0x0001 since 0x0000 is precessed before
        code <= 0x001F || code == 0x007F ||
                // [or] ... is in the range [0-9] (U+0030 to U+0039),
                (c.is_ascii_digit() && (
                    // If the character is the first character ...
                    i == 0 ||
                        // If the character is the second character ... and the first character is a "-" (U+002D)
                        i == 1 && first == Some('-')
                ))
        {
            // ... then the character escaped as code point.
            result.push_str(&hex_escape(c as u8, minify));

            continue;
        }

        // If the character is not handled by one of the above rules and is greater
        // than or equal to U+0080, is "-" (U+002D) or "_" (U+005F), or is in one
        // of the ranges [0-9] (U+0030 to U+0039), [A-Z] (U+0041 to U+005A),
        // or \[a-z] (U+0061 to U+007A), then the character itself.
        if is_name(c) {
            result.push(c);
        } else {
            // Otherwise, the escaped character.
            result.push_str(&char_escape(c as u8));
        }
    }

    result
}

// A name-start code point, a digit, or U+002D HYPHEN-MINUS (-).
fn is_name(c: char) -> bool {
    ((c.is_ascii_uppercase() || c.is_ascii_lowercase()) || !c.is_ascii() || c == '_')
        || c.is_ascii_digit()
        || c == '-'
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
    } else {
        if minify {
            unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[ascii_byte as usize]]) }
                .to_string()
        } else {
            unsafe { str::from_utf8_unchecked(&[b'\\', HEX_DIGITS[ascii_byte as usize], b' ']) }
                .to_string()
        }
    }
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L185
fn char_escape(ascii_byte: u8) -> String {
    let bytes = [b'\\', ascii_byte];

    // SAFETY: We know it's valid to convert bytes to &str 'cause it's all valid
    // ASCII
    unsafe { str::from_utf8_unchecked(&bytes) }.to_string()
}
