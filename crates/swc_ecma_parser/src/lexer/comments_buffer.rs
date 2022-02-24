use std::{iter::Rev, rc::Rc, vec::IntoIter};

use swc_common::{comments::Comment, BytePos};

#[derive(Clone)]
pub(crate) struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Clone)]
pub(crate) enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Clone)]
pub(crate) struct CommentsBuffer {
    comments: OneDirectionalList<BufferedComment>,
    pending_leading: OneDirectionalList<Comment>,
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self {
            comments: OneDirectionalList::new(),
            pending_leading: OneDirectionalList::new(),
        }
    }

    pub fn push(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    pub fn take_comments(&mut self) -> Rev<IntoIter<BufferedComment>> {
        self.comments.take_all()
    }

    pub fn take_pending_leading(&mut self) -> Rev<IntoIter<Comment>> {
        self.pending_leading.take_all()
    }
}

/// A one direction linked list that can be cheaply
/// cloned with the clone maintaining its position in the list.
#[derive(Clone)]
struct OneDirectionalList<T: Clone> {
    last_node: Option<Rc<OneDirectionalListNode<T>>>,
}

impl<T: Clone> OneDirectionalList<T> {
    pub fn new() -> Self {
        Self { last_node: None }
    }

    pub fn take_all(&mut self) -> Rev<IntoIter<T>> {
        // these are stored in reverse, so we need to reverse them back
        let mut items = Vec::new();
        let mut current_node = self.last_node.take();
        while let Some(node) = current_node {
            let mut node = match Rc::try_unwrap(node) {
                Ok(n) => n,
                Err(n) => n.as_ref().clone(),
            };
            items.push(node.item);
            current_node = node.previous.take();
        }
        items.into_iter().rev()
    }

    pub fn push(&mut self, item: T) {
        let previous = self.last_node.take();
        let new_item = OneDirectionalListNode { item, previous };
        self.last_node = Some(Rc::new(new_item));
    }
}

#[derive(Clone)]
struct OneDirectionalListNode<T: Clone> {
    item: T,
    previous: Option<Rc<OneDirectionalListNode<T>>>,
}
