use std::{
    borrow::Cow,
    cell::RefCell,
    ffi::c_void,
    hash::{BuildHasherDefault, Hash, Hasher},
    mem::{forget, ManuallyDrop},
    ops::Deref,
    ptr::{self, NonNull},
};

use rustc_hash::FxHasher;
use triomphe::{HeaderWithLength, ThinArc};

use crate::{
    tagged_value::{TaggedValue, MAX_INLINE_LEN},
    Atom, INLINE_TAG_INIT, LEN_OFFSET, TAG_MASK,
};

#[derive(PartialEq, Eq)]
pub(crate) struct Metadata {
    pub hash: u64,
    pub is_global: bool,
}

#[derive(Clone, PartialEq, Eq)]
pub(crate) struct Item(pub ThinArc<HeaderWithLength<Metadata>, u8>);

impl Item {
    /// https://users.rust-lang.org/t/what-is-the-ideal-way-to-destruct-a-guard-type/25974/8
    fn into_inner(self) -> ThinArc<HeaderWithLength<Metadata>, u8> {
        unsafe {
            let inner = ptr::read(&self.0);
            forget(self);
            inner
        }
    }
}

impl Deref for Item {
    type Target = <ThinArc<HeaderWithLength<Metadata>, u8> as Deref>::Target;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Hash for Item {
    fn hash<H: Hasher>(&self, state: &mut H) {
        state.write_u64(self.0.header.header.header.hash);
    }
}

pub(crate) unsafe fn deref_from(ptr: TaggedValue) -> ManuallyDrop<Item> {
    let item = restore_arc(ptr);

    ManuallyDrop::new(item)
}

pub(crate) unsafe fn restore_arc(v: TaggedValue) -> Item {
    let ptr = v.get_ptr();
    Item(ThinArc::from_raw(ptr))
}

/// A store that stores [Atom]s. Can be merged with other [AtomStore]s for
/// better performance.
///
///
/// # Merging [AtomStore]
pub struct AtomStore {
    pub(crate) data: hashbrown::HashMap<Item, (), BuildEntryHasher>,
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
        atom_in(self, &text.into(), false)
    }
}

impl Drop for Item {
    fn drop(&mut self) {
        // If we are going to drop the last reference, we need to remove the
        // entry from the global store if it is a global atom
        if self.0.header.header.header.is_global && ThinArc::strong_count(&self.0) == 2 {
            GLOBAL_DATA.with(|global| {
                let mut store = global.borrow_mut();
                store.data.remove(self);
            });
        }
    }
}

thread_local! {
    static GLOBAL_DATA: RefCell<AtomStore> = Default::default();
}

pub(crate) fn global_atom(text: &str) -> Atom {
    GLOBAL_DATA.with(|global| {
        let mut store = global.borrow_mut();

        atom_in(&mut *store, text, true)
    })
}

/// This can create any kind of [Atom], although this lives in the `dynamic`
/// module.
pub(crate) fn atom_in<S>(storage: S, text: &str, is_global: bool) -> Atom
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

    let hash = calc_hash(text);
    let entry = storage.insert_entry(text, hash, is_global);
    let entry = ThinArc::into_raw(entry.into_inner()) as *mut c_void;

    let ptr: NonNull<c_void> = unsafe {
        // Safety: Arc::into_raw returns a non-null pointer
        NonNull::new_unchecked(entry)
    };
    debug_assert!(0 == ptr.as_ptr() as u8 & TAG_MASK);
    Atom {
        unsafe_data: TaggedValue::new_ptr(ptr),
    }
}

pub(crate) trait Storage {
    fn insert_entry(self, text: &str, hash: u64, is_global: bool) -> Item;
}

impl Storage for &'_ mut AtomStore {
    #[inline(never)]
    fn insert_entry(self, text: &str, hash: u64, is_global: bool) -> Item {
        // If the text is too long, interning is not worth it.
        if text.len() > 512 {
            return Item(ThinArc::from_header_and_slice(
                HeaderWithLength::new(Metadata { hash, is_global }, text.len()),
                text.as_bytes(),
            ));
        }

        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| {
                key.header.header.header.hash == hash && key.slice == *text.as_bytes()
            })
            .or_insert_with(move || {
                (
                    Item(ThinArc::from_header_and_slice(
                        HeaderWithLength::new(Metadata { hash, is_global }, text.len()),
                        text.as_bytes(),
                    )),
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

#[cfg(test)]
mod tests {
    use crate::{dynamic::GLOBAL_DATA, Atom};

    #[test]
    fn global_ref_count_dynamic() {
        let atom1 = Atom::new("Hello, world!");

        let atom2 = Atom::new("Hello, world!");

        // 2 for the two atoms, 1 for the global store
        assert_eq!(atom1.ref_count(), 3);
        assert_eq!(atom2.ref_count(), 3);

        drop(atom1);

        // 1 for the atom2, 1 for the global store
        assert_eq!(atom2.ref_count(), 2);

        drop(atom2);

        GLOBAL_DATA.with(|global| {
            let store = global.borrow();
            assert_eq!(store.data.len(), 0);
        });
    }
}
