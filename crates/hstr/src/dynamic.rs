use std::{
    borrow::Cow,
    cell::RefCell,
    ffi::c_void,
    hash::{BuildHasherDefault, Hash, Hasher},
    mem::{forget, ManuallyDrop},
    num::NonZeroU8,
    ops::Deref,
    ptr::{self, NonNull},
};

use rustc_hash::FxHasher;

use crate::{
    tagged_value::{TaggedValue, MAX_INLINE_LEN},
    Atom, INLINE_TAG, INLINE_TAG_INIT, LEN_OFFSET, TAG_MASK,
};

#[derive(Clone, PartialEq, Eq)]
pub(crate) struct ItemInner {
    hash: u64,
    is_global: bool,
    data: Box<[u8]>,
}

#[derive(Clone, PartialEq, Eq)]
pub(crate) struct Item(pub(crate) triomphe::Arc<ItemInner>);

impl Item {
    /// https://users.rust-lang.org/t/what-is-the-ideal-way-to-destruct-a-guard-type/25974/8
    fn into_inner(self) -> triomphe::Arc<ItemInner> {
        unsafe {
            let inner = ptr::read(&self.0);
            forget(self);
            inner
        }
    }

    #[inline]
    pub(super) fn slice(&self) -> &[u8] {
        &self.0.data
    }

    #[inline]
    pub(super) fn hash_value(&self) -> u64 {
        self.0.hash
    }
}

impl Deref for Item {
    type Target = triomphe::Arc<ItemInner>;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Hash for Item {
    fn hash<H: Hasher>(&self, state: &mut H) {
        state.write_u64(self.0.hash);
    }
}

pub(crate) unsafe fn deref_from(ptr: TaggedValue) -> ManuallyDrop<Item> {
    let item = restore_arc(ptr);

    ManuallyDrop::new(item)
}

pub(crate) unsafe fn restore_arc(v: TaggedValue) -> Item {
    let ptr = v.get_ptr().cast::<ItemInner>();
    Item(triomphe::Arc::from_raw(ptr))
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
        atom_in(self, text.into(), false)
    }
}

impl Drop for Item {
    fn drop(&mut self) {
        // If we are going to drop the last reference, we need to remove the
        // entry from the global store if it is a global atom
        if self.0.is_global && triomphe::Arc::strong_count(&self.0) == 2 {
            let v = GLOBAL_DATA.try_with(|global| {
                let mut store = global.borrow_mut();
                store.data.remove_entry(self)
            });

            if let Ok(Some((v, _))) = v {
                v.into_inner();
            }
        }
    }
}

thread_local! {
    static GLOBAL_DATA: RefCell<AtomStore> = Default::default();
}

pub(crate) fn global_atom(text: &str) -> Atom {
    GLOBAL_DATA.with(|global| {
        let mut store = global.borrow_mut();

        atom_in(&mut *store, Cow::Borrowed(text), true)
    })
}

/// This can create any kind of [Atom], although this lives in the `dynamic`
/// module.
fn atom_in<S>(storage: S, text: Cow<'_, str>, is_global: bool) -> Atom
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
    let entry = match text {
        Cow::Borrowed(s) => storage.insert_entry(s, hash, is_global),
        Cow::Owned(s) => {
            storage.insert_owned_entry(s.into_bytes().into_boxed_slice(), hash, is_global)
        }
    };
    let entry = triomphe::Arc::into_raw(entry.into_inner()) as *mut c_void;

    let ptr: NonNull<c_void> = unsafe {
        // Safety: Arc::into_raw returns a non-null pointer
        NonNull::new_unchecked(entry)
    };
    debug_assert!(0 == ptr.as_ptr() as u8 & TAG_MASK);
    Atom {
        unsafe_data: TaggedValue::new_ptr(ptr),
    }
}

/// Attempts to construct an Atom but only if it can be constructed inline.
/// This is primarily useful in constant contexts.
pub(crate) const fn inline_atom(text: &str) -> Option<Atom> {
    let len = text.len();
    if len < MAX_INLINE_LEN {
        // INLINE_TAG ensures this is never zero
        let tag = INLINE_TAG | ((len as u8) << LEN_OFFSET);
        let mut unsafe_data = TaggedValue::new_tag(NonZeroU8::new(tag).unwrap());
        // This odd pattern is needed because we cannot create slices from ranges or
        // ranges at all in constant context.  So we write our own copying loop.
        unsafe {
            let data = unsafe_data.data_mut();
            let bytes = text.as_bytes();
            let mut i = 0;
            while i < len {
                data[i] = bytes[i];
                i += 1;
            }
        }
        return Some(Atom { unsafe_data });
    }
    None
}

trait Storage {
    fn insert_entry(self, text: &str, hash: u64, is_global: bool) -> Item;
    fn insert_owned_entry(self, text: Box<[u8]>, hash: u64, is_global: bool) -> Item;
}

impl Storage for &'_ mut AtomStore {
    #[inline(never)]
    fn insert_entry(self, text: &str, hash: u64, is_global: bool) -> Item {
        fn str_to_boxed_bytes(s: &str) -> Box<[u8]> {
            let len = s.len();
            let layout = std::alloc::Layout::array::<u8>(len).unwrap();
            unsafe {
                let ptr = std::alloc::alloc(layout);
                ptr::copy_nonoverlapping(s.as_ptr(), ptr, len);
                Box::from_raw(std::ptr::slice_from_raw_parts_mut(ptr, len))
            }
        }

        // If the text is too long, interning is not worth it.
        if text.len() > 512 {
            let inner = triomphe::Arc::new(ItemInner {
                hash,
                is_global,
                data: str_to_boxed_bytes(text),
            });
            return Item(inner);
        }

        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| key.0.hash == hash)
            .or_insert_with(move || {
                (
                    {
                        let inner = triomphe::Arc::new(ItemInner {
                            hash,
                            is_global,
                            data: str_to_boxed_bytes(text),
                        });
                        Item(inner)
                    },
                    (),
                )
            });
        entry.clone()
    }

    fn insert_owned_entry(self, text: Box<[u8]>, hash: u64, is_global: bool) -> Item {
        // If the text is too long, interning is not worth it.
        if text.len() > 512 {
            let inner = triomphe::Arc::new(ItemInner {
                hash,
                is_global,
                data: text,
            });
            return Item(inner);
        }

        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| key.0.hash == hash)
            .or_insert_with(move || {
                (
                    {
                        let inner = triomphe::Arc::new(ItemInner {
                            hash,
                            is_global,
                            data: text,
                        });
                        Item(inner)
                    },
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
        // The strings should be long enough so that they are not inline even under
        // feature `atom_size_128`
        let atom1 = Atom::new("Hello, beautiful world!");

        let atom2 = Atom::new("Hello, beautiful world!");

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
