//! This is a copy of `core::hash::sip` adapted to providing 128 bit hashes.

use std::{cmp, hash::Hasher, mem, ptr, slice};

#[derive(Debug, Clone)]
pub struct SipHasher128 {
    k0: u64,
    k1: u64,
    length: usize, // how many bytes we've processed
    state: State,  // hash State
    tail: u64,     // unprocessed bytes le
    ntail: usize,  // how many bytes in tail are valid
}

#[derive(Debug, Clone, Copy)]
#[repr(C)]
struct State {
    // v0, v2 and v1, v3 show up in pairs in the algorithm,
    // and simd implementations of SipHash will use vectors
    // of v02 and v13. By placing them in this order in the struct,
    // the compiler can pick up on just a few simd optimizations by itself.
    v0: u64,
    v2: u64,
    v1: u64,
    v3: u64,
}

macro_rules! compress {
    ($state:expr) => {{
        compress!($state.v0, $state.v1, $state.v2, $state.v3)
    }};
    ($v0:expr, $v1:expr, $v2:expr, $v3:expr) => {{
        $v0 = $v0.wrapping_add($v1);
        $v1 = $v1.rotate_left(13);
        $v1 ^= $v0;
        $v0 = $v0.rotate_left(32);
        $v2 = $v2.wrapping_add($v3);
        $v3 = $v3.rotate_left(16);
        $v3 ^= $v2;
        $v0 = $v0.wrapping_add($v3);
        $v3 = $v3.rotate_left(21);
        $v3 ^= $v0;
        $v2 = $v2.wrapping_add($v1);
        $v1 = $v1.rotate_left(17);
        $v1 ^= $v2;
        $v2 = $v2.rotate_left(32);
    }};
}

/// Load an integer of the desired type from a byte stream, in LE order. Uses
/// `copy_nonoverlapping` to let the compiler generate the most efficient way
/// to load it from a possibly unaligned address.
///
/// Unsafe because: unchecked indexing at i..i+size_of(int_ty)
macro_rules! load_int_le {
    ($buf:expr, $i:expr, $int_ty:ident) => {{
        debug_assert!($i + mem::size_of::<$int_ty>() <= $buf.len());
        let mut data = 0 as $int_ty;
        ptr::copy_nonoverlapping(
            $buf.get_unchecked($i),
            &mut data as *mut _ as *mut u8,
            mem::size_of::<$int_ty>(),
        );
        data.to_le()
    }};
}

/// Load an u64 using up to 7 bytes of a byte slice.
///
/// Unsafe because: unchecked indexing at start..start+len
#[inline]
unsafe fn u8to64_le(buf: &[u8], start: usize, len: usize) -> u64 {
    debug_assert!(len < 8);
    let mut i = 0; // current byte index (from LSB) in the output u64
    let mut out = 0;
    if i + 3 < len {
        out = load_int_le!(buf, start + i, u32) as u64;
        i += 4;
    }
    if i + 1 < len {
        out |= (load_int_le!(buf, start + i, u16) as u64) << (i * 8);
        i += 2
    }
    if i < len {
        out |= (*buf.get_unchecked(start + i) as u64) << (i * 8);
        i += 1;
    }
    debug_assert_eq!(i, len);
    out
}

impl SipHasher128 {
    #[inline]
    pub fn new_with_keys(key0: u64, key1: u64) -> SipHasher128 {
        let mut state = SipHasher128 {
            k0: key0,
            k1: key1,
            length: 0,
            state: State {
                v0: 0,
                v1: 0,
                v2: 0,
                v3: 0,
            },
            tail: 0,
            ntail: 0,
        };
        state.reset();
        state
    }

    #[inline]
    fn reset(&mut self) {
        self.length = 0;
        self.state.v0 = self.k0 ^ 0x736f_6d65_7073_6575;
        self.state.v1 = self.k1 ^ 0x646f_7261_6e64_6f6d;
        self.state.v2 = self.k0 ^ 0x6c79_6765_6e65_7261;
        self.state.v3 = self.k1 ^ 0x7465_6462_7974_6573;
        self.ntail = 0;

        // This is only done in the 128 bit version:
        self.state.v1 ^= 0xee;
    }

    // Specialized write function that is only valid for buffers with len <= 8.
    // It's used to force inlining of write_u8 and write_usize, those would normally
    // be inlined except for composite types (that includes slices and str
    // hashing because of delimiter). Without this extra push the compiler is
    // very reluctant to inline delimiter writes, degrading performance
    // substantially for the most common use cases.
    #[inline]
    fn short_write(&mut self, msg: &[u8]) {
        debug_assert!(msg.len() <= 8);
        let length = msg.len();
        self.length += length;

        let needed = 8 - self.ntail;
        let fill = cmp::min(length, needed);
        if fill == 8 {
            self.tail = unsafe { load_int_le!(msg, 0, u64) };
        } else {
            self.tail |= unsafe { u8to64_le(msg, 0, fill) } << (8 * self.ntail);
            if length < needed {
                self.ntail += length;
                return;
            }
        }
        self.state.v3 ^= self.tail;
        Sip24Rounds::c_rounds(&mut self.state);
        self.state.v0 ^= self.tail;

        // Buffered tail is now flushed, process new input.
        self.ntail = length - needed;
        self.tail = unsafe { u8to64_le(msg, needed, self.ntail) };
    }

    #[inline(always)]
    fn short_write_gen<T>(&mut self, x: T) {
        let bytes =
            unsafe { slice::from_raw_parts(&x as *const T as *const u8, mem::size_of::<T>()) };
        self.short_write(bytes);
    }

    #[inline]
    pub fn finish128(mut self) -> (u64, u64) {
        let b: u64 = ((self.length as u64 & 0xff) << 56) | self.tail;

        self.state.v3 ^= b;
        Sip24Rounds::c_rounds(&mut self.state);
        self.state.v0 ^= b;

        self.state.v2 ^= 0xee;
        Sip24Rounds::d_rounds(&mut self.state);
        let _0 = self.state.v0 ^ self.state.v1 ^ self.state.v2 ^ self.state.v3;

        self.state.v1 ^= 0xdd;
        Sip24Rounds::d_rounds(&mut self.state);
        let _1 = self.state.v0 ^ self.state.v1 ^ self.state.v2 ^ self.state.v3;
        (_0, _1)
    }
}

impl Hasher for SipHasher128 {
    #[inline]
    fn write_u8(&mut self, i: u8) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_u16(&mut self, i: u16) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_u32(&mut self, i: u32) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_u64(&mut self, i: u64) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_usize(&mut self, i: usize) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_i8(&mut self, i: i8) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_i16(&mut self, i: i16) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_i32(&mut self, i: i32) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_i64(&mut self, i: i64) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write_isize(&mut self, i: isize) {
        self.short_write_gen(i);
    }

    #[inline]
    fn write(&mut self, msg: &[u8]) {
        let length = msg.len();
        self.length += length;

        let mut needed = 0;

        if self.ntail != 0 {
            needed = 8 - self.ntail;
            self.tail |= unsafe { u8to64_le(msg, 0, cmp::min(length, needed)) } << (8 * self.ntail);
            if length < needed {
                self.ntail += length;
                return;
            } else {
                self.state.v3 ^= self.tail;
                Sip24Rounds::c_rounds(&mut self.state);
                self.state.v0 ^= self.tail;
                self.ntail = 0;
            }
        }

        // Buffered tail is now flushed, process new input.
        let len = length - needed;
        let left = len & 0x7;

        let mut i = needed;
        while i < len - left {
            let mi = unsafe { load_int_le!(msg, i, u64) };

            self.state.v3 ^= mi;
            Sip24Rounds::c_rounds(&mut self.state);
            self.state.v0 ^= mi;

            i += 8;
        }

        self.tail = unsafe { u8to64_le(msg, i, left) };
        self.ntail = left;
    }

    fn finish(&self) -> u64 {
        panic!("SipHasher128 cannot provide valid 64 bit hashes")
    }
}

#[derive(Debug, Clone, Default)]
struct Sip24Rounds;

impl Sip24Rounds {
    #[inline]
    fn c_rounds(state: &mut State) {
        compress!(state);
        compress!(state);
    }

    #[inline]
    fn d_rounds(state: &mut State) {
        compress!(state);
        compress!(state);
        compress!(state);
        compress!(state);
    }
}

#[cfg(test)]
mod test {
    use super::SipHasher128;
    use std::{
        hash::{Hash, Hasher},
        mem, slice,
    };

    // Hash just the bytes of the slice, without length prefix
    struct Bytes<'a>(&'a [u8]);

    impl<'a> Hash for Bytes<'a> {
        #[allow(unused_must_use)]
        fn hash<H: Hasher>(&self, state: &mut H) {
            for byte in self.0 {
                state.write_u8(*byte);
            }
        }
    }

    fn hash_with<T: Hash>(mut st: SipHasher128, x: &T) -> (u64, u64) {
        x.hash(&mut st);
        st.finish128()
    }

    fn hash<T: Hash>(x: &T) -> (u64, u64) {
        hash_with(SipHasher128::new_with_keys(0, 0), x)
    }

    const TEST_VECTOR: [[u8; 16]; 64] = [
        [
            0xa3, 0x81, 0x7f, 0x04, 0xba, 0x25, 0xa8, 0xe6, 0x6d, 0xf6, 0x72, 0x14, 0xc7, 0x55,
            0x02, 0x93,
        ],
        [
            0xda, 0x87, 0xc1, 0xd8, 0x6b, 0x99, 0xaf, 0x44, 0x34, 0x76, 0x59, 0x11, 0x9b, 0x22,
            0xfc, 0x45,
        ],
        [
            0x81, 0x77, 0x22, 0x8d, 0xa4, 0xa4, 0x5d, 0xc7, 0xfc, 0xa3, 0x8b, 0xde, 0xf6, 0x0a,
            0xff, 0xe4,
        ],
        [
            0x9c, 0x70, 0xb6, 0x0c, 0x52, 0x67, 0xa9, 0x4e, 0x5f, 0x33, 0xb6, 0xb0, 0x29, 0x85,
            0xed, 0x51,
        ],
        [
            0xf8, 0x81, 0x64, 0xc1, 0x2d, 0x9c, 0x8f, 0xaf, 0x7d, 0x0f, 0x6e, 0x7c, 0x7b, 0xcd,
            0x55, 0x79,
        ],
        [
            0x13, 0x68, 0x87, 0x59, 0x80, 0x77, 0x6f, 0x88, 0x54, 0x52, 0x7a, 0x07, 0x69, 0x0e,
            0x96, 0x27,
        ],
        [
            0x14, 0xee, 0xca, 0x33, 0x8b, 0x20, 0x86, 0x13, 0x48, 0x5e, 0xa0, 0x30, 0x8f, 0xd7,
            0xa1, 0x5e,
        ],
        [
            0xa1, 0xf1, 0xeb, 0xbe, 0xd8, 0xdb, 0xc1, 0x53, 0xc0, 0xb8, 0x4a, 0xa6, 0x1f, 0xf0,
            0x82, 0x39,
        ],
        [
            0x3b, 0x62, 0xa9, 0xba, 0x62, 0x58, 0xf5, 0x61, 0x0f, 0x83, 0xe2, 0x64, 0xf3, 0x14,
            0x97, 0xb4,
        ],
        [
            0x26, 0x44, 0x99, 0x06, 0x0a, 0xd9, 0xba, 0xab, 0xc4, 0x7f, 0x8b, 0x02, 0xbb, 0x6d,
            0x71, 0xed,
        ],
        [
            0x00, 0x11, 0x0d, 0xc3, 0x78, 0x14, 0x69, 0x56, 0xc9, 0x54, 0x47, 0xd3, 0xf3, 0xd0,
            0xfb, 0xba,
        ],
        [
            0x01, 0x51, 0xc5, 0x68, 0x38, 0x6b, 0x66, 0x77, 0xa2, 0xb4, 0xdc, 0x6f, 0x81, 0xe5,
            0xdc, 0x18,
        ],
        [
            0xd6, 0x26, 0xb2, 0x66, 0x90, 0x5e, 0xf3, 0x58, 0x82, 0x63, 0x4d, 0xf6, 0x85, 0x32,
            0xc1, 0x25,
        ],
        [
            0x98, 0x69, 0xe2, 0x47, 0xe9, 0xc0, 0x8b, 0x10, 0xd0, 0x29, 0x93, 0x4f, 0xc4, 0xb9,
            0x52, 0xf7,
        ],
        [
            0x31, 0xfc, 0xef, 0xac, 0x66, 0xd7, 0xde, 0x9c, 0x7e, 0xc7, 0x48, 0x5f, 0xe4, 0x49,
            0x49, 0x02,
        ],
        [
            0x54, 0x93, 0xe9, 0x99, 0x33, 0xb0, 0xa8, 0x11, 0x7e, 0x08, 0xec, 0x0f, 0x97, 0xcf,
            0xc3, 0xd9,
        ],
        [
            0x6e, 0xe2, 0xa4, 0xca, 0x67, 0xb0, 0x54, 0xbb, 0xfd, 0x33, 0x15, 0xbf, 0x85, 0x23,
            0x05, 0x77,
        ],
        [
            0x47, 0x3d, 0x06, 0xe8, 0x73, 0x8d, 0xb8, 0x98, 0x54, 0xc0, 0x66, 0xc4, 0x7a, 0xe4,
            0x77, 0x40,
        ],
        [
            0xa4, 0x26, 0xe5, 0xe4, 0x23, 0xbf, 0x48, 0x85, 0x29, 0x4d, 0xa4, 0x81, 0xfe, 0xae,
            0xf7, 0x23,
        ],
        [
            0x78, 0x01, 0x77, 0x31, 0xcf, 0x65, 0xfa, 0xb0, 0x74, 0xd5, 0x20, 0x89, 0x52, 0x51,
            0x2e, 0xb1,
        ],
        [
            0x9e, 0x25, 0xfc, 0x83, 0x3f, 0x22, 0x90, 0x73, 0x3e, 0x93, 0x44, 0xa5, 0xe8, 0x38,
            0x39, 0xeb,
        ],
        [
            0x56, 0x8e, 0x49, 0x5a, 0xbe, 0x52, 0x5a, 0x21, 0x8a, 0x22, 0x14, 0xcd, 0x3e, 0x07,
            0x1d, 0x12,
        ],
        [
            0x4a, 0x29, 0xb5, 0x45, 0x52, 0xd1, 0x6b, 0x9a, 0x46, 0x9c, 0x10, 0x52, 0x8e, 0xff,
            0x0a, 0xae,
        ],
        [
            0xc9, 0xd1, 0x84, 0xdd, 0xd5, 0xa9, 0xf5, 0xe0, 0xcf, 0x8c, 0xe2, 0x9a, 0x9a, 0xbf,
            0x69, 0x1c,
        ],
        [
            0x2d, 0xb4, 0x79, 0xae, 0x78, 0xbd, 0x50, 0xd8, 0x88, 0x2a, 0x8a, 0x17, 0x8a, 0x61,
            0x32, 0xad,
        ],
        [
            0x8e, 0xce, 0x5f, 0x04, 0x2d, 0x5e, 0x44, 0x7b, 0x50, 0x51, 0xb9, 0xea, 0xcb, 0x8d,
            0x8f, 0x6f,
        ],
        [
            0x9c, 0x0b, 0x53, 0xb4, 0xb3, 0xc3, 0x07, 0xe8, 0x7e, 0xae, 0xe0, 0x86, 0x78, 0x14,
            0x1f, 0x66,
        ],
        [
            0xab, 0xf2, 0x48, 0xaf, 0x69, 0xa6, 0xea, 0xe4, 0xbf, 0xd3, 0xeb, 0x2f, 0x12, 0x9e,
            0xeb, 0x94,
        ],
        [
            0x06, 0x64, 0xda, 0x16, 0x68, 0x57, 0x4b, 0x88, 0xb9, 0x35, 0xf3, 0x02, 0x73, 0x58,
            0xae, 0xf4,
        ],
        [
            0xaa, 0x4b, 0x9d, 0xc4, 0xbf, 0x33, 0x7d, 0xe9, 0x0c, 0xd4, 0xfd, 0x3c, 0x46, 0x7c,
            0x6a, 0xb7,
        ],
        [
            0xea, 0x5c, 0x7f, 0x47, 0x1f, 0xaf, 0x6b, 0xde, 0x2b, 0x1a, 0xd7, 0xd4, 0x68, 0x6d,
            0x22, 0x87,
        ],
        [
            0x29, 0x39, 0xb0, 0x18, 0x32, 0x23, 0xfa, 0xfc, 0x17, 0x23, 0xde, 0x4f, 0x52, 0xc4,
            0x3d, 0x35,
        ],
        [
            0x7c, 0x39, 0x56, 0xca, 0x5e, 0xea, 0xfc, 0x3e, 0x36, 0x3e, 0x9d, 0x55, 0x65, 0x46,
            0xeb, 0x68,
        ],
        [
            0x77, 0xc6, 0x07, 0x71, 0x46, 0xf0, 0x1c, 0x32, 0xb6, 0xb6, 0x9d, 0x5f, 0x4e, 0xa9,
            0xff, 0xcf,
        ],
        [
            0x37, 0xa6, 0x98, 0x6c, 0xb8, 0x84, 0x7e, 0xdf, 0x09, 0x25, 0xf0, 0xf1, 0x30, 0x9b,
            0x54, 0xde,
        ],
        [
            0xa7, 0x05, 0xf0, 0xe6, 0x9d, 0xa9, 0xa8, 0xf9, 0x07, 0x24, 0x1a, 0x2e, 0x92, 0x3c,
            0x8c, 0xc8,
        ],
        [
            0x3d, 0xc4, 0x7d, 0x1f, 0x29, 0xc4, 0x48, 0x46, 0x1e, 0x9e, 0x76, 0xed, 0x90, 0x4f,
            0x67, 0x11,
        ],
        [
            0x0d, 0x62, 0xbf, 0x01, 0xe6, 0xfc, 0x0e, 0x1a, 0x0d, 0x3c, 0x47, 0x51, 0xc5, 0xd3,
            0x69, 0x2b,
        ],
        [
            0x8c, 0x03, 0x46, 0x8b, 0xca, 0x7c, 0x66, 0x9e, 0xe4, 0xfd, 0x5e, 0x08, 0x4b, 0xbe,
            0xe7, 0xb5,
        ],
        [
            0x52, 0x8a, 0x5b, 0xb9, 0x3b, 0xaf, 0x2c, 0x9c, 0x44, 0x73, 0xcc, 0xe5, 0xd0, 0xd2,
            0x2b, 0xd9,
        ],
        [
            0xdf, 0x6a, 0x30, 0x1e, 0x95, 0xc9, 0x5d, 0xad, 0x97, 0xae, 0x0c, 0xc8, 0xc6, 0x91,
            0x3b, 0xd8,
        ],
        [
            0x80, 0x11, 0x89, 0x90, 0x2c, 0x85, 0x7f, 0x39, 0xe7, 0x35, 0x91, 0x28, 0x5e, 0x70,
            0xb6, 0xdb,
        ],
        [
            0xe6, 0x17, 0x34, 0x6a, 0xc9, 0xc2, 0x31, 0xbb, 0x36, 0x50, 0xae, 0x34, 0xcc, 0xca,
            0x0c, 0x5b,
        ],
        [
            0x27, 0xd9, 0x34, 0x37, 0xef, 0xb7, 0x21, 0xaa, 0x40, 0x18, 0x21, 0xdc, 0xec, 0x5a,
            0xdf, 0x89,
        ],
        [
            0x89, 0x23, 0x7d, 0x9d, 0xed, 0x9c, 0x5e, 0x78, 0xd8, 0xb1, 0xc9, 0xb1, 0x66, 0xcc,
            0x73, 0x42,
        ],
        [
            0x4a, 0x6d, 0x80, 0x91, 0xbf, 0x5e, 0x7d, 0x65, 0x11, 0x89, 0xfa, 0x94, 0xa2, 0x50,
            0xb1, 0x4c,
        ],
        [
            0x0e, 0x33, 0xf9, 0x60, 0x55, 0xe7, 0xae, 0x89, 0x3f, 0xfc, 0x0e, 0x3d, 0xcf, 0x49,
            0x29, 0x02,
        ],
        [
            0xe6, 0x1c, 0x43, 0x2b, 0x72, 0x0b, 0x19, 0xd1, 0x8e, 0xc8, 0xd8, 0x4b, 0xdc, 0x63,
            0x15, 0x1b,
        ],
        [
            0xf7, 0xe5, 0xae, 0xf5, 0x49, 0xf7, 0x82, 0xcf, 0x37, 0x90, 0x55, 0xa6, 0x08, 0x26,
            0x9b, 0x16,
        ],
        [
            0x43, 0x8d, 0x03, 0x0f, 0xd0, 0xb7, 0xa5, 0x4f, 0xa8, 0x37, 0xf2, 0xad, 0x20, 0x1a,
            0x64, 0x03,
        ],
        [
            0xa5, 0x90, 0xd3, 0xee, 0x4f, 0xbf, 0x04, 0xe3, 0x24, 0x7e, 0x0d, 0x27, 0xf2, 0x86,
            0x42, 0x3f,
        ],
        [
            0x5f, 0xe2, 0xc1, 0xa1, 0x72, 0xfe, 0x93, 0xc4, 0xb1, 0x5c, 0xd3, 0x7c, 0xae, 0xf9,
            0xf5, 0x38,
        ],
        [
            0x2c, 0x97, 0x32, 0x5c, 0xbd, 0x06, 0xb3, 0x6e, 0xb2, 0x13, 0x3d, 0xd0, 0x8b, 0x3a,
            0x01, 0x7c,
        ],
        [
            0x92, 0xc8, 0x14, 0x22, 0x7a, 0x6b, 0xca, 0x94, 0x9f, 0xf0, 0x65, 0x9f, 0x00, 0x2a,
            0xd3, 0x9e,
        ],
        [
            0xdc, 0xe8, 0x50, 0x11, 0x0b, 0xd8, 0x32, 0x8c, 0xfb, 0xd5, 0x08, 0x41, 0xd6, 0x91,
            0x1d, 0x87,
        ],
        [
            0x67, 0xf1, 0x49, 0x84, 0xc7, 0xda, 0x79, 0x12, 0x48, 0xe3, 0x2b, 0xb5, 0x92, 0x25,
            0x83, 0xda,
        ],
        [
            0x19, 0x38, 0xf2, 0xcf, 0x72, 0xd5, 0x4e, 0xe9, 0x7e, 0x94, 0x16, 0x6f, 0xa9, 0x1d,
            0x2a, 0x36,
        ],
        [
            0x74, 0x48, 0x1e, 0x96, 0x46, 0xed, 0x49, 0xfe, 0x0f, 0x62, 0x24, 0x30, 0x16, 0x04,
            0x69, 0x8e,
        ],
        [
            0x57, 0xfc, 0xa5, 0xde, 0x98, 0xa9, 0xd6, 0xd8, 0x00, 0x64, 0x38, 0xd0, 0x58, 0x3d,
            0x8a, 0x1d,
        ],
        [
            0x9f, 0xec, 0xde, 0x1c, 0xef, 0xdc, 0x1c, 0xbe, 0xd4, 0x76, 0x36, 0x74, 0xd9, 0x57,
            0x53, 0x59,
        ],
        [
            0xe3, 0x04, 0x0c, 0x00, 0xeb, 0x28, 0xf1, 0x53, 0x66, 0xca, 0x73, 0xcb, 0xd8, 0x72,
            0xe7, 0x40,
        ],
        [
            0x76, 0x97, 0x00, 0x9a, 0x6a, 0x83, 0x1d, 0xfe, 0xcc, 0xa9, 0x1c, 0x59, 0x93, 0x67,
            0x0f, 0x7a,
        ],
        [
            0x58, 0x53, 0x54, 0x23, 0x21, 0xf5, 0x67, 0xa0, 0x05, 0xd5, 0x47, 0xa4, 0xf0, 0x47,
            0x59, 0xbd,
        ],
        [
            0x51, 0x50, 0xd1, 0x77, 0x2f, 0x50, 0x83, 0x4a, 0x50, 0x3e, 0x06, 0x9a, 0x97, 0x3f,
            0xbd, 0x7c,
        ],
    ];

    // Test vector from reference implementation
    #[test]
    fn test_siphash_2_4_test_vector() {
        let k0 = 0x_07_06_05_04_03_02_01_00;
        let k1 = 0x_0f_0e_0d_0c_0b_0a_09_08;

        let mut input: Vec<u8> = Vec::new();

        for i in 0..64 {
            let out = hash_with(SipHasher128::new_with_keys(k0, k1), &Bytes(&input[..]));
            let expected = (
                ((TEST_VECTOR[i][0] as u64) << 0)
                    | ((TEST_VECTOR[i][1] as u64) << 8)
                    | ((TEST_VECTOR[i][2] as u64) << 16)
                    | ((TEST_VECTOR[i][3] as u64) << 24)
                    | ((TEST_VECTOR[i][4] as u64) << 32)
                    | ((TEST_VECTOR[i][5] as u64) << 40)
                    | ((TEST_VECTOR[i][6] as u64) << 48)
                    | ((TEST_VECTOR[i][7] as u64) << 56),
                ((TEST_VECTOR[i][8] as u64) << 0)
                    | ((TEST_VECTOR[i][9] as u64) << 8)
                    | ((TEST_VECTOR[i][10] as u64) << 16)
                    | ((TEST_VECTOR[i][11] as u64) << 24)
                    | ((TEST_VECTOR[i][12] as u64) << 32)
                    | ((TEST_VECTOR[i][13] as u64) << 40)
                    | ((TEST_VECTOR[i][14] as u64) << 48)
                    | ((TEST_VECTOR[i][15] as u64) << 56),
            );

            assert_eq!(out, expected);
            input.push(i as u8);
        }
    }

    #[test]
    #[cfg(target_arch = "arm")]
    fn test_hash_usize() {
        let val = 0xdeadbeef_deadbeef_u64;
        assert!(hash(&(val as u64)) != hash(&(val as usize)));
        assert_eq!(hash(&(val as u32)), hash(&(val as usize)));
    }
    #[test]
    #[cfg(target_arch = "x86_64")]
    fn test_hash_usize() {
        let val = 0xdeadbeef_deadbeef_u64;
        assert_eq!(hash(&(val as u64)), hash(&(val as usize)));
        assert!(hash(&(val as u32)) != hash(&(val as usize)));
    }
    #[test]
    #[cfg(target_arch = "x86")]
    fn test_hash_usize() {
        let val = 0xdeadbeef_deadbeef_u64;
        assert!(hash(&(val as u64)) != hash(&(val as usize)));
        assert_eq!(hash(&(val as u32)), hash(&(val as usize)));
    }

    #[test]
    fn test_hash_idempotent() {
        let val64 = 0xdeadbeef_deadbeef_u64;
        assert_eq!(hash(&val64), hash(&val64));
        let val32 = 0xdead_beef_u32;
        assert_eq!(hash(&val32), hash(&val32));
    }

    #[test]
    fn test_hash_no_bytes_dropped_64() {
        let val = 0xdeadbeef_deadbeef_u64;

        assert!(hash(&val) != hash(&zero_byte(val, 0)));
        assert!(hash(&val) != hash(&zero_byte(val, 1)));
        assert!(hash(&val) != hash(&zero_byte(val, 2)));
        assert!(hash(&val) != hash(&zero_byte(val, 3)));
        assert!(hash(&val) != hash(&zero_byte(val, 4)));
        assert!(hash(&val) != hash(&zero_byte(val, 5)));
        assert!(hash(&val) != hash(&zero_byte(val, 6)));
        assert!(hash(&val) != hash(&zero_byte(val, 7)));

        fn zero_byte(val: u64, byte: usize) -> u64 {
            assert!(byte < 8);
            val & !(0xff << (byte * 8))
        }
    }

    #[test]
    fn test_hash_no_bytes_dropped_32() {
        let val = 0xdead_beef_u32;

        assert!(hash(&val) != hash(&zero_byte(val, 0)));
        assert!(hash(&val) != hash(&zero_byte(val, 1)));
        assert!(hash(&val) != hash(&zero_byte(val, 2)));
        assert!(hash(&val) != hash(&zero_byte(val, 3)));

        fn zero_byte(val: u32, byte: usize) -> u32 {
            assert!(byte < 4);
            val & !(0xff << (byte * 8))
        }
    }

    #[test]
    fn test_hash_no_concat_alias() {
        let s = ("aa", "bb");
        let t = ("aabb", "");
        let u = ("a", "abb");

        assert!(s != t && t != u);
        assert!(hash(&s) != hash(&t) && hash(&s) != hash(&u));

        let u = [1, 0, 0, 0];
        let v = (&u[..1], &u[1..3], &u[3..]);
        let w = (&u[..], &u[4..4], &u[4..4]);

        assert!(v != w);
        assert!(hash(&v) != hash(&w));
    }

    #[test]
    fn test_write_short_works() {
        let test_usize = 0xd0c0_b0a0usize;
        let mut h1 = SipHasher128::new_with_keys(0, 0);
        h1.write_usize(test_usize);
        h1.write(b"bytes");
        h1.write(b"string");
        h1.write_u8(0xFFu8);
        h1.write_u8(0x01u8);
        let mut h2 = SipHasher128::new_with_keys(0, 0);
        h2.write(unsafe {
            slice::from_raw_parts(
                &test_usize as *const _ as *const u8,
                mem::size_of::<usize>(),
            )
        });
        h2.write(b"bytes");
        h2.write(b"string");
        h2.write(&[0xFFu8, 0x01u8]);
        assert_eq!(h1.finish128(), h2.finish128());
    }
}
