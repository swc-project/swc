use std::{
    cell::{Cell, RefCell},
    fmt, mem,
    rc::{Rc, Weak},
};

use swc_atoms::JsWord;
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
        mode: DocumentMode,
        children: Vec<Child>,
    },
    DocumentType {
        name: Option<JsWord>,
        public_id: Option<JsWord>,
        system_id: Option<JsWord>,
    },
    Element {
        namespace: Namespace,
        tag_name: JsWord,
        attributes: Vec<Attribute>,
    },
    Text {
        data: RefCell<String>,
    },
    Comment {
        data: JsWord,
    },
}

pub struct Node {
    pub parent: Cell<Option<WeakNode>>,
    pub children: RefCell<Vec<RcNode>>,
    pub data: Data,
    pub start_span: RefCell<Option<Span>>,
    pub end_span: RefCell<Option<Span>>,
}

impl Node {
    /// Create a new node from its contents
    pub fn new(data: Data, span: Option<Span>) -> Rc<Self> {
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

            nodes.extend(children.into_iter());

            // TODO `<template>` and use contents
            // if let Element { ref children, .. } = node.data {
            //     if let Some(template_contents) = children.borrow_mut().take()
            //     {     nodes.push(template_contents);
            //     }
            // }
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
