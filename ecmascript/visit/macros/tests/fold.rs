use std::any::Any;
use swc_ecma_visit_macros::define;

/// Visitable nodes.
pub trait Node: Any {}

pub struct Optional<V> {
    pub enabled: bool,
    pub inner: V,
}

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
