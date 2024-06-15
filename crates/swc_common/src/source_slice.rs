use crate::sync::Lrc;

#[derive(Clone)]
pub struct SourceSlice(Repr);

#[derive(Clone)]
enum Repr {
    Owned(Lrc<String>),
    Pointer {
        src: Lrc<String>,
        start: u32,
        end: u32,
    },
}
