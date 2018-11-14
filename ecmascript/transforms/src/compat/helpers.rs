use std::{
    ops::BitOr,
    sync::atomic::{AtomicBool, Ordering},
};

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    /// `_extends({}, b)`
    pub extends: AtomicBool,
    pub to_consumable_array: AtomicBool,
    /// `_classCallCheck`
    pub class_call_check: AtomicBool,
    /// `_inherits`
    pub inherits: AtomicBool,
    /// `_possibleConstructorReturn`
    pub possible_constructor_return: AtomicBool,
    ///`_createClass`
    pub create_class: AtomicBool,
    /// `_get`
    pub get: AtomicBool,
}

impl<'a> BitOr<&'a Helpers> for Helpers {
    type Output = Self;

    fn bitor(mut self, other: &Helpers) -> Self {
        *self.extends.get_mut() |= other.extends.load(Ordering::SeqCst);
        *self.to_consumable_array.get_mut() |= other.to_consumable_array.load(Ordering::SeqCst);
        *self.class_call_check.get_mut() |= other.class_call_check.load(Ordering::SeqCst);
        *self.inherits.get_mut() |= other.inherits.load(Ordering::SeqCst);
        *self.possible_constructor_return.get_mut() |=
            other.possible_constructor_return.load(Ordering::SeqCst);
        *self.create_class.get_mut() |= other.create_class.load(Ordering::SeqCst);
        *self.get.get_mut() |= other.get.load(Ordering::SeqCst);

        self
    }
}
