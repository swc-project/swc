use swc_ecma_ast::IdentExt;

const CHARS: &[u8] = b"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_0123456789";

/// Note: This returns `a` for 0.
pub(crate) fn incr_base54(init: &mut usize) -> (usize, String) {
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

    if ret.is_reserved() || ret.is_reserved_in_strict_bind() || ret.is_reserved_in_strict_mode(true)
    {
        return incr_base54(init);
    }

    (*init - 1, ret)
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
            let generated = incr_base54(&mut self.n).1;
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
    fn perf_1() {
        let mut t = Tester { n: 0 };

        t.incr(54);
        t.gen("aa");
    }

    #[test]
    fn perf_2() {
        let mut t = Tester { n: 0 };

        t.incr(54 * 64 * 64 * 64 * 64 * 64 * 64 * 64);
        t.gen("a9888888")
    }
}
