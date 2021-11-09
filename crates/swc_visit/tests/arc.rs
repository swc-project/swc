use std::{any::Any, sync::Arc};
use swc_visit::define;

/// Visitable nodes.
pub trait Node: Any {}

impl<T: ?Sized> Node for T where T: Any {}

pub struct Item {
    pub item: Option<Arc<Item>>,
    pub ref_to_enum: Option<Arc<Enum>>,
}
pub enum Enum {
    Item(Arc<Item>),
    Items(Arc<Vec<Item>>),
    Enum(Arc<Enum>),
    Enums(Arc<Vec<Enum>>),
}

define!({
    pub struct Item {
        pub item: Option<Arc<Item>>,
        pub ref_to_enum: Option<Arc<Enum>>,
    }
    pub enum Enum {
        Item(Arc<Item>),
        Items(Arc<Vec<Item>>),
        Enum(Arc<Enum>),
        Enums(Arc<Vec<Enum>>),
    }
});

struct Panic;

impl Visit for Panic {
    fn visit_item(&mut self, _: &Item, _parent: &dyn Node) {
        panic!("Success")
    }
}

#[test]
#[should_panic(expected = "Success")]
fn test_panic() {
    Enum::Item(Arc::new(Item {
        item: None,
        ref_to_enum: None,
    }))
    .visit_children_with(&mut Panic)
}
