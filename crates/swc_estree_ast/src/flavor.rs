better_scoped_tls::scoped_tls!(static FLAVOR: Flavor);

#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash, Default)]
pub enum Flavor {
    #[default]
    Babel,
    Acorn {
        extra_comments: bool,
    },
}

impl Flavor {
    pub fn with<F, Ret>(self, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        FLAVOR.set(&self, op)
    }

    pub fn current() -> Self {
        if FLAVOR.is_set() {
            FLAVOR.with(|v| *v)
        } else {
            Flavor::default()
        }
    }

    pub fn emit_loc(&self) -> bool {
        true
    }

    pub(crate) fn skip_range(_: &Option<[u32; 2]>) -> bool {
        matches!(Self::current(), Flavor::Babel)
    }

    pub(crate) fn skip_empty<T>(v: &T) -> bool
    where
        T: IsEmpty,
    {
        matches!(Self::current(), Flavor::Acorn { .. }) && v.is_empty()
    }

    pub(crate) fn skip_none<T>(v: &Option<T>) -> bool {
        matches!(Self::current(), Flavor::Acorn { .. }) && v.is_none()
    }

    pub(crate) fn skip_none_and_false(v: &Option<bool>) -> bool {
        matches!(Self::current(), Flavor::Acorn { .. }) && matches!(v, None | Some(false))
    }
}

pub(crate) trait IsEmpty {
    fn is_empty(&self) -> bool;
}

impl IsEmpty for String {
    fn is_empty(&self) -> bool {
        self.is_empty()
    }
}

impl<T> IsEmpty for Vec<T> {
    fn is_empty(&self) -> bool {
        self.is_empty()
    }
}

impl<T> IsEmpty for Option<T>
where
    T: IsEmpty,
{
    fn is_empty(&self) -> bool {
        match self {
            Some(v) => v.is_empty(),
            None => true,
        }
    }
}
