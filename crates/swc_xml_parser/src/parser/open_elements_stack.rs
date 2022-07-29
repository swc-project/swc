use crate::parser::RcNode;

pub struct OpenElementsStack {
    pub items: Vec<RcNode>,
}

impl OpenElementsStack {
    pub fn new() -> Self {
        OpenElementsStack {
            items: Vec::with_capacity(16),
        }
    }

    pub fn pop_until_tag_name_popped(&mut self, tag_name: &[&str]) -> Option<RcNode> {
        while let Some(node) = self.items.pop() {
            if tag_name.contains(&get_tag_name!(node)) {
                return Some(node);
            }
        }

        None
    }
}
