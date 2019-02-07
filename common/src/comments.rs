use crate::{BytePos, Span};
use fxhash::FxHashMap;
use std::{cell::RefCell, rc::Rc};

type CommentMap = FxHashMap<BytePos, Vec<Comment>>;

#[derive(Debug, Clone, Default)]
pub struct Comments {
    leading: Rc<RefCell<CommentMap>>,
    trailing: Rc<RefCell<CommentMap>>,
}

impl Comments {
    pub fn add_leading(&self, pos: BytePos, cmt: Vec<Comment>) {
        self.leading.borrow_mut().insert(pos, cmt);
    }

    pub fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.borrow_mut().entry(pos).or_default().push(cmt);
    }

    pub fn trailing_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        let mut cs = self.trailing.borrow_mut();
        cs.remove_entry(&pos).map(|v| v.1)
    }

    pub fn leading_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        let mut cs = self.leading.borrow_mut();
        cs.remove_entry(&pos).map(|v| v.1)
    }
}

#[derive(Debug, Clone)]
pub struct Comment {
    pub kind: CommentKind,
    pub span: Span,
    pub text: String,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommentKind {
    Line,
    Block,
}
