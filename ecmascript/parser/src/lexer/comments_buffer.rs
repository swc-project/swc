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
    last_item: Option<OneDirectionalListRootNode<T>>,
}

impl<T: Clone> OneDirectionalList<T> {
    pub fn new() -> Self {
        Self { last_item: None }
    }

    pub fn take_all(&mut self) -> Vec<T> {
        if let Some(last_item) = self.last_item.take() {
            let mut items = Vec::with_capacity(last_item.len());
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
        let previous = self.last_item.take().map(|root_node| {
            Rc::new(OneDirectionalListNode {
                length: root_node.len(),
                item: root_node.item,
                previous: root_node.previous,
            })
        });
        let new_item = OneDirectionalListRootNode { item, previous };
        self.last_item = Some(new_item);
    }
}

#[derive(Clone)]
struct OneDirectionalListRootNode<T: Clone> {
    // no length stored here in order to reduce memory needed to clone
    item: T,
    previous: Option<Rc<OneDirectionalListNode<T>>>,
}

impl<T: Clone> OneDirectionalListRootNode<T> {
    pub fn len(&self) -> usize {
        self.previous.as_ref().map(|p| p.length + 1).unwrap_or(1)
    }
}

#[derive(Clone)]
struct OneDirectionalListNode<T: Clone> {
    item: T,
    previous: Option<Rc<OneDirectionalListNode<T>>>,
    length: usize,
}
