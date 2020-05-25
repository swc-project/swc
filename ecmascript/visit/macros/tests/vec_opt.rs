use swc_ecma_visit_macros::define;

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
