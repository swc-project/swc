use crate::{
    pos::Spanned,
    syntax_pos::{BytePos, Span},
};
use chashmap::{CHashMap, ReadGuard};
use std::collections::HashMap;

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

    pub fn take_trailing_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos)
    }

    pub fn trailing_comments(&self, pos: BytePos) -> Option<ReadGuard<'_, BytePos, Vec<Comment>>> {
        self.trailing.get(&pos)
    }

    pub fn take_leading_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos)
    }

    pub fn leading_comments(&self, pos: BytePos) -> Option<ReadGuard<'_, BytePos, Vec<Comment>>> {
        self.leading.get(&pos)
    }

    pub fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.leading.remove(&from);

        if let Some(cmt) = cmt {
            self.leading.alter(to, |v| match v {
                Some(mut value) => {
                    value.extend(cmt);
                    Some(value)
                }
                None => Some(cmt),
            });
        }
    }

    pub fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.trailing.remove(&from);

        if let Some(cmt) = cmt {
            self.trailing.alter(to, |v| match v {
                Some(mut value) => {
                    value.extend(cmt);
                    Some(value)
                }
                None => Some(cmt),
            });
        }
    }

    /// Takes all the comments as (leading, trailing).
    pub fn take_all(
        self,
    ) -> (
        HashMap<BytePos, Vec<Comment>>,
        HashMap<BytePos, Vec<Comment>>,
    ) {
        (
            self.leading.into_iter().collect(),
            self.trailing.into_iter().collect(),
        )
    }
}

#[derive(Debug, Clone, PartialEq, Eq)]
pub struct Comment {
    pub kind: CommentKind,
    pub span: Span,
    pub text: String,
}

impl Spanned for Comment {
    fn span(&self) -> Span {
        self.span
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum CommentKind {
    Line,
    Block,
}
