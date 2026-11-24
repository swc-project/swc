use std::{
    borrow::Cow,
    cell::RefCell,
    ffi::c_void,
    hash::{BuildHasherDefault, Hash, Hasher},
    mem::ManuallyDrop,
    num::NonZeroU8,
    ops::Deref,
    ptr::NonNull,
};

use rustc_hash::FxHasher;
use triomphe::ThinArc;

use crate::{
    tagged_value::{TaggedValue, MAX_INLINE_LEN},
    wtf8::Wtf8,
    Atom, Wtf8Atom, INLINE_TAG, INLINE_TAG_INIT, LEN_OFFSET, TAG_MASK,
};

#[derive(PartialEq, Eq)]
pub(crate) struct Metadata {
    pub hash: u64,
}

#[derive(Clone, PartialEq, Eq)]
pub(crate) struct Item(pub ThinArc<Metadata, u8>);

impl Deref for Item {
    type Target = <ThinArc<Metadata, u8> as Deref>::Target;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

impl Hash for Item {
    fn hash<H: Hasher>(&self, state: &mut H) {
        state.write_u64(self.0.header.header.hash);
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
            data: hashbrown::HashMap::with_capacity_and_hasher(64, BuildEntryHasher::default()),
        }
    }
}

impl AtomStore {
    #[inline(always)]
    pub fn atom<'a>(&mut self, text: impl Into<Cow<'a, str>>) -> Atom {
        atom_in(self, &text.into())
    }

    #[inline(always)]
    pub fn wtf8_atom<'a>(&mut self, text: impl Into<Cow<'a, Wtf8>>) -> Wtf8Atom {
        wtf8_atom_in(self, text.into().as_bytes())
    }

    fn gc(&mut self) {
        self.data.retain(|item, _| {
            let count = ThinArc::strong_count(&item.0);
            debug_assert!(count > 0);
            count > 1
        });
    }

    /// Drops every entry and releases the table's memory.
    fn clear(&mut self) {
        // `HashMap::clear` keeps the allocation at its peak size, which
        // defeats the purpose of clearing a store to reclaim memory.
        // Replacing the store frees the old table and starts again at
        // the default capacity.
        *self = Self::default();
    }
}

thread_local! {
    /// The global atom store of the current thread.
    ///
    /// Always access it with [`LocalKey::try_with`](std::thread::LocalKey::try_with),
    /// never with `with`. Thread-local destructors run in the reverse order of
    /// registration, so a destructor of another thread-local can run after
    /// this store is destroyed. `with` panics then, and a panic in a
    /// thread-local destructor aborts the process.
    static GLOBAL_DATA: RefCell<AtomStore> = Default::default();
}

/// Cleans up atoms in the global store that are no longer referenced.
///
/// The global store is thread-local, so this only affects the store of the
/// calling thread. To clean up every thread, run this on each of them (for
/// example with `rayon::broadcast`).
///
/// If the store of the calling thread is already destroyed (for example when
/// this is called from a thread-local destructor), this does nothing: the
/// store released its atoms when it was destroyed.
pub fn global_atom_store_gc() {
    let _ = GLOBAL_DATA.try_with(|global| global.borrow_mut().gc());
}

/// Removes every atom from the global store, including atoms that are still
/// referenced elsewhere. Use [`global_atom_store_gc`] to remove only the atoms
/// that are no longer referenced.
///
/// This is always safe. Live atoms keep their own reference to their data, and
/// equality falls back to comparing the text, so an atom that is interned again
/// after this call still compares equal to an older copy.
///
/// Interning text again after this call has two costs while older atoms with
/// the same text are still alive:
///
/// - The store allocates a new copy of the text, so both copies stay in memory
///   until every reference to the old copy is dropped.
/// - Comparing an old atom with a new one compares the text instead of the
///   pointer.
///
/// Call this when most atoms from the previous work are no longer referenced,
/// for example between phases of work.
///
/// The global store is thread-local, so this only affects the store of the
/// calling thread. To clear every thread, run this on each of them (for
/// example with `rayon::broadcast`).
///
/// If the store of the calling thread is already destroyed (for example when
/// this is called from a thread-local destructor), this does nothing: the
/// store released its atoms when it was destroyed.
pub fn drop_global_atom_store() {
    let _ = GLOBAL_DATA.try_with(|global| global.borrow_mut().clear());
}

/// Creates a [Wtf8Atom] in the global store of the calling thread.
///
/// If the store is already destroyed (during thread teardown), the atom is
/// created without interning. See [Uninterned].
pub(crate) fn global_wtf8_atom(text: &[u8]) -> Wtf8Atom {
    GLOBAL_DATA
        .try_with(|global| wtf8_atom_in(&mut *global.borrow_mut(), text))
        .unwrap_or_else(|_| wtf8_atom_in(Uninterned, text))
}

/// Creates an [Atom] in the global store of the calling thread.
///
/// If the store is already destroyed (during thread teardown), the atom is
/// created without interning. See [Uninterned].
pub(crate) fn global_atom(text: &str) -> Atom {
    GLOBAL_DATA
        .try_with(|global| atom_in(&mut *global.borrow_mut(), text))
        .unwrap_or_else(|_| atom_in(Uninterned, text))
}

fn wtf8_atom_in<S>(storage: S, text: &[u8]) -> Wtf8Atom
where
    S: Storage,
{
    let len = text.len();

    if len <= MAX_INLINE_LEN {
        // INLINE_TAG ensures this is never zero
        let tag = INLINE_TAG_INIT | ((len as u8) << LEN_OFFSET);
        let mut unsafe_data = TaggedValue::new_tag(tag);
        unsafe {
            unsafe_data.data_mut()[..len].copy_from_slice(text);
        }
        return Wtf8Atom { unsafe_data };
    }

    let hash = calc_hash(text);
    let entry = storage.insert_entry(text, hash);
    let entry = ThinArc::into_raw(entry.0) as *mut c_void;

    let ptr: NonNull<c_void> = unsafe {
        // Safety: Arc::into_raw returns a non-null pointer
        NonNull::new_unchecked(entry)
    };
    debug_assert!(0 == ptr.as_ptr() as u8 & TAG_MASK);
    Wtf8Atom {
        unsafe_data: TaggedValue::new_ptr(ptr),
    }
}

/// This can create any kind of [Atom], although this lives in the `dynamic`
/// module.
fn atom_in<S>(storage: S, text: &str) -> Atom
where
    S: Storage,
{
    // SAFETY: `text` is valid UTF-8
    unsafe { Atom::from_wtf8_unchecked(wtf8_atom_in(storage, text.as_bytes())) }
}

/// Attempts to construct an [Atom] but only if it can be constructed inline.
/// This is primarily useful in constant contexts.
pub(crate) const fn inline_atom(text: &str) -> Option<Atom> {
    let len = text.len();
    if len <= MAX_INLINE_LEN {
        // INLINE_TAG ensures this is never zero
        let tag = INLINE_TAG | ((len as u8) << LEN_OFFSET);
        let mut unsafe_data = TaggedValue::new_tag(match NonZeroU8::new(tag) {
            Some(tag) => tag,
            None => unreachable!(),
        });
        // This odd pattern is needed because we cannot create slices from
        // ranges or ranges at all in constant context.  So we write our own
        // copying loop.
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
    fn insert_entry(self, text: &[u8], hash: u64) -> Item;
}

/// Allocates a new entry that is not stored in any [AtomStore].
#[inline]
fn new_item(text: &[u8], hash: u64) -> Item {
    Item(ThinArc::from_header_and_slice(Metadata { hash }, text))
}

/// A [Storage] that does not intern: every call allocates a new entry.
///
/// The global store uses this when the thread-local store is already destroyed
/// (during thread teardown). An atom made this way is still correct, because
/// equality and hashing use the stored hash and the text, not the pointer. The
/// only cost is that equal texts are not deduplicated.
struct Uninterned;

impl Storage for Uninterned {
    #[inline]
    fn insert_entry(self, text: &[u8], hash: u64) -> Item {
        new_item(text, hash)
    }
}

impl Storage for &'_ mut AtomStore {
    fn insert_entry(self, text: &[u8], hash: u64) -> Item {
        // If the text is too long, interning is not worth it.
        if text.len() > 512 {
            return new_item(text, hash);
        }

        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| {
                key.header.header.hash == hash && key.slice.eq(text)
            })
            .or_insert_with(move || (new_item(text, hash), ()));
        entry.clone()
    }
}

#[inline(always)]
fn calc_hash(text: &[u8]) -> u64 {
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
    use std::{
        cell::RefCell,
        hash::{Hash, Hasher},
        sync::mpsc::{channel, Sender},
    };

    use rustc_hash::FxHasher;

    use crate::{
        drop_global_atom_store, dynamic::GLOBAL_DATA, global_atom_store_gc, Atom, AtomStore,
        Wtf8Atom,
    };

    fn expect_size(expected: usize) {
        // This is a helper function to count the number of bytes in the global
        // store.
        GLOBAL_DATA.with(|global| {
            let store = global.borrow();
            assert_eq!(store.data.len(), expected);
        })
    }

    #[test]
    fn global_ref_count_dynamic_0() {
        expect_size(0);

        // The strings should be long enough so that they are not inline even
        // under feature `atom_size_128`
        let atom1 = Atom::new("Hello, beautiful world!");

        expect_size(1);

        let atom2 = Atom::new("Hello, beautiful world!");

        expect_size(1);

        // 2 for the two atoms, 1 for the global store
        assert_eq!(atom1.ref_count(), 3);
        assert_eq!(atom2.ref_count(), 3);

        drop(atom1);

        expect_size(1);

        // 1 for the atom2, 1 for the global store
        assert_eq!(atom2.ref_count(), 2);

        drop(atom2);

        expect_size(1);
        global_atom_store_gc();
        expect_size(0);
    }

    #[test]
    fn global_ref_count_dynamic_1() {
        expect_size(0);

        {
            expect_size(0);
            let atom = Atom::new("Hello, beautiful world!");
            assert_eq!(atom.ref_count(), 2);
            expect_size(1);
        }

        expect_size(1);
        global_atom_store_gc();
        expect_size(0);

        {
            let atom = Atom::new("Hello, beautiful world!");
            assert_eq!(atom.ref_count(), 2);
            expect_size(1);
        }
        let atom = Atom::new("Hello, beautiful world!");
        assert_eq!(atom.ref_count(), 2);

        expect_size(1);
        global_atom_store_gc();
        expect_size(1);

        drop(atom);
        expect_size(1);
        global_atom_store_gc();
        expect_size(0);
    }

    #[test]
    fn drop_global_atom_store_releases_table_memory() {
        let default_capacity = AtomStore::default().data.capacity();

        // Grow the table well beyond its default capacity.
        let atoms: Vec<Atom> = (0..10_000)
            .map(|i| Atom::new(format!("a long enough atom to not be inline {i}")))
            .collect();
        drop(atoms);
        GLOBAL_DATA.with(|global| {
            assert!(global.borrow().data.capacity() > default_capacity);
        });

        drop_global_atom_store();
        GLOBAL_DATA.with(|global| {
            assert_eq!(global.borrow().data.capacity(), default_capacity);
        });
    }

    #[test]
    fn drop_global_atom_store_keeps_live_atoms_valid() {
        expect_size(0);

        let live = Atom::new("Hello, beautiful world!");
        let _unreferenced = Atom::new("Goodbye, beautiful world!");
        drop(_unreferenced);
        expect_size(2);

        drop_global_atom_store();
        expect_size(0);

        // The store no longer holds a reference, but the live atom does.
        assert_eq!(live.ref_count(), 1);
        assert_eq!(&*live, "Hello, beautiful world!");

        // Interning the same text again creates a new entry, which still
        // compares equal to the old atom.
        let again = Atom::new("Hello, beautiful world!");
        expect_size(1);
        assert_eq!(again.ref_count(), 2);
        assert_eq!(live, again);

        drop_global_atom_store();
        expect_size(0);
    }

    /// What a thread-local destructor saw and created after the global store of
    /// its thread was destroyed.
    struct TeardownResult {
        store_destroyed: bool,
        long: Atom,
        short: Atom,
        wtf8_long: Wtf8Atom,
    }

    /// A thread-local whose destructor uses the global store.
    ///
    /// The test touches it before the global store, so it is registered first
    /// and destroyed last, after the global store is gone.
    struct TeardownGuard(RefCell<Option<Sender<TeardownResult>>>);

    impl Drop for TeardownGuard {
        fn drop(&mut self) {
            let Some(tx) = self.0.borrow_mut().take() else {
                return;
            };
            let store_destroyed = GLOBAL_DATA.try_with(|_| ()).is_err();

            // Each of these used to panic, which aborts the process inside a
            // thread-local destructor.
            global_atom_store_gc();
            drop_global_atom_store();
            let result = TeardownResult {
                store_destroyed,
                long: Atom::new(LONG),
                short: Atom::new("short"),
                wtf8_long: Wtf8Atom::new(LONG),
            };
            let _ = tx.send(result);
        }
    }

    thread_local! {
        static TEARDOWN_GUARD: TeardownGuard = const { TeardownGuard(RefCell::new(None)) };
    }

    /// Longer than the inline limit, even with `atom_size_128`.
    const LONG: &str = "this string is longer than the inline limit";

    fn hash_of<T: Hash>(value: &T) -> u64 {
        let mut hasher = FxHasher::default();
        value.hash(&mut hasher);
        hasher.finish()
    }

    #[test]
    fn global_store_is_usable_after_thread_local_teardown() {
        let (tx, rx) = channel();
        std::thread::spawn(move || {
            // Register the guard before the global store.
            TEARDOWN_GUARD.with(|guard| *guard.0.borrow_mut() = Some(tx));
            let _ = Atom::new(LONG);
        })
        .join()
        .expect("thread teardown should not panic");

        let result = rx.recv().expect("the guard should send its result");
        // Without this, the test would pass without testing anything if the
        // destructor order changed.
        assert!(result.store_destroyed);

        let live = Atom::new(LONG);
        assert_eq!(&*result.long, LONG);
        assert_eq!(result.long, live);
        assert_eq!(hash_of(&result.long), hash_of(&live));
        // The atom is not interned, so the teardown thread holds the only
        // reference.
        assert_eq!(result.long.ref_count(), 1);

        assert_eq!(&*result.short, "short");
        assert_eq!(result.short, Atom::new("short"));

        let live_wtf8 = Wtf8Atom::new(LONG);
        assert_eq!(result.wtf8_long, live_wtf8);
        assert_eq!(hash_of(&result.wtf8_long), hash_of(&live_wtf8));
    }
}
