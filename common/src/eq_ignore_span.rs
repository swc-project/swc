/// # Derive
/// This trait can be derived with `#[derive(EqIgnoreSpan)]`.
pub trait EqIgnoreSpan: PartialEq {
    fn eq_ignore_span(&self, other: &Self) -> bool;
}

impl<T: ?Sized + PartialEq> EqIgnoreSpan for T {
    /// Default implementation of this trait.
    /// This might be wrong.
    default fn eq_ignore_span(&self, other: &Self) -> bool {
        *self == *other
    }
}

impl<T: EqIgnoreSpan> EqIgnoreSpan for Option<T> {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        match (self.as_ref(), other.as_ref()) {
            (Some(l), Some(r)) if l.eq_ignore_span(r) => true,
            (None, None) => true,
            _ => false,
        }
    }
}

impl<'a, T: ?Sized + EqIgnoreSpan> EqIgnoreSpan for &'a T {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        <T as EqIgnoreSpan>::eq_ignore_span(*self, *other)
    }
}

impl<T: EqIgnoreSpan> EqIgnoreSpan for [T] {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        if self.len() != other.len() {
            return false;
        }

        for i in 0..self.len() {
            if !self[i].eq_ignore_span(&other[i]) {
                return false;
            }
        }
        true
    }
}

impl<T> EqIgnoreSpan for Box<T>
where
    T: ?Sized + EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        <T as EqIgnoreSpan>::eq_ignore_span(&self, &other)
    }
}

impl<T> EqIgnoreSpan for Vec<T>
where
    T: EqIgnoreSpan,
{
    fn eq_ignore_span(&self, other: &Self) -> bool {
        (&self[..]).eq_ignore_span(&other[..])
    }
}
