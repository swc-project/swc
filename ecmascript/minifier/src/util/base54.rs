const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

/// Note: This returns `a` for 0.
///
/// Returns [None] if the value is is not a valid ideitifer.
pub(crate) fn incr_base54(init: &mut usize) -> String {
    let mut n = *init;

    *init += 1;

    let mut ret = String::new();
    let mut base = 54;

    n += 1;

    while n > 0 {
        n -= 1;

        let c = CHARS[n % base] as char;

        if ret.is_empty() && c.is_digit(10) {
            return incr_base54(init);
        }

        ret.push(c);

        n = n / base;
        base = 64;
    }

    if ret == "do" {
        return incr_base54(init);
    }

    ret
}

#[cfg(test)]
mod tests {
    use super::incr_base54;
    struct Tester {
        n: usize,
    }

    impl Tester {
        fn incr(&mut self, n: usize) {
            self.n += n;
        }

        fn gen(&mut self, expected: &str) {
            let generated = incr_base54(&mut self.n);
            assert_eq!(generated, expected);
        }
    }

    #[test]
    fn simple() {
        let mut t = Tester { n: 0 };

        t.gen("a");
        t.gen("b");
        t.incr(54 - 2);
        t.gen("aa");
    }

    #[test]
    fn perf() {
        let mut t = Tester { n: 0 };

        t.incr(54);
        t.gen("aa");
        t.incr(54 * 64 * 64 * 64 * 64 * 64);
        t.gen("")
    }
}
