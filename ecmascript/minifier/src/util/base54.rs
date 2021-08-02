const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/// Note: This returns `a` for 0.
///
/// Returns [None] if the value is is not a valid ideitifer.
pub(crate) fn base54(init: usize) -> Option<String> {
    let mut n = init;
    let mut ret = String::new();
    let mut base = 54;

    n += 1;

    while n > 0 {
        n -= 1;

        let c = CHARS[n % base] as char;

        if ret.is_empty() && c.is_digit(10) {
            return None;
        }

        ret.push(c);

        n = n / base;
        base = 64;
    }

    if ret == "do" {
        return None;
    }

    Some(ret)
}
