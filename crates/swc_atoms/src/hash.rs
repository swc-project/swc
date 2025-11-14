use std::{
    collections::{HashMap, HashSet},
    hash::{BuildHasher, BuildHasherDefault, Hasher},
};

use byteorder::{ByteOrder, NativeEndian};

use crate::Atom;

pub type AtomMap<V> = HashMap<Atom, V, BuildHasherDefault<IdentityHasher>>;

pub type AtomSet = HashSet<Atom, BuildHasherDefault<IdentityHasher>>;

#[derive(Default)]
pub struct IdentityHasher {
    hash: u64,
}

impl Hasher for IdentityHasher {
    #[inline]
    fn write(&mut self, bytes: &[u8]) {
        if bytes.len() == 8 {
            self.hash = NativeEndian::read_u64(bytes);
        }
    }

    #[inline]
    fn finish(&self) -> u64 {
        self.hash
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
