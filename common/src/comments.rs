use crate::{BytePos, Span};
use std::{cell::RefCell, rc::Rc};

#[derive(Debug, Clone, Default)]
pub struct Comments {
    comments: Rc<RefCell<Vec<Comment>>>,
}

impl Comments {
    fn add(&self, cmt: Comment) {
        self.comments.borrow_mut().push(cmt);
    }

    pub fn add_line(&self, span: Span, is_for_next: bool, text: String) {
        self.add(Comment {
            kind: CommentKind::Line,
            span,
            is_for_next,
            text,
        });
    }

    pub fn add_block(&self, span: Span, is_for_next: bool, text: String) {
        self.add(Comment {
            kind: CommentKind::Block,
            span,
            is_for_next,
            text,
        });
    }
}

#[derive(Debug, Clone)]
pub struct Comment {
    pub kind: CommentKind,
    pub span: Span,
    pub is_for_next: bool,
    pub text: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommentKind {
    Line,
    Block,
}
