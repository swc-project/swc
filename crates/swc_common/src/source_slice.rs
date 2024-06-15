use std::ops::Deref;

use crate::sync::Lrc;

#[derive(Clone)]
pub struct SourceSlice(Repr);

impl SourceSlice {
    pub fn new(src: Lrc<str>, start: u32, end: u32) -> Self {
        SourceSlice(Repr::Pointer { src, start, end })
    }

    pub fn new_owned(value: Lrc<str>) -> Self {
        SourceSlice(Repr::Owned { value })
    }
}

#[derive(Clone)]
enum Repr {
    Owned { value: Lrc<str> },
    Pointer { src: Lrc<str>, start: u32, end: u32 },
}

impl Deref for SourceSlice {
    type Target = str;

    fn deref(&self) -> &str {
        match &self.0 {
            Repr::Owned { value } => value,
            Repr::Pointer { src, start, end } => &src[*start as usize..*end as usize],
        }
    }
}
