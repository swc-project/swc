use crate::Span;
use std::{cell::RefCell, rc::Rc};

#[derive(Debug, Clone, Default)]
pub struct Comments {
    line_comments: Rc<RefCell<Vec<LineComment>>>,
    block_comments: Rc<RefCell<Vec<BlockComment>>>,
}

impl Comments {
    pub fn add_line(&self, span: Span, is_for_next: bool, text: String) {
        let mut cs = self.line_comments.borrow_mut();
        cs.push(LineComment {
            span,
            is_for_next,
            text,
        });
    }

    pub fn add_block(&self, span: Span, is_for_next: bool, text: String) {
        let mut cs = self.block_comments.borrow_mut();
        cs.push(BlockComment {
            span,
            is_for_next,
            text,
        });
    }
}

#[derive(Debug, Clone)]
pub struct LineComment {
    pub span: Span,
    pub is_for_next: bool,
    pub text: String,
}

#[derive(Debug, Clone)]
pub struct BlockComment {
    pub span: Span,
    pub is_for_next: bool,
    pub text: String,
}
