#![cfg_attr(test, deny(warnings))]

use std::sync::Arc;

use dashmap::DashMap;
use swc_atoms::atom;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    BytePos, DUMMY_SP,
};

pub type CommentMap = Arc<DashMap<BytePos, Vec<Comment>, ahash::RandomState>>;

/// Multi-threaded implementation of [Comments]
#[derive(Clone, Default)]
pub struct SwcComments {
    pub leading: CommentMap,
    pub trailing: CommentMap,
}

impl Comments for SwcComments {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.leading.entry(pos).or_default().push(cmt);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.leading.entry(pos).or_default().extend(comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        if let Some(v) = self.leading.get(&pos) {
            !v.is_empty()
        } else {
            false
        }
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.take_leading(from);

        if let Some(mut cmt) = cmt {
            if from < to && self.has_leading(to) {
                cmt.extend(self.take_leading(to).unwrap());
            }

            self.add_leading_comments(to, cmt);
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos).map(|v| v.1)
    }

    fn get_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.get(&pos).map(|v| v.to_owned())
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.entry(pos).or_default().push(cmt)
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.trailing.entry(pos).or_default().extend(comments)
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        if let Some(v) = self.trailing.get(&pos) {
            !v.is_empty()
        } else {
            false
        }
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.take_trailing(from);

        if let Some(mut cmt) = cmt {
            if from < to && self.has_trailing(to) {
                cmt.extend(self.take_trailing(to).unwrap());
            }

            self.add_trailing_comments(to, cmt);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }

    fn get_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.get(&pos).map(|v| v.to_owned())
    }

    fn add_pure_comment(&self, pos: BytePos) {
        let mut leading = self.leading.entry(pos).or_default();
        let pure_comment = Comment {
            kind: CommentKind::Block,
            span: DUMMY_SP,
            text: atom!("#__PURE__"),
        };

        if !leading.iter().any(|c| c.text == pure_comment.text) {
            leading.push(pure_comment);
        }
    }

    fn with_leading<F, Ret>(&self, pos: BytePos, f: F) -> Ret
    where
        Self: Sized,
        F: FnOnce(&[Comment]) -> Ret,
    {
        let ret = if let Some(cmts) = self.leading.get(&pos) {
            f(&cmts)
        } else {
            f(&[])
        };

        ret
    }

    fn with_trailing<F, Ret>(&self, pos: BytePos, f: F) -> Ret
    where
        Self: Sized,
        F: FnOnce(&[Comment]) -> Ret,
    {
        let ret = if let Some(cmts) = &self.trailing.get(&pos) {
            f(cmts)
        } else {
            f(&[])
        };

        ret
    }
}
