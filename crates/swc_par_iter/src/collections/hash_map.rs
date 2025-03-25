//! This module contains the parallel iterator types for hash maps
//! (`HashMap<K, V>`). You will rarely need to interact with it directly
//! unless you have need to name one of the iterator types.

use std::collections::HashMap;
use std::hash::{BuildHasher, Hash};
use std::marker::PhantomData;

use crate::iter::plumbing::*;
use crate::iter::*;

use crate::vec;

/// Parallel iterator over a hash map
#[derive(Debug)] // std doesn't Clone
pub struct IntoIter<K: Hash + Eq + Send, V: Send> {
    inner: vec::IntoIter<(K, V)>,
}

into_par_vec! {
    HashMap<K, V, S> => IntoIter<K, V>,
    impl<K: Hash + Eq + Send, V: Send, S: BuildHasher>
}

delegate_iterator! {
    IntoIter<K, V> => (K, V),
    impl<K: Hash + Eq + Send, V: Send>
}

/// Parallel iterator over an immutable reference to a hash map
#[derive(Debug)]
pub struct Iter<'a, K: Hash + Eq + Sync, V: Sync> {
    inner: vec::IntoIter<(&'a K, &'a V)>,
}

impl<'a, K: Hash + Eq + Sync, V: Sync> Clone for Iter<'a, K, V> {
    fn clone(&self) -> Self {
        Iter {
            inner: self.inner.clone(),
        }
    }
}

into_par_vec! {
    &'a HashMap<K, V, S> => Iter<'a, K, V>,
    impl<'a, K: Hash + Eq + Sync, V: Sync, S: BuildHasher>
}

delegate_iterator! {
    Iter<'a, K, V> => (&'a K, &'a V),
    impl<'a, K: Hash + Eq + Sync + 'a, V: Sync + 'a>
}

/// Parallel iterator over a mutable reference to a hash map
#[derive(Debug)]
pub struct IterMut<'a, K: Hash + Eq + Sync, V: Send> {
    inner: vec::IntoIter<(&'a K, &'a mut V)>,
}

into_par_vec! {
    &'a mut HashMap<K, V, S> => IterMut<'a, K, V>,
    impl<'a, K: Hash + Eq + Sync, V: Send, S: BuildHasher>
}

delegate_iterator! {
    IterMut<'a, K, V> => (&'a K, &'a mut V),
    impl<'a, K: Hash + Eq + Sync + 'a, V: Send + 'a>
}

/// Draining parallel iterator that moves out of a hash map,
/// but keeps the total capacity.
#[derive(Debug)]
pub struct Drain<'a, K: Hash + Eq + Send, V: Send> {
    inner: vec::IntoIter<(K, V)>,
    marker: PhantomData<&'a mut HashMap<K, V>>,
}

impl<'a, K: Hash + Eq + Send, V: Send, S: BuildHasher> ParallelDrainFull
    for &'a mut HashMap<K, V, S>
{
    type Iter = Drain<'a, K, V>;
    type Item = (K, V);

    fn par_drain(self) -> Self::Iter {
        let vec: Vec<_> = self.drain().collect();
        Drain {
            inner: vec.into_par_iter(),
            marker: PhantomData,
        }
    }
}

delegate_iterator! {
    Drain<'_, K, V> => (K, V),
    impl<K: Hash + Eq + Send, V: Send>
}
