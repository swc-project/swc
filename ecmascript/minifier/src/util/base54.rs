const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/// Note: This returns `a` for 0.
pub(crate) fn base54(mut n: usize) -> String {
    let mut ret = String::new();
    let mut base = 54;

    n += 1;

    while n > 0 {
        n -= 1;

        ret.push(CHARS[n % base] as char);
        n = n / base;
        base = 64;
    }

    ret
}
