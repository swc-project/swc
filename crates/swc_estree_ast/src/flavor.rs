use crate::Loc;
use scoped_tls::scoped_thread_local;

scoped_thread_local!(static FLAVOR: Flavor);

#[repr(u8)]
#[derive(Debug, Clone, Copy, Eq, PartialEq, Hash)]
pub enum Flavor {
    Babel,
    Acorn,
}

impl Default for Flavor {
    fn default() -> Self {
        Flavor::Babel
    }
}

impl Flavor {
    pub fn with<F, Ret>(self, op: F) -> Ret
    where
        F: FnOnce() -> Ret,
    {
        FLAVOR.set(&self, || op())
    }

    pub fn current() -> Self {
        if FLAVOR.is_set() {
            FLAVOR.with(|v| *v)
        } else {
            Flavor::default()
        }
    }

    pub fn emit_loc(&self) -> bool {
        matches!(Self::current(), Flavor::Babel)
    }

    pub(crate) fn skip_range(_: &Option<[usize; 2]>) -> bool {
        matches!(Self::current(), Flavor::Babel)
    }

    pub(crate) fn skip_loc(_: &Option<Loc>) -> bool {
        !Self::current().emit_loc()
    }

    pub(crate) fn skip_empty_vec<T>(v: &Vec<T>) -> bool {
        matches!(Self::current(), Flavor::Acorn) && v.is_empty()
    }

    pub(crate) fn skip_empty_string(v: &String) -> bool {
        matches!(Self::current(), Flavor::Acorn) && v.is_empty()
    }

    pub(crate) fn skip_none<T>(v: &Option<T>) -> bool {
        matches!(Self::current(), Flavor::Acorn) && v.is_none()
    }
    pub(crate) fn skip_none_and_false(v: &Option<bool>) -> bool {
        matches!(Self::current(), Flavor::Acorn) && matches!(v, None | Some(false))
    }
}
