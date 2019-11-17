use crate::syntax_pos::{BytePos, Span};
use chashmap::{CHashMap, ReadGuard};

type CommentMap = CHashMap<BytePos, Vec<Comment>>;

#[derive(Debug, Default)]
pub struct Comments {
    leading: CommentMap,
    trailing: CommentMap,
}

impl Comments {
    pub fn add_leading(&self, pos: BytePos, cmt: Vec<Comment>) {
        self.leading.insert(pos, cmt);
    }

    pub fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.alter(pos, |v| match v {
            Some(mut value) => {
                value.push(cmt);
                Some(value)
            }
            None => Some(vec![cmt]),
        });
    }

    pub fn trailing_comments(&self, pos: BytePos) -> Option<ReadGuard<'_, BytePos, Vec<Comment>>> {
        self.trailing.get(&pos)
    }

    pub fn leading_comments(&self, pos: BytePos) -> Option<ReadGuard<'_, BytePos, Vec<Comment>>> {
        self.leading.get(&pos)
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
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
