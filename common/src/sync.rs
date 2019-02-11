// Copyright 2017 The Rust Project Developers. See the COPYRIGHT
// file at the top-level directory of this distribution and at
// http://rust-lang.org/COPYRIGHT.
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option. This file may not be copied, modified, or distributed
// except according to those terms.

//! This module defines types which are thread safe if cfg!(parallel_queries) is
//! true.
//!
//! `Lrc` is an alias of either Rc or Arc.
//!
//! `Lock` is a mutex.
//! It internally uses `parking_lot::Mutex` if cfg!(parallel_queries) is true,
//! `RefCell` otherwise.
//!
//! `RwLock` is a read-write lock.
//! It internally uses `parking_lot::RwLock` if cfg!(parallel_queries) is true,
//! `RefCell` otherwise.
//!
//! `LockCell` is a thread safe version of `Cell`, with `set` and `get`
//! operations. It can never deadlock. It uses `Cell` when
//! cfg!(parallel_queries) is false, otherwise it is a `Lock`.
//!
//! `MTLock` is a mutex which disappears if cfg!(parallel_queries) is false.
//!
//! `MTRef` is a immutable reference if cfg!(parallel_queries), and an mutable
//! reference otherwise.
//!
//! `rustc_erase_owner!` erases a OwningRef owner into Erased or Erased + Send +
//! Sync depending on the value of cfg!(parallel_queries).

pub use parking_lot::{
    MappedMutexGuard as MappedLockGuard, MappedRwLockReadGuard as MappedReadGuard,
    MappedRwLockWriteGuard as MappedWriteGuard, MutexGuard as LockGuard,
    RwLockReadGuard as ReadGuard, RwLockWriteGuard as WriteGuard,
};
use parking_lot::{Mutex as InnerLock, RwLock as InnerRwLock};
use std::{
    cmp::Ordering,
    collections::HashMap,
    fmt::{self, Debug, Formatter},
    hash::{BuildHasher, Hash},
};

/// This makes locks panic if they are already held.
/// It is only useful when you are running in a single thread
const ERROR_CHECKING: bool = false;

#[macro_export]
macro_rules! rustc_erase_owner {
    ($v:expr) => {{
        let v = $v;
        ::rustc_data_structures::sync::assert_send_val(&v);
        v.erase_send_sync_owner()
    }};
}

pub struct LockCell<T>(Lock<T>);

impl<T> LockCell<T> {
    #[inline(always)]
    pub fn new(inner: T) -> Self {
        LockCell(Lock::new(inner))
    }

    #[inline(always)]
    pub fn set(&self, new_inner: T) {
        *self.0.lock() = new_inner;
    }

    #[inline(always)]
    pub fn get(&self) -> T
    where
        T: Copy,
    {
        *self.0.lock()
    }
}

pub trait HashMapExt<K, V> {
    /// Same as HashMap::insert, but it may panic if there's already an
    /// entry for `key` with a value not equal to `value`
    fn insert_same(&mut self, key: K, value: V);
}

impl<K: Eq + Hash, V: Eq, S: BuildHasher> HashMapExt<K, V> for HashMap<K, V, S> {
    fn insert_same(&mut self, key: K, value: V) {
        self.entry(key)
            .and_modify(|old| assert!(*old == value))
            .or_insert(value);
    }
}

impl<T: Copy + Debug> Debug for LockCell<T> {
    fn fmt(&self, f: &mut Formatter) -> fmt::Result {
        f.debug_struct("LockCell")
            .field("value", &self.get())
            .finish()
    }
}

impl<T: Default> Default for LockCell<T> {
    /// Creates a `LockCell<T>`, with the `Default` value for T.
    #[inline]
    fn default() -> LockCell<T> {
        LockCell::new(Default::default())
    }
}

impl<T: PartialEq + Copy> PartialEq for LockCell<T> {
    #[inline]
    fn eq(&self, other: &LockCell<T>) -> bool {
        self.get() == other.get()
    }
}

impl<T: Eq + Copy> Eq for LockCell<T> {}

impl<T: PartialOrd + Copy> PartialOrd for LockCell<T> {
    #[inline]
    fn partial_cmp(&self, other: &LockCell<T>) -> Option<Ordering> {
        self.get().partial_cmp(&other.get())
    }

    #[inline]
    fn lt(&self, other: &LockCell<T>) -> bool {
        self.get() < other.get()
    }

    #[inline]
    fn le(&self, other: &LockCell<T>) -> bool {
        self.get() <= other.get()
    }

    #[inline]
    fn gt(&self, other: &LockCell<T>) -> bool {
        self.get() > other.get()
    }

    #[inline]
    fn ge(&self, other: &LockCell<T>) -> bool {
        self.get() >= other.get()
    }
}

impl<T: Ord + Copy> Ord for LockCell<T> {
    #[inline]
    fn cmp(&self, other: &LockCell<T>) -> Ordering {
        self.get().cmp(&other.get())
    }
}

#[derive(Debug)]
pub struct Lock<T>(InnerLock<T>);

impl<T> Lock<T> {
    #[inline(always)]
    pub fn new(inner: T) -> Self {
        Lock(InnerLock::new(inner))
    }

    #[inline(always)]
    pub fn lock(&self) -> LockGuard<T> {
        if ERROR_CHECKING {
            self.0.try_lock().expect("lock was already held")
        } else {
            self.0.lock()
        }
    }

    #[inline(always)]
    pub fn borrow(&self) -> LockGuard<T> {
        self.lock()
    }

    #[inline(always)]
    pub fn borrow_mut(&self) -> LockGuard<T> {
        self.lock()
    }
}

impl<T: Default> Default for Lock<T> {
    #[inline]
    fn default() -> Self {
        Lock::new(T::default())
    }
}

// FIXME: Probably a bad idea
impl<T: Clone> Clone for Lock<T> {
    #[inline]
    fn clone(&self) -> Self {
        Lock::new(self.borrow().clone())
    }
}

#[derive(Debug)]
pub struct RwLock<T>(InnerRwLock<T>);

impl<T> RwLock<T> {
    #[inline(always)]
    pub fn new(inner: T) -> Self {
        RwLock(InnerRwLock::new(inner))
    }

    #[inline(always)]
    pub fn read(&self) -> ReadGuard<T> {
        if ERROR_CHECKING {
            self.0.try_read().expect("lock was already held")
        } else {
            self.0.read()
        }
    }

    #[inline(always)]
    pub fn borrow(&self) -> ReadGuard<T> {
        self.read()
    }
}

// FIXME: Probably a bad idea
impl<T: Clone> Clone for RwLock<T> {
    #[inline]
    fn clone(&self) -> Self {
        RwLock::new(self.borrow().clone())
    }
}
