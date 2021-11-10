use std::any::Any;
use swc_visit::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

pub struct Item {
    // pub field: usize,
    // pub inner: Option<Box<Item>>,
    pub opt_vec: Option<Vec<Item>>,
    pub vec_opt: Vec<Option<Item>>,
}
pub enum Enum {
    Item(Item),
}

define!({
    pub struct Item {
        // pub field: usize,
        // pub inner: Option<Box<Item>>,
        pub opt_vec: Option<Vec<Item>>,
        pub vec_opt: Vec<Option<Item>>,
    }
    pub enum Enum {
        Item(Item),
    }
});
