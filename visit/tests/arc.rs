use std::{any::Any, sync::Arc};
use swc_visit::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

pub struct Item {
    pub item: Arc<Item>,
    pub ref_to_enum: Arc<Enum>,
}
pub enum Enum {
    Item(Arc<Item>),
    Items(Arc<Vec<Item>>),
    Enum(Arc<Enum>),
    Enums(Arc<Vec<Enum>>),
}

define!({
    pub struct Item {
        pub item: Arc<Item>,
        pub ref_to_enum: Arc<Enum>,
    }
    pub enum Enum {
        Item(Arc<Item>),
        Items(Arc<Vec<Item>>),
        Enum(Arc<Enum>),
        Enums(Arc<Vec<Enum>>),
    }
});
