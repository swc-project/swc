use crate::Span;
use std::{cell::RefCell, rc::Rc};

#[derive(Debug, Clone, Default)]
pub struct Comments {
    line_comments: Rc<RefCell<Vec<LineComment>>>,
    block_comments: Rc<RefCell<Vec<BlockComment>>>,
}

impl Comments {
    pub fn add_line(&mut self, span: Span, text: String) {}
}

#[derive(Debug, Clone)]
pub struct LineComment {}

#[derive(Debug, Clone)]
pub struct BlockComment {}
