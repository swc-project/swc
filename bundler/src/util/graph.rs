use std::{
    cmp::Ordering,
    hash::{Hash, Hasher},
    marker::PhantomData,
};

// Used to get a `Copy` type
pub(crate) struct Inliner<T>
where
    T: Eq,
{
    inner: Vec<T>,
}

impl<T> Inliner<T>
where
    T: Eq,
{
    pub fn inline(&mut self, t: T) -> NodeId<T> {
        for (index, item) in self.inner.iter().enumerate() {
            if *item == t {
                return NodeId(index, PhantomData);
            }
        }
        self.inner.push(t);

        NodeId(self.inner.len() - 1, PhantomData)
    }
}

impl<T> Default for Inliner<T>
where
    T: Eq,
{
    fn default() -> Self {
        Self {
            inner: Default::default(),
        }
    }
}

pub(crate) struct NodeId<T>(usize, PhantomData<T>);

impl<T> Clone for NodeId<T> {
    fn clone(&self) -> Self {
        NodeId(self.0, self.1)
    }
}

impl<T> Copy for NodeId<T> {}

impl<T> PartialEq for NodeId<T> {
    fn eq(&self, other: &Self) -> bool {
        self.0 == other.0
    }
}

impl<T> Eq for NodeId<T> {}

impl<T> PartialOrd for NodeId<T> {
    fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
        self.0.partial_cmp(&other.0)
    }
}

impl<T> Ord for NodeId<T> {
    fn cmp(&self, other: &Self) -> Ordering {
        self.0.cmp(&other.0)
    }
}

impl<T> Hash for NodeId<T> {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.0.hash(state)
    }
}
