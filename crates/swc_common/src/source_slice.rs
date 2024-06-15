use crate::sync::Lrc;

#[derive(Clone)]
pub struct SourceSlice(Repr);

impl SourceSlice {
    pub fn new(src: Lrc<String>, start: u32, end: u32) -> Self {
        SourceSlice(Repr::Pointer { src, start, end })
    }

    pub fn new_owned(value: Lrc<String>) -> Self {
        SourceSlice(Repr::Owned { value })
    }
}

#[derive(Clone)]
enum Repr {
    Owned {
        value: Lrc<String>,
    },
    Pointer {
        src: Lrc<String>,
        start: u32,
        end: u32,
    },
}
