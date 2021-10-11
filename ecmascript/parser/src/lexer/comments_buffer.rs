use std::rc::Rc;

use swc_common::{comments::Comment, BytePos};

#[derive(Clone)]
pub struct BufferedComment {
    pub pos: BytePos,
    pub comment: Comment,
}

#[derive(Clone)]
pub struct CommentsBuffer {
    leading: OneDirectionalList<BufferedComment>,
    trailing: OneDirectionalList<BufferedComment>,
    pending_leading: OneDirectionalList<Comment>,
}

impl CommentsBuffer {
    pub fn new() -> Self {
        Self {
            leading: OneDirectionalList::new(),
            trailing: OneDirectionalList::new(),
            pending_leading: OneDirectionalList::new(),
        }
    }

    pub fn push_leading(&mut self, comment: BufferedComment) {
        self.leading.push(comment);
    }

    pub fn push_trailing(&mut self, comment: BufferedComment) {
        self.trailing.push(comment);
    }

    pub fn push_pending_leading(&mut self, comment: Comment) {
        self.pending_leading.push(comment);
    }

    pub fn take_leading(&mut self) -> Vec<BufferedComment> {
        self.leading.take_all()
    }

    pub fn take_trailing(&mut self) -> Vec<BufferedComment> {
        self.trailing.take_all()
    }

    pub fn take_pending_leading(&mut self) -> Vec<Comment> {
        self.pending_leading.take_all()
    }
}

/// A one direction linked list that can be cheaply
/// cloned with the clone maintaining its position in the list.
#[derive(Clone)]
struct OneDirectionalList<T: Clone> {
    last_item: Option<OneDirectionalListNode<T>>,
}

impl<T: Clone> OneDirectionalList<T> {
    pub fn new() -> Self {
        Self { last_item: None }
    }

    pub fn take_all(&mut self) -> Vec<T> {
        if let Some(last_item) = self.last_item.take() {
            let capacity = last_item.depth + 1;
            let mut items = Vec::with_capacity(capacity);
            items.push(last_item.item);
            let mut previous = last_item.previous;
            while let Some(item) = previous {
                let item = match Rc::try_unwrap(item) {
                    Ok(p) => p,
                    Err(p) => p.as_ref().clone(),
                };
                items.push(item.item);
                previous = item.previous;
            }
            // reverse because the items were pushed first to last
            items.reverse();
            items
        } else {
            Vec::with_capacity(0)
        }
    }

    pub fn push(&mut self, item: T) {
        let previous = self.last_item.take().map(Rc::new);
        let depth = previous.as_ref().map(|p| p.depth + 1).unwrap_or(0);
        let new_item = OneDirectionalListNode {
            item,
            previous,
            depth,
        };
        self.last_item = Some(new_item);
    }
}

#[derive(Clone)]
struct OneDirectionalListNode<T: Clone> {
    pub item: T,
    previous: Option<Rc<OneDirectionalListNode<T>>>,
    depth: usize,
}
