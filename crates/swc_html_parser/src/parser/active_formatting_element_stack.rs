use crate::parser::{is_same_node, RcNode, TokenAndInfo};

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

    pub fn push(&mut self, element: ActiveFormattingElement) {
        self.items.push(element);
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
