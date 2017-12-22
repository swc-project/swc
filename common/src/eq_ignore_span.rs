pub trait EqIgnoreSpan: Eq {
    fn eq_ignore_span(&self, other: &Self) -> bool;
}

impl<T: ?Sized + Eq> EqIgnoreSpan for T {
    default fn eq_ignore_span(&self, other: &Self) -> bool {
        *self == *other
    }
}

macro_rules! impl_for_eq_ty {
    ($Type:ty) => {
        impl $crate::EqIgnoreSpan for $Type {
            fn eq_ignore_span(&self, other: &Self) -> bool { *self == *other }
        }
    };
    ($Type:ty,) => {
        impl_for_eq_ty!($Type);
    };
    ($Type:ty, $($rest:tt)+) => {
        impl_for_eq_ty!($Type);
        impl_for_eq_ty!($($rest)*);
    };
}

impl_for_eq_ty!(
    bool,
    u8,
    u16,
    u32,
    u64,
    usize,
    i8,
    i16,
    i32,
    i64,
    isize,
    String,
    char,
);

impl<T: EqIgnoreSpan> EqIgnoreSpan for Option<T> {
    fn eq_ignore_span(&self, other: &Self) -> bool {
        match (self.as_ref(), other.as_ref()) {
            (Some(l), Some(r)) if l.eq_ignore_span(r) => true,
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
