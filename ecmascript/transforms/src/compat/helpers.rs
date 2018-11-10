use std::{
    ops::BitOr,
    sync::atomic::{AtomicBool, Ordering},
};

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    /// `_extends({}, b)`
    pub(crate) extends: AtomicBool,
    pub(crate) to_consumable_array: AtomicBool,
}

impl<'a> BitOr<&'a Helpers> for Helpers {
    type Output = Self;

    fn bitor(mut self, other: &Helpers) -> Self {
        *self.extends.get_mut() |= other.extends.load(Ordering::SeqCst);
        *self.to_consumable_array.get_mut() |= other.to_consumable_array.load(Ordering::SeqCst);

        self
    }
}
