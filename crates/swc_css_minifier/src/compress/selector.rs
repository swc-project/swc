use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_selector() -> impl VisitMut {
    CompressSelector {}
}

struct CompressSelector {}

impl CompressSelector {}

impl VisitMut for CompressSelector {
    fn visit_mut_subclass_selector(&mut self, subclass_selector: &mut SubclassSelector) {
        subclass_selector.visit_mut_children_with(self);

        match subclass_selector {
            SubclassSelector::PseudoElement(PseudoElementSelector { name, span, .. }) => {
                match &*name.value.to_lowercase() {
                    "before" | "after" | "first-letter" | "first-line" => {
                        *subclass_selector = SubclassSelector::PseudoClass(PseudoClassSelector {
                            span: *span,
                            name: name.clone(),
                            children: None,
                        })
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    // fn visit_mut_compound_selector(&mut self, compound_selector: &mut CompoundSelector) {
    //     compound_selector.visit_mut_children_with(self);
    // 
    //     if compound_selector.subclass_selectors.len() > 0 {
    //         match compound_selector.type_selector { 
    //             Some(TypeSelector::Universal(_)) => {
    //                 compound_selector.type_selector = None;
    //             }
    //             _ => {}
    //         }
    //     }
    // }

    fn visit_mut_attribute_selector(&mut self, attribute_selector: &mut AttributeSelector) {
        attribute_selector.visit_mut_children_with(self);

        if let Some(AttributeSelectorValue::Str(Str { value, span, .. })) =
            &attribute_selector.value
        {
            // A valid unquoted attribute value in CSS is any string of text that is not the
            // empty string, is not just a hyphen (-), consists of escaped characters and/or
            // characters matching [-_a-zA-Z0-9\u00A0-\u10FFFF] entirely, and doesn’t start
            // with a digit or a hyphen followed by a digit.

            // is any string of text that is not the empty string, is not just a hyphen (-)
            if value.is_empty() || value == "-" {
                return;
            }

            let chars = value.chars();

            let mut starts_with_hyphen = false;

            for (idx, char) in chars.enumerate() {
                match char {
                    '0'..='9' if idx == 0 || (starts_with_hyphen && idx == 1) => {
                        return;
                    }
                    '-' => {
                        if idx == 0 {
                            starts_with_hyphen = true;
                        }
                    }
                    _ if !matches!(char, '-' | '_' | 'a'..='z' | 'A'..='Z' | '0'..='9' | '\u{00a0}'..='\u{10FFFF}') =>
                    {
                        return;
                    }
                    _ => {}
                }
            }

            attribute_selector.value = Some(AttributeSelectorValue::Ident(Ident {
                span: *span,
                value: value.clone(),
                raw: value.clone(),
            }));
        }
    }
}
