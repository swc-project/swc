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

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L193
pub fn serialize_ident(mut value: &str) -> String {
    if value.is_empty() {
        return String::new();
    }

    let mut result = String::new();

    if let Some(stripped) = value.strip_prefix("--") {
        result += "--";
        result += &*serialize_name(stripped);
    } else if value == "-" {
        result += "\\-";
    } else {
        if value.as_bytes()[0] == b'-' {
            result += "-";
            value = &value[1..];
        }

        if let digit @ b'0'..=b'9' = value.as_bytes()[0] {
            result += &*hex_escape(digit);
            value = &value[1..];
        }

        result += &*serialize_name(value);
    }

    result
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L220
fn serialize_name(value: &str) -> String {
    let mut result = String::new();
    let mut chunk_start = 0;

    for (i, b) in value.bytes().enumerate() {
        let escaped = match b {
            b'0'..=b'9' | b'A'..=b'Z' | b'a'..=b'z' | b'_' | b'-' => continue,
            _ if !b.is_ascii() => continue,
            b'\0' => Some("\u{FFFD}"),
            _ => None,
        };
        result += &value[chunk_start..i];

        if let Some(escaped) = escaped {
            result += escaped;
        } else if (b'\x01'..=b'\x1F').contains(&b) || b == b'\x7F' {
            result += &*hex_escape(b);
        } else {
            result += &*char_escape(b);
        };

        chunk_start = i + 1;
    }

    result += &value[chunk_start..];
    result
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L166
fn hex_escape(ascii_byte: u8) -> String {
    static HEX_DIGITS: &[u8; 16] = b"0123456789abcdef";

    let b3;
    let b4;
    let bytes = if ascii_byte > 0x0f {
        let high = (ascii_byte >> 4) as usize;
        let low = (ascii_byte & 0x0f) as usize;
        b4 = [b'\\', HEX_DIGITS[high], HEX_DIGITS[low], b' '];
        &b4[..]
    } else {
        b3 = [b'\\', HEX_DIGITS[ascii_byte as usize], b' '];
        &b3[..]
    };

    // SAFETY: We know it's valid to convert bytes to &str 'cause it's all valid
    // ASCII
    unsafe { str::from_utf8_unchecked(bytes) }.to_string()
}

// https://github.com/servo/rust-cssparser/blob/4c5d065798ea1be649412532bde481dbd404f44a/src/serializer.rs#L185
fn char_escape(ascii_byte: u8) -> String {
    let bytes = [b'\\', ascii_byte];

    // SAFETY: We know it's valid to convert bytes to &str 'cause it's all valid
    // ASCII
    unsafe { str::from_utf8_unchecked(&bytes) }.to_string()
}
