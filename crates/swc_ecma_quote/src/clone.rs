//! Module for implicitly copyable types.

/// Noop
pub trait ImplicitClone: Clone {
    fn clone_quote_var(&self) -> Self {
        self.clone()
    }
}

impl<T: Clone> ImplicitClone for T {}
