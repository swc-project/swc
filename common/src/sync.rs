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
//! `MTLock` is a mutex which disappears if cfg!(parallel_queries) is false.
//!
//! `MTRef` is a immutable reference if cfg!(parallel_queries), and an mutable
//! reference otherwise.
//!
//! `rustc_erase_owner!` erases a OwningRef owner into Erased or Erased + Send +
//! Sync depending on the value of cfg!(parallel_queries).

use owning_ref::{Erased, OwningRef};
use std::{
    collections::HashMap,
    hash::{BuildHasher, Hash},
    marker::PhantomData,
    ops::{Deref, DerefMut},
};

pub fn serial_join<A, B, RA, RB>(oper_a: A, oper_b: B) -> (RA, RB)
where
    A: FnOnce() -> RA,
    B: FnOnce() -> RB,
{
    (oper_a(), oper_b())
}

pub struct SerialScope;

impl SerialScope {
    pub fn spawn<F>(&self, f: F)
    where
        F: FnOnce(&SerialScope),
    {
        f(self)
    }
}

pub fn serial_scope<F, R>(f: F) -> R
where
    F: FnOnce(&SerialScope) -> R,
{
    f(&SerialScope)
}

pub use std::sync::atomic::Ordering::{self, SeqCst};

pub use std::marker::{Send, Sync};

pub use parking_lot::{
    MappedRwLockReadGuard as MappedReadGuard, MappedRwLockWriteGuard as MappedWriteGuard,
    RwLockReadGuard as ReadGuard, RwLockWriteGuard as WriteGuard,
};

pub use parking_lot::{MappedMutexGuard as MappedLockGuard, MutexGuard as LockGuard};

pub use std::sync::atomic::{AtomicBool, AtomicUsize};

pub use std::sync::{Arc as Lrc, Weak};

pub type MTRef<'a, T> = &'a T;

#[derive(Debug, Default)]
pub struct MTLock<T>(Lock<T>);

impl<T> MTLock<T> {
    #[inline(always)]
    pub fn new(inner: T) -> Self {
        MTLock(Lock::new(inner))
    }

    #[inline(always)]
    pub fn into_inner(self) -> T {
        self.0.into_inner()
    }

    #[inline(always)]
    pub fn get_mut(&mut self) -> &mut T {
        self.0.get_mut()
    }

    #[inline(always)]
    pub fn lock(&self) -> LockGuard<T> {
        self.0.lock()
    }

    #[inline(always)]
    pub fn lock_mut(&self) -> LockGuard<T> {
        self.lock()
    }
}

use parking_lot::{Mutex as InnerLock, RwLock as InnerRwLock};

pub use rayon::{join, scope};
use std::{self, thread};

use rayon::iter::IntoParallelIterator;
pub use rayon::iter::ParallelIterator;

pub fn par_iter<T: IntoParallelIterator>(t: T) -> T::Iter {
    t.into_par_iter()
}

pub type MetadataRef = OwningRef<Box<dyn Erased + Send + Sync>, [u8]>;

/// This makes locks panic if they are already held.
/// It is only useful when you are running in a single thread
const ERROR_CHECKING: bool = false;

#[macro_export]
macro_rules! rustc_erase_owner {
    ($v:expr) => {{
        let v = $v;
        ::data_structures::sync::assert_send_val(&v);
        v.erase_send_sync_owner()
    }};
}

pub fn assert_sync<T: ?Sized + Sync>() {}
pub fn assert_send<T: ?Sized + Send>() {}
pub fn assert_send_val<T: ?Sized + Send>(_t: &T) {}
pub fn assert_send_sync_val<T: ?Sized + Sync + Send>(_t: &T) {}

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

/// A type whose inner value can be written once and then will stay read-only
// This contains a PhantomData<T> since this type conceptually owns a T outside
// the Mutex once initialized. This ensures that Once<T> is Sync only if T is.
// If we did not have PhantomData<T> we could send a &Once<Cell<bool>> to
// multiple threads and call `get` on it to get access to &Cell<bool> on those
// threads.
pub struct Once<T>(Lock<Option<T>>, PhantomData<T>);

impl<T> Once<T> {
    /// Creates an Once value which is uninitialized
    #[inline(always)]
    pub fn new() -> Self {
        Once(Lock::new(None), PhantomData)
    }

    /// Consumes the value and returns Some(T) if it was initialized
    #[inline(always)]
    pub fn into_inner(self) -> Option<T> {
        self.0.into_inner()
    }

    /// Tries to initialize the inner value to `value`.
    /// Returns `None` if the inner value was uninitialized and `value` was
    /// consumed setting it otherwise if the inner value was already set it
    /// returns `value` back to the caller
    #[inline]
    pub fn try_set(&self, value: T) -> Option<T> {
        let mut lock = self.0.lock();
        if lock.is_some() {
            return Some(value);
        }
        *lock = Some(value);
        None
    }

    /// Tries to initialize the inner value to `value`.
    /// Returns `None` if the inner value was uninitialized and `value` was
    /// consumed setting it otherwise if the inner value was already set it
    /// asserts that `value` is equal to the inner value and then returns
    /// `value` back to the caller
    #[inline]
    pub fn try_set_same(&self, value: T) -> Option<T>
    where
        T: Eq,
    {
        let mut lock = self.0.lock();
        if let Some(ref inner) = *lock {
            assert!(*inner == value);
            return Some(value);
        }
        *lock = Some(value);
        None
    }

    /// Tries to initialize the inner value to `value` and panics if it was
    /// already initialized
    #[inline]
    pub fn set(&self, value: T) {
        assert!(self.try_set(value).is_none());
    }

    /// Tries to initialize the inner value by calling the closure while
    /// ensuring that no-one else can access the value in the mean time by
    /// holding a lock for the duration of the closure. If the value was
    /// already initialized the closure is not called and `false` is returned,
    /// otherwise if the value from the closure initializes the inner value,
    /// `true` is returned
    #[inline]
    pub fn init_locking<F: FnOnce() -> T>(&self, f: F) -> bool {
        let mut lock = self.0.lock();
        if lock.is_some() {
            return false;
        }
        *lock = Some(f());
        true
    }

    /// Tries to initialize the inner value by calling the closure without
    /// ensuring that no-one else can access it. This mean when this is
    /// called from multiple threads, multiple closures may concurrently be
    /// computing a value which the inner value should take. Only one of
    /// these closures are used to actually initialize the value.
    /// If some other closure already set the value,
    /// we return the value our closure computed wrapped in a `Option`.
    /// If our closure set the value, `None` is returned.
    /// If the value is already initialized, the closure is not called and
    /// `None` is returned.
    #[inline]
    pub fn init_nonlocking<F: FnOnce() -> T>(&self, f: F) -> Option<T> {
        if self.0.lock().is_some() {
            None
        } else {
            self.try_set(f())
        }
    }

    /// Tries to initialize the inner value by calling the closure without
    /// ensuring that no-one else can access it. This mean when this is
    /// called from multiple threads, multiple closures may concurrently be
    /// computing a value which the inner value should take. Only one of
    /// these closures are used to actually initialize the value.
    /// If some other closure already set the value, we assert that it our
    /// closure computed a value equal to the value already set and then
    /// we return the value our closure computed wrapped in a `Option`.
    /// If our closure set the value, `None` is returned.
    /// If the value is already initialized, the closure is not called and
    /// `None` is returned.
    #[inline]
    pub fn init_nonlocking_same<F: FnOnce() -> T>(&self, f: F) -> Option<T>
    where
        T: Eq,
    {
        if self.0.lock().is_some() {
            None
        } else {
            self.try_set_same(f())
        }
    }

    /// Tries to get a reference to the inner value, returns `None` if it is not
    /// yet initialized
    #[inline(always)]
    pub fn try_get(&self) -> Option<&T> {
        let lock = &*self.0.lock();
        if let Some(ref inner) = *lock {
            // This is safe since we won't mutate the inner value
            unsafe { Some(&*(inner as *const T)) }
        } else {
            None
        }
    }

    /// Gets reference to the inner value, panics if it is not yet initialized
    #[inline(always)]
    pub fn get(&self) -> &T {
        self.try_get().expect("value was not set")
    }

    /// Gets reference to the inner value, panics if it is not yet initialized
    #[inline(always)]
    pub fn borrow(&self) -> &T {
        self.get()
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
    pub fn into_inner(self) -> T {
        self.0.into_inner()
    }

    #[inline(always)]
    pub fn get_mut(&mut self) -> &mut T {
        self.0.get_mut()
    }

    #[inline(always)]
    pub fn try_lock(&self) -> Option<LockGuard<T>> {
        self.0.try_lock()
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
    pub fn with_lock<F: FnOnce(&mut T) -> R, R>(&self, f: F) -> R {
        f(&mut *self.lock())
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
    pub fn into_inner(self) -> T {
        self.0.into_inner()
    }

    #[inline(always)]
    pub fn get_mut(&mut self) -> &mut T {
        self.0.get_mut()
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
    pub fn with_read_lock<F: FnOnce(&T) -> R, R>(&self, f: F) -> R {
        f(&*self.read())
    }

    #[inline(always)]
    pub fn try_write(&self) -> Result<WriteGuard<T>, ()> {
        self.0.try_write().ok_or(())
    }

    #[inline(always)]
    pub fn write(&self) -> WriteGuard<T> {
        if ERROR_CHECKING {
            self.0.try_write().expect("lock was already held")
        } else {
            self.0.write()
        }
    }

    #[inline(always)]
    pub fn with_write_lock<F: FnOnce(&mut T) -> R, R>(&self, f: F) -> R {
        f(&mut *self.write())
    }

    #[inline(always)]
    pub fn borrow(&self) -> ReadGuard<T> {
        self.read()
    }

    #[inline(always)]
    pub fn borrow_mut(&self) -> WriteGuard<T> {
        self.write()
    }
}

// FIXME: Probably a bad idea
impl<T: Clone> Clone for RwLock<T> {
    #[inline]
    fn clone(&self) -> Self {
        RwLock::new(self.borrow().clone())
    }
}

/// A type which only allows its inner value to be used in one thread.
/// It will panic if it is used on multiple threads.
#[derive(Copy, Clone, Hash, Debug, Eq, PartialEq)]
pub struct OneThread<T> {
    thread: thread::ThreadId,
    inner: T,
}

unsafe impl<T> std::marker::Sync for OneThread<T> {}

unsafe impl<T> std::marker::Send for OneThread<T> {}

impl<T> OneThread<T> {
    #[inline(always)]
    fn check(&self) {
        assert_eq!(thread::current().id(), self.thread);
    }

    #[inline(always)]
    pub fn new(inner: T) -> Self {
        OneThread {
            thread: thread::current().id(),
            inner,
        }
    }

    #[inline(always)]
    pub fn into_inner(value: Self) -> T {
        value.check();
        value.inner
    }
}

impl<T> Deref for OneThread<T> {
    type Target = T;

    fn deref(&self) -> &T {
        self.check();
        &self.inner
    }
}

impl<T> DerefMut for OneThread<T> {
    fn deref_mut(&mut self) -> &mut T {
        self.check();
        &mut self.inner
    }
}
