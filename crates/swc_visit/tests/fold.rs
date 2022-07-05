#![allow(clippy::ptr_arg)]

use std::any::Any;

use swc_visit::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

#[derive(Debug, PartialEq)]
pub struct Item {
    // pub field: usize,
    // pub inner: Option<Box<Item>>,
    pub opt_vec: Option<Vec<Item>>,
    pub vec_opt: Vec<Option<Item>>,

    pub value: f64,
}
#[derive(Debug, PartialEq)]
pub enum Enum {
    Item(Item),
    Boxed(Box<Enum>),
}

define!({
    pub struct Item {
        // pub field: usize,
        // pub inner: Option<Box<Item>>,
        pub opt_vec: Option<Vec<Item>>,
        pub vec_opt: Vec<Option<Item>>,

        pub value: f64,
    }
    pub enum Enum {
        Item(Item),
        Boxed(Box<Enum>),
    }
});
