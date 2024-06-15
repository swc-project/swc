use std::{
    fmt::{Debug, Display},
    hash::Hash,
    ops::Deref,
};

use crate::sync::Lrc;

/// A slice of source code. This is a reference to a part of a source code.
///
///
/// # Note for ECMAScript
///
/// You may need to perform. `.replace("\r\n", "\n").replace('\r', "\n")` on
/// this value. (ECMAScript specification normalizes line terminators to `\n`.)
#[derive(Clone)]
pub struct SourceSlice(Repr);

impl SourceSlice {
    pub fn new(src: Lrc<str>, start: u32, end: u32) -> Self {
        SourceSlice(Repr::Pointer { src, start, end })
    }

    pub fn new_owned(value: Lrc<str>) -> Self {
        SourceSlice(Repr::Owned { value })
    }

    #[inline]
    pub fn as_str(&self) -> &str {
        match &self.0 {
            Repr::Owned { value } => value,
            Repr::Pointer { src, start, end } => &src[*start as usize..*end as usize],
        }
    }
}

#[derive(Clone)]
enum Repr {
    Owned { value: Lrc<str> },
    Pointer { src: Lrc<str>, start: u32, end: u32 },
}

impl Deref for SourceSlice {
    type Target = str;

    #[inline]
    fn deref(&self) -> &str {
        self.as_str()
    }
}

impl PartialEq for SourceSlice {
    fn eq(&self, other: &Self) -> bool {
        self.as_str() == other.as_str()
    }
}

impl Eq for SourceSlice {}

impl Debug for SourceSlice {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Debug::fmt(self.as_str(), f)
    }
}

impl Display for SourceSlice {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        Display::fmt(self.as_str(), f)
    }
}

impl Hash for SourceSlice {
    fn hash<H: std::hash::Hasher>(&self, state: &mut H) {
        self.as_str().hash(state)
    }
}
