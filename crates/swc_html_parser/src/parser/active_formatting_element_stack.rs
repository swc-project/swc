use swc_html_ast::Token;

use crate::parser::{is_same_node, Element, RcNode, TokenAndInfo};

#[derive(Debug)]
pub enum ActiveFormattingElement {
    Element(RcNode, TokenAndInfo),
    Marker,
}

pub struct ActiveFormattingElementStack {
    pub items: Vec<ActiveFormattingElement>,
}

impl ActiveFormattingElementStack {
    pub fn new() -> Self {
        ActiveFormattingElementStack { items: vec![] }
    }

    pub fn push(&mut self, value: ActiveFormattingElement) {
        // When the steps below require the UA to push onto the list of active
        // formatting elements an element element, the UA must perform the following
        // steps:

        // 1. If there are already three elements in the list of active formatting
        // elements after the last marker, if any, or anywhere in the list if
        // there are no markers, that have the same tag name, namespace, and
        // attributes as element, then remove the earliest such element from the
        // list of active formatting elements. For these purposes, the attributes
        // must be compared as they were when the elements were created by the parser;
        // two elements have the same attributes if all their parsed attributes
        // can be paired such that the two attributes in each pair have
        // identical names, namespaces, and values (the order of the attributes
        // does not matter).
        let mut count = 0;
        let new_element = match &value {
            ActiveFormattingElement::Element(node, token_and_info) => (node, token_and_info),
            _ => {
                unreachable!();
            }
        };

        for element in self.items.iter().rev() {
            let (node_in_element, token_and_info_in_element) = match &element {
                ActiveFormattingElement::Marker => {
                    break;
                }
                ActiveFormattingElement::Element(node, token_and_info) => {
                    if get_namespace!(node) != get_namespace!(new_element.0)
                        || get_tag_name!(node) != get_tag_name!(new_element.0)
                    {
                        continue;
                    }

                    (node.clone(), token_and_info.clone())
                }
            };

            let attributes_in_element = match &token_and_info_in_element.token {
                Token::StartTag { attributes, .. } | Token::EndTag { attributes, .. } => {
                    attributes.clone()
                }
                _ => {
                    unreachable!()
                }
            };
            let attributes_in_new_element = match &new_element.1.token {
                Token::StartTag { attributes, .. } | Token::EndTag { attributes, .. } => {
                    attributes.clone()
                }
                _ => {
                    unreachable!()
                }
            };

            if attributes_in_element.len() != attributes_in_new_element.len() {
                continue;
            }

            let mut sorted_attributes_in_element = attributes_in_element.clone();

            for attribute in &mut sorted_attributes_in_element {
                attribute.span = Default::default();
            }

            let mut sorted_attributes_in_new_element = attributes_in_new_element.clone();

            for attribute in &mut sorted_attributes_in_new_element {
                attribute.span = Default::default();
            }

            sorted_attributes_in_element.sort();
            sorted_attributes_in_new_element.sort();

            if sorted_attributes_in_element != sorted_attributes_in_new_element {
                continue;
            }

            count += 1;

            if count == 3 {
                self.remove(&node_in_element);

                break;
            }
        }

        // 2. Add element to the list of active formatting elements.
        self.items.push(value);
    }

    pub fn remove(&mut self, node: &RcNode) {
        let position = self.get_position(node);

        if let Some(position) = position {
            self.items.remove(position);
        }
    }

    pub fn insert_marker(&mut self) {
        self.items.push(ActiveFormattingElement::Marker);
    }

    pub fn get_position(&self, element: &RcNode) -> Option<usize> {
        self.items.iter().position(|n| match *n {
            ActiveFormattingElement::Marker => false,
            ActiveFormattingElement::Element(ref handle, _) => is_same_node(handle, element),
        })
    }

    pub fn clear_to_last_marker(&mut self) {
        loop {
            match self.items.pop() {
                None | Some(ActiveFormattingElement::Marker) => break,
                _ => (),
            }
        }
    }
}
