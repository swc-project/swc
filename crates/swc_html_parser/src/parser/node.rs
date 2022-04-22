use std::{
    cell::{Cell, RefCell},
    mem,
    rc::{Rc, Weak},
};

use swc_html_ast::*;

#[derive(Debug, Clone)]
pub enum Data {
    Document(Document),
    DocumentType(DocumentType),
    Element(Element),
    Text(Text),
    Comment(Comment),
}

pub struct Node {
    pub parent: Cell<Option<WeakNode>>,
    pub children: RefCell<Vec<RcNode>>,
    pub data: Data,
}

impl Node {
    /// Create a new node from its contents
    pub fn new(data: Data) -> Rc<Self> {
        Rc::new(Node {
            parent: Cell::new(None),
            children: RefCell::new(Vec::new()),
            data,
        })
    }
}

impl Drop for Node {
    fn drop(&mut self) {
        let mut nodes = mem::take(&mut *self.children.borrow_mut());

        while let Some(node) = nodes.pop() {
            let children = mem::take(&mut *node.children.borrow_mut());

            nodes.extend(children.into_iter());

            // TODO fix me
            // if let Element { ref children, .. } = node.data {
            //     if let Some(template_contents) = children.borrow_mut().take()
            //     {     nodes.push(template_contents);
            //     }
            // }
        }
    }
}

pub type RcNode = Rc<Node>;
type WeakNode = Weak<Node>;
