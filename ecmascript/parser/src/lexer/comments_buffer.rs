use std::rc::Rc;

use swc_common::{comments::Comment, BytePos};

#[derive(Clone)]
pub struct BufferedComment {
    pub kind: BufferedCommentKind,
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Clone)]
pub enum BufferedCommentKind {
    Leading,
    Trailing,
}

#[derive(Clone)]
pub struct CommentsBuffer {
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

    pub fn take_comments(&mut self) -> OneDirectionalListIterator<BufferedComment> {
        self.comments.into_iter()
    }

    pub fn take_pending_leading(&mut self) -> OneDirectionalListIterator<Comment> {
        self.pending_leading.into_iter()
    }
}

/// A one direction linked list that can be cheaply
/// cloned with the clone maintaining its position in the list.
#[derive(Clone)]
struct OneDirectionalList<T: Clone> {
    last_item: Option<Rc<OneDirectionalListNode<T>>>,
}

impl<T: Clone> OneDirectionalList<T> {
    pub fn new() -> Self {
        Self { last_item: None }
    }

    pub fn into_iter(&mut self) -> OneDirectionalListIterator<T> {
        OneDirectionalListIterator {
            node: self.last_item.take(),
        }
    }

    pub fn push(&mut self, item: T) {
        let previous = self.last_item.take();
        let new_item = OneDirectionalListNode { item, previous };
        self.last_item = Some(Rc::new(new_item));
    }
}

#[derive(Clone)]
struct OneDirectionalListNode<T: Clone> {
    item: T,
    previous: Option<Rc<OneDirectionalListNode<T>>>,
}

pub struct OneDirectionalListIterator<T: Clone> {
    node: Option<Rc<OneDirectionalListNode<T>>>,
}

impl<T: Clone> Iterator for OneDirectionalListIterator<T> {
    type Item = T;

    fn next(&mut self) -> Option<T> {
        match self.node.take() {
            Some(node) => {
                let node = match Rc::try_unwrap(node) {
                    Ok(n) => n,
                    Err(n) => n.as_ref().clone(),
                };
                self.node = node.previous;
                Some(node.item)
            }
            None => None,
        }
    }
}
