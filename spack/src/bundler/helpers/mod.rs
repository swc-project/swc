use std::{
    ops::BitOr,
    sync::atomic::{AtomicBool, Ordering},
};

#[derive(Debug, Default)]
pub(super) struct Helpers {
    /// `__spack_require__`
    pub require: AtomicBool,
}

impl<'a> BitOr<&'a Self> for Helpers {
    type Output = Self;

    fn bitor(mut self, rhs: &Self) -> Self::Output {
        if rhs.require.load(Ordering::SeqCst) {
            *self.require.get_mut() = true;
        }

        self
    }
}
