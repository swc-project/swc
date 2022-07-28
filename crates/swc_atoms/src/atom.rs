use std::num::NonZeroU64;

const DYNAMIC_TAG: u8 = 0b_00;
const INLINE_TAG: u8 = 0b_01; // len in upper nybble
const STATIC_TAG: u8 = 0b_10;
const TAG_MASK: u64 = 0b_11;
const LEN_OFFSET: u64 = 4;
const LEN_MASK: u64 = 0xf0;

const MAX_INLINE_LEN: usize = 7;
const STATIC_SHIFT_BITS: usize = 4;

pub(super) struct Atom {
    unsafe_data: NonZeroU64,
}

impl Atom {
    fn tag(&self) -> u8 {
        (self.unsafe_data.get() & TAG_MASK) as u8
    }
}
