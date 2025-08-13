use std::{iter::Rev, rc::Rc, vec::IntoIter};

use swc_common::comments::Comment;

use crate::common::lexer::comments_buffer::{BufferedComment, CommentsBufferTrait};

#[derive(Clone)]
pub struct CommentsBuffer {
    comments: OneDirectionalList<BufferedComment>,
    pending_leading: OneDirectionalList<Comment>,
}

impl Default for CommentsBuffer {
    fn default() -> Self {
        Self::new()
    }
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self {
            comments: OneDirectionalList::new(),
            pending_leading: OneDirectionalList::new(),
        }
    }
}

impl CommentsBufferTrait for CommentsBuffer {
    fn push_comment(&mut self, comment: BufferedComment) {
        self.comments.push(comment);
    }

    fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    fn take_comments(&mut self) -> impl Iterator<Item = BufferedComment> + '_ {
        self.comments.take_all()
    }

    fn pending_leading_to_comments<F: Fn(Comment) -> BufferedComment>(&mut self, f: F) {
        for comment in self.pending_leading.take_all() {
            let comment = f(comment);
            self.comments.push(comment);
        }
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
