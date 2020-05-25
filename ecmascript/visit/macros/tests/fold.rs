use swc_ecma_visit_macros::define;

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
