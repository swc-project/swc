//! Faster box type.

use std::{
    borrow::{Borrow, BorrowMut},
    fmt::{self, Debug, Display, Formatter},
    io::{self, BufRead, Read, Seek},
    iter::FusedIterator,
    ops::{Deref, DerefMut},
    pin::Pin,
};

use crate::FastAlloc;

#[cfg(feature = "rkyv")]
mod rkyv;
#[cfg(feature = "serde")]
mod serde;

/// Faster alterantive for [`std::boxed::Box`].
#[repr(transparent)]
#[derive(Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct Box<T: ?Sized>(pub(crate) std::boxed::Box<T, FastAlloc>);

impl<T> From<T> for Box<T> {
    #[inline(always)]
    fn from(v: T) -> Self {
        Box::new(v)
    }
}

impl<T: ?Sized> From<std::boxed::Box<T, FastAlloc>> for Box<T> {
    #[inline(always)]
    fn from(v: std::boxed::Box<T, FastAlloc>) -> Self {
        Box(v)
    }
}

impl<T> Default for Box<T>
where
    T: Default,
{
    fn default() -> Self {
        Box::new(Default::default())
    }
}

impl<T> Box<T> {
    /// Allocates memory on the heap and then places `x` into it.
    ///
    /// This doesn't actually allocate if `T` is zero-sized.
    ///
    /// # Examples
    ///
    /// ```
    /// let five = Box::new(5);
    /// ```
    ///
    /// Note: This is slower than using [Self::new_in] with cached [FastAlloc].
    #[inline(always)]
    pub fn new(value: T) -> Self {
        Self::new_in(value, Default::default())
    }

    /// Allocates memory in the given allocator then places `x` into it.
    ///
    /// This doesn't actually allocate if `T` is zero-sized.
    ///
    /// # Examples
    ///
    /// ```
    /// #![feature(allocator_api)]
    ///
    /// use std::alloc::System;
    ///
    /// let five = Box::new_in(5, System);
    /// ```
    #[inline(always)]
    pub fn new_in(value: T, alloc: FastAlloc) -> Self {
        Self(std::boxed::Box::new_in(value, alloc))
    }

    /// Moves the value out of the box.
    pub fn unbox(self) -> T {
        std::boxed::Box::into_inner(self.0)
    }
}

impl<T: ?Sized> Box<T> {
    /// Constructs a box from a raw pointer.
    ///
    /// After calling this function, the raw pointer is owned by the
    /// resulting `Box`. Specifically, the `Box` destructor will call
    /// the destructor of `T` and free the allocated memory. For this
    /// to be safe, the memory must have been allocated in accordance
    /// with the [memory layout] used by `Box` .
    ///
    /// # Safety
    ///
    /// This function is unsafe because improper use may lead to
    /// memory problems. For example, a double-free may occur if the
    /// function is called twice on the same raw pointer.
    ///
    /// The safety conditions are described in the [memory layout] section.
    ///
    /// # Examples
    ///
    /// Recreate a `Box` which was previously converted to a raw pointer
    /// using [`Box::into_raw`]:
    /// ```
    /// let x = Box::new(5);
    /// let ptr = Box::into_raw(x);
    /// let x = unsafe { Box::from_raw(ptr) };
    /// ```
    /// Manually create a `Box` from scratch by using the global allocator:
    /// ```
    /// use std::alloc::{alloc, Layout};
    ///
    /// unsafe {
    ///     let ptr = alloc(Layout::new::<i32>()) as *mut i32;
    ///     // In general .write is required to avoid attempting to destruct
    ///     // the (uninitialized) previous contents of `ptr`, though for this
    ///     // simple example `*ptr = 5` would have worked as well.
    ///     ptr.write(5);
    ///     let x = Box::from_raw(ptr);
    /// }
    /// ```
    ///
    /// [memory layout]: self#memory-layout
    /// [`Layout`]: crate::Layout
    pub unsafe fn from_raw(raw: *mut T) -> Self {
        Self(std::boxed::Box::from_raw_in(raw, FastAlloc::default()))
    }

    /// Consumes the `Box`, returning a wrapped raw pointer.
    ///
    /// The pointer will be properly aligned and non-null.
    ///
    /// After calling this function, the caller is responsible for the
    /// memory previously managed by the `Box`. In particular, the
    /// caller should properly destroy `T` and release the memory, taking
    /// into account the [memory layout] used by `Box`. The easiest way to
    /// do this is to convert the raw pointer back into a `Box` with the
    /// [`Box::from_raw`] function, allowing the `Box` destructor to perform
    /// the cleanup.
    ///
    /// Note: this is an associated function, which means that you have
    /// to call it as `Box::into_raw(b)` instead of `b.into_raw()`. This
    /// is so that there is no conflict with a method on the inner type.
    ///
    /// # Examples
    /// Converting the raw pointer back into a `Box` with [`Box::from_raw`]
    /// for automatic cleanup:
    /// ```
    /// let x = Box::new(String::from("Hello"));
    /// let ptr = Box::into_raw(x);
    /// let x = unsafe { Box::from_raw(ptr) };
    /// ```
    /// Manual cleanup by explicitly running the destructor and deallocating
    /// the memory:
    /// ```
    /// use std::alloc::{dealloc, Layout};
    /// use std::ptr;
    ///
    /// let x = Box::new(String::from("Hello"));
    /// let ptr = Box::into_raw(x);
    /// unsafe {
    ///     ptr::drop_in_place(ptr);
    ///     dealloc(ptr as *mut u8, Layout::new::<String>());
    /// }
    /// ```
    /// Note: This is equivalent to the following:
    /// ```
    /// let x = Box::new(String::from("Hello"));
    /// let ptr = Box::into_raw(x);
    /// unsafe {
    ///     drop(Box::from_raw(ptr));
    /// }
    /// ```
    ///
    /// [memory layout]: self#memory-layout
    pub fn into_raw(b: Self) -> *mut T {
        std::boxed::Box::into_raw(b.0)
    }

    /// Converts a `Box<T>` into a `Pin<Box<T>>`. If `T` does not implement
    /// [`Unpin`], then `*boxed` will be pinned in memory and unable to be
    /// moved.
    ///
    /// This conversion does not allocate on the heap and happens in place.
    ///
    /// This is also available via [`From`].
    ///
    /// Constructing and pinning a `Box` with
    /// <code>Box::into_pin([Box::new]\(x))</code> can also be written more
    /// concisely using <code>[Box::pin]\(x)</code>. This `into_pin` method
    /// is useful if you already have a `Box<T>`, or you are constructing a
    /// (pinned) `Box` in a different way than with [`Box::new`].
    ///
    /// # Notes
    ///
    /// It's not recommended that crates add an impl like `From<Box<T>> for
    /// Pin<T>`, as it'll introduce an ambiguity when calling `Pin::from`.
    /// A demonstration of such a poor impl is shown below.
    ///
    /// ```compile_fail
    /// # use std::pin::Pin;
    /// struct Foo; // A type defined in this crate.
    /// impl From<Box<()>> for Pin<Foo> {
    ///     fn from(_: Box<()>) -> Pin<Foo> {
    ///         Pin::new(Foo)
    ///     }
    /// }
    ///
    /// let foo = Box::new(());
    /// let bar = Pin::from(foo);
    /// ```
    pub fn into_pin(boxed: Self) -> Pin<Self> {
        // It's not possible to move or replace the insides of a `Pin<Box<T>>`
        // when `T: !Unpin`, so it's safe to pin it directly without any
        // additional requirements.
        unsafe { Pin::new_unchecked(boxed) }
    }
}

impl<T: ?Sized> AsRef<T> for Box<T> {
    fn as_ref(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> AsMut<T> for Box<T> {
    fn as_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: ?Sized> Borrow<T> for Box<T> {
    fn borrow(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> BorrowMut<T> for Box<T> {
    fn borrow_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: ?Sized> Deref for Box<T> {
    type Target = T;

    #[inline(always)]
    fn deref(&self) -> &T {
        &self.0
    }
}

impl<T: ?Sized> DerefMut for Box<T> {
    #[inline(always)]
    fn deref_mut(&mut self) -> &mut T {
        &mut self.0
    }
}

impl<T: ?Sized + BufRead> BufRead for Box<T> {
    fn fill_buf(&mut self) -> std::io::Result<&[u8]> {
        self.0.fill_buf()
    }

    fn consume(&mut self, amt: usize) {
        self.0.consume(amt)
    }
}

impl<T: ?Sized> Debug for Box<T>
where
    T: Debug,
{
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(&self.0, f)
    }
}

impl<T: ?Sized> Display for Box<T>
where
    T: Display,
{
    fn fmt(&self, f: &mut Formatter<'_>) -> std::fmt::Result {
        Display::fmt(&self.0, f)
    }
}

impl<T: ?Sized> Iterator for Box<T>
where
    T: Iterator,
{
    type Item = T::Item;

    fn next(&mut self) -> Option<Self::Item> {
        self.0.next()
    }

    fn size_hint(&self) -> (usize, Option<usize>) {
        self.0.size_hint()
    }

    fn count(self) -> usize {
        self.0.count()
    }

    fn last(self) -> Option<Self::Item> {
        self.0.last()
    }

    fn nth(&mut self, n: usize) -> Option<Self::Item> {
        self.0.nth(n)
    }

    fn all<F>(&mut self, f: F) -> bool
    where
        F: FnMut(Self::Item) -> bool,
    {
        self.0.all(f)
    }

    fn any<F>(&mut self, f: F) -> bool
    where
        F: FnMut(Self::Item) -> bool,
    {
        self.0.any(f)
    }

    fn find<P>(&mut self, predicate: P) -> Option<Self::Item>
    where
        P: FnMut(&Self::Item) -> bool,
    {
        self.0.find(predicate)
    }

    fn position<P>(&mut self, predicate: P) -> Option<usize>
    where
        P: FnMut(Self::Item) -> bool,
    {
        self.0.position(predicate)
    }

    fn max(self) -> Option<Self::Item>
    where
        Self::Item: Ord,
    {
        self.0.max()
    }

    fn min(self) -> Option<Self::Item>
    where
        Self::Item: Ord,
    {
        self.0.min()
    }

    fn by_ref(&mut self) -> &mut Self {
        self.0.by_ref();
        self
    }

    fn collect<B>(self) -> B
    where
        B: std::iter::FromIterator<Self::Item>,
    {
        self.0.collect()
    }

    fn fold<B, F>(self, init: B, f: F) -> B
    where
        F: FnMut(B, Self::Item) -> B,
    {
        self.0.fold(init, f)
    }

    fn for_each<F>(self, f: F)
    where
        Self: Sized,
        F: FnMut(Self::Item),
    {
        self.0.for_each(f)
    }

    fn partition<B, F>(self, f: F) -> (B, B)
    where
        Self: Sized,
        B: Default + Extend<Self::Item>,
        F: FnMut(&Self::Item) -> bool,
    {
        self.0.partition(f)
    }

    fn reduce<F>(mut self, f: F) -> Option<Self::Item>
    where
        Self: Sized,
        F: FnMut(Self::Item, Self::Item) -> Self::Item,
    {
        let first = self.next()?;
        Some(self.fold(first, f))
    }

    fn find_map<B, F>(&mut self, f: F) -> Option<B>
    where
        Self: Sized,
        F: FnMut(Self::Item) -> Option<B>,
    {
        self.0.find_map(f)
    }

    fn max_by_key<B: Ord, F>(self, f: F) -> Option<Self::Item>
    where
        Self: Sized,
        F: FnMut(&Self::Item) -> B,
    {
        self.0.max_by_key(f)
    }

    fn max_by<F>(self, compare: F) -> Option<Self::Item>
    where
        Self: Sized,
        F: FnMut(&Self::Item, &Self::Item) -> std::cmp::Ordering,
    {
        self.0.max_by(compare)
    }

    fn min_by_key<B: Ord, F>(self, f: F) -> Option<Self::Item>
    where
        Self: Sized,
        F: FnMut(&Self::Item) -> B,
    {
        self.0.min_by_key(f)
    }

    fn min_by<F>(self, compare: F) -> Option<Self::Item>
    where
        Self: Sized,
        F: FnMut(&Self::Item, &Self::Item) -> std::cmp::Ordering,
    {
        self.0.min_by(compare)
    }

    fn sum<S>(self) -> S
    where
        Self: Sized,
        S: std::iter::Sum<Self::Item>,
    {
        self.0.sum()
    }

    fn product<P>(self) -> P
    where
        Self: Sized,
        P: std::iter::Product<Self::Item>,
    {
        self.0.product()
    }

    fn cmp<I>(self, other: I) -> std::cmp::Ordering
    where
        I: IntoIterator<Item = Self::Item>,
        Self::Item: Ord,
        Self: Sized,
    {
        self.0.cmp(other)
    }

    fn partial_cmp<I>(self, other: I) -> Option<std::cmp::Ordering>
    where
        I: IntoIterator,
        Self::Item: PartialOrd<I::Item>,
        Self: Sized,
    {
        self.0.partial_cmp(other)
    }

    fn eq<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialEq<I::Item>,
        Self: Sized,
    {
        self.0.eq(other)
    }

    fn ne<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialEq<I::Item>,
        Self: Sized,
    {
        self.0.ne(other)
    }

    fn lt<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialOrd<I::Item>,
        Self: Sized,
    {
        self.0.lt(other)
    }

    fn le<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialOrd<I::Item>,
        Self: Sized,
    {
        self.0.le(other)
    }

    fn gt<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialOrd<I::Item>,
        Self: Sized,
    {
        self.0.gt(other)
    }

    fn ge<I>(self, other: I) -> bool
    where
        I: IntoIterator,
        Self::Item: PartialOrd<I::Item>,
        Self: Sized,
    {
        self.0.ge(other)
    }
}

impl<T: ?Sized> DoubleEndedIterator for Box<T>
where
    T: DoubleEndedIterator,
{
    fn next_back(&mut self) -> Option<Self::Item> {
        self.0.next_back()
    }

    fn nth_back(&mut self, n: usize) -> Option<Self::Item> {
        self.0.nth_back(n)
    }

    fn rfold<B, F>(self, init: B, f: F) -> B
    where
        Self: Sized,
        F: FnMut(B, Self::Item) -> B,
    {
        self.0.rfold(init, f)
    }

    fn rfind<P>(&mut self, predicate: P) -> Option<Self::Item>
    where
        Self: Sized,
        P: FnMut(&Self::Item) -> bool,
    {
        self.0.rfind(predicate)
    }
}

impl<T: ?Sized> fmt::Pointer for Box<T> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        fmt::Pointer::fmt(&self.0, f)
    }
}

impl<T: ?Sized> Read for Box<T>
where
    T: Read,
{
    fn read(&mut self, buf: &mut [u8]) -> std::io::Result<usize> {
        self.0.read(buf)
    }

    fn read_to_end(&mut self, buf: &mut std::vec::Vec<u8>) -> std::io::Result<usize> {
        self.0.read_to_end(buf)
    }

    fn read_to_string(&mut self, buf: &mut String) -> std::io::Result<usize> {
        self.0.read_to_string(buf)
    }

    fn read_exact(&mut self, buf: &mut [u8]) -> std::io::Result<()> {
        self.0.read_exact(buf)
    }
}

impl<T: ?Sized> Seek for Box<T>
where
    T: Seek,
{
    fn seek(&mut self, pos: std::io::SeekFrom) -> std::io::Result<u64> {
        self.0.seek(pos)
    }
}

impl<T: ?Sized> fmt::Write for Box<T>
where
    T: fmt::Write,
{
    fn write_str(&mut self, s: &str) -> fmt::Result {
        self.0.write_str(s)
    }

    fn write_char(&mut self, c: char) -> fmt::Result {
        self.0.write_char(c)
    }

    fn write_fmt(&mut self, args: fmt::Arguments) -> fmt::Result {
        self.0.write_fmt(args)
    }
}

impl<T: ?Sized> io::Write for Box<T>
where
    T: io::Write,
{
    fn write(&mut self, buf: &[u8]) -> io::Result<usize> {
        self.0.write(buf)
    }

    fn flush(&mut self) -> io::Result<()> {
        self.0.flush()
    }

    fn write_all(&mut self, buf: &[u8]) -> io::Result<()> {
        self.0.write_all(buf)
    }

    fn write_fmt(&mut self, fmt: fmt::Arguments) -> io::Result<()> {
        self.0.write_fmt(fmt)
    }
}

impl<T> FusedIterator for Box<T> where T: ?Sized + FusedIterator {}

impl<T> ExactSizeIterator for Box<T>
where
    T: ?Sized + ExactSizeIterator,
{
    fn len(&self) -> usize {
        self.0.len()
    }
}
