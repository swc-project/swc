use std::{any::Any, cell::RefCell, rc::Rc};

use petgraph::graph::DiGraph;

use crate::ptr::Ptr;

pub type LinkedDirectedGraph<N, E> = DiGraph<DiGraphNode<N>, DiGraphEdge<E>>;

#[derive(Clone)]
pub struct DiGraphNode<N> {
    data: Ptr<N>,
    annotation: Rc<RefCell<Option<Box<dyn Any>>>>,
}

impl<N> DiGraphNode<N> {
    pub fn get_value(&self) -> &Ptr<N> {
        &self.data
    }

    pub fn get_annotation<T>(&self) -> &T
    where
        T: Any,
    {
        self.annotation
            .borrow()
            .as_ref()
            .unwrap()
            .downcast_ref::<T>()
            .unwrap()
    }

    pub fn set_annotation<T>(&mut self, annotation: T)
    where
        T: Any,
    {
        self.annotation.replace(Some(Box::new(annotation)));
    }
}

impl<N> std::ops::Deref for DiGraphNode<N> {
    type Target = Ptr<N>;

    fn deref(&self) -> &Self::Target {
        &self.data
    }
}

impl<N> PartialEq for DiGraphNode<N> {
    fn eq(&self, other: &Self) -> bool {
        self.data == other.data
    }
}

#[derive(Clone)]
pub struct DiGraphEdge<E> {
    data: E,
    annotation: Rc<RefCell<Option<Box<dyn Any>>>>,
}

impl<E> DiGraphEdge<E> {
    pub fn get_annotation<T>(&self) -> &T
    where
        T: Any,
    {
        self.annotation
            .borrow()
            .as_ref()
            .unwrap()
            .downcast_ref::<T>()
            .unwrap()
    }

    pub fn set_annotation<T>(&self, annotation: T)
    where
        T: Any,
    {
        self.annotation.replace(Some(Box::new(annotation)));
    }
}
