use bumpalo::Bump;

use crate::util::Allocator;

#[derive(Default)]
pub struct Arena {
    inner: Bump,
}

impl From<Bump> for Arena {
    fn from(inner: Bump) -> Self {
        Self { inner }
    }
}

unsafe impl Allocator for Arena {}
