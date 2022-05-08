use serde::{Deserialize, Serialize};

use crate::merge::Merge;

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize)]
pub struct BoolConfig<const DEFAULT: bool>(#[serde(default)] Option<bool>);

impl<const DEFAULT: bool> BoolConfig<DEFAULT> {
    #[inline]
    pub fn new(value: Option<bool>) -> Self {
        Self(value)
    }
}

impl<const DEFAULT: bool> From<BoolConfig<DEFAULT>> for bool {
    #[inline]
    fn from(v: BoolConfig<DEFAULT>) -> Self {
        match v.0 {
            Some(v) => v,
            _ => DEFAULT,
        }
    }
}

impl<const DEFAULT: bool> From<Option<bool>> for BoolConfig<DEFAULT> {
    #[inline]
    fn from(v: Option<bool>) -> Self {
        Self(v)
    }
}

impl<const DEFAULT: bool> From<bool> for BoolConfig<DEFAULT> {
    #[inline]
    fn from(v: bool) -> Self {
        Self(Some(v))
    }
}

impl<const DEFAULT: bool> Merge for BoolConfig<DEFAULT> {
    #[inline]
    fn merge(&mut self, other: Self) {
        self.0.merge(other.0);
    }
}
