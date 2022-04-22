use crate::parser::{RcNode, TokenAndInfo};

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

    pub fn insert_marker(&mut self) {
        self.items.push(ActiveFormattingElement::Marker);
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
