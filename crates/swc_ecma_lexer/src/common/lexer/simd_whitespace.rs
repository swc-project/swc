use std::simd::{cmp::SimdPartialEq, Mask, Simd, SupportedLaneCount};

pub(super) fn is_javascript_ascii_whitespace(byte: u8) -> bool {
    // Check for common ASCII whitespace characters
    byte == b' '
        || byte == b'\n'
        || byte == b'\r'
        || byte == b'\t'
        || byte == b'\x0B'
        || byte == b'\x0C'
}

pub(super) fn find_first_non_whitespace(bytes: &[u8]) -> Option<usize> {
    const LANES: usize = 64;

    // 0x20
    let space: Simd<u8, LANES> = Simd::splat(b' ');
    // 0x0A
    let newline = Simd::splat(b'\n');
    // 0x0D
    let cr = Simd::splat(b'\r');
    // 0x09
    let tab = Simd::splat(b'\t');
    let vt = Simd::splat(b'\x0B');
    let ff = Simd::splat(b'\x0C');

    let mut chunks = bytes.chunks_exact(LANES);
    for (i, chunk) in chunks.by_ref().enumerate() {
        let data = Simd::from_slice(chunk);

        let non_whitespace = !(data.simd_eq(space)
            | data.simd_eq(newline)
            | data.simd_eq(cr)
            | data.simd_eq(tab)
            | data.simd_eq(vt)
            | data.simd_eq(ff));
        if let Some(pos) = find_non_whitespace(&non_whitespace) {
            return Some(i * LANES + pos);
        }
    }
    let remainder = chunks.remainder();
    for (i, &b) in remainder.iter().enumerate() {
        if !is_javascript_ascii_whitespace(b) {
            return Some(bytes.len() - remainder.len() + i);
        }
    }
    None
}

#[inline(always)]
fn find_non_whitespace<const N: usize>(mask: &Mask<i8, N>) -> Option<usize>
where
    std::simd::LaneCount<N>: SupportedLaneCount,
{
    if mask.any() {
        for i in 0..N {
            if mask.test(i) {
                return Some(i);
            }
        }
    }
    None
}

#[test]
fn test_find_first_non_whitespace() {
    assert_eq!(
        find_first_non_whitespace(
            b"aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa"
        ),
        Some(0)
    );
    assert_eq!(
        find_first_non_whitespace(
            b"/*! **************************************************************** \nCopyright"
        ),
        Some(0)
    );
    assert_eq!(
        find_first_non_whitespace(b"   \n  \t  \r  \x0B  \x0C"),
        None
    );
    assert_eq!(
        find_first_non_whitespace(b"   \n  \t  \r  \x0B  \x0C1"),
        Some(16)
    );
    assert_eq!(find_first_non_whitespace(b"123"), Some(0));
    assert_eq!(find_first_non_whitespace(b" 123"), Some(1));
    assert_eq!(find_first_non_whitespace(b" 123 456"), Some(1));
}
