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

use triomphe::ThinArc;

use crate::{
    tagged_value::{TaggedValue, MAX_INLINE_LEN},
    Atom, INLINE_TAG, INLINE_TAG_INIT, LEN_OFFSET, TAG_MASK,
};

#[derive(PartialEq, Eq)]
pub(crate) struct Metadata {
    pub hash: u64,
}

#[derive(Clone, PartialEq, Eq)]
pub(crate) struct Item(pub ThinArc<Metadata, u8>);

impl Item {
    /// https://users.rust-lang.org/t/what-is-the-ideal-way-to-destruct-a-guard-type/25974/8
    fn into_inner(self) -> ThinArc<Metadata, u8> {
        unsafe {
            let inner = ptr::read(&self.0);
            forget(self);
            inner
        }
    }
}

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

    fn gc(&mut self) {
        self.data.retain(|item, _| {
            let count = ThinArc::strong_count(&item.0);
            debug_assert!(count > 0);
            count > 1
        });
    }
}

thread_local! {
    static GLOBAL_DATA: RefCell<AtomStore> = Default::default();
}

/// Cleans up atoms in the global store that are no longer referenced.
pub fn global_atom_store_gc() {
    GLOBAL_DATA.with(|global| {
        let mut store = global.borrow_mut();
        store.gc();
    });
}

pub(crate) fn global_atom(text: &str) -> Atom {
    GLOBAL_DATA.with(|global| {
        let mut store = global.borrow_mut();

        atom_in(&mut *store, text)
    })
}

/// This can create any kind of [Atom], although this lives in the `dynamic`
/// module.
fn atom_in<S>(storage: S, text: &str) -> Atom
where
    S: Storage,
{
    let len = text.len();

    if len <= MAX_INLINE_LEN {
        // INLINE_TAG ensures this is never zero
        let tag = INLINE_TAG_INIT | ((len as u8) << LEN_OFFSET);
        let mut unsafe_data = TaggedValue::new_tag(tag);
        unsafe {
            unsafe_data.data_mut()[..len].copy_from_slice(text.as_bytes());
        }
        return Atom { unsafe_data };
    }

    let hash = calc_hash(text);
    let entry = storage.insert_entry(text, hash);
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

/// Attempts to construct an Atom but only if it can be constructed inline.
/// This is primarily useful in constant contexts.
pub(crate) const fn inline_atom(text: &str) -> Option<Atom> {
    let len = text.len();
    if len <= MAX_INLINE_LEN {
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
    fn insert_entry(self, text: &str, hash: u64) -> Item;
}

impl Storage for &'_ mut AtomStore {
    #[inline(never)]
    fn insert_entry(self, text: &str, hash: u64) -> Item {
        // If the text is too long, interning is not worth it.
        if text.len() > 512 {
            return Item(ThinArc::from_header_and_slice(
                Metadata { hash },
                text.as_bytes(),
            ));
        }

        let (entry, _) = self
            .data
            .raw_entry_mut()
            .from_hash(hash, |key| {
                key.header.header.hash == hash && key.slice.eq(text.as_bytes())
            })
            .or_insert_with(move || {
                (
                    Item(ThinArc::from_header_and_slice(
                        Metadata { hash },
                        text.as_bytes(),
                    )),
                    (),
                )
            });
        entry.clone()
    }
}

#[inline(never)]
pub(crate) const fn calc_hash(text: &str) -> u64 {
    hash_bytes(text.as_bytes())
}

// Nothing special, digits of pi.
const SEED1: u64 = 0x243f6a8885a308d3;
const SEED2: u64 = 0x13198a2e03707344;
const PREVENT_TRIVIAL_ZERO_COLLAPSE: u64 = 0xa4093822299f31d0;

#[inline]
const fn multiply_mix(x: u64, y: u64) -> u64 {
    #[cfg(target_pointer_width = "64")]
    {
        // We compute the full u64 x u64 -> u128 product, this is a single mul
        // instruction on x86-64, one mul plus one mulhi on ARM64.
        let full = (x as u128) * (y as u128);
        let lo = full as u64;
        let hi = (full >> 64) as u64;

        // The middle bits of the full product fluctuate the most with small
        // changes in the input. This is the top bits of lo and the bottom bits
        // of hi. We can thus make the entire output fluctuate with small
        // changes to the input by XOR'ing these two halves.
        lo ^ hi

        // Unfortunately both 2^64 + 1 and 2^64 - 1 have small prime factors,
        // otherwise combining with + or - could result in a really strong hash,
        // as:     x * y = 2^64 * hi + lo = (-1) * hi + lo = lo - hi,
        // (mod 2^64 + 1)     x * y = 2^64 * hi + lo =    1 * hi + lo =
        // lo + hi,   (mod 2^64 - 1) Multiplicative hashing is universal
        // in a field (like mod p).
    }

    #[cfg(target_pointer_width = "32")]
    {
        // u64 x u64 -> u128 product is prohibitively expensive on 32-bit.
        // Decompose into 32-bit parts.
        let lx = x as u32;
        let ly = y as u32;
        let hx = (x >> 32) as u32;
        let hy = (y >> 32) as u32;

        // u32 x u32 -> u64 the low bits of one with the high bits of the other.
        let afull = (lx as u64) * (hy as u64);
        let bfull = (hx as u64) * (ly as u64);

        // Combine, swapping low/high of one of them so the upper bits of the
        // product of one combine with the lower bits of the other.
        afull ^ bfull.rotate_right(32)
    }
}

// Const compatible helper function to read a u64 from a byte array at a given
// offset
const fn read_u64_le(bytes: &[u8], offset: usize) -> u64 {
    (bytes[offset] as u64)
        | ((bytes[offset + 1] as u64) << 8)
        | ((bytes[offset + 2] as u64) << 16)
        | ((bytes[offset + 3] as u64) << 24)
        | ((bytes[offset + 4] as u64) << 32)
        | ((bytes[offset + 5] as u64) << 40)
        | ((bytes[offset + 6] as u64) << 48)
        | ((bytes[offset + 7] as u64) << 56)
}

// Const compatible helper function to read a u32 from a byte array at a given
// offset
const fn read_u32_le(bytes: &[u8], offset: usize) -> u32 {
    (bytes[offset] as u32)
        | ((bytes[offset + 1] as u32) << 8)
        | ((bytes[offset + 2] as u32) << 16)
        | ((bytes[offset + 3] as u32) << 24)
}

/// Copied from `hash_bytes` of `rustc-hash`.
///
/// See: https://github.com/rust-lang/rustc-hash/blob/dc5c33f1283de2da64d8d7a06401d91aded03ad4/src/lib.rs#L252-L297
///
/// ---
///
/// A wyhash-inspired non-collision-resistant hash for strings/slices designed
/// by Orson Peters, with a focus on small strings and small codesize.
///
/// The 64-bit version of this hash passes the SMHasher3 test suite on the full
/// 64-bit output, that is, f(hash_bytes(b) ^ f(seed)) for some good avalanching
/// permutation f() passed all tests with zero failures. When using the 32-bit
/// version of multiply_mix this hash has a few non-catastrophic failures where
/// there are a handful more collisions than an optimal hash would give.
///
/// We don't bother avalanching here as we'll feed this hash into a
/// multiplication after which we take the high bits, which avalanches for us.
#[inline]
#[doc(hidden)]
const fn hash_bytes(bytes: &[u8]) -> u64 {
    let len = bytes.len();
    let mut s0 = SEED1;
    let mut s1 = SEED2;

    if len <= 16 {
        // XOR the input into s0, s1.
        if len >= 8 {
            s0 ^= read_u64_le(bytes, 0);
            s1 ^= read_u64_le(bytes, len - 8);
        } else if len >= 4 {
            s0 ^= read_u32_le(bytes, 0) as u64;
            s1 ^= read_u32_le(bytes, len - 4) as u64;
        } else if len > 0 {
            let lo = bytes[0];
            let mid = bytes[len / 2];
            let hi = bytes[len - 1];
            s0 ^= lo as u64;
            s1 ^= ((hi as u64) << 8) | mid as u64;
        }
    } else {
        // Handle bulk (can partially overlap with suffix).
        let mut off = 0;
        while off < len - 16 {
            let x = read_u64_le(bytes, off);
            let y = read_u64_le(bytes, off + 8);

            // Replace s1 with a mix of s0, x, and y, and s0 with s1.
            // This ensures the compiler can unroll this loop into two
            // independent streams, one operating on s0, the other on s1.
            //
            // Since zeroes are a common input we prevent an immediate trivial
            // collapse of the hash function by XOR'ing a constant with y.
            let t = multiply_mix(s0 ^ x, PREVENT_TRIVIAL_ZERO_COLLAPSE ^ y);
            s0 = s1;
            s1 = t;
            off += 16;
        }

        s0 ^= read_u64_le(bytes, len - 16);
        s1 ^= read_u64_le(bytes, len - 8);
    }

    multiply_mix(s0, s1) ^ (len as u64)
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
    use std::hash::{Hash, Hasher};

    use rustc_hash::FxHasher;

    use crate::{atom, dynamic::GLOBAL_DATA, global_atom_store_gc, Atom};

    fn expect_size(expected: usize) {
        // This is a helper function to count the number of bytes in the global store.
        GLOBAL_DATA.with(|global| {
            let store = global.borrow();
            assert_eq!(store.data.len(), expected);
        })
    }

    #[test]
    fn global_ref_count_dynamic_0() {
        expect_size(0);

        // The strings should be long enough so that they are not inline even under
        // feature `atom_size_128`
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

    // Ensure that the hash value is the same as the one generated by FxHasher.
    //
    // This is important for `Borrow<str>` implementation to be correct.
    // Note that if we enable `nightly` feature of `rustc-hash`, we need to remove
    // `state.write_u8(0xff);` from the hash implementation of `RcStr`.
    #[test]
    fn test_hash() {
        const LONG_STRING: &str = "A very long long long string that would not be inlined";

        {
            let u64_value = super::hash_bytes(LONG_STRING.as_bytes());
            dbg!(u64_value);
            let mut hasher = FxHasher::default();
            hasher.write_u64(u64_value);
            let expected = hasher.finish();

            println!("Expected: {expected:?}");
        }

        let str = Atom::from(LONG_STRING);
        assert_eq!(fxhash(str.clone()), fxhash(LONG_STRING));
        assert_eq!(fxhash(str.clone()), fxhash(atom!(LONG_STRING)));
        assert_eq!(fxhash((1, str, 1)), fxhash((1, LONG_STRING, 1)));
    }

    fn fxhash<T: Hash>(value: T) -> u64 {
        let mut hasher = FxHasher::default();
        value.hash(&mut hasher);
        hasher.finish()
    }

    #[test]
    fn static_items_are_not_in_the_store() {
        const VALUE: &str = "hello a long string that cannot be inline";
        expect_size(0);
        let long_str = atom!(VALUE);
        expect_size(0);
        let store_str = Atom::new(VALUE);
        expect_size(1);
        drop(store_str);
        expect_size(1);
        global_atom_store_gc();
        drop(long_str);
        expect_size(0);
    }
}
