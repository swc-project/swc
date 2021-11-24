use crate::{comment::Comment, Loc};
use scoped_tls::scoped_thread_local;

scoped_thread_local!(static FLAVOR: Flavor);

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

    pub(crate) fn skip_comments(cmts: &Vec<Comment>) -> bool {
        matches!(Self::current(), Flavor::Acorn) && cmts.is_empty()
    }
}
