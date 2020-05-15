/// Copied from `syntax::ptr::P`
pub trait Map<T> {
    /// Transform the inner value, consuming `self` and producing a new `P<T>`.
    fn map<F>(self, f: F) -> Self
    where
        F: FnOnce(T) -> T;
}

impl<T> Map<T> for Box<T> {
    fn map<F>(mut self, f: F) -> Self
    where
        F: FnOnce(T) -> T,
    {
        *self = f(*self);
        self
    }
}
