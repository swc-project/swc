use std::{
    borrow::Cow,
    ffi::c_void,
    fmt::Debug,
    hash::{BuildHasherDefault, Hash, Hasher},
    ptr::NonNull,
    sync::{Arc, Weak},
};

use rustc_hash::FxHasher;
use triomphe::{HeaderSlice, HeaderWithLength};

use crate::{
    tagged_value::{TaggedValue, MAX_INLINE_LEN},
    Atom, INLINE_TAG_INIT, LEN_OFFSET, TAG_MASK,
};

struct Metadata {
    hash: u64,
}

type Entry = HeaderSlice<HeaderWithLength<Metadata>, [u8; 0]>;

pub(crate) unsafe fn cast(ptr: TaggedValue) -> *const Entry {
    ptr.get_ptr().cast()
}

pub(crate) unsafe fn deref_from<'i>(ptr: TaggedValue) -> &'i Entry {
    &*cast(ptr)
}

pub(crate) unsafe fn restore_arc(v: TaggedValue) -> Arc<Entry> {
    let ptr = v.get_ptr() as *const Entry;
    Arc::from_raw(ptr)
}

/// A store that stores [Atom]s. Can be merged with other [AtomStore]s for
/// better performance.
///
///
/// # Merging [AtomStore]
#[derive(Debug)]
pub struct AtomStore {
    pub(crate) data: hashbrown::HashMap<Weak<Entry>, (), BuildEntryHasher>,
}

impl Default for AtomStore {
    fn default() -> Self {
        Self {
            data: hashbrown::HashMap::with_capacity_and_hasher(64, Default::default()),
        }
    }
}

impl AtomStore {
    #[inline(always)]
    pub fn atom<'a>(&mut self, text: impl Into<Cow<'a, str>>) -> Atom {
        new_atom(self, text.into())
    }
}

/// This can create any kind of [Atom], although this lives in the `dynamic`
/// module.
pub(crate) fn new_atom<S>(storage: S, text: Cow<str>) -> Atom
where
    S: Storage,
{
    let len = text.len();

    if len < MAX_INLINE_LEN {
        // INLINE_TAG ensures this is never zero
        let tag = INLINE_TAG_INIT | ((len as u8) << LEN_OFFSET);
        let mut unsafe_data = TaggedValue::new_tag(tag);
        unsafe {
            unsafe_data.data_mut()[..len].copy_from_slice(text.as_bytes());
        }
        return Atom { unsafe_data };
    }

    let hash = calc_hash(&text);
    let entry = storage.insert_entry(text, hash);
    let entry = Arc::into_raw(entry) as *mut Entry;

    let ptr: NonNull<Entry> = unsafe {
        // Safety: Arc::into_raw returns a non-null pointer
        NonNull::new_unchecked(entry)
    };
    debug_assert!(0 == ptr.as_ptr() as u8 & TAG_MASK);
    Atom {
        unsafe_data: TaggedValue::new_ptr(ptr),
    }
}

pub(crate) trait Storage {
    fn insert_entry(self, text: Cow<str>, hash: u64) -> Arc<Entry>;
}

impl Storage for &'_ mut AtomStore {
    #[inline(never)]
    fn insert_entry(self, text: Cow<str>, hash: u64) -> Arc<Entry> {
        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| key.hash == hash && *key.string == *text)
            .or_insert_with(move || {
                (
                    Arc::new(Entry {
                        string: text.into_owned().into_boxed_str(),
                        hash,
                    }),
                    (),
                )
            });
        entry.clone()
    }
}

#[inline(never)]
fn calc_hash(text: &str) -> u64 {
    let mut hasher = FxHasher::default();
    text.hash(&mut hasher);
    hasher.finish()
}

type BuildEntryHasher = BuildHasherDefault<EntryHasher>;

/// A "no-op" hasher for [Entry] that returns [Entry::hash]. The design is
/// inspired by the `nohash-hasher` crate.
///
/// Assumption: [Arc]'s implementation of [Hash] is a simple pass-through.
#[derive(Default)]
pub(crate) struct EntryHasher {
    hash: u64,
    #[cfg(debug_assertions)]
    write_called: bool,
}

impl Hasher for EntryHasher {
    fn finish(&self) -> u64 {
        #[cfg(debug_assertions)]
        debug_assert!(
            self.write_called,
            "EntryHasher expects write_u64 to have been called",
        );
        self.hash
    }

    fn write(&mut self, _bytes: &[u8]) {
        panic!("EntryHasher expects to be called with write_u64");
    }

    fn write_u64(&mut self, val: u64) {
        #[cfg(debug_assertions)]
        {
            debug_assert!(
                !self.write_called,
                "EntryHasher expects write_u64 to be called only once",
            );
            self.write_called = true;
        }

        self.hash = val;
    }
}
