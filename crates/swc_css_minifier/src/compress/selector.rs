use swc_common::DUMMY_SP;
use swc_css_ast::*;
use swc_css_visit::{VisitMut, VisitMutWith};

pub fn compress_selector() -> impl VisitMut {
    CompressSelector {}
}

struct CompressSelector {}

impl CompressSelector {}

impl VisitMut for CompressSelector {
    fn visit_mut_nth(&mut self, nth: &mut Nth) {
        nth.visit_mut_children_with(self);

        match &nth.nth {
            // `2n+1`, `2n-1`, `2n-3`, etc => `odd`
            NthValue::AnPlusB(AnPlusB {
                a: Some(a),
                b: Some(b),
                span,
                ..
            }) if *a == 2 && (*b == 1 || b % 2 == -1) => {
                nth.nth = NthValue::Ident(Ident {
                    span: *span,
                    value: "odd".into(),
                    raw: "odd".into(),
                });
            }
            // `2n-0`, `2n-2`, `2n-4`, etc => `2n`
            NthValue::AnPlusB(AnPlusB {
                a: Some(a),
                b: Some(b),
                span,
                ..
            }) if *a == 2 && *b < 0 && b % 2 == 0 => {
                nth.nth = NthValue::AnPlusB(AnPlusB {
                    span: *span,
                    a: Some(2),
                    a_raw: Some("2".into()),
                    b: None,
                    b_raw: None,
                });
            }
            // `even` => `2n`
            NthValue::Ident(Ident { value, span, .. }) if &*value.to_lowercase() == "even" => {
                nth.nth = NthValue::AnPlusB(AnPlusB {
                    span: *span,
                    a: Some(2),
                    a_raw: Some("2".into()),
                    b: None,
                    b_raw: None,
                });
            }
            // `0n+5` => `5`, `0n-5` => `-5`, etc
            NthValue::AnPlusB(AnPlusB {
                a: Some(a),
                b,
                b_raw,
                span,
                ..
            }) if *a == 0 => {
                nth.nth = NthValue::AnPlusB(AnPlusB {
                    span: *span,
                    a: None,
                    a_raw: None,
                    b: *b,
                    b_raw: b_raw.clone(),
                });
            }
            // `-5n+0` => `-5n`, etc
            NthValue::AnPlusB(AnPlusB {
                a,
                a_raw,
                b: Some(b),
                span,
                ..
            }) if *b == 0 => {
                nth.nth = NthValue::AnPlusB(AnPlusB {
                    span: *span,
                    a: *a,
                    a_raw: a_raw.clone(),
                    b: None,
                    b_raw: None,
                });
            }
            _ => {}
        }
    }

    fn visit_mut_subclass_selector(&mut self, subclass_selector: &mut SubclassSelector) {
        subclass_selector.visit_mut_children_with(self);

        match &subclass_selector {
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
            SubclassSelector::PseudoClass(PseudoClassSelector {
                name,
                children: Some(children),
                span,
                ..
            }) if &*name.value.to_lowercase() == "nth-child" && children.len() == 1 => {
                match children.get(0) {
                    Some(PseudoSelectorChildren::Nth(Nth {
                        nth:
                            NthValue::AnPlusB(AnPlusB {
                                a: None,
                                b: Some(b),
                                ..
                            }),
                        ..
                    })) if *b == 1 => {
                        *subclass_selector = SubclassSelector::PseudoClass(PseudoClassSelector {
                            span: *span,
                            name: Ident {
                                span: DUMMY_SP,
                                value: "first-child".into(),
                                raw: "first-child".into(),
                            },
                            children: None,
                        })
                    }
                    _ => {}
                }
            }
            SubclassSelector::PseudoClass(PseudoClassSelector {
                name,
                children: Some(children),
                span,
                ..
            }) if &*name.value.to_lowercase() == "nth-last-child" && children.len() == 1 => {
                match children.get(0) {
                    Some(PseudoSelectorChildren::Nth(Nth {
                        nth:
                            NthValue::AnPlusB(AnPlusB {
                                a: None,
                                b: Some(b),
                                ..
                            }),
                        ..
                    })) if *b == 1 => {
                        *subclass_selector = SubclassSelector::PseudoClass(PseudoClassSelector {
                            span: *span,
                            name: Ident {
                                span: DUMMY_SP,
                                value: "last-child".into(),
                                raw: "last-child".into(),
                            },
                            children: None,
                        })
                    }
                    _ => {}
                }
            }
            SubclassSelector::PseudoClass(PseudoClassSelector {
                name,
                children: Some(children),
                span,
                ..
            }) if &*name.value.to_lowercase() == "nth-of-type" && children.len() == 1 => {
                match children.get(0) {
                    Some(PseudoSelectorChildren::Nth(Nth {
                        nth:
                            NthValue::AnPlusB(AnPlusB {
                                a: None,
                                b: Some(b),
                                ..
                            }),
                        ..
                    })) if *b == 1 => {
                        *subclass_selector = SubclassSelector::PseudoClass(PseudoClassSelector {
                            span: *span,
                            name: Ident {
                                span: DUMMY_SP,
                                value: "first-of-type".into(),
                                raw: "first-of-type".into(),
                            },
                            children: None,
                        })
                    }
                    _ => {}
                }
            }
            SubclassSelector::PseudoClass(PseudoClassSelector {
                name,
                children: Some(children),
                span,
                ..
            }) if &*name.value.to_lowercase() == "nth-last-of-type" && children.len() == 1 => {
                match children.get(0) {
                    Some(PseudoSelectorChildren::Nth(Nth {
                        nth:
                            NthValue::AnPlusB(AnPlusB {
                                a: None,
                                b: Some(b),
                                ..
                            }),
                        ..
                    })) if *b == 1 => {
                        *subclass_selector = SubclassSelector::PseudoClass(PseudoClassSelector {
                            span: *span,
                            name: Ident {
                                span: DUMMY_SP,
                                value: "last-of-type".into(),
                                raw: "last-of-type".into(),
                            },
                            children: None,
                        })
                    }
                    _ => {}
                }
            }
            _ => {}
        }
    }

    fn visit_mut_compound_selector(&mut self, compound_selector: &mut CompoundSelector) {
        compound_selector.visit_mut_children_with(self);

        if let Some(TypeSelector::Universal(UniversalSelector { prefix: None, .. })) =
            &compound_selector.type_selector
        {
            compound_selector.type_selector = None;
        }
    }

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
