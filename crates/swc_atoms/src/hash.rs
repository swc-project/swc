use std::{
    collections::{HashMap, HashSet},
    hash::{BuildHasher, BuildHasherDefault, Hasher},
};

use byteorder::{ByteOrder, NativeEndian};

use crate::Atom;

pub type AtomMap<V> = HashMap<Atom, V, BuildHasherDefault<IdentityHasher>>;

pub type AtomSet = HashSet<Atom, BuildHasherDefault<IdentityHasher>>;

#[cfg(target_pointer_width = "64")]
const K: usize = 0xf1357aea2e62a9c5;
#[cfg(target_pointer_width = "32")]
const K: usize = 0x93d765dd;

#[derive(Default)]
pub struct IdentityHasher {
    hash: usize,
}

impl Hasher for IdentityHasher {
    #[inline]
    fn write(&mut self, bytes: &[u8]) {
        if bytes.len() == 8 {
            self.hash = (NativeEndian::read_u64(bytes) as usize).wrapping_mul(K);
        }
    }

    #[inline]
    fn finish(&self) -> u64 {
        #[cfg(target_pointer_width = "64")]
        const ROTATE: u32 = 26;
        #[cfg(target_pointer_width = "32")]
        const ROTATE: u32 = 15;

        self.hash.rotate_left(ROTATE) as u64
    }
}

#[derive(Copy, Clone, Default)]
pub struct IdentityBuildHasher;

impl BuildHasher for IdentityBuildHasher {
    type Hasher = IdentityHasher;

    fn build_hasher(&self) -> IdentityHasher {
        IdentityHasher::default()
    }
}
