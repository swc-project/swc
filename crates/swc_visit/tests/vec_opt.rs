#![allow(clippy::ptr_arg)]

use std::any::Any;

use swc_visit::define;

#[derive(Debug, PartialEq)]
pub struct Item {
    pub vec_opt1: Vec<Option<Item>>,
    pub vec_opt2: Vec<Option<Enum>>,
}
#[derive(Debug, PartialEq)]
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
