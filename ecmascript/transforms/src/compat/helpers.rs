use std::sync::atomic::{AtomicBool, Ordering};

#[derive(Debug, Default)]
pub struct Helpers {
    /// `_extends({}, b)`
    pub(crate) extends: AtomicBool,
    pub(crate) to_consumable_array: AtomicBool,
}

impl Helpers {
    pub fn merge(mut self, other: &Self) -> Self {
        *self.extends.get_mut() |= other.extends.load(Ordering::SeqCst);

        self
    }
}
