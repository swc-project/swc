use swc_common::{comments::Comment, BytePos};

#[derive(Debug, Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Debug, Clone, Copy)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

pub trait CommentsBufferTrait {
    fn push_comment(&mut self, comment: BufferedComment);
    fn push_pending(&mut self, comment: Comment);
    fn pending_to_comment(&mut self, kind: BufferedCommentKind, pos: BytePos);
    fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_;
}
