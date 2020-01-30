use crate::{
    pos::Spanned,
    syntax_pos::{BytePos, Span},
};
use dashmap::{mapref::one::Ref, DashMap};
use fxhash::FxBuildHasher;

pub type CommentMap = DashMap<BytePos, Vec<Comment>, FxBuildHasher>;

#[derive(Debug)]
pub struct Comments {
    leading: CommentMap,
    trailing: CommentMap,
}

impl Default for Comments {
    fn default() -> Self {
        fn mk() -> CommentMap {
            DashMap::with_hasher(Default::default())
        }

        Comments {
            leading: mk(),
            trailing: mk(),
        }
    }
}

impl Comments {
    pub fn add_leading(&self, pos: BytePos, cmt: Vec<Comment>) {
        self.leading.insert(pos, cmt);
    }

    pub fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.entry(pos).or_default().push(cmt);
    }

    pub fn take_trailing_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.remove(&pos).map(|v| v.1)
    }

    pub fn trailing_comments(
        &self,
        pos: BytePos,
    ) -> Option<Ref<'_, BytePos, Vec<Comment>, FxBuildHasher>> {
        self.trailing.get(&pos)
    }

    pub fn take_leading_comments(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.remove(&pos).map(|v| v.1)
    }

    pub fn leading_comments(
        &self,
        pos: BytePos,
    ) -> Option<Ref<'_, BytePos, Vec<Comment>, FxBuildHasher>> {
        self.leading.get(&pos)
    }

    pub fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.leading.remove(&from);

        if let Some(cmt) = cmt {
            self.leading.entry(to).or_default().extend(cmt.1);
        }
    }

    pub fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.trailing.remove(&from);

        if let Some(cmt) = cmt {
            self.trailing.entry(to).or_default().extend(cmt.1);
        }
    }

    /// Takes all the comments as (leading, trailing).
    pub fn take_all(self) -> (CommentMap, CommentMap) {
        (self.leading, self.trailing)
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
