use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(
    Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize,
)]
pub struct BoolOr<T>(#[serde(default)] Option<Inner<T>>);

impl<T> Merge for BoolOr<T> {
    #[inline]
    fn merge(&mut self, other: Self) {
        self.0.merge(other.0)
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
#[serde(untagged)]
enum Inner<T> {
    Bool(bool),
    Actual(T),
}
