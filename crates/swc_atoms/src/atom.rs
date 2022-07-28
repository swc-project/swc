use std::num::NonZeroU64;

const DYNAMIC_TAG: u8 = 0b_00;
const INLINE_TAG: u8 = 0b_01; // len in upper nybble
const STATIC_TAG: u8 = 0b_10;
const TAG_MASK: u64 = 0b_11;
const LEN_OFFSET: u64 = 4;
const LEN_MASK: u64 = 0xf0;

const MAX_INLINE_LEN: usize = 7;
const STATIC_SHIFT_BITS: usize = 32;

pub(super) struct Atom {
    unsafe_data: NonZeroU64,
}

impl Atom {
    pub fn from_static(s: &'static str) -> Self {
        let len = s.len();
        let mut data = 0;
        data |= STATIC_TAG;
        data |= (len as u64) << LEN_OFFSET;
        data |= s.as_ptr() as u64;

        Self {
            unsafe_data: NonZeroU64::new_unchecked(data),
        }
    }
}
