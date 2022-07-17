#![allow(clippy::ptr_arg)]

use std::sync::Arc;

use swc_visit::define;

#[derive(Debug, PartialEq)]
pub struct Item {
    pub item: Option<Arc<Item>>,
    pub ref_to_enum: Option<Arc<Enum>>,
}
#[derive(Debug, PartialEq)]
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
    fn visit_item(&mut self, _: &Item) {
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
