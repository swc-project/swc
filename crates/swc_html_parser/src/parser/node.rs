use std::{
    cell::{Cell, RefCell},
    fmt, mem,
    rc::{Rc, Weak},
};

use swc_atoms::{Atom, JsWord};
use swc_common::Span;
use swc_html_ast::*;

#[derive(Debug, Clone)]
pub struct TokenAndInfo {
    pub span: Span,
    pub acknowledged: bool,
    pub token: Token,
}

#[derive(Debug, Clone)]
pub enum Data {
    Document {
        mode: RefCell<DocumentMode>,
    },
    DocumentType {
        name: Option<JsWord>,
        public_id: Option<JsWord>,
        system_id: Option<JsWord>,
        raw: Option<Atom>,
    },
    Element {
        namespace: Namespace,
        tag_name: JsWord,
        attributes: RefCell<Vec<Attribute>>,
        is_self_closing: bool,
    },
    Text {
        data: RefCell<String>,
        raw: RefCell<String>,
    },
    Comment {
        data: JsWord,
        raw: Option<Atom>,
    },
}

pub struct Node {
    pub parent: Cell<Option<WeakNode>>,
    pub children: RefCell<Vec<RcNode>>,
    pub data: Data,
    pub start_span: RefCell<Span>,
    pub end_span: RefCell<Option<Span>>,
}

impl Node {
    /// Create a new node from its contents
    pub fn new(data: Data, span: Span) -> Rc<Self> {
        Rc::new(Node {
            parent: Cell::new(None),
            children: RefCell::new(vec![]),
            start_span: RefCell::new(span),
            end_span: RefCell::new(None),
            data,
        })
    }
}

impl Drop for Node {
    fn drop(&mut self) {
        let mut nodes = mem::take(&mut *self.children.borrow_mut());

        while let Some(node) = nodes.pop() {
            let children = mem::take(&mut *node.children.borrow_mut());

            nodes.extend(children);
        }
    }
}

impl fmt::Debug for Node {
    fn fmt(&self, fmt: &mut fmt::Formatter) -> fmt::Result {
        fmt.debug_struct("Node")
            .field("data", &self.data)
            .field("children", &self.children)
            .finish()
    }
}

pub type RcNode = Rc<Node>;
type WeakNode = Weak<Node>;
