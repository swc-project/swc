use std::{
    ops::BitOr,
    sync::atomic::{AtomicBool, Ordering::SeqCst},
};

#[derive(Debug, Default)]
pub(super) struct Helpers {
    /// `__spack_require__`
    pub require: AtomicBool,
}

impl Helpers {
    pub fn extend(&self, rhs: &Self) {
        if rhs.require.load(SeqCst) {
            self.require.store(true, SeqCst);
        }
    }
}
