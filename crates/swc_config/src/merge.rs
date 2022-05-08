pub trait Merge: Sized {
    /// `self` has higher priority.
    fn merge(&mut self, other: Self);
}

/// Modifies `self` iff `*self` is [None]
impl<T> Merge for Option<T> {
    fn merge(&mut self, other: Self) {
        if self.is_none() {
            *self = other;
        }
    }
}

impl<T> Merge for Box<T>
where
    T: Merge,
{
    fn merge(&mut self, other: Self) {
        (**self).merge(*other);
    }
}
