use crate::{
    pos::Spanned,
    syntax_pos::{BytePos, Span, DUMMY_SP},
};
use fxhash::FxHashMap;
use std::{
    cell::{Ref, RefCell},
    rc::Rc,
    sync::Arc,
};

/// Stores comment.
///
/// ## Implementation notes
///
/// Methods uses `(&self)` instead of `(&mut self)` for some reasons. Firstly,
/// this is similar to the previous api. Secondly, typescript parser requires
/// backtracking, which requires [Clone]. To avoid cloning large vectors, we
/// must use [Rc<RefCell<Comments>>]. We have two option. We may implement it in
/// the parser or in the implementation. If we decide to go with first option,
/// we should pass [Comments] to parser, and as a result we need another method
/// to take comments back. If we decide to go with second way, we can just pass
/// [&Comments] to the parser. Thirdly, `(&self)` allows multi-threaded
/// use-cases such as swc itself.
///
/// We use [Option] instead of no-op Comments implementation to avoid allocation
/// unless required.
pub trait Comments {
    fn add_leading(&self, pos: BytePos, cmt: Comment);
    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>);
    fn has_leading(&self, pos: BytePos) -> bool;
    fn move_leading(&self, from: BytePos, to: BytePos);
    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>>;

    fn add_trailing(&self, pos: BytePos, cmt: Comment);
    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>);
    fn has_trailing(&self, pos: BytePos) -> bool;
    fn move_trailing(&self, from: BytePos, to: BytePos);
    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>>;

    fn add_pure_comment(&self, pos: BytePos) {
        let mut leading = self.take_leading(pos);
        let pure_comment = Comment {
            kind: CommentKind::Block,
            span: DUMMY_SP,
            text: "#__PURE__".into(),
        };

        match &mut leading {
            Some(comments) => {
                if !comments.iter().any(|c| c.text == pure_comment.text) {
                    comments.push(pure_comment);
                }
            }
            None => {
                leading = Some(vec![pure_comment]);
            }
        }
        if let Some(leading) = leading {
            self.add_leading_comments(pos, leading);
        }
    }
}

macro_rules! delegate {
    () => {
        fn add_leading(&self, pos: BytePos, cmt: Comment) {
            (**self).add_leading(pos, cmt)
        }

        fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
            (**self).add_leading_comments(pos, comments)
        }

        fn has_leading(&self, pos: BytePos) -> bool {
            (**self).has_leading(pos)
        }

        fn move_leading(&self, from: BytePos, to: BytePos) {
            (**self).move_leading(from, to)
        }

        fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
            (**self).take_leading(pos)
        }

        fn add_trailing(&self, pos: BytePos, cmt: Comment) {
            (**self).add_trailing(pos, cmt)
        }

        fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
            (**self).add_trailing_comments(pos, comments)
        }

        fn has_trailing(&self, pos: BytePos) -> bool {
            (**self).has_trailing(pos)
        }

        fn move_trailing(&self, from: BytePos, to: BytePos) {
            (**self).move_trailing(from, to)
        }

        fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
            (**self).take_trailing(pos)
        }

        fn add_pure_comment(&self, pos: BytePos) {
            (**self).add_pure_comment(pos)
        }
    };
}

impl<T> Comments for &'_ T
where
    T: ?Sized + Comments,
{
    delegate!();
}

impl<T> Comments for Arc<T>
where
    T: ?Sized + Comments,
{
    delegate!();
}

impl<T> Comments for Rc<T>
where
    T: ?Sized + Comments,
{
    delegate!();
}

impl<T> Comments for Box<T>
where
    T: ?Sized + Comments,
{
    delegate!();
}

pub type SingleThreadedCommentsMapInner = FxHashMap<BytePos, Vec<Comment>>;
pub type SingleThreadedCommentsMap = Rc<RefCell<SingleThreadedCommentsMapInner>>;

/// Single-threaded storage for comments.
#[derive(Debug, Clone, Default)]
pub struct SingleThreadedComments {
    leading: SingleThreadedCommentsMap,
    trailing: SingleThreadedCommentsMap,
}

impl Comments for SingleThreadedComments {
    fn add_leading(&self, pos: BytePos, cmt: Comment) {
        self.leading.borrow_mut().entry(pos).or_default().push(cmt);
    }

    fn add_leading_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.leading
            .borrow_mut()
            .entry(pos)
            .or_default()
            .extend(comments);
    }

    fn has_leading(&self, pos: BytePos) -> bool {
        self.leading.borrow().contains_key(&pos)
    }

    fn move_leading(&self, from: BytePos, to: BytePos) {
        let cmt = self.leading.borrow_mut().remove(&from);

        if let Some(cmt) = cmt {
            self.leading.borrow_mut().entry(to).or_default().extend(cmt);
        }
    }

    fn take_leading(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.leading.borrow_mut().remove(&pos)
    }

    fn add_trailing(&self, pos: BytePos, cmt: Comment) {
        self.trailing.borrow_mut().entry(pos).or_default().push(cmt);
    }

    fn add_trailing_comments(&self, pos: BytePos, comments: Vec<Comment>) {
        self.trailing
            .borrow_mut()
            .entry(pos)
            .or_default()
            .extend(comments);
    }

    fn has_trailing(&self, pos: BytePos) -> bool {
        self.trailing.borrow().contains_key(&pos)
    }

    fn move_trailing(&self, from: BytePos, to: BytePos) {
        let cmt = self.trailing.borrow_mut().remove(&from);

        if let Some(cmt) = cmt {
            self.trailing
                .borrow_mut()
                .entry(to)
                .or_default()
                .extend(cmt);
        }
    }

    fn take_trailing(&self, pos: BytePos) -> Option<Vec<Comment>> {
        self.trailing.borrow_mut().remove(&pos)
    }
}

impl SingleThreadedComments {
    /// Takes all the comments as (leading, trailing).
    pub fn take_all(self) -> (SingleThreadedCommentsMap, SingleThreadedCommentsMap) {
        (self.leading, self.trailing)
    }

    /// Borrows all the comments as (leading, trailing).
    pub fn borrow_all<'a>(
        &'a self,
    ) -> (
        Ref<'a, SingleThreadedCommentsMapInner>,
        Ref<'a, SingleThreadedCommentsMapInner>,
    ) {
        (self.leading.borrow(), self.trailing.borrow())
    }

    pub fn with_leading<F, Ret>(&self, pos: BytePos, op: F) -> Ret
    where
        F: FnOnce(&[Comment]) -> Ret,
    {
        if let Some(comments) = self.leading.borrow().get(&pos) {
            op(&*comments)
        } else {
            op(&[])
        }
    }

    pub fn with_trailing<F, Ret>(&self, pos: BytePos, op: F) -> Ret
    where
        F: FnOnce(&[Comment]) -> Ret,
    {
        if let Some(comments) = self.trailing.borrow().get(&pos) {
            op(&*comments)
        } else {
            op(&[])
        }
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

pub trait CommentsExt: Comments {
    fn with_leading<F, Ret>(&self, pos: BytePos, op: F) -> Ret
    where
        F: FnOnce(&[Comment]) -> Ret,
    {
        if let Some(comments) = self.take_leading(pos) {
            let ret = op(&comments);
            self.add_leading_comments(pos, comments);
            ret
        } else {
            op(&[])
        }
    }

    fn with_trailing<F, Ret>(&self, pos: BytePos, op: F) -> Ret
    where
        F: FnOnce(&[Comment]) -> Ret,
    {
        if let Some(comments) = self.take_trailing(pos) {
            let ret = op(&comments);
            self.add_trailing_comments(pos, comments);
            ret
        } else {
            op(&[])
        }
    }
}

impl<C> CommentsExt for C where C: Comments {}
