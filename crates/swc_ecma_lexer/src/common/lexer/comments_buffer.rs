use swc_common::{comments::Comment, BytePos};

#[derive(Debug, Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Debug, Clone)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

pub trait CommentsBufferTrait {
    fn push_comment(&mut self, comment: BufferedComment);
    fn push_pending_leading(&mut self, comment: Comment);
    fn pending_leading_to_comments<F: Fn(Comment) -> BufferedComment>(&mut self, f: F);
    fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_;
}
