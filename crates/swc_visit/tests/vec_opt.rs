use std::any::Any;
use swc_visit::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

pub struct Item {
    pub vec_opt1: Vec<Option<Item>>,
    pub vec_opt2: Vec<Option<Enum>>,
}
pub enum Enum {
    Item(Item),
}

define!({
    pub struct Item {
        pub vec_opt1: Vec<Option<Item>>,
        pub vec_opt2: Vec<Option<Enum>>,
    }
    pub enum Enum {
        Item(Item),
    }
});
