//! Runtime arena with typed, generational handles.
//!
//! This crate provides a fast arena allocator that does not rely on Rust
//! lifetimes for safety. Instead, each allocation returns an [`Id<T>`] that
//! embeds both slot index and generation. Reused slots receive a new
//! generation, so stale ids are rejected at runtime.

#![cfg_attr(docsrs, feature(doc_cfg))]
#![deny(clippy::all)]
#![deny(missing_docs)]

use std::{
    fmt,
    marker::PhantomData,
    mem::replace,
    num::NonZeroU64,
    ops::{Index, IndexMut},
};

#[cfg(feature = "serde-impl")]
use serde::{Deserialize, Deserializer, Serialize, Serializer};

const INVALID_INDEX: u32 = u32::MAX;
const INITIAL_GENERATION: u32 = 1;
const MAX_SLOTS: usize = u32::MAX as usize;

/// A typed handle to a value stored in an [`Arena`].
///
/// The handle is copyable and does not carry any lifetime. Safety is validated
/// at runtime using generation checks.
#[derive(PartialEq, Eq, PartialOrd, Ord, Hash)]
#[repr(transparent)]
pub struct Id<T> {
    raw: NonZeroU64,
    _marker: PhantomData<fn() -> T>,
}

impl<T> Id<T> {
    /// Creates an [`Id`] from a raw non-zero value.
    ///
    /// Returns `None` if `raw == 0`.
    #[inline]
    pub fn try_from_raw(raw: u64) -> Option<Self> {
        NonZeroU64::new(raw).map(|raw| Self {
            raw,
            _marker: PhantomData,
        })
    }

    /// Returns the raw packed value.
    ///
    /// The upper 32 bits contain generation and lower 32 bits contain
    /// `index + 1`.
    #[inline]
    pub fn as_raw(self) -> u64 {
        self.raw.get()
    }

    /// Returns the slot index of this id.
    #[inline]
    pub fn index(self) -> u32 {
        ((self.raw.get() & 0xffff_ffff) as u32).wrapping_sub(1)
    }

    /// Returns the generation of this id.
    #[inline]
    pub fn generation(self) -> u32 {
        (self.raw.get() >> 32) as u32
    }

    #[inline]
    fn from_parts(index: u32, generation: u32) -> Self {
        debug_assert!(index < u32::MAX);
        debug_assert_ne!(generation, 0);

        let raw = ((u64::from(generation)) << 32) | (u64::from(index) + 1);

        Self {
            raw: NonZeroU64::new(raw).expect("arena id must be non-zero"),
            _marker: PhantomData,
        }
    }
}

impl<T> Copy for Id<T> {}

impl<T> Clone for Id<T> {
    #[inline]
    fn clone(&self) -> Self {
        *self
    }
}

impl<T> fmt::Debug for Id<T> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Id")
            .field("index", &self.index())
            .field("generation", &self.generation())
            .finish()
    }
}

#[cfg(feature = "serde-impl")]
impl<T> Serialize for Id<T> {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_u64(self.as_raw())
    }
}

#[cfg(feature = "serde-impl")]
impl<'de, T> Deserialize<'de> for Id<T> {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let raw = u64::deserialize(deserializer)?;
        Id::try_from_raw(raw).ok_or_else(|| serde::de::Error::custom("invalid arena id"))
    }
}

/// A fast runtime arena using typed generational ids.
pub struct Arena<T> {
    slots: Vec<Slot<T>>,
    free_head: u32,
    len: usize,
}

impl<T> Arena<T> {
    /// Creates an empty arena.
    #[inline]
    pub fn new() -> Self {
        Self {
            slots: Vec::new(),
            free_head: INVALID_INDEX,
            len: 0,
        }
    }

    /// Creates an empty arena with pre-allocated slot capacity.
    ///
    /// # Panics
    ///
    /// Panics if `capacity` exceeds the maximum supported slot count.
    #[inline]
    pub fn with_capacity(capacity: usize) -> Self {
        assert!(
            capacity <= MAX_SLOTS,
            "capacity exceeds arena maximum slot count"
        );

        Self {
            slots: Vec::with_capacity(capacity),
            free_head: INVALID_INDEX,
            len: 0,
        }
    }

    /// Returns number of live items in the arena.
    #[inline]
    pub fn len(&self) -> usize {
        self.len
    }

    /// Returns `true` if the arena has no live items.
    #[inline]
    pub fn is_empty(&self) -> bool {
        self.len == 0
    }

    /// Returns total slot capacity.
    #[inline]
    pub fn capacity(&self) -> usize {
        self.slots.capacity()
    }

    /// Reserves capacity for at least `additional` more slots.
    ///
    /// # Panics
    ///
    /// Panics if reservation would exceed the maximum supported slot count.
    #[inline]
    pub fn reserve(&mut self, additional: usize) {
        let required = self
            .slots
            .len()
            .checked_add(additional)
            .expect("slot reservation overflow");
        assert!(
            required <= MAX_SLOTS,
            "reservation exceeds arena maximum slot count"
        );
        self.slots.reserve(additional);
    }

    /// Inserts a value and returns its id.
    ///
    /// Reuses freed slots through an internal free list.
    ///
    /// # Panics
    ///
    /// Panics if the arena has reached its maximum number of slots.
    #[inline]
    pub fn insert(&mut self, value: T) -> Id<T> {
        if self.free_head != INVALID_INDEX {
            let index = self.free_head as usize;
            let slot = self
                .slots
                .get_mut(index)
                .expect("free list index should be valid");

            let next = match &slot.entry {
                SlotEntry::Vacant { next } => *next,
                SlotEntry::Occupied(_) => unreachable!("free list points to occupied slot"),
            };

            self.free_head = next;
            self.len += 1;
            slot.entry = SlotEntry::Occupied(value);

            return Id::from_parts(index as u32, slot.generation);
        }

        assert!(
            self.slots.len() < MAX_SLOTS,
            "arena reached maximum slot count"
        );

        let index = self.slots.len() as u32;
        self.slots.push(Slot {
            generation: INITIAL_GENERATION,
            entry: SlotEntry::Occupied(value),
        });
        self.len += 1;

        Id::from_parts(index, INITIAL_GENERATION)
    }

    /// Returns `true` if `id` points to a live value.
    #[inline]
    pub fn contains(&self, id: Id<T>) -> bool {
        self.get(id).is_some()
    }

    /// Returns a shared reference for `id` if it is valid.
    #[inline]
    pub fn get(&self, id: Id<T>) -> Option<&T> {
        let slot = self.slots.get(id.index() as usize)?;
        if slot.generation != id.generation() {
            return None;
        }

        match &slot.entry {
            SlotEntry::Occupied(value) => Some(value),
            SlotEntry::Vacant { .. } => None,
        }
    }

    /// Returns a mutable reference for `id` if it is valid.
    #[inline]
    pub fn get_mut(&mut self, id: Id<T>) -> Option<&mut T> {
        let slot = self.slots.get_mut(id.index() as usize)?;
        if slot.generation != id.generation() {
            return None;
        }

        match &mut slot.entry {
            SlotEntry::Occupied(value) => Some(value),
            SlotEntry::Vacant { .. } => None,
        }
    }

    /// Removes a value and returns it if `id` is valid.
    ///
    /// The slot is recycled and generation is bumped to invalidate stale ids.
    #[inline]
    pub fn remove(&mut self, id: Id<T>) -> Option<T> {
        let index = id.index() as usize;
        let slot = self.slots.get_mut(index)?;
        if slot.generation != id.generation() {
            return None;
        }

        let previous = replace(
            &mut slot.entry,
            SlotEntry::Vacant {
                next: self.free_head,
            },
        );

        match previous {
            SlotEntry::Occupied(value) => {
                slot.generation = next_generation(slot.generation);
                self.free_head = index as u32;
                self.len -= 1;
                Some(value)
            }
            SlotEntry::Vacant { next } => {
                slot.entry = SlotEntry::Vacant { next };
                None
            }
        }
    }

    /// Clears all live values from the arena.
    ///
    /// Existing ids are invalidated by generation bumps.
    pub fn clear(&mut self) {
        if self.slots.is_empty() {
            self.free_head = INVALID_INDEX;
            self.len = 0;
            return;
        }

        let len = self.slots.len();
        for (index, slot) in self.slots.iter_mut().enumerate() {
            let next = if index + 1 == len {
                INVALID_INDEX
            } else {
                (index as u32) + 1
            };

            slot.generation = next_generation(slot.generation);
            slot.entry = SlotEntry::Vacant { next };
        }

        self.free_head = 0;
        self.len = 0;
    }

    /// Returns an iterator over live `(id, value)` pairs.
    #[inline]
    pub fn iter(&self) -> Iter<'_, T> {
        Iter {
            inner: self.slots.iter().enumerate(),
        }
    }

    /// Returns a mutable iterator over live `(id, value)` pairs.
    #[inline]
    pub fn iter_mut(&mut self) -> IterMut<'_, T> {
        IterMut {
            inner: self.slots.iter_mut().enumerate(),
        }
    }

    /// Returns an iterator over live ids.
    #[inline]
    pub fn ids(&self) -> Ids<'_, T> {
        Ids {
            inner: self.slots.iter().enumerate(),
        }
    }
}

impl<T> Default for Arena<T> {
    #[inline]
    fn default() -> Self {
        Self::new()
    }
}

impl<T> fmt::Debug for Arena<T> {
    #[inline]
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        f.debug_struct("Arena")
            .field("len", &self.len)
            .field("slots", &self.slots.len())
            .field("capacity", &self.slots.capacity())
            .finish()
    }
}

impl<T> Index<Id<T>> for Arena<T> {
    type Output = T;

    #[inline]
    fn index(&self, index: Id<T>) -> &Self::Output {
        self.get(index).expect("invalid arena id")
    }
}

impl<T> IndexMut<Id<T>> for Arena<T> {
    #[inline]
    fn index_mut(&mut self, index: Id<T>) -> &mut Self::Output {
        self.get_mut(index).expect("invalid arena id")
    }
}

impl<'a, T> IntoIterator for &'a Arena<T> {
    type IntoIter = Iter<'a, T>;
    type Item = (Id<T>, &'a T);

    #[inline]
    fn into_iter(self) -> Self::IntoIter {
        self.iter()
    }
}

impl<'a, T> IntoIterator for &'a mut Arena<T> {
    type IntoIter = IterMut<'a, T>;
    type Item = (Id<T>, &'a mut T);

    #[inline]
    fn into_iter(self) -> Self::IntoIter {
        self.iter_mut()
    }
}

/// Iterator over immutable live entries in an [`Arena`].
pub struct Iter<'a, T> {
    inner: std::iter::Enumerate<std::slice::Iter<'a, Slot<T>>>,
}

impl<'a, T> Iterator for Iter<'a, T> {
    type Item = (Id<T>, &'a T);

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        for (index, slot) in self.inner.by_ref() {
            if let SlotEntry::Occupied(value) = &slot.entry {
                return Some((Id::from_parts(index as u32, slot.generation), value));
            }
        }

        None
    }
}

/// Iterator over mutable live entries in an [`Arena`].
pub struct IterMut<'a, T> {
    inner: std::iter::Enumerate<std::slice::IterMut<'a, Slot<T>>>,
}

impl<'a, T> Iterator for IterMut<'a, T> {
    type Item = (Id<T>, &'a mut T);

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        for (index, slot) in self.inner.by_ref() {
            let generation = slot.generation;
            if let SlotEntry::Occupied(value) = &mut slot.entry {
                return Some((Id::from_parts(index as u32, generation), value));
            }
        }

        None
    }
}

/// Iterator over live ids in an [`Arena`].
pub struct Ids<'a, T> {
    inner: std::iter::Enumerate<std::slice::Iter<'a, Slot<T>>>,
}

impl<'a, T> Iterator for Ids<'a, T> {
    type Item = Id<T>;

    #[inline]
    fn next(&mut self) -> Option<Self::Item> {
        for (index, slot) in self.inner.by_ref() {
            if matches!(slot.entry, SlotEntry::Occupied(_)) {
                return Some(Id::from_parts(index as u32, slot.generation));
            }
        }

        None
    }
}

struct Slot<T> {
    generation: u32,
    entry: SlotEntry<T>,
}

enum SlotEntry<T> {
    Occupied(T),
    Vacant { next: u32 },
}

#[inline]
fn next_generation(current: u32) -> u32 {
    let next = current.wrapping_add(1);
    if next == 0 {
        INITIAL_GENERATION
    } else {
        next
    }
}
